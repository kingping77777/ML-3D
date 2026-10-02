import pandas as pd
from app.schemas import PatientInput
from ml.src.explainability import resolve_path

def test_explain_endpoint_valid_target(client, valid_patient_data):
    payload = {
        "patient": valid_patient_data,
        "target": "cad"
    }
    response = client.post("/api/v1/explain", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["target"] == "CAD"
    assert "probability" in data
    assert 0.0 <= data["probability"] <= 1.0
    assert "top_features" in data
    assert len(data["top_features"]) > 0

    first_feat = data["top_features"][0]
    assert "feature" in first_feat
    assert "shap_value" in first_feat
    assert "direction" in first_feat
    assert "rank" in first_feat
    assert "explanation" in first_feat
    
    # Corrected wording check: contains 'model output' and NOT 'probability output'
    assert "model output" in first_feat["explanation"]
    assert "probability output" not in first_feat["explanation"]

def test_explain_endpoint_invalid_target(client, valid_patient_data):
    payload = {
        "patient": valid_patient_data,
        "target": "unknown_vessel"
    }
    response = client.post("/api/v1/explain", json=payload)
    assert response.status_code == 422 # Pydantic enum validation failure

def test_explain_real_dataset_row(client):
    """Real SHAP explanation test using a row from the raw dataset."""
    data_path = resolve_path("data/extention of Z-Alizadeh sani dataset.xlsx")
    df = pd.read_excel(data_path)
    if "Sex" in df.columns:
        df["Sex"] = df["Sex"].replace({"Fmale": "Female"})

    row_dict = {}
    for field_name, field in PatientInput.model_fields.items():
        col_name = field.alias or field_name
        val = df[col_name].iloc[0]
        if hasattr(val, "item"):
            val = val.item()
        row_dict[col_name] = val

    payload = {
        "patient": row_dict,
        "target": "lad"
    }
    response = client.post("/api/v1/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target"] == "LAD"
    assert len(data["top_features"]) > 0
    assert "model output" in data["top_features"][0]["explanation"]
