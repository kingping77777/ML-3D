from typing import Dict, List, Any, Optional, Literal
from pydantic import BaseModel, Field, field_validator, ConfigDict
import pandas as pd

class PatientInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    # --- 21 Numerical Features ---
    Age: float = Field(..., alias="Age", ge=1, le=120, description="Age in years")
    Weight: float = Field(..., alias="Weight", ge=20, le=250, description="Weight in kg")
    Length: float = Field(..., alias="Length", ge=50, le=250, description="Height in cm")
    BMI: float = Field(..., alias="BMI", ge=10, le=60, description="Body Mass Index")
    BP: float = Field(..., alias="BP", ge=50, le=250, description="Blood Pressure (mmHg)")
    PR: float = Field(..., alias="PR", ge=30, le=200, description="Pulse Rate (bpm)")
    FBS: float = Field(..., alias="FBS", ge=40, le=600, description="Fasting Blood Sugar (mg/dL)")
    CR: float = Field(..., alias="CR", ge=0.1, le=15.0, description="Creatinine (mg/dL)")
    TG: float = Field(..., alias="TG", ge=20, le=1500, description="Triglycerides (mg/dL)")
    LDL: float = Field(..., alias="LDL", ge=10, le=600, description="LDL Cholesterol (mg/dL)")
    HDL: float = Field(..., alias="HDL", ge=5, le=200, description="HDL Cholesterol (mg/dL)")
    BUN: float = Field(..., alias="BUN", ge=1, le=150, description="Blood Urea Nitrogen (mg/dL)")
    ESR: float = Field(..., alias="ESR", ge=1, le=150, description="Erythrocyte Sedimentation Rate")
    HB: float = Field(..., alias="HB", ge=3.0, le=25.0, description="Hemoglobin (g/dL)")
    K: float = Field(..., alias="K", ge=1.0, le=10.0, description="Potassium (mEq/L)")
    Na: float = Field(..., alias="Na", ge=100, le=170, description="Sodium (mEq/L)")
    WBC: float = Field(..., alias="WBC", ge=1000, le=50000, description="White Blood Cell count")
    Lymph: float = Field(..., alias="Lymph", ge=1, le=99, description="Lymphocytes (%)")
    Neut: float = Field(..., alias="Neut", ge=1, le=99, description="Neutrophils (%)")
    PLT: float = Field(..., alias="PLT", ge=10, le=1000000, description="Platelets count")
    EF_TTE: float = Field(..., alias="EF-TTE", ge=5, le=90, description="Ejection Fraction (%)")

    # --- 30 Binary Features (Sex + 29 Clinical Binary Flags) ---
    Sex: Literal["Male", "Female"] = Field(..., alias="Sex", description="Patient sex ('Male' or 'Female')")

    # --- 3 Multi-Class Categorical Features ---
    Function_Class: Literal[0, 1, 2, 3] = Field(..., alias="Function Class", description="NYHA Function Class (0, 1, 2, or 3)")
    BBB: Literal["N", "LBBB", "RBBB"] = Field(..., alias="BBB", description="Bundle Branch Block ('N', 'LBBB', 'RBBB')")
    VHD: Literal["N", "mild", "Moderate", "Severe"] = Field(..., alias="VHD", description="Valvular Heart Disease ('N', 'mild', 'Moderate', 'Severe')")

    # --- 29 Clinical Binary Features ---
    Obesity: int = Field(..., alias="Obesity", ge=0, le=1)
    CRF: int = Field(..., alias="CRF", ge=0, le=1)
    CVA: int = Field(..., alias="CVA", ge=0, le=1)
    Airway_disease: int = Field(..., alias="Airway disease", ge=0, le=1)
    Thyroid_Disease: int = Field(..., alias="Thyroid Disease", ge=0, le=1)
    CHF: int = Field(..., alias="CHF", ge=0, le=1)
    DLP: int = Field(..., alias="DLP", ge=0, le=1)
    Weak_Peripheral_Pulse: int = Field(..., alias="Weak Peripheral Pulse", ge=0, le=1)
    Lung_rales: int = Field(..., alias="Lung rales", ge=0, le=1)
    Systolic_Murmur: int = Field(..., alias="Systolic Murmur", ge=0, le=1)
    Diastolic_Murmur: int = Field(..., alias="Diastolic Murmur", ge=0, le=1)
    Dyspnea: int = Field(..., alias="Dyspnea", ge=0, le=1)
    Atypical: int = Field(..., alias="Atypical", ge=0, le=1)
    Nonanginal: int = Field(..., alias="Nonanginal", ge=0, le=1)
    LowTH_Ang: int = Field(..., alias="LowTH Ang", ge=0, le=1)
    LVH: int = Field(..., alias="LVH", ge=0, le=1)
    Poor_R_Progression: int = Field(..., alias="Poor R Progression", ge=0, le=1)
    DM: int = Field(..., alias="DM", ge=0, le=1)
    HTN: int = Field(..., alias="HTN", ge=0, le=1)
    Current_Smoker: int = Field(..., alias="Current Smoker", ge=0, le=1)
    EX_Smoker: int = Field(..., alias="EX-Smoker", ge=0, le=1)
    FH: int = Field(..., alias="FH", ge=0, le=1)
    Edema: int = Field(..., alias="Edema", ge=0, le=1)
    Typical_Chest_Pain: int = Field(..., alias="Typical Chest Pain", ge=0, le=1)
    Q_Wave: int = Field(..., alias="Q Wave", ge=0, le=1)
    St_Elevation: int = Field(..., alias="St Elevation", ge=0, le=1)
    St_Depression: int = Field(..., alias="St Depression", ge=0, le=1)
    Tinversion: int = Field(..., alias="Tinversion", ge=0, le=1)
    Region_RWMA: int = Field(..., alias="Region RWMA", ge=0, le=1)

    @field_validator(
        "Obesity", "CRF", "CVA", "Airway_disease", "Thyroid_Disease", "CHF", "DLP",
        "Weak_Peripheral_Pulse", "Lung_rales", "Systolic_Murmur", "Diastolic_Murmur",
        "Dyspnea", "Atypical", "Nonanginal", "LowTH_Ang", "LVH", "Poor_R_Progression",
        "DM", "HTN", "Current_Smoker", "EX_Smoker", "FH", "Edema", "Typical_Chest_Pain",
        "Q_Wave", "St_Elevation", "St_Depression", "Tinversion", "Region_RWMA",
        mode="before"
    )
    def normalize_binary_or_flag(cls, v: Any) -> Any:
        if isinstance(v, str):
            v_clean = v.strip().upper()
            if v_clean in ["Y", "YES", "1", "TRUE"]:
                return 1
            if v_clean in ["N", "NO", "0", "FALSE"]:
                return 0
        if isinstance(v, bool):
            return 1 if v else 0
        return v

    @field_validator("Sex", mode="before")
    def normalize_sex(cls, v: Any) -> str:
        if isinstance(v, str):
            val_clean = v.strip()
            if val_clean.lower() == "fmale":
                raise ValueError("'Fmale' is invalid and must not be accepted as a valid value.")
            val_cap = val_clean.capitalize()
            if val_cap in ["Female", "F"]:
                return "Female"
            if val_cap in ["Male", "M"]:
                return "Male"
        raise ValueError("Sex must be 'Male' or 'Female'.")

    @field_validator("BBB", mode="before")
    def validate_bbb(cls, v: Any) -> str:
        if isinstance(v, str):
            val_clean = v.strip()
            if val_clean.upper() in ["N", "NO", "NONE", "NORMAL"]:
                return "N"
            if val_clean.upper() == "LBBB":
                return "LBBB"
            if val_clean.upper() == "RBBB":
                return "RBBB"
        raise ValueError("BBB must be one of: 'N', 'LBBB', 'RBBB'.")

    @field_validator("VHD", mode="before")
    def validate_vhd(cls, v: Any) -> str:
        if isinstance(v, str):
            val_clean = v.strip()
            if val_clean.upper() in ["N", "NO", "NONE", "NORMAL"]:
                return "N"
            if val_clean.lower() == "mild":
                return "mild"
            if val_clean.capitalize() == "Moderate":
                return "Moderate"
            if val_clean.capitalize() == "Severe":
                return "Severe"
        raise ValueError("VHD must be one of: 'N', 'mild', 'Moderate', 'Severe'.")

    def to_df(self) -> pd.DataFrame:
        """
        Converts the Pydantic instance into a 1-row pandas DataFrame using original feature aliases.
        """
        data = self.model_dump(by_alias=True)
        return pd.DataFrame([data])


