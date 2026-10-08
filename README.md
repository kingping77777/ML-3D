# CardioVision 3D — AI Cardiac Anatomy & CAD Explainability Platform

**CardioVision 3D** is a production-grade 3D cardiac visualization and Machine Learning decision-support platform for Coronary Artery Disease (CAD) risk assessment and Premature Ventricular Contraction (PVC) localization.

Combining multi-vessel CatBoost/XGBoost ML models, local SHAP feature attributions, and interactive React Three Fiber 3D coronary anatomy, CardioVision 3D translates complex clinical feature vectors into plain-English anatomical risk breakdowns.

---

## 🫀 Key Platform Features

- **Interactive 3D Cardiac Anatomy (`React Three Fiber`)**: Real-time 3D model of coronary vessels (`LAD`, `LCX`, `RCA`) and PVC origin markers with dynamic risk color-mapping and smooth camera presets.
- **Multi-Vessel ML Inference (`FastAPI`)**: Predicts probability and risk status for overall CAD as well as specific coronary arteries based on 54 clinical patient features.
- **Local SHAP Explainability Engine**: Decomposes patient risk scores into additive feature attributions to highlight which clinical factors (e.g. ST Depression, Fasting Blood Sugar, Smoking) contribute to the model prediction.
- **Plain-English Anatomical Breakdown (`AnatomicalExplanationCard`)**: Translates complex medical features into simple, non-specialist explanations detailing:
  - 📍 **Where is the problem?** (Specific anatomical location & heart region)
  - ⚠️ **What is the problem?** (Probability score & risk classification)
  - 🔍 **Why is this happening?** (Key risk-elevating patient factors)
- **Sleek Pure Black Clinical Dark Theme**: Tailored true-black dark UI (`#000000` / `#09090b`) with neutral borders for optimal visual clarity.

---

## 🏗️ Architecture Overview

```text
ML-3D/
├── backend/                  # FastAPI Inference Backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point & CORS configuration
│   │   ├── routes/           # Endpoints: /api/v1/predict, /api/v1/explain, /api/v1/analyze
│   │   └── services/         # Model & SHAP service handlers
│   ├── tests/                # Pytest test suite
│   └── requirements.txt
├── frontend/                 # Next.js 14 Web Application
│   ├── app/                  # Page routes & global styles
│   ├── components/
│   │   ├── 3d/               # 3D Exporters & GLTF component helpers
│   │   ├── dashboard/        # Clinical Forms, Risk Cards & Anatomical Explanations
│   │   └── heart/            # Three.js Heart Canvas, Controls, Hotspots & Vessels
│   ├── hooks/                # API communication & state management
│   └── package.json
├── ml/                       # ML Notebooks, Pipelines & Artifacts
│   ├── artifacts/            # Model weights & SHAP explainers
│   ├── src/                  # Preprocessing, training & evaluation scripts
│   └── notebooks/
└── data/                     # Dataset storage (Z-Alizadeh Sani extension)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+ (or PNPM/Yarn)

---

### 1️⃣ Start the Backend Server (FastAPI)

```bash
# Navigate to repository root
cd "ML 3D"

# Install Python requirements (if needed)
pip install -r backend/requirements.txt

# Launch FastAPI backend on port 8000
python -m uvicorn backend.app.main:app --reload --port 8000
```

- **Backend Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2️⃣ Start the Frontend Server (Next.js)

Open a second terminal window:

```bash
# Navigate to the frontend directory
cd "ML 3D/frontend"

# Install dependencies (if needed)
npm install

# Start development server on port 3000
npm run dev
```

- **Frontend Application**: `http://localhost:3000`

---

## 📊 Dataset Placement Instructions

To train or audit the models locally using the **UCI Extension of Z-Alizadeh Sani Dataset**:

Place the raw dataset file inside:
```text
data/Z-Alizadeh_sani_dataset.xlsx
```
or
```text
data/Z-Alizadeh_sani_dataset.csv
```

Once placed, run the audit notebook:
```bash
jupyter notebook ml/notebooks/01_dataset_audit.ipynb
```

---

## ⚠️ Medical & Educational Disclaimer

> **IMPORTANT**: CardioVision 3D outputs model-estimated probabilities and feature contribution associations for educational, research, and clinical decision-support demonstration purposes only. It does NOT provide clinical diagnoses or treatment advice.
