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
    
    # Medical safety check: non-causal language
    assert "contributed" in first_feat["explanation"]
    assert "caused" not in first_feat["explanation"]


def test_explain_endpoint_invalid_target(client, valid_patient_data):
    payload = {
        "patient": valid_patient_data,
        "target": "unknown_vessel"
    }
    response = client.post("/api/v1/explain", json=payload)
    assert response.status_code == 422 # Pydantic enum validation failure
