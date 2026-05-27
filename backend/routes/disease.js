/**
 * CropXAI – Disease Detection API Route
 * POST /api/disease/predict
 *
 * Accepts: multipart/form-data { image: File, crop: string }
 * Returns: JSON prediction result
 *
 * Uses multer for image upload handling.
 * Runs a rule-based / simulated prediction engine
 * (swap analyzeImage() for a real ML model call when available).
 */

'use strict';

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const router = express.Router();

// ── Multer config ─────────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../uploads/disease');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename:    (_req, file, cb) => {
        const ext  = path.extname(file.originalname).toLowerCase();
        const name = `leaf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
        cb(null, name);
    }
});

const fileFilter = (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// ── Disease database (inline — mirrors frontend diseaseDatabase.js) ───────────
const diseaseDB = {
    rice: [
        { id: 'rice_blast',       name: 'Rice Blast',            severity: 'high',
          symptoms:   'Diamond-shaped lesions with gray centers and brown borders on leaves.',
          causes:     'Fungus Magnaporthe oryzae. Spreads in humid, warm conditions (24-28°C).',
          treatment:  '1. Spray Tricyclazole (0.1%) or Carbendazim\n2. Apply Propiconazole fungicide\n3. Remove infected plants immediately',
          prevention: 'Use resistant varieties. Avoid excess nitrogen. Maintain proper spacing.',
          organic:    'Neem oil spray (3%). Trichoderma viride application.' },
        { id: 'rice_blight',      name: 'Bacterial Leaf Blight', severity: 'high',
          symptoms:   'Water-soaked lesions on leaf tips turning yellow to white.',
          causes:     'Xanthomonas oryzae bacteria. Spreads through water and wind.',
          treatment:  '1. Apply Copper oxychloride (0.3%)\n2. Use Streptocycline (500ppm)\n3. Drain fields and reduce irrigation',
          prevention: 'Use disease-free seeds. Avoid excess nitrogen.',
          organic:    'Garlic extract spray. Copper sulfate solution (0.2%).' },
        { id: 'rice_brown_spot',  name: 'Brown Spot',            severity: 'medium',
          symptoms:   'Circular to oval brown spots with yellow halo on leaves.',
          causes:     'Fungus Bipolaris oryzae. Occurs in nutrient-deficient soils.',
          treatment:  '1. Spray Mancozeb (0.25%) or Iprodione\n2. Apply balanced NPK fertilizer\n3. Improve soil health',
          prevention: 'Maintain soil fertility. Use potassium-rich fertilizers.',
          organic:    'Compost application. Neem cake as soil amendment.' }
    ],
    wheat: [
        { id: 'wheat_rust',           name: 'Leaf Rust',       severity: 'high',
          symptoms:   'Orange-red pustules on upper leaf surface. Leaves turn yellow and dry.',
          causes:     'Fungus Puccinia triticina. Spreads through wind-borne spores.',
          treatment:  '1. Spray Propiconazole (0.1%) or Tebuconazole\n2. Apply Mancozeb at early stage\n3. Remove infected crop debris',
          prevention: 'Use rust-resistant varieties. Early sowing.',
          organic:    'Sulfur dust application. Baking soda spray (1%).' },
        { id: 'wheat_powdery_mildew', name: 'Powdery Mildew',  severity: 'medium',
          symptoms:   'White powdery coating on leaves and stems.',
          causes:     'Fungus Blumeria graminis. Favored by cool, humid conditions.',
          treatment:  '1. Spray Triadimefon (0.1%) or Hexaconazole\n2. Apply Sulfur-based fungicide\n3. Improve air circulation',
          prevention: 'Use resistant varieties. Avoid excess nitrogen.',
          organic:    'Neem oil spray (2%). Potassium bicarbonate solution.' }
    ],
    tomato: [
        { id: 'tomato_early_blight', name: 'Early Blight',              severity: 'medium',
          symptoms:   'Dark brown spots with concentric rings on older leaves.',
          causes:     'Fungus Alternaria solani. Favored by warm, humid weather.',
          treatment:  '1. Spray Mancozeb (0.25%) or Chlorothalonil\n2. Remove infected leaves\n3. Apply Copper-based fungicide',
          prevention: 'Crop rotation. Avoid overhead irrigation.',
          organic:    'Baking soda spray (1 tsp/litre). Compost tea spray.' },
        { id: 'tomato_late_blight',  name: 'Late Blight',               severity: 'high',
          symptoms:   'Water-soaked dark green to brown lesions. White mold on underside.',
          causes:     'Phytophthora infestans. Spreads rapidly in cool, wet conditions.',
          treatment:  '1. Spray Metalaxyl + Mancozeb immediately\n2. Remove and destroy infected plants\n3. Apply Cymoxanil fungicide',
          prevention: 'Use resistant varieties. Avoid wet foliage.',
          organic:    'Copper sulfate spray (0.2%). Remove infected debris immediately.' },
        { id: 'tomato_leaf_curl',    name: 'Tomato Leaf Curl Virus',    severity: 'high',
          symptoms:   'Leaves curl upward and inward. Yellowing, stunted growth.',
          causes:     'TYLCV virus transmitted by whitefly Bemisia tabaci.',
          treatment:  '1. Control whitefly with Imidacloprid (0.3ml/L)\n2. Remove infected plants\n3. Use yellow sticky traps',
          prevention: 'Use virus-resistant varieties. Install insect-proof nets.',
          organic:    'Neem oil spray to control whitefly. Reflective mulch.' }
    ],
    potato: [
        { id: 'potato_late_blight',  name: 'Late Blight',   severity: 'high',
          symptoms:   'Dark water-soaked lesions on leaves. White cottony growth on underside.',
          causes:     'Phytophthora infestans. Cool, wet weather (10-20°C).',
          treatment:  '1. Spray Metalaxyl + Mancozeb\n2. Destroy infected tubers\n3. Apply Cymoxanil',
          prevention: 'Use certified disease-free seed tubers. Proper drainage.',
          organic:    'Copper-based sprays. Remove infected plant material promptly.' },
        { id: 'potato_early_blight', name: 'Early Blight',  severity: 'medium',
          symptoms:   'Brown spots with concentric rings on older leaves.',
          causes:     'Alternaria solani fungus. Warm temperatures and high humidity.',
          treatment:  '1. Spray Mancozeb (0.25%)\n2. Apply Chlorothalonil\n3. Remove infected leaves',
          prevention: 'Crop rotation. Avoid overhead irrigation.',
          organic:    'Neem oil spray. Compost to improve soil health.' }
    ],
    maize: [
        { id: 'maize_rust',        name: 'Common Rust',          severity: 'medium',
          symptoms:   'Brick-red to brown pustules on both leaf surfaces.',
          causes:     'Puccinia sorghi fungus. Cool temperatures (16-23°C) with high humidity.',
          treatment:  '1. Spray Mancozeb or Propiconazole\n2. Apply fungicide at early stage',
          prevention: 'Use resistant hybrids. Early planting.',
          organic:    'Sulfur-based fungicide. Neem oil spray.' },
        { id: 'maize_leaf_blight', name: 'Northern Leaf Blight', severity: 'high',
          symptoms:   'Long, cigar-shaped gray-green lesions on leaves.',
          causes:     'Exserohilum turcicum fungus. Cool, moist weather.',
          treatment:  '1. Spray Propiconazole or Azoxystrobin\n2. Remove infected leaves',
          prevention: 'Use resistant varieties. Crop rotation.',
          organic:    'Trichoderma application. Neem-based spray.' }
    ],
    cotton: [
        { id: 'cotton_boll_rot',   name: 'Boll Rot',          severity: 'high',
          symptoms:   'Bolls turn brown and rot. Pink or white fungal growth inside bolls.',
          causes:     'Multiple fungi (Fusarium, Colletotrichum). High humidity.',
          treatment:  '1. Spray Copper oxychloride\n2. Control bollworm insects\n3. Improve drainage',
          prevention: 'Control insect pests. Avoid excess irrigation.',
          organic:    'Neem oil spray. Pheromone traps for bollworm.' },
        { id: 'cotton_leaf_spot',  name: 'Bacterial Blight',  severity: 'medium',
          symptoms:   'Angular water-soaked spots on leaves turning brown.',
          causes:     'Xanthomonas citri bacteria. Spreads through rain and wind.',
          treatment:  '1. Spray Copper oxychloride (0.3%)\n2. Apply Streptocycline\n3. Remove infected plant parts',
          prevention: 'Use resistant varieties. Treat seeds before sowing.',
          organic:    'Copper sulfate seed treatment. Garlic extract spray.' }
    ],
    groundnut: [
        { id: 'groundnut_leaf_spot', name: 'Early Leaf Spot', severity: 'medium',
          symptoms:   'Circular dark brown spots with yellow halo on upper leaf surface.',
          causes:     'Cercospora arachidicola fungus. Warm, humid conditions.',
          treatment:  '1. Spray Mancozeb (0.25%) or Chlorothalonil\n2. Apply Carbendazim\n3. Remove infected leaves',
          prevention: 'Crop rotation. Use resistant varieties.',
          organic:    'Neem oil spray. Trichoderma soil application.' }
    ],
    sugarcane: [
        { id: 'sugarcane_red_rot', name: 'Red Rot', severity: 'high',
          symptoms:   'Reddening of internal stalk tissue with white patches. Sour smell.',
          causes:     'Colletotrichum falcatum fungus. Spreads through infected setts.',
          treatment:  '1. Treat setts with Carbendazim (0.1%)\n2. Remove infected clumps\n3. Improve drainage',
          prevention: 'Use disease-free setts. Avoid waterlogging.',
          organic:    'Hot water treatment of setts (52°C for 30 min). Trichoderma application.' }
    ]
};

const HEALTHY = {
    id: 'healthy', name: 'Healthy Plant', severity: 'none',
    symptoms:   'No disease symptoms detected. Plant appears healthy.',
    causes:     'N/A',
    treatment:  'Continue regular care: proper irrigation, balanced fertilization, and pest monitoring.',
    prevention: 'Maintain good agricultural practices to keep plants healthy.',
    organic:    'Regular neem oil spray as preventive measure.'
};

// ── Prediction engine ─────────────────────────────────────────────────────────
// In production: replace this with a real ML model (TensorFlow.js, Python microservice, etc.)
function analyzeImage(filePath, cropKey) {
    const diseases = diseaseDB[cropKey] || [];

    if (diseases.length === 0) {
        return { disease: HEALTHY, confidence: 94 };
    }

    // Simulated prediction: 30% healthy, 70% disease
    const pickHealthy = Math.random() < 0.30;
    if (pickHealthy) {
        return { disease: HEALTHY, confidence: 88 + Math.floor(Math.random() * 10) };
    }

    const disease    = diseases[Math.floor(Math.random() * diseases.length)];
    const confidence = 72 + Math.floor(Math.random() * 24);
    return { disease, confidence };
}

// ── POST /api/disease/predict ─────────────────────────────────────────────────
router.post('/predict', upload.single('image'), (req, res) => {
    try {
        // Validate crop
        const cropKey = (req.body.crop || '').toLowerCase().trim();
        const validCrops = Object.keys(diseaseDB);

        if (!cropKey || !validCrops.includes(cropKey)) {
            // Clean up uploaded file if any
            if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(400).json({
                success: false,
                error: `Invalid crop type. Supported: ${validCrops.join(', ')}`
            });
        }

        // Validate file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file uploaded. Please attach a JPG, JPEG, or PNG image.'
            });
        }

        // Run prediction
        const { disease, confidence } = analyzeImage(req.file.path, cropKey);

        // Clean up uploaded file after processing
        fs.unlink(req.file.path, (err) => {
            if (err) console.warn('[Disease API] Could not delete temp file:', err.message);
        });

        return res.json({
            success:   true,
            simulated: true, // set to false when using a real model
            crop:      cropKey,
            disease: {
                id:         disease.id,
                name:       disease.name,
                severity:   disease.severity,
                confidence: confidence,
                symptoms:   disease.symptoms,
                causes:     disease.causes,
                treatment:  disease.treatment,
                prevention: disease.prevention,
                organic:    disease.organic
            }
        });

    } catch (err) {
        console.error('[Disease API] Error:', err);
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(500).json({
            success: false,
            error:   'Internal server error during disease prediction.'
        });
    }
});

// ── Multer error handler ──────────────────────────────────────────────────────
router.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB.' });
        }
        return res.status(400).json({ success: false, error: err.message });
    }
    if (err) {
        return res.status(400).json({ success: false, error: err.message });
    }
    _next();
});

module.exports = router;
