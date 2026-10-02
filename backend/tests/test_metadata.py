def test_metadata_endpoint(client):
    response = client.get("/api/v1/metadata")
    assert response.status_code == 200
    data = response.json()
    assert "targets" in data
    targets = data["targets"]

    for target in ["cad", "lad", "lcx", "rca"]:
        assert target in targets
        t_meta = targets[target]
        assert "model" in t_meta
        assert "calibration" in t_meta
        assert "selected_threshold" in t_meta
        assert 0.0 <= t_meta["selected_threshold"] <= 1.0
        assert t_meta["features_count"] == 54
