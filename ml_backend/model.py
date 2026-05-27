"""
CROPXAI XGBoost Crop Recommender - Improved Accuracy
"""

import numpy as np
import pickle
import os

try:
    import xgboost as xgb
    from sklearn.preprocessing import LabelEncoder
    from sklearn.model_selection import train_test_split, StratifiedKFold
    from sklearn.metrics import accuracy_score
    from sklearn.calibration import CalibratedClassifierCV
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

MODEL_PATH = "cropxai_xgb_model.pkl"

CLIMATE_MAP = {"tropical": 0, "subtropical": 1, "temperate": 2, "arid": 3}
SEASON_MAP  = {"kharif": 0, "rabi": 1, "zaid": 2}
SOIL_MAP    = {"clay": 0, "sandy": 1, "loamy": 2, "black": 3, "red": 4, "alluvial": 5}

FEATURE_NAMES = ["climate", "season", "soil_type", "soil_ph",
                 "nitrogen", "phosphorus", "potassium"]

# ── Crop specs: (climates, seasons, soils, ph_min, ph_max, n_min, n_max, p_min, p_max, k_min, k_max)
CROP_SPECS = {
    "rice":      ([0, 1],    [0],    [0, 2, 5],    5.5, 7.0,  80, 120,  40,  60,  40,  60),
    "wheat":     ([1, 2],    [1],    [2, 0, 5],    6.0, 7.5, 100, 150,  50,  80,  40,  60),
    "cotton":    ([0, 1],    [0],    [2, 3, 5],    6.0, 8.0, 100, 150,  50,  75,  50,  75),
    "maize":     ([0, 1, 2], [0, 1], [2, 1, 5],    5.5, 7.5, 120, 150,  60,  80,  40,  60),
    "sugarcane": ([0, 1],    [0],    [2, 0, 5],    6.0, 7.5, 200, 300,  80, 120, 100, 150),
    "groundnut": ([0, 1],    [0, 1], [1, 2, 4],    6.0, 7.0,  20,  40,  40,  60,  40,  60),
    "tomato":    ([1, 2],    [1, 2], [2, 1, 4],    6.0, 7.0, 100, 150,  50,  75,  50,  75),
    "potato":    ([1, 2],    [1],    [2, 1],       5.5, 6.5, 120, 180,  80, 120, 100, 150),
}


