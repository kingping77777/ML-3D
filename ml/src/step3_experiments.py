import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import RepeatedStratifiedKFold, StratifiedKFold
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, precision_recall_curve, auc, brier_score_loss
)

from preprocessing import map_targets, clean_dataset, get_feature_lists, build_preprocessor, assert_no_leakage
from evaluation import calculate_specificity, evaluate_fold

# Global Random State
RANDOM_STATE = 42

# Define candidate models for each target per Step 3 instructions
CANDIDATE_MODELS = {
    'cad': {
        'Logistic Regression (Default)': LogisticRegression(random_state=RANDOM_STATE, max_iter=1000),
        'Random Forest (Default)': RandomForestClassifier(random_state=RANDOM_STATE),
        'Logistic Regression (Balanced)': LogisticRegression(class_weight='balanced', random_state=RANDOM_STATE, max_iter=1000)
    },
    'lad': {
        'Random Forest (Default)': RandomForestClassifier(random_state=RANDOM_STATE),
        'Random Forest (Balanced)': RandomForestClassifier(class_weight='balanced', random_state=RANDOM_STATE),
        'Gradient Boosting (Default)': GradientBoostingClassifier(random_state=RANDOM_STATE)
    },
    'lcx': {
        'Random Forest (Default)': RandomForestClassifier(random_state=RANDOM_STATE),
        'Gradient Boosting (Default)': GradientBoostingClassifier(random_state=RANDOM_STATE),
        'SVM (Balanced)': SVC(probability=True, class_weight='balanced', random_state=RANDOM_STATE)
    },
    'rca': {
        'Logistic Regression (Default)': LogisticRegression(random_state=RANDOM_STATE, max_iter=1000),
        'Logistic Regression (Balanced)': LogisticRegression(class_weight='balanced', random_state=RANDOM_STATE, max_iter=1000),
        'SVM (Balanced)': SVC(probability=True, class_weight='balanced', random_state=RANDOM_STATE)
    }
}

THRESHOLDS = [0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80]

def load_and_preprocess_raw_data(data_path):
    """
    Loads raw Excel dataset and applies leakage-safe setup.
    """
    df_raw = pd.read_excel(data_path)
    df_clean = clean_dataset(df_raw)
    df_mapped = map_targets(df_clean)
    return df_mapped

def get_target_features(df_mapped, exclude_extra=None):
    """
    Returns feature matrices and feature names excluding targets and optional extra features.
    """
    if exclude_extra is None:
        exclude_extra = []
        
    with open('../reports/feature_types.json', 'r') if os.path.exists('../reports/feature_types.json') else open('ml/reports/feature_types.json', 'r') as f:
        feature_types = json.load(f)
        
    num_cols, cat_cols, bin_cols = get_feature_lists(df_mapped, feature_types)
    
    # Exclude extra columns (e.g. for ablation)
    num_cols = [c for c in num_cols if c not in exclude_extra]
    cat_cols = [c for c in cat_cols if c not in exclude_extra]
    bin_cols = [c for c in bin_cols if c not in exclude_extra]
    
    feature_cols = num_cols + cat_cols + bin_cols
    X = df_mapped[feature_cols].copy()
    
    # Leakage assertions
    targets = ['Cath', 'LAD', 'LCX', 'RCA', 'y_cad', 'y_lad', 'y_lcx', 'y_rca']
    excluded = ['Exertional CP'] + exclude_extra
    assert_no_leakage(X, targets, excluded)
    
    return X, num_cols, cat_cols, bin_cols

def run_repeated_cv(X, y, model, preprocessor, n_splits=5, n_repeats=5, random_state=RANDOM_STATE):
    """
    Runs 5x5 RepeatedStratifiedKFold CV (25 folds total).
    Returns fold-by-fold metrics dataframe and out-of-fold predictions.
    Out-of-fold predictions average probability across repeats for each sample to give a clean 1-prediction-per-sample set or preserve all folds.
    """
    rskf = RepeatedStratifiedKFold(n_splits=n_splits, n_repeats=n_repeats, random_state=random_state)
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])
    
    fold_records = []
    oof_records = []
    
    for fold_idx, (train_idx, val_idx) in enumerate(rskf.split(X, y)):
        X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
        X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]
        
        # Fit pipeline
        pipeline.fit(X_train, y_train)
        
        # Predict validation
        y_prob = pipeline.predict_proba(X_val)[:, 1]
        y_pred = (y_prob >= 0.50).astype(int)
        
        # Evaluate fold
        metrics = evaluate_fold(y_val, y_pred, y_prob)
        metrics['fold'] = fold_idx + 1
        metrics['repeat'] = fold_idx // n_splits + 1
        fold_records.append(metrics)
        
        # OOF records
        oof_df = pd.DataFrame({
            'sample_index': y_val.index,
            'true_label': y_val.values,
            'predicted_probability': y_prob,
            'default_threshold_class': y_pred,
            'fold': fold_idx + 1,
            'repeat': fold_idx // n_splits + 1
        })
        oof_records.append(oof_df)
        
    fold_df = pd.DataFrame(fold_records)
    oof_all_df = pd.concat(oof_records, ignore_index=True)
    
    # Also create sample-level averaged OOF predictions across the 5 repeats
    oof_avg_df = oof_all_df.groupby(['sample_index', 'true_label']).agg({
        'predicted_probability': 'mean'
    }).reset_index()
    oof_avg_df['default_threshold_class'] = (oof_avg_df['predicted_probability'] >= 0.50).astype(int)
    
    return fold_df, oof_all_df, oof_avg_df

