import sys, os
sys.path.insert(0, os.path.abspath("."))
import joblib
import json
import pandas as pd
import numpy as np
import shap
from ml.src.preprocessing import clean_dataset, map_targets, get_feature_lists

# Load dataset
df_raw = pd.read_excel("data/extention of Z-Alizadeh sani dataset.xlsx")
df_clean = clean_dataset(df_raw)
df_mapped = map_targets(df_clean)

with open("ml/reports/feature_types.json", "r") as f:
    feature_types = json.load(f)

num_cols, cat_cols, bin_cols = get_feature_lists(df_mapped, feature_types)
raw_features = num_cols + cat_cols + bin_cols

print(f"Loaded dataset: shape={df_mapped.shape}, raw_features count={len(raw_features)}")

# Test CAD model
cad_model = joblib.load("ml/artifacts/final/cad_model.joblib")
preprocessor = cad_model.named_steps['preprocessor']
clf = cad_model.named_steps['classifier']

X_raw = df_mapped[raw_features]
X_trans = preprocessor.transform(X_raw)
feature_names_transformed = preprocessor.get_feature_names_out()

print(f"Transformed features count: {X_trans.shape[1]}")
print("Transformed feature names sample:", feature_names_transformed[:10])

# Test SHAP LinearExplainer on CAD
explainer_cad = shap.LinearExplainer(clf, X_trans)
shap_vals_cad = explainer_cad.shap_values(X_trans)
print("CAD SHAP values shape:", shap_vals_cad.shape)
print("CAD Base value:", explainer_cad.expected_value)

# Test LAD model (CalibratedClassifierCV containing RandomForest Pipeline)
lad_model = joblib.load("ml/artifacts/final/lad_model.joblib")

# inspect base estimator inside CalibratedClassifierCV
base_pipeline = lad_model.calibrated_classifiers_[0].estimator
lad_preprocessor = base_pipeline.named_steps['preprocessor']
lad_rf = base_pipeline.named_steps['classifier']

X_trans_lad = lad_preprocessor.transform(X_raw)
explainer_lad = shap.TreeExplainer(lad_rf)
shap_vals_lad = explainer_lad.shap_values(X_trans_lad)
if isinstance(shap_vals_lad, list):
    # for classification, class 1 shap values
    shap_vals_lad_class1 = shap_vals_lad[1]
elif hasattr(shap_vals_lad, "values") and len(shap_vals_lad.values.shape) == 3:
    shap_vals_lad_class1 = shap_vals_lad.values[:, :, 1]
else:
    shap_vals_lad_class1 = shap_vals_lad
print("LAD SHAP values shape:", np.array(shap_vals_lad_class1).shape)

# Test LCX model (CalibratedClassifierCV with SVM)
lcx_model = joblib.load("ml/artifacts/final/lcx_model.joblib")
# Use KernelExplainer or Explainer on predict_proba
lcx_bg = X_raw.sample(n=50, random_state=42)
explainer_lcx = shap.Explainer(lcx_model.predict_proba, lcx_bg)
shap_vals_lcx = explainer_lcx(X_raw.iloc[:5])
print("LCX SHAP values shape:", shap_vals_lcx.values.shape)

# Test RCA model (Pipeline with LogisticRegression)
rca_model = joblib.load("ml/artifacts/final/rca_model.joblib")
rca_pre = rca_model.named_steps['preprocessor']
rca_clf = rca_model.named_steps['classifier']
X_trans_rca = rca_pre.transform(X_raw)
explainer_rca = shap.LinearExplainer(rca_clf, X_trans_rca)
shap_vals_rca = explainer_rca.shap_values(X_trans_rca)
print("RCA SHAP values shape:", shap_vals_rca.shape)

print("All SHAP tests passed successfully!")