class CropRecommender:
    def __init__(self):
        self.model       = None
        self.le          = LabelEncoder() if XGB_AVAILABLE else None
        self.is_trained  = False
        self.crop_labels = list(CROP_SPECS.keys())
        self._importance = {}

    # ── Generate realistic training data with overlap ─────────────────────
    def _generate_dataset(self, samples_per_crop: int = 800):
        X, y = [], []
        rng = np.random.default_rng(42)

        for crop, (climates, seasons, soils,
                   ph_min, ph_max,
                   n_min, n_max, p_min, p_max, k_min, k_max) in CROP_SPECS.items():

            # ── Core samples: clearly within optimal range ────────────────
            for _ in range(samples_per_crop):
                climate = rng.choice(climates)
                season  = rng.choice(seasons)
                soil    = rng.choice(soils)
                ph      = rng.uniform(ph_min, ph_max)
                n       = rng.uniform(n_min, n_max)
                p       = rng.uniform(p_min, p_max)
                k       = rng.uniform(k_min, k_max)
                X.append([climate, season, soil, ph, n, p, k])
                y.append(crop)

            # ── Borderline samples: slightly outside optimal range ────────
            for _ in range(samples_per_crop // 3):
                climate = rng.choice(climates)
                season  = rng.choice(seasons)
                soil    = rng.choice(soils)
                ph      = rng.uniform(ph_min - 0.5, ph_max + 0.5)
                n       = rng.uniform(n_min * 0.7, n_max * 1.3)
                p       = rng.uniform(p_min * 0.7, p_max * 1.3)
                k       = rng.uniform(k_min * 0.7, k_max * 1.3)
                X.append([climate, season, soil, ph, n, p, k])
                y.append(crop)

            # ── Realistic noise: wrong climate/season but right soil/NPK ──
            for _ in range(samples_per_crop // 5):
                climate = rng.integers(0, 4)
                season  = rng.integers(0, 3)
                soil    = rng.choice(soils)
                ph      = rng.uniform(ph_min, ph_max)
                n       = rng.uniform(n_min, n_max)
                p       = rng.uniform(p_min, p_max)
                k       = rng.uniform(k_min, k_max)
                X.append([climate, season, soil, ph, n, p, k])
                y.append(crop)

        return np.array(X, dtype=np.float32), np.array(y)

    # ── Train ─────────────────────────────────────────────────────────────
    def train(self) -> dict:
        if not XGB_AVAILABLE:
            raise RuntimeError("xgboost or scikit-learn not installed.")

        X, y_raw = self._generate_dataset(samples_per_crop=800)
        y = self.le.fit_transform(y_raw)
        self.crop_labels = list(self.le.classes_)
        n_classes = len(self.crop_labels)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # ── XGBoost with calibrated probabilities ─────────────────────────
        base_model = xgb.XGBClassifier(
            n_estimators      = 500,
            max_depth         = 5,
            learning_rate     = 0.05,
            subsample         = 0.75,
            colsample_bytree  = 0.75,
            min_child_weight  = 3,
            gamma             = 0.1,
            reg_alpha         = 0.1,
            reg_lambda        = 1.5,
            use_label_encoder = False,
            eval_metric       = "mlogloss",
            num_class         = n_classes,
            objective         = "multi:softprob",
            random_state      = 42,
            n_jobs            = -1,
        )

        base_model.fit(
            X_train, y_train,
            eval_set    = [(X_test, y_test)],
            verbose     = False,
        )

        # Calibrate probabilities so they spread realistically (not 99%/0%)
        self.model = CalibratedClassifierCV(base_model, method="isotonic", cv=3)
        self.model.fit(X_train, y_train)

        y_pred   = self.model.predict(X_test)
        accuracy = float(accuracy_score(y_test, y_pred))

        # Feature importance from base model
        imp = base_model.feature_importances_
        self._importance = {
            FEATURE_NAMES[i]: round(float(imp[i]), 4)
            for i in range(len(FEATURE_NAMES))
        }

        self.is_trained = True
        self._save()

        return {
            "status":   "trained",
            "accuracy": round(accuracy * 100, 2),
            "crops":    self.crop_labels,
            "samples":  len(X_train),
        }

    # ── Predict ───────────────────────────────────────────────────────────
    def predict(self, req) -> dict:
        climate  = CLIMATE_MAP.get(req.climate.lower(), 0)
        season   = SEASON_MAP.get(req.season.lower(), 0)
        soil     = SOIL_MAP.get(req.soil_type.lower(), 2)

        features = np.array([[
            climate, season, soil,
            req.soil_ph, req.nitrogen, req.phosphorus, req.potassium
        ]], dtype=np.float32)

        raw_proba = self.model.predict_proba(features)[0]

        # ── Score each crop using agronomic rules to get realistic spread ──
        agronomic_scores = self._agronomic_score(req)

        # Blend: 60% ML probability + 40% agronomic score
        blended = {}
        for i, crop in enumerate(self.crop_labels):
            ml_score  = float(raw_proba[i])
            agr_score = agronomic_scores.get(crop, 0.0)
            blended[crop] = 0.6 * ml_score + 0.4 * agr_score

        # Normalise to sum to 1
        total = sum(blended.values()) or 1.0
        blended = {k: v / total for k, v in blended.items()}

        # Sort and take top 3
        sorted_crops = sorted(blended.items(), key=lambda x: x[1], reverse=True)[:3]

        top_3 = [
            {
                "crop":       crop,
                "confidence": round(conf * 100, 1),
                "rank":       rank + 1,
            }
            for rank, (crop, conf) in enumerate(sorted_crops)
        ]

        return {
            "best_crop":          top_3[0]["crop"],
            "confidence":         top_3[0]["confidence"],
            "top_3":              top_3,
            "feature_importance": self._importance,
            "model":              "XGBoost",
        }

    # ── Agronomic rule-based scoring (0-1) ────────────────────────────────
    def _agronomic_score(self, req) -> dict:
        climate_key  = req.climate.lower()
        season_key   = req.season.lower()
        soil_key     = req.soil_type.lower()

        climate_idx = CLIMATE_MAP.get(climate_key, -1)
        season_idx  = SEASON_MAP.get(season_key, -1)
        soil_idx    = SOIL_MAP.get(soil_key, -1)

        scores = {}
        for crop, (climates, seasons, soils,
                   ph_min, ph_max,
                   n_min, n_max, p_min, p_max, k_min, k_max) in CROP_SPECS.items():

            score = 0.0

            # Climate match (30%)
            if climate_idx in climates:
                score += 0.30
            else:
                score += 0.05  # small partial credit

            # Season match (25%)
            if season_idx in seasons:
                score += 0.25
            else:
                score += 0.03

            # Soil match (20%)
            if soil_idx in soils:
                score += 0.20
            else:
                score += 0.03

            # pH match (10%) — gradient
            if ph_min <= req.soil_ph <= ph_max:
                score += 0.10
            else:
                diff = min(abs(req.soil_ph - ph_min), abs(req.soil_ph - ph_max))
                score += max(0, 0.10 - diff * 0.03)

            # N match (5%)
            if n_min <= req.nitrogen <= n_max:
                score += 0.05
            else:
                diff = min(abs(req.nitrogen - n_min), abs(req.nitrogen - n_max))
                score += max(0, 0.05 - diff * 0.001)

            # P match (5%)
            if p_min <= req.phosphorus <= p_max:
                score += 0.05
            else:
                diff = min(abs(req.phosphorus - p_min), abs(req.phosphorus - p_max))
                score += max(0, 0.05 - diff * 0.001)

            # K match (5%)
            if k_min <= req.potassium <= k_max:
                score += 0.05
            else:
                diff = min(abs(req.potassium - k_min), abs(req.potassium - k_max))
                score += max(0, 0.05 - diff * 0.001)

            scores[crop] = score

        # Normalise
        total = sum(scores.values()) or 1.0
        return {k: v / total for k, v in scores.items()}

    def get_feature_importance(self) -> dict:
        return {"feature_importance": self._importance}

    def _save(self):
        with open(MODEL_PATH, "wb") as f:
            pickle.dump({
                "model":      self.model,
                "le":         self.le,
                "crops":      self.crop_labels,
                "importance": self._importance,
            }, f)

    def load_or_train(self):
        # Always retrain to pick up model improvements
        if os.path.exists(MODEL_PATH):
            os.remove(MODEL_PATH)
        print("🔄 Training XGBoost model with calibrated probabilities...")
        result = self.train()
        print(f"✅ Model trained — Accuracy: {result['accuracy']}%")
