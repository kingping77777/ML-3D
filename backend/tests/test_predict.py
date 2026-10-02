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


def test_predict_endpoint_invalid_sex(client, valid_patient_data):
    invalid_data = valid_patient_data.copy()
    invalid_data["Sex"] = "Fmale"
    response = client.post("/api/v1/predict", json=invalid_data)
    assert response.status_code == 422


def test_predict_endpoint_missing_feature(client, valid_patient_data):
    invalid_data = valid_patient_data.copy()
    del invalid_data["Age"]
    response = client.post("/api/v1/predict", json=invalid_data)
    assert response.status_code == 422


def test_predict_endpoint_out_of_range(client, valid_patient_data):
    invalid_data = valid_patient_data.copy()
    invalid_data["Age"] = -5
    response = client.post("/api/v1/predict", json=invalid_data)
    assert response.status_code == 422