class TargetPrediction(BaseModel):
    probability: float = Field(..., description="Model-estimated probability (0.0 to 1.0)")
    predicted_class: int = Field(..., description="Predicted class (1 if probability >= threshold else 0)")
    threshold: float = Field(..., description="Operating decision threshold selected in Step 3")


class VesselVisualization(BaseModel):
    probability: float = Field(..., description="Model-estimated probability")
    status: str = Field(..., description="UI/Model visualization risk category ('elevated_risk' or 'normal_risk')")


class PredictionResponse(BaseModel):
    predictions: Dict[str, TargetPrediction]
    visualization: Dict[str, VesselVisualization]
    disclaimer: str = Field(
        default="CardioVision 3D outputs model-estimated probabilities for research/decision-support only. Not a medical diagnosis."
    )


class ExplainRequest(BaseModel):
    patient: PatientInput
    target: Literal["cad", "lad", "lcx", "rca"] = Field(..., description="Target model to explain")


class FeatureContribution(BaseModel):
    feature: str
    value: Any
    shap_value: float
    direction: str
    rank: int
    explanation: str


class ExplanationResponse(BaseModel):
    target: str
    model_type: str
    explainer_type: str
    probability: float
    threshold: float
    predicted_class: int
    shap_base_value: float
    shap_sum_contributions: float
    top_features: List[FeatureContribution]
    all_features: List[FeatureContribution]
    disclaimer: str = Field(
        default="Feature importances represent model feature contributions to the output, not direct clinical causation."
    )


class AnalyzeResponse(BaseModel):
    predictions: Dict[str, TargetPrediction]
    visualization: Dict[str, VesselVisualization]
    explanations: Dict[str, ExplanationResponse]
    disclaimer: str = Field(
        default="CardioVision 3D outputs model-estimated probabilities for research/decision-support only. Not a medical diagnosis."
    )


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool
    timestamp: str


class TargetMetadata(BaseModel):
    target: str
    model: str
    calibration: str
    selected_threshold: float
    features_count: int
    validation_method: str


class MetadataResponse(BaseModel):
    targets: Dict[str, TargetMetadata]
