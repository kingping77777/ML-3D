import nbformat as nbf
import json
import os

nb = nbf.v4.new_notebook()

cells = []

# Title & Overview
cells.append(nbf.v4.new_markdown_cell("""# CARDIOVISION 3D — STEP 4: EXPLAINABLE AI (SHAP) FOR CAD, LAD, LCX & RCA

## Executive Overview
This notebook implements **Step 4: Explainable AI (SHAP)** of the CardioVision 3D pipeline.
The goal is to construct a transparent, robust SHAP-based explainability layer for all four targets:
1. **CAD** (Coronary Artery Disease)
2. **LAD** (Left Anterior Descending)
3. **LCX** (Left Circumflex)
4. **RCA** (Right Coronary Artery)

Using the actual final models selected and saved in **Step 3** (`ml/artifacts/final/`), we calculate global feature importances, local individual patient explanations, feature interaction plots, and structured JSON outputs for API integration.

### Core Safety Principle:
> *"Explain what the model learned and how features contributed to its output, without turning model associations into clinical causal claims."*
"""))

# Section 1: Inspect Final Models
cells.append(nbf.v4.new_markdown_cell("""## 1. Inspect Final Models & Metadata
Before initializing SHAP explainers, we read `ml/artifacts/final/model_metadata.json` to inspect model types, calibration status, thresholds, and input feature counts.
"""))

cells.append(nbf.v4.new_code_cell("""import sys, os, json

# Dynamically locate project root containing 'ml' and 'data' folders
curr = os.path.abspath(".")
root = curr
while root and not (os.path.exists(os.path.join(root, "ml")) and os.path.exists(os.path.join(root, "data"))):
    parent = os.path.dirname(root)
    if parent == root:
        break
    root = parent

if root and root not in sys.path:
    sys.path.insert(0, root)

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import shap
import joblib

from ml.src.preprocessing import clean_dataset, map_targets, get_feature_lists
from ml.src.explainability import (
    resolve_path,
    load_final_models,
    extract_pipeline_and_classifier,
    compute_global_shap,
    explain_patient
)

# Load metadata and models
models, metadata = load_final_models("ml/artifacts/final")

meta_summary = []
for t in ["cad", "lad", "lcx", "rca"]:
    info = metadata[t]
    preprocessor, clf, calib_status, is_calib = extract_pipeline_and_classifier(models[t])
    meta_summary.append({
        "Target": info["target"],
        "Model": info["model"],
        "Calibration": info["calibration"],
        "Selected Threshold": info["selected_threshold"],
        "Input Feature Count": info["features_count"],
        "Classifier Class": type(clf).__name__
    })

pd.DataFrame(meta_summary)
"""))

# Section 2: Global Explainability
cells.append(nbf.v4.new_markdown_cell("""## 2. Global SHAP Feature Importance Calculation
We calculate global feature importances for CAD, LAD, LCX, and RCA by mapping preprocessed One-Hot Encoded and scaled columns back to the 54 original raw input features.
"""))

cells.append(nbf.v4.new_code_cell("""# Load dataset
df_raw = pd.read_excel(resolve_path("data/extention of Z-Alizadeh sani dataset.xlsx"))
df_clean = clean_dataset(df_raw)
df_mapped = map_targets(df_clean)

with open(resolve_path("ml/reports/feature_types.json"), "r") as f:
    feature_types = json.load(f)

num_cols, cat_cols, bin_cols = get_feature_lists(df_mapped, feature_types)
raw_features = num_cols + cat_cols + bin_cols
X_raw = df_mapped[raw_features]

global_dfs = {}
global_infos = {}
raw_shap_dfs = {}

for target in ["cad", "lad", "lcx", "rca"]:
    print(f"Calculating SHAP for {target.upper()}...")
    shap_df_raw, mean_abs_df, info = compute_global_shap(
        models[target], target, X_raw, raw_features, n_kmeans_bg=10, random_state=42
    )
    raw_shap_dfs[target] = shap_df_raw
    global_dfs[target] = mean_abs_df
    global_infos[target] = info

print("Global SHAP computation complete for all targets!")
"""))

# Display Top 10 for each target
cells.append(nbf.v4.new_markdown_cell("""### Top 10 Global Features by Target"""))
cells.append(nbf.v4.new_code_cell("""top10_df = pd.DataFrame({
    "CAD Top Features": global_dfs["cad"].head(10)["feature"].values,
    "CAD |SHAP|": global_dfs["cad"].head(10)["mean_abs_shap"].round(4).values,
    "LAD Top Features": global_dfs["lad"].head(10)["feature"].values,
    "LAD |SHAP|": global_dfs["lad"].head(10)["mean_abs_shap"].round(4).values,
    "LCX Top Features": global_dfs["lcx"].head(10)["feature"].values,
    "LCX |SHAP|": global_dfs["lcx"].head(10)["mean_abs_shap"].round(4).values,
    "RCA Top Features": global_dfs["rca"].head(10)["feature"].values,
    "RCA |SHAP|": global_dfs["rca"].head(10)["mean_abs_shap"].round(4).values,
})
top10_df
"""))

# Section 3: Visualizations
cells.append(nbf.v4.new_markdown_cell("""## 3. Global SHAP Visualizations
Plotting feature importance bar charts and summary/beeswarm plots for each vessel.
"""))

cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(2, 2, figsize=(16, 12))
targets = ["cad", "lad", "lcx", "rca"]

for idx, t in enumerate(targets):
    ax = axes[idx // 2, idx % 2]
    top15 = global_dfs[t].head(15).sort_values(by="mean_abs_shap", ascending=True)
    ax.barh(top15["feature"], top15["mean_abs_shap"], color="#2b5c8f")
    ax.set_title(f"{t.upper()} — Top 15 Global Feature Importance", fontsize=12, fontweight="bold")
    ax.set_xlabel("Mean |SHAP Value|")

plt.tight_layout()
plt.show()
"""))

# Section 4: Local Explainability
cells.append(nbf.v4.new_markdown_cell("""## 4. Local Patient Explanation (Individual Prediction)
Demonstrating patient-level feature decomposition and deterministic natural-language explanation.
"""))

cells.append(nbf.v4.new_code_cell("""patient_idx = 0
patient_row = X_raw.iloc[[patient_idx]]

cad_local = explain_patient("cad", models["cad"], patient_row, X_raw, raw_features, metadata)

print(f"=== LOCAL EXPLANATION FOR CAD (Patient #{patient_idx}) ===")
print(f"Probability Output: {cad_local['probability']:.4f} (Threshold: {cad_local['threshold']})")
print(f"Predicted Class: {cad_local['predicted_class']}")
print(f"Base Value: {cad_local['shap_base_value']}")
print(f"Sum of SHAP Contributions: {cad_local['shap_sum_contributions']}")
print("\\nTop 5 Contributing Features:")
for feat_item in cad_local["top_features"][:5]:
    print(f" - {feat_item['natural_language_summary']}")
"""))

# Section 5: Quality & Consistency Verification
cells.append(nbf.v4.new_markdown_cell("""## 5. Explanation Quality & Mathematical Consistency Verification
Validating base value + sum(SHAP) consistency and documenting calibration handling.
"""))

cells.append(nbf.v4.new_code_cell("""quality_df = pd.read_csv(resolve_path("ml/reports/explanation_quality_report.csv"))
quality_df
"""))

nb.cells = cells

with open("ml/notebooks/04_shap_explainability.ipynb", "w", encoding="utf-8") as f:
    nbf.write(nb, f)

print("Created notebook: ml/notebooks/04_shap_explainability.ipynb")
