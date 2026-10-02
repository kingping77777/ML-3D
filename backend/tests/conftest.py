import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure project root and backend folder are in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def valid_patient_data():
    return {
        "Age": 53,
        "Weight": 78,
        "Length": 172,
        "BMI": 26.36,
        "BP": 125,
        "PR": 72,
        "FBS": 95,
        "CR": 0.9,
        "TG": 140,
        "LDL": 110,
        "HDL": 45,
        "BUN": 14,
        "ESR": 12,
        "HB": 14.2,
        "K": 4.2,
        "Na": 140,
        "WBC": 6800,
        "Lymph": 30,
        "Neut": 60,
        "PLT": 220000,
        "EF-TTE": 55,
        "Sex": "Male",
        "Function Class": 0,
        "Obesity": 0,
        "CRF": 0,
        "CVA": 0,
        "Airway disease": 0,
        "Thyroid Disease": 0,
        "CHF": 0,
        "DLP": 1,
        "Weak Peripheral Pulse": 0,
        "Lung rales": 0,
        "Systolic Murmur": 0,
        "Diastolic Murmur": 0,
        "Dyspnea": 0,
        "Atypical": 0,
        "Nonanginal": 0,
        "LowTH Ang": 0,
        "LVH": 0,
        "Poor R Progression": 0,
        "BBB": "N",
        "VHD": "N",
        "DM": 1,
        "HTN": 1,
        "Current Smoker": 1,
        "EX-Smoker": 0,
        "FH": 1,
        "Edema": 0,
        "Typical Chest Pain": 1,
        "Q Wave": 0,
        "St Elevation": 0,
        "St Depression": 1,
        "Tinversion": 0,
        "Region RWMA": 0
    }
