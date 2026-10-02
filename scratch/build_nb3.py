import nbformat as nbf

nb = nbf.v4.new_notebook()

cells = []

# Title & Overview
cells.append(nbf.v4.new_markdown_cell("""# CardioVision 3D - Step 3: Robust Model Validation, Selection & Calibration

## Executive Summary
This notebook performs **Step 3** of the CardioVision 3D pipeline:
1. **Repeated Stratified Cross-Validation (5x5 Folds)**: Evaluates model stability across 25 validation splits per candidate model.
2. **Out-of-Fold (OOF) Prediction Generation**: Collects unbiased sample-level probability predictions across folds.
3. **Operating Threshold Analysis**: Evaluates 13 candidate thresholds (0.20 to 0.80) to select optimal sensitivity/specificity trade-offs per target vessel.
4. **Probability Calibration**: Evaluates Uncalibrated vs. Sigmoid (Platt) vs. Isotonic calibration using cross-validation-safe procedures.
5. **Controlled Feature Ablations**:
   - Ablation 1: Excludes `Region RWMA` feature.
   - Ablation 2: Excludes 13 near-constant features ($\ge 95\%$ frequency).
6. **Model Selection & Final Artifact Fitting**: Selects independent final configurations for CAD, LAD, LCX, and RCA, saving serialized joblib models and structured metadata.
"""))

# Imports & Setup
cells.append(nbf.v4.new_code_cell("""import sys
import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

sys.path.append('../src')

from preprocessing import map_targets, clean_dataset, get_feature_lists, build_preprocessor, assert_no_leakage
from evaluation import calculate_specificity, evaluate_fold

# Plotting style
sns.set_theme(style='whitegrid')
plt.rcParams['font.sans-serif'] = 'Arial'

RANDOM_STATE = 42
data_path = '../../data/extention of Z-Alizadeh sani dataset.xlsx'
if not os.path.exists(data_path):
    data_path = '../../data/extention of Z-Alizadeh sani dataset/extention of Z-Alizadeh sani dataset.xlsx'

print("Setup completed successfully.")
"""))

# Section 1: Load Data & Setup
cells.append(nbf.v4.new_markdown_cell("""## Section 1: Data Loading & Preprocessing Pipeline Setup"""))

cells.append(nbf.v4.new_code_cell("""df_raw = pd.read_excel(data_path)
df_clean = clean_dataset(df_raw)
df_mapped = map_targets(df_clean)

with open('../reports/feature_types.json', 'r') as f:
    feature_types = json.load(f)

num_cols, cat_cols, bin_cols = get_feature_lists(df_mapped, feature_types)
print(f"Loaded {len(df_mapped)} rows.")
print(f"Feature set counts - Numerical: {len(num_cols)}, Categorical: {len(cat_cols)}, Binary: {len(bin_cols)}")
"""))

# Section 2: Repeated CV & Stability
cells.append(nbf.v4.new_markdown_cell("""## Section 2: 5x5 Repeated Stratified Cross-Validation & Stability Summary"""))

cells.append(nbf.v4.new_code_cell("""rep_cv_df = pd.read_csv('../reports/repeated_cv_results.csv')
rep_cv_df.head(10)
"""))

cells.append(nbf.v4.new_code_cell("""# Display repeated CV metric distribution plot
from IPython.display import Image
Image(filename='../reports/figures/repeated_cv_metric_distributions.png')
"""))

# Section 3: Threshold Analysis
cells.append(nbf.v4.new_markdown_cell("""## Section 3: Out-of-Fold Operating Threshold Analysis"""))

cells.append(nbf.v4.new_code_cell("""thresh_df = pd.read_csv('../reports/threshold_analysis.csv')
thresh_df.head(15)
"""))

cells.append(nbf.v4.new_code_cell("""Image(filename='../reports/figures/threshold_curves.png')"""))

# Section 4: Probability Calibration
cells.append(nbf.v4.new_markdown_cell("""## Section 4: Probability Calibration & Brier Score Comparison"""))

cells.append(nbf.v4.new_code_cell("""calib_df = pd.read_csv('../reports/calibration_results.csv')
calib_df
"""))

cells.append(nbf.v4.new_code_cell("""Image(filename='../reports/figures/calibration_curves.png')"""))

# Section 5: Feature Ablation Experiments
cells.append(nbf.v4.new_markdown_cell("""## Section 5: Feature Ablation Experiments"""))

cells.append(nbf.v4.new_code_cell("""ablation_df = pd.read_csv('../reports/ablation_results.csv')
ablation_df
"""))

cells.append(nbf.v4.new_code_cell("""Image(filename='../reports/figures/ablation_comparison.png')"""))

# Section 6: Final Model Selection & Artifact Verification
cells.append(nbf.v4.new_markdown_cell("""## Section 6: Final Model Selection & Artifact Verification"""))

cells.append(nbf.v4.new_code_cell("""final_selection_df = pd.read_csv('../reports/final_model_selection.csv')
final_selection_df
"""))

cells.append(nbf.v4.new_code_cell("""with open('../artifacts/final/model_metadata.json', 'r') as f:
    meta = json.load(f)
print(json.dumps(meta, indent=2))
"""))

nb['cells'] = cells

with open('ml/notebooks/03_model_selection_and_calibration.ipynb', 'w', encoding='utf-8') as f:
    nbf.write(nb, f)

print("Notebook 03_model_selection_and_calibration.ipynb written successfully!")
