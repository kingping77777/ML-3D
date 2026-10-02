# CardioVision 3D — FastAPI ML Inference & Explainability Backend

Production-grade FastAPI backend for **CardioVision 3D (Step 5)**. 
Exposes multi-vessel Coronary Artery Disease ML predictions, 3D visualization risk statuses, and local SHAP feature explanations built on the trained Step 3 final models and Step 4 explainability pipeline.

---

## Architecture Overview

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application, CORS, lifespan manager, exception handlers
│   ├── config.py            # Environment configuration via Pydantic Settings
│   ├── schemas.py           # Typed Pydantic request & response models (PatientInput, etc.)
│   ├── dependencies.py      # Service dependency injection handlers
│   ├── routes/
│   │   ├── health.py        # GET /api/v1/health
│   │   ├── predict.py       # POST /api/v1/predict, POST /api/v1/analyze
│   │   ├── explain.py       # POST /api/v1/explain
│   │   └── metadata.py      # GET /api/v1/metadata
│   └── services/
│       ├── model_service.py # Centralized ModelService (startup loading & inference)
│       ├── explanation_service.py # SHAP explanation generation service
│       └── validation_service.py  # Patient input validation & feature alignment
├── tests/                   # Pytest test suite
├── .env.example
├── README.md
└── requirements.txt
```

---

## Installation & Environment Setup

### 1. Requirements
- Python 3.10+
- Virtual environment with dependencies from `requirements.txt`

### 2. Environment Variables
Copy `.env.example` to `.env` if needed:
```bash
API_ENV=development
MODEL_DIR=ml/artifacts/final
EXPLANATION_DIR=ml/artifacts/explanations
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000
```

---

## Running Locally

Run the server from the repository root or backend directory using `uvicorn`:

```bash
# From repository root:
uvicorn backend.app.main:app --reload --port 8000
```

Access Interactive API Documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | System status & model load readiness check |
| `GET` | `/api/v1/metadata` | Clean non-sensitive model architecture & threshold metadata |
| `POST` | `/api/v1/predict` | Predict CAD, LAD, LCX, RCA probabilities & 3D risk statuses |
| `POST` | `/api/v1/explain` | Compute patient local SHAP feature contributions for a target |
| `POST` | `/api/v1/analyze` | Combined endpoint returning predictions + SHAP explanations |

---

## Example API Request (`POST /api/v1/predict`)

```json
{
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
  "BBB": 0,
  "VHD": 0,
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
```

---

## Running Test Suite

Run pytest from the project root:

```bash
pytest backend/tests/
```

---

## Medical & Educational Disclaimer

> **IMPORTANT**: CardioVision 3D outputs model-estimated probabilities and feature contribution associations for research and clinical decision-support demonstration purposes only. It does NOT provide clinical diagnoses or treatment advice. Feature contributions indicate statistical impact on the model's prediction output, not direct physiological causation.
