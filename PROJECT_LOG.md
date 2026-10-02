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

## Plan and Next Steps
1. **Step 4:** SHAP Explainability & Feature Contribution Analysis (Awaiting prompt/approval).
2. **Step 5:** FastAPI Backend Service Development.
3. **Step 6:** 3D Heart Visualization & Interactive UI.

## Changelog
- **[2026-10-01]:** Initialized dataset audit pipeline. Generated dataset summaries and target distribution reports. Created `PROJECT_LOG.md` to persist project history.
- **[2026-10-01]:** Completed Step 2: Leakage-Safe Preprocessing & Baseline ML Experiments. Created `ml/notebooks/02_preprocessing_and_baselines.ipynb`.
- **[2026-10-01]:** Completed Step 3: Robust Model Validation, Model Selection & Probability Calibration. Created `ml/notebooks/03_model_selection_and_calibration.ipynb`, saved final joblib models to `ml/artifacts/final/`, and updated reports.
