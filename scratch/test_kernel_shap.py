import sys, os, json
sys.path.insert(0, os.path.abspath("."))
import time
import joblib
import pandas as pd
import numpy as np
import shap
from ml.src.preprocessing import clean_dataset, map_targets, get_feature_lists

df_raw = pd.read_excel("data/extention of Z-Alizadeh sani dataset.xlsx")
df_clean = clean_dataset(df_raw)
df_mapped = map_targets(df_clean)

with open("ml/reports/feature_types.json", "r") as f:
    feature_types = json.load(f)

num_cols, cat_cols, bin_cols = get_feature_lists(df_mapped, feature_types)
raw_features = num_cols + cat_cols + bin_cols
X_raw = df_mapped[raw_features]

lcx_model = joblib.load("ml/artifacts/final/lcx_model.joblib")

# For LCX (CalibratedClassifierCV with SVC), let's extract preprocessor and classifier
sub = lcx_model.calibrated_classifiers_[0].estimator
preprocessor = sub.named_steps['preprocessor']
svc = sub.named_steps['classifier']

X_trans = preprocessor.transform(X_raw)

t0 = time.time()
bg_summary = shap.kmeans(X_trans, 10)
explainer = shap.KernelExplainer(svc.predict_proba, bg_summary)
shap_values = explainer.shap_values(X_trans[:50])
t1 = time.time()

print(f"KernelExplainer test completed in {t1 - t0:.2f} seconds!")
if isinstance(shap_values, list):
    print("Class 1 SHAP values shape:", shap_values[1].shape)
else:
    print("SHAP values shape:", shap_values.shape)
