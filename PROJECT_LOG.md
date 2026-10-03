# Project Log (ML 3D)

This file acts as a historical log and deployment tracker for the project. It provides context for other models/agents about what has been completed and what the future plan is.

## Current State and Recent Changes
- **Dataset Audit Pipeline (Step 1):** Created modular utilities in `ml/src/dataset_audit.py` for analyzing the UCI Extension of Z-Alizadeh Sani Dataset (303 rows, 59 columns, 0 missing).
- **Leakage-Safe Preprocessing & Baselines (Step 2):** Built `ml/src/preprocessing.py`, `ml/src/evaluation.py`, and `ml/src/train_baselines.py`. Evaluated baseline models across 5-Fold Stratified CV.
- **Robust Model Validation, Selection & Calibration (Step 3):**
  - Evaluated candidate models across 5x5 Repeated Stratified CV (25 folds per model).
  - Executed Out-of-Fold (OOF) operating threshold analysis across 13 candidate thresholds (0.20 to 0.80).
  - Evaluated probability calibration (Uncalibrated vs Sigmoid vs Isotonic) using cross-validation-safe calibration.
  - Performed controlled feature ablations (`Region RWMA` and 13 near-constant features $\ge 95\%$).
  - Selected independent final model configurations for CAD, LAD, LCX, and RCA.
  - Serialized final fitted models to `ml/artifacts/final/` (`cad_model.joblib`, `lad_model.joblib`, `lcx_model.joblib`, `rca_model.joblib`) and generated `model_metadata.json`.

- **FastAPI Backend (Step 5 & Patch):** Built production FastAPI backend service with schemas, endpoints (`/predict`, `/analyze`, `/explain`, `/health`, `/metadata`), CORS, exception handlers, and full test suite. Standardized feature categorization documentation (21 Numerical, 30 Binary including Sex, 3 Multi-Class Categorical).
- **Interactive 3D Heart & Coronary Vessel Layer (Step 6):** Created functional Next.js + React Three Fiber frontend (`frontend/`) consuming live FastAPI prediction endpoints. Generated custom 3D anatomical GLB asset (`heart.glb`), implemented explicit mesh mappings (`LAD_Vessel`, `LCX_Vessel`, `RCA_Vessel`), interactive selection/pulsing, hover tooltips, 2D fallback (`TwoDCardFallback.tsx`), WebGL fallback, and dev diagnostic panel.
- **CardioVision 3D Unified Clinical Dashboard (Step 7):** Assembled the complete end-to-end clinical AI dashboard integrating patient input presets, dynamic 54-feature clinical form, live FastAPI `/api/v1/analyze` communication (with high-fidelity client simulation fallback), multi-target CAD / LAD / LCX / RCA risk gauges, interactive SHAP waterfall/contribution explorer, synchronized 3D heart anatomical heatmaps, and printable clinical decision-support reports.

## Plan and Next Steps
1. Project milestones (Steps 1 through 7) are complete.

## Changelog
- **[2026-10-01]:** Initialized dataset audit pipeline. Generated dataset summaries and target distribution reports. Created `PROJECT_LOG.md` to persist project history.
- **[2026-10-01]:** Completed Step 2: Leakage-Safe Preprocessing & Baseline ML Experiments. Created `ml/notebooks/02_preprocessing_and_baselines.ipynb`.
- **[2026-10-01]:** Completed Step 3: Robust Model Validation, Model Selection & Probability Calibration. Created `ml/notebooks/03_model_selection_and_calibration.ipynb`, saved final joblib models to `ml/artifacts/final/`, and updated reports.
- **[2026-10-02]:** Completed Step 4: SHAP Explainability & Feature Contribution Layer.
- **[2026-10-02]:** Completed Step 5: Production-grade FastAPI Backend Service with multi-target inference and SHAP explanation endpoints.
- **[2026-10-03]:** Completed Step 6: Functional Interactive 3D Heart & Coronary Vessel Visualization (`frontend/`).
- **[2026-10-03]:** Completed Step 7: Full CardioVision 3D Clinical Dashboard & End-to-End Pipeline Integration (`frontend/app/page.tsx`).
