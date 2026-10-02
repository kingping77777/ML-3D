import pandas as pd
from app.schemas import PatientInput
from ml.src.explainability import resolve_path

def test_feature_count_is_54():
    """Verify PatientInput schema represents exactly 54 raw input features."""
    assert len(PatientInput.model_fields) == 54

def test_predict_endpoint_valid_patient(client, valid_patient_data):
    response = client.post("/api/v1/predict", json=valid_patient_data)
    assert response.status_code == 200
    data = response.json()

    assert "predictions" in data
    assert "visualization" in data
    assert "disclaimer" in data

    preds = data["predictions"]
    vis = data["visualization"]

    for target in ["cad", "lad", "lcx", "rca"]:
        assert target in preds
        p = preds[target]
        assert 0.0 <= p["probability"] <= 1.0
        assert p["predicted_class"] in [0, 1]
        assert 0.0 <= p["threshold"] <= 1.0
        
        # Verify threshold consistency
        expected_class = 1 if p["probability"] >= p["threshold"] else 0
        assert p["predicted_class"] == expected_class

    for vessel in ["lad", "lcx", "rca"]:
        assert vessel in vis
        v = vis[vessel]
        assert 0.0 <= v["probability"] <= 1.0
        assert v["status"] in ["elevated_risk", "normal_risk"]

def test_predict_endpoint_bbb_categories(client, valid_patient_data):
    # Test valid BBB categories
    for valid_bbb in ["N", "LBBB", "RBBB", "No"]:
        data = valid_patient_data.copy()
        data["BBB"] = valid_bbb
        res = client.post("/api/v1/predict", json=data)
        assert res.status_code == 200

    # Test invalid BBB category
    invalid_data = valid_patient_data.copy()
    invalid_data["BBB"] = "InvalidBBB"
    res = client.post("/api/v1/predict", json=invalid_data)
    assert res.status_code == 422

def test_predict_endpoint_vhd_categories(client, valid_patient_data):
    # Test valid VHD categories
    for valid_vhd in ["N", "mild", "Moderate", "Severe", "Normal"]:
        data = valid_patient_data.copy()
        data["VHD"] = valid_vhd
        res = client.post("/api/v1/predict", json=data)
        assert res.status_code == 200

    # Test invalid VHD category
    invalid_data = valid_patient_data.copy()
    invalid_data["VHD"] = "ExtremeVHD"
    res = client.post("/api/v1/predict", json=invalid_data)
    assert res.status_code == 422

def test_predict_endpoint_function_class_categories(client, valid_patient_data):
    # Test valid Function Class categories (0, 1, 2, 3)
    for valid_fc in [0, 1, 2, 3]:
        data = valid_patient_data.copy()
        data["Function Class"] = valid_fc
        res = client.post("/api/v1/predict", json=data)
        assert res.status_code == 200

    # Test invalid Function Class category
    invalid_data = valid_patient_data.copy()
    invalid_data["Function Class"] = 5
    res = client.post("/api/v1/predict", json=invalid_data)
    assert res.status_code == 422

def test_predict_endpoint_invalid_sex(client, valid_patient_data):
    invalid_data = valid_patient_data.copy()
    invalid_data["Sex"] = "Fmale"
    response = client.post("/api/v1/predict", json=invalid_data)
    assert response.status_code == 422

def test_predict_real_dataset_row(client):
    """Real inference test using a real row from the raw dataset."""
    data_path = resolve_path("data/extention of Z-Alizadeh sani dataset.xlsx")
    df = pd.read_excel(data_path)
    if "Sex" in df.columns:
        df["Sex"] = df["Sex"].replace({"Fmale": "Female"})

    # Extract first row feature values
    row_dict = {}
    for field_name, field in PatientInput.model_fields.items():
        col_name = field.alias or field_name
        val = df[col_name].iloc[0]
        if hasattr(val, "item"):
            val = val.item()
        row_dict[col_name] = val

    response = client.post("/api/v1/predict", json=row_dict)
    assert response.status_code == 200
    data = response.json()
    assert "predictions" in data
    assert "cad" in data["predictions"]
