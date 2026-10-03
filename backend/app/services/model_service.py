import os
import sys
from pathlib import Path

# Ensure project root is in sys.path
_project_root = str(Path(__file__).resolve().parents[3])
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

from app.config import settings
from app.schemas import TargetPrediction, VesselVisualization, PredictionResponse, TargetMetadata, MetadataResponse
from ml.src.explainability import fix_unpickled_imputers, resolve_path

class ModelService:
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.metadata: Dict[str, Any] = {}
        self.is_loaded: bool = False

    def load_models(self) -> None:
        """
        Loads all 4 target models and metadata once at startup.
        Patches unpickled imputers for scikit-learn 1.9 compatibility.
        """
        model_dir = resolve_path(settings.MODEL_DIR)
        meta_path = os.path.join(model_dir, "model_metadata.json")

        if not os.path.exists(meta_path):
            raise FileNotFoundError(f"Model metadata not found at {meta_path}")

        with open(meta_path, "r") as f:
            self.metadata = json.load(f)

        for target in ["cad", "lad", "lcx", "rca"]:
            model_path = os.path.join(model_dir, f"{target}_model.joblib")
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model artifact not found for target '{target}' at {model_path}")
            
            m_obj = joblib.load(model_path)
            fix_unpickled_imputers(m_obj)
            self.models[target] = m_obj

        self.is_loaded = True

    def predict_all(self, df: pd.DataFrame) -> PredictionResponse:
        """
        Executes prediction for CAD, LAD, LCX, RCA on a single-patient DataFrame.
        """
        if not self.is_loaded:
            raise RuntimeError("Models are not loaded. Call load_models() first.")

        predictions: Dict[str, TargetPrediction] = {}
        visualization: Dict[str, VesselVisualization] = {}

        for target in ["cad", "lad", "lcx", "rca"]:
            model_obj = self.models[target]
            meta = self.metadata[target]

            prob = float(model_obj.predict_proba(df)[0, 1])
            prob = max(0.0, min(1.0, prob)) # Bound to [0.0, 1.0]
            thresh = float(meta["selected_threshold"])
            pred_class = 1 if prob >= thresh else 0

            predictions[target] = TargetPrediction(
                probability=round(prob, 4),
                predicted_class=pred_class,
                threshold=thresh
            )

            if target in ["lad", "lcx", "rca"]:
                status_cat = "elevated_risk" if prob >= thresh else "normal_risk"
                visualization[target] = VesselVisualization(
                    probability=round(prob, 4),
                    status=status_cat
                )

        return PredictionResponse(
            predictions=predictions,
            visualization=visualization
        )

    def predict_single(self, target: str, df: pd.DataFrame) -> TargetPrediction:
        """
        Executes prediction for a specific target.
        """
        target_lower = target.lower()
        if target_lower not in self.models:
            raise ValueError(f"Unknown target: '{target}'. Supported targets: cad, lad, lcx, rca.")

        model_obj = self.models[target_lower]
        meta = self.metadata[target_lower]

        prob = float(model_obj.predict_proba(df)[0, 1])
        prob = max(0.0, min(1.0, prob))
        thresh = float(meta["selected_threshold"])
        pred_class = 1 if prob >= thresh else 0

        return TargetPrediction(
            probability=round(prob, 4),
            predicted_class=pred_class,
            threshold=thresh
        )

    def get_clean_metadata(self) -> MetadataResponse:
        """
        Returns clean metadata without sensitive local file paths.
        """
        if not self.is_loaded:
            raise RuntimeError("Metadata not loaded.")

        targets_meta: Dict[str, TargetMetadata] = {}
        for target, info in self.metadata.items():
            targets_meta[target] = TargetMetadata(
                target=info.get("target", target.upper()),
                model=info.get("model", "Unknown"),
                calibration=info.get("calibration", "Unknown"),
                selected_threshold=float(info.get("selected_threshold", 0.5)),
                features_count=int(info.get("features_count", 54)),
                validation_method=info.get("validation_method", "RepeatedStratifiedKFold")
            )

        return MetadataResponse(targets=targets_meta)

model_service = ModelService()