def compute_stability_summary(fold_df, target_name, model_name):
    """
    Computes mean, std, min, max, and coefficient of variation (CV = std/mean) for metrics across folds.
    """
    metric_cols = ['roc_auc', 'pr_auc', 'f1', 'precision', 'recall', 'specificity', 'accuracy']
    summary = {
        'target': target_name,
        'model': model_name
    }
    
    for col in metric_cols:
        vals = fold_df[col].dropna()
        mean_v = vals.mean()
        std_v = vals.std()
        min_v = vals.min()
        max_v = vals.max()
        cv_v = (std_v / mean_v) if mean_v != 0 else np.nan
        
        summary[f'{col}_mean'] = mean_v
        summary[f'{col}_std'] = std_v
        summary[f'{col}_min'] = min_v
        summary[f'{col}_max'] = max_v
        summary[f'{col}_cv'] = cv_v
        
    return summary

def analyze_thresholds(oof_avg_df, thresholds=THRESHOLDS):
    """
    Evaluates classification metrics across candidate thresholds using out-of-fold predictions.
    """
    results = []
    y_true = oof_avg_df['true_label'].values
    y_prob = oof_avg_df['predicted_probability'].values
    
    for thresh in thresholds:
        y_pred = (y_prob >= thresh).astype(int)
        
        prec = precision_score(y_true, y_pred, zero_division=0)
        rec = recall_score(y_true, y_pred, zero_division=0) # Sensitivity
        spec = calculate_specificity(y_true, y_pred)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        acc = accuracy_score(y_true, y_pred)
        
        results.append({
            'threshold': thresh,
            'precision': prec,
            'recall': rec,
            'sensitivity': rec,
            'specificity': spec,
            'f1': f1,
            'accuracy': acc
        })
        
    return pd.DataFrame(results)

def evaluate_calibration(X, y, model, preprocessor, n_splits=5, n_repeats=5, random_state=RANDOM_STATE):
    """
    Compares Uncalibrated, Sigmoidal (Platt), and Isotonic calibration using CV-safe out-of-fold predictions.
    """
    rskf = RepeatedStratifiedKFold(n_splits=n_splits, n_repeats=n_repeats, random_state=random_state)
    
    uncal_probs = np.zeros((len(X), n_repeats))
    sig_probs = np.zeros((len(X), n_repeats))
    iso_probs = np.zeros((len(X), n_repeats))
    
    y_true_array = y.values
    
    # Store probability predictions per repeat
    for rep in range(n_repeats):
        skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state + rep)
        for train_idx, val_idx in skf.split(X, y):
            X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
            X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]
            
            # Base Pipeline
            base_pipeline = Pipeline([
                ('preprocessor', preprocessor),
                ('classifier', model)
            ])
            base_pipeline.fit(X_train, y_train)
            
            # 1. Uncalibrated
            uncal_p = base_pipeline.predict_proba(X_val)[:, 1]
            uncal_probs[val_idx, rep] = uncal_p
            
            # 2. Sigmoid Calibration using inner CV on training fold
            sig_cal = CalibratedClassifierCV(estimator=base_pipeline, method='sigmoid', cv=3)
            sig_cal.fit(X_train, y_train)
            sig_p = sig_cal.predict_proba(X_val)[:, 1]
            sig_probs[val_idx, rep] = sig_p
            
            # 3. Isotonic Calibration using inner CV on training fold
            iso_cal = CalibratedClassifierCV(estimator=base_pipeline, method='isotonic', cv=3)
            iso_cal.fit(X_train, y_train)
            iso_p = iso_cal.predict_proba(X_val)[:, 1]
            iso_probs[val_idx, rep] = iso_p

    # Average across repeats
    mean_uncal = uncal_probs.mean(axis=1)
    mean_sig = sig_probs.mean(axis=1)
    mean_iso = iso_probs.mean(axis=1)
    
    cal_results = []
    for name, probs in [('Uncalibrated', mean_uncal), ('Sigmoid', mean_sig), ('Isotonic', mean_iso)]:
        y_pred = (probs >= 0.50).astype(int)
        metrics = evaluate_fold(y_true_array, y_pred, probs)
        brier = brier_score_loss(y_true_array, probs)
        metrics['calibration'] = name
        metrics['brier_score'] = brier
        cal_results.append(metrics)
        
    return pd.DataFrame(cal_results), mean_uncal, mean_sig, mean_iso
