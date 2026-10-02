import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV

def resolve_path(path):
    """
    Resolves relative path when executing either from root or from ml/notebooks.
    """
    if os.path.exists(path):
        return path
    alt_1 = os.path.join("..", path)
    if os.path.exists(alt_1):
        return alt_1
    alt_2 = os.path.join("../..", path)
    if os.path.exists(alt_2):
        return alt_2
    return path

def fix_unpickled_imputers(transformer):
    """
    Ensures unpickled SimpleImputer instances have both _fill_dtype and _fit_dtype set across scikit-learn versions (1.7 vs 1.9).
    """
    def _patch_imputer(obj):
        if hasattr(obj, "statistics_"):
            if not hasattr(obj, "_fill_dtype"):
                obj._fill_dtype = getattr(obj, "_fit_dtype", obj.statistics_.dtype)
            if not hasattr(obj, "_fit_dtype"):
                obj._fit_dtype = getattr(obj, "_fill_dtype", obj.statistics_.dtype)

    if hasattr(transformer, "transformers_"):
        for name, trans, cols in transformer.transformers_:
            if hasattr(trans, "steps"):
                for step_name, step_obj in trans.steps:
                    _patch_imputer(step_obj)
            else:
                _patch_imputer(trans)

def load_final_models(artifacts_dir="ml/artifacts/final"):
    """
    Loads model metadata and model artifacts for all four targets: CAD, LAD, LCX, RCA.
    """
    artifacts_dir = resolve_path(artifacts_dir)
    meta_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(meta_path, "r") as f:
        metadata = json.load(f)
        
    models = {}
    for target in ["cad", "lad", "lcx", "rca"]:
        path = os.path.join(artifacts_dir, f"{target}_model.joblib")
        models[target] = joblib.load(path)
        
    return models, metadata

def extract_pipeline_and_classifier(model_obj):
    """
    Extracts the preprocessor and the underlying core classifier from
    either a Pipeline or a CalibratedClassifierCV wrapper.
    """
    if isinstance(model_obj, Pipeline):
        preprocessor = model_obj.named_steps['preprocessor']
        classifier = model_obj.named_steps['classifier']
        calibration_status = "Uncalibrated"
        is_calibrated = False
    elif isinstance(model_obj, CalibratedClassifierCV):
        base_pipe = model_obj.calibrated_classifiers_[0].estimator
        preprocessor = base_pipe.named_steps['preprocessor']
        classifier = base_pipe.named_steps['classifier']
        calibration_status = f"Calibrated ({model_obj.method})"
        is_calibrated = True
    else:
        raise ValueError(f"Unsupported model object type: {type(model_obj)}")
        
    fix_unpickled_imputers(preprocessor)
    return preprocessor, classifier, calibration_status, is_calibrated

def get_feature_mapping(preprocessor, raw_features):
    """
    Maps transformed column names out of ColumnTransformer back to raw feature names.
    """
    feature_names_out = preprocessor.get_feature_names_out()
    mapping = []
    for f_out in feature_names_out:
        prefix_removed = f_out.split("__")[-1]
        
        matched_raw = None
        for raw_f in raw_features:
            if prefix_removed == raw_f or prefix_removed.startswith(raw_f + "_"):
                matched_raw = raw_f
                break
                
        if matched_raw is None:
            matched_raw = prefix_removed
            
        mapping.append((f_out, matched_raw))
        
    return feature_names_out, mapping

def aggregate_shap_to_raw_features(shap_values_trans, feature_mapping, raw_features):
    """
    Aggregates SHAP values for transformed One-Hot/Scaled columns back to the 54 original raw features.
    Ensures shap_values_trans is a 2D matrix (N_samples, N_transformed_cols).
    """
    if isinstance(shap_values_trans, list):
        shap_values_trans = shap_values_trans[1]
    if hasattr(shap_values_trans, "values"):
        shap_values_trans = shap_values_trans.values
    if len(shap_values_trans.shape) == 3:
        shap_values_trans = shap_values_trans[:, :, 1]
        
    n_samples = shap_values_trans.shape[0]
    aggregated_dict = {rf: np.zeros(n_samples) for rf in raw_features}
    
    for col_idx, (f_out, raw_f) in enumerate(feature_mapping):
        col_vals = shap_values_trans[:, col_idx]
        if raw_f in aggregated_dict:
            aggregated_dict[raw_f] += col_vals
        else:
            aggregated_dict[raw_f] = col_vals.copy()
            
    shap_df_raw = pd.DataFrame(aggregated_dict)
    return shap_df_raw

