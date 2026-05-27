"""
CROPXAI - FastAPI + XGBoost ML Backend
Crop Recommendation using XGBoost classifier
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import os

from model import CropRecommender

app = FastAPI(
    title="CROPXAI ML API",
    description="XGBoost-powered crop recommendation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
recommender = CropRecommender()

@app.on_event("startup")
async def startup():
    recommender.load_or_train()

# ── Request / Response schemas ────────────────────────────────────────────

class PredictRequest(BaseModel):
    climate:     str   = Field(..., example="tropical",  description="tropical|subtropical|temperate|arid")
    season:      str   = Field(..., example="kharif",    description="kharif|rabi|zaid")
    soil_type:   str   = Field(..., example="clay",      description="clay|sandy|loamy|black|red|alluvial")
    soil_ph:     float = Field(..., example=6.5,         ge=3.0, le=10.0)
    nitrogen:    float = Field(..., example=50.0,        ge=0.0, le=200.0)
    phosphorus:  float = Field(..., example=40.0,        ge=0.0, le=200.0)
    potassium:   float = Field(..., example=40.0,        ge=0.0, le=200.0)
    area:        Optional[float] = Field(None, example=2.5)

class CropResult(BaseModel):
    crop:        str
    confidence:  float
    rank:        int

class PredictResponse(BaseModel):
    best_crop:       str
    confidence:      float
    top_3:           List[CropResult]
    feature_importance: dict
    model:           str = "XGBoost"

class TrainResponse(BaseModel):
    status:    str
    accuracy:  float
    crops:     List[str]
    samples:   int

# ── Endpoints ─────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "CROPXAI ML API running", "docs": "/docs"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_trained": recommender.is_trained,
        "model_type": "XGBoost"
    }

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not recommender.is_trained:
        raise HTTPException(status_code=503, detail="Model not trained yet. POST /train first.")
    try:
        result = recommender.predict(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train", response_model=TrainResponse)
def train():
    try:
        result = recommender.train()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/crops")
def list_crops():
    return {"crops": recommender.crop_labels if recommender.is_trained else []}

@app.get("/feature-importance")
def feature_importance():
    if not recommender.is_trained:
        raise HTTPException(status_code=503, detail="Model not trained yet.")
    return recommender.get_feature_importance()
