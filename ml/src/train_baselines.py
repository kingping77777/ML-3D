import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold
from sklearn.pipeline import Pipeline
import time
from evaluation import evaluate_fold, aggregate_cv_metrics

def get_baseline_models(random_state=42):
    """
    Returns a dictionary of baseline models to evaluate.
    Both default and balanced configurations for models that support it.
    """
    models = {
        'Logistic Regression (Default)': LogisticRegression(random_state=random_state, max_iter=1000),
        'Logistic Regression (Balanced)': LogisticRegression(class_weight='balanced', random_state=random_state, max_iter=1000),
        'Random Forest (Default)': RandomForestClassifier(random_state=random_state),
        'Random Forest (Balanced)': RandomForestClassifier(class_weight='balanced', random_state=random_state),
        'Gradient Boosting (Default)': GradientBoostingClassifier(random_state=random_state),
        # GB doesn't have class_weight natively in sklearn. 
        'SVM (Default)': SVC(probability=True, random_state=random_state),
        'SVM (Balanced)': SVC(probability=True, class_weight='balanced', random_state=random_state)
    }
    return models

def run_cross_validation(X, y, model, preprocessor, n_splits=5, random_state=42):
    """
    Runs Stratified K-Fold CV for a single model and target.
    Returns aggregated metrics and out-of-fold predictions.
    """
    cv = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=random_state)
    
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', model)
    ])
    
    fold_metrics = []
    oof_predictions = []
    
    for fold, (train_idx, val_idx) in enumerate(cv.split(X, y)):
        X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
        X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]
        
        # Fit pipeline (ensures transformations are learned only on training data)
        pipeline.fit(X_train, y_train)
        
        # Predict
        y_pred = pipeline.predict(X_val)
        if hasattr(pipeline.named_steps['classifier'], "predict_proba"):
            y_prob = pipeline.predict_proba(X_val)[:, 1]
        else:
            # Fallback for models without predict_proba (though all baselines here have it)
            y_prob = pipeline.decision_function(X_val)
            # Min-max scale decision function roughly to 0-1 if necessary (SVC w/o proba)
            # But SVC has probability=True configured.
            
        metrics = evaluate_fold(y_val, y_pred, y_prob)
        fold_metrics.append(metrics)
        
        # Collect OOF predictions
        oof_df = pd.DataFrame({
            'sample_index': y_val.index,
            'true_label': y_val.values,
            'predicted_class': y_pred,
            'predicted_probability': y_prob,
            'fold': fold + 1
        })
        oof_predictions.append(oof_df)
        
    agg_metrics = aggregate_cv_metrics(fold_metrics)
    oof_predictions_df = pd.concat(oof_predictions).sort_values('sample_index')
    
    return agg_metrics, oof_predictions_df