def compute_global_shap(model_obj, target_name, X_raw, raw_features, n_kmeans_bg=10, random_state=42):
    """
    Computes SHAP values and global feature importances for a target model.
    """
    preprocessor, clf, calib_status, is_calib = extract_pipeline_and_classifier(model_obj)
    X_trans = preprocessor.transform(X_raw)
    f_out, mapping = get_feature_mapping(preprocessor, raw_features)
    
    clf_type = type(clf).__name__
    
    if "LogisticRegression" in clf_type:
        explainer = shap.LinearExplainer(clf, X_trans)
        raw_shap = explainer.shap_values(X_trans)
        base_val = float(explainer.expected_value)
        explainer_name = "LinearExplainer"
    elif "RandomForest" in clf_type or "ExtraTrees" in clf_type or "GradientBoosting" in clf_type:
        explainer = shap.TreeExplainer(clf)
        raw_shap = explainer.shap_values(X_trans)
        b_val = explainer.expected_value
        if isinstance(b_val, (list, np.ndarray)):
            base_val = float(b_val[1])
        else:
            base_val = float(b_val)
        explainer_name = "TreeExplainer"
    else:
        bg_summary = shap.kmeans(X_trans, n_kmeans_bg)
        explainer = shap.KernelExplainer(clf.predict_proba, bg_summary)
        X_trans_sub = X_trans[::3]
        raw_shap = explainer.shap_values(X_trans_sub)
        b_val = explainer.expected_value
        if isinstance(b_val, (list, np.ndarray)):
            base_val = float(b_val[1])
        else:
            base_val = float(b_val)
        explainer_name = "KernelExplainer"
        
    shap_df_raw = aggregate_shap_to_raw_features(raw_shap, mapping, raw_features)
    
    mean_abs_shap = shap_df_raw.abs().mean(axis=0).reset_index()
    mean_abs_shap.columns = ["feature", "mean_abs_shap"]
    mean_abs_shap = mean_abs_shap.sort_values(by="mean_abs_shap", ascending=False).reset_index(drop=True)
    mean_abs_shap["rank"] = mean_abs_shap.index + 1
    
    info = {
        "target": target_name.upper(),
        "model_type": clf_type,
        "calibration": calib_status,
        "explainer_type": explainer_name,
        "base_value": base_val,
        "preprocessor": preprocessor,
        "classifier": clf,
        "feature_mapping": mapping,
        "explainer": explainer
    }
    
    return shap_df_raw, mean_abs_shap, info

def explain_patient(target_name, model_obj, patient_row_df, X_raw_df, raw_features, metadata):
    """
    Computes local SHAP explanation for an individual patient.
    """
    preprocessor, clf, calib_status, is_calib = extract_pipeline_and_classifier(model_obj)
    
    prob = float(model_obj.predict_proba(patient_row_df)[0, 1])
    thresh = float(metadata[target_name.lower()]["selected_threshold"])
    pred_class = int(prob >= thresh)
    
    X_trans_patient = preprocessor.transform(patient_row_df)
    f_out, mapping = get_feature_mapping(preprocessor, raw_features)
    
    clf_type = type(clf).__name__
    
    if "LogisticRegression" in clf_type:
        explainer = shap.LinearExplainer(clf, preprocessor.transform(X_raw_df))
        raw_shap = explainer.shap_values(X_trans_patient)
        base_val = float(explainer.expected_value)
        explainer_name = "LinearExplainer"
    elif "RandomForest" in clf_type:
        explainer = shap.TreeExplainer(clf)
        raw_shap = explainer.shap_values(X_trans_patient)
        b_val = explainer.expected_value
        base_val = float(b_val[1]) if isinstance(b_val, (list, np.ndarray)) else float(b_val)
        explainer_name = "TreeExplainer"
    else:
        bg_summary = shap.kmeans(preprocessor.transform(X_raw_df), 10)
        explainer = shap.KernelExplainer(clf.predict_proba, bg_summary)
        raw_shap = explainer.shap_values(X_trans_patient)
        b_val = explainer.expected_value
        base_val = float(b_val[1]) if isinstance(b_val, (list, np.ndarray)) else float(b_val)
        explainer_name = "KernelExplainer"
        
    shap_df_raw = aggregate_shap_to_raw_features(raw_shap, mapping, raw_features)
    patient_shap = shap_df_raw.iloc[0]
    
    features_contrib = []
    for feat in raw_features:
        s_val = float(patient_shap[feat])
        val = patient_row_df[feat].values[0]
        if isinstance(val, (np.generic, np.ndarray)):
            val = val.item()
        direction = "positive contribution" if s_val >= 0 else "negative contribution"
        features_contrib.append({
            "feature": feat,
            "value": val,
            "shap_value": round(s_val, 4),
            "direction": direction,
            "abs_shap": abs(s_val)
        })
        
    features_contrib.sort(key=lambda x: x["abs_shap"], reverse=True)
    for r_idx, item in enumerate(features_contrib):
        item["rank"] = r_idx + 1
        del item["abs_shap"]
        dir_word = "positively" if item["shap_value"] >= 0 else "negatively"
        item["natural_language_summary"] = (
            f"'{item['feature']}' (patient value: {item['value']}) contributed {dir_word} "
            f"to the model's {target_name.upper()} probability output."
        )
        
    sum_shap = float(np.sum([item["shap_value"] for item in features_contrib]))
    reconstructed_margin = base_val + sum_shap
    
    local_explanation = {
        "target": target_name.upper(),
        "model_type": metadata[target_name.lower()]["model"],
        "explainer_type": explainer_name,
        "calibration": calib_status,
        "probability": round(prob, 4),
        "threshold": thresh,
        "predicted_class": pred_class,
        "shap_base_value": round(base_val, 4),
        "shap_sum_contributions": round(sum_shap, 4),
        "top_features": features_contrib[:10],
        "all_features": features_contrib,
        "consistency_check": {
            "space": "Model decision space (log-odds / margin for linear & tree models, probability for kernel)",
            "base_value": round(base_val, 4),
            "sum_shap": round(sum_shap, 4),
            "reconstructed_output": round(reconstructed_margin, 4)
        }
    }
    
    return local_explanation
