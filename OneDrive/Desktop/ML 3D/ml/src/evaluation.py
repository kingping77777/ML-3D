import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, precision_recall_curve, auc
)

def calculate_specificity(y_true, y_pred):
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()
    return tn / (tn + fp) if (tn + fp) > 0 else 0.0

def evaluate_fold(y_true, y_pred, y_prob):
    """
    Evaluates predictions for a single CV fold.
    Returns dictionary of metrics.
    """
    metrics = {}
    metrics['accuracy'] = accuracy_score(y_true, y_pred)
    metrics['precision'] = precision_score(y_true, y_pred, zero_division=0)
    metrics['recall'] = recall_score(y_true, y_pred, zero_division=0)  # Sensitivity
    metrics['specificity'] = calculate_specificity(y_true, y_pred)
    metrics['f1'] = f1_score(y_true, y_pred, zero_division=0)
    
    try:
        metrics['roc_auc'] = roc_auc_score(y_true, y_prob)
    except ValueError:
        metrics['roc_auc'] = np.nan
        
    try:
        precision_curve, recall_curve, _ = precision_recall_curve(y_true, y_prob)
        metrics['pr_auc'] = auc(recall_curve, precision_curve)
    except ValueError:
        metrics['pr_auc'] = np.nan
        
    return metrics

def aggregate_cv_metrics(fold_metrics_list):
    """
    Aggregates metrics across folds, calculating mean and std.
    """
    aggregated = {}
    # Fold metrics is a list of dicts. Convert to dict of lists.
    metrics_keys = fold_metrics_list[0].keys()
    for key in metrics_keys:
        values = [fm[key] for fm in fold_metrics_list]
        aggregated[f'{key}_mean'] = np.mean(values)
        aggregated[f'{key}_std'] = np.std(values)
    return aggregated
