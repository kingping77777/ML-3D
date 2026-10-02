def test_analyze_endpoint_valid_patient(client, valid_patient_data):
    response = client.post("/api/v1/analyze", json=valid_patient_data)
    assert response.status_code == 200
    data = response.json()

    assert "predictions" in data
    assert "visualization" in data
    assert "explanations" in data

    preds = data["predictions"]
    exps = data["explanations"]

    for target in ["cad", "lad", "lcx", "rca"]:
        assert target in preds
        assert target in exps
        assert exps[target]["probability"] == preds[target]["probability"]
        assert exps[target]["threshold"] == preds[target]["threshold"]
        assert exps[target]["predicted_class"] == preds[target]["predicted_class"]
