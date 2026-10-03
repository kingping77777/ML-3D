import os
import sys
from pathlib import Path

# Ensure project root is in sys.path
_project_root = str(Path(__file__).resolve().parents[3])
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

import pandas as pd
import numpy as np
from typing import Dict, Any, List

from app.schemas import PatientInput, ExplanationResponse, FeatureContribution
from app.services.model_service import model_service
from ml.src.explainability import explain_patient, resolve_path
from ml.src.preprocessing import clean_dataset

class ExplanationService:
    def __init__(self):
        self.X_raw_ref: pd.DataFrame = None
        self.raw_features: List[str] = []
        self.is_initialized: bool = False

    def initialize(self) -> None:
        """
        Loads reference background dataset for SHAP background summarization once at startup.
        """
        data_path = resolve_path("data/extention of Z-Alizadeh sani dataset.xlsx")
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Reference dataset not found at {data_path}")

        df_raw = pd.read_excel(data_path)
        df_clean = clean_dataset(df_raw)

        # Get features list from metadata
        if "cad" in model_service.metadata:
            self.raw_features = model_service.metadata["cad"]["features_list"]
        else:
            raise RuntimeError("ModelService metadata must be loaded before ExplanationService initialization.")

        # Exclude targets and non-features
        self.X_raw_ref = df_clean[self.raw_features].copy()
        self.is_initialized = True

    def explain_target(self, target: str, df_patient: pd.DataFrame) -> ExplanationResponse:
        """
        Computes local SHAP explanation for a given target and patient DataFrame.
        """
        if not model_service.is_loaded:
            model_service.load_models()
        if not self.is_initialized:
            self.initialize()

        target_lower = target.lower()
        if target_lower not in model_service.models:
            raise ValueError(f"Unknown target: '{target}'. Must be one of: cad, lad, lcx, rca.")

        model_obj = model_service.models[target_lower]
        metadata = model_service.metadata

        # Compute raw SHAP dict using explainability module
        raw_exp = explain_patient(
            target_name=target_lower,
            model_obj=model_obj,
            patient_row_df=df_patient,
            X_raw_df=self.X_raw_ref,
            raw_features=self.raw_features,
            metadata=metadata
        )

        top_features = [
            FeatureContribution(
                feature=item["feature"],
                value=item["value"],
                shap_value=item["shap_value"],
                direction=item["direction"],
                rank=item["rank"],
                explanation=item["natural_language_summary"]
            )
            for item in raw_exp["top_features"]
        ]

        all_features = [
            FeatureContribution(
                feature=item["feature"],
                value=item["value"],
                shap_value=item["shap_value"],
                direction=item["direction"],
                rank=item["rank"],
                explanation=item["natural_language_summary"]
            )
            for item in raw_exp["all_features"]
        ]

        return ExplanationResponse(
            target=target_lower.upper(),
            model_type=raw_exp["model_type"],
            explainer_type=raw_exp["explainer_type"],
            probability=raw_exp["probability"],
            threshold=raw_exp["threshold"],
            predicted_class=raw_exp["predicted_class"],
            shap_base_value=raw_exp["shap_base_value"],
            shap_sum_contributions=raw_exp["shap_sum_contributions"],
            top_features=top_features,
            all_features=all_features
        )

    def explain_all(self, df_patient: pd.DataFrame) -> Dict[str, ExplanationResponse]:
        """
        Computes SHAP explanations for all 4 targets (CAD, LAD, LCX, RCA).
        """
        explanations: Dict[str, ExplanationResponse] = {}
        for target in ["cad", "lad", "lcx", "rca"]:
            explanations[target] = self.explain_target(target, df_patient)
        return explanations

explanation_service = ExplanationService()
