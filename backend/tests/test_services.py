import pytest
import pandas as pd
from app.services.model_service import model_service
from app.services.validation_service import validation_service
from app.schemas import PatientInput

def test_model_service_real_inference(valid_patient_data):
    if not model_service.is_loaded:
        model_service.load_models()

    assert model_service.is_loaded is True
    patient = PatientInput(**valid_patient_data)
    df = validation_service.validate_and_format_input(patient)

    res = model_service.predict_all(df)
    assert len(res.predictions) == 4
    for target in ["cad", "lad", "lcx", "rca"]:
        pred = res.predictions[target]
        assert 0.0 <= pred.probability <= 1.0
        assert pred.predicted_class in [0, 1]

def test_validation_service_normalization(valid_patient_data):
    data = valid_patient_data.copy()
    data["Sex"] = "female"
    patient = PatientInput(**data)
    df = validation_service.validate_and_format_input(patient)
    assert df["Sex"].iloc[0] == "Female"
