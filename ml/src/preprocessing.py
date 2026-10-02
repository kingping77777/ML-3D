import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def map_targets(df):
    """
    Creates binary targets:
    Cath: CAD -> 1, Normal -> 0
    LAD, LCX, RCA: Stenotic -> 1, Normal -> 0
    """
    df_mapped = df.copy()
    
    # Map Cath
    if 'Cath' in df_mapped.columns:
        valid_cath = {'CAD', 'Normal'}
        actual_cath = set(df_mapped['Cath'].dropna().unique())
        if not actual_cath.issubset(valid_cath):
            raise ValueError(f"Unexpected values in Cath: {actual_cath - valid_cath}")
        df_mapped['y_cad'] = df_mapped['Cath'].map({'CAD': 1, 'Normal': 0})
        
    # Map LAD, LCX, RCA
    valid_vessel = {'Stenotic', 'Normal'}
    for target in ['LAD', 'LCX', 'RCA']:
        if target in df_mapped.columns:
            actual = set(df_mapped[target].dropna().unique())
            if not actual.issubset(valid_vessel):
                raise ValueError(f"Unexpected values in {target}: {actual - valid_vessel}")
            df_mapped[f'y_{target.lower()}'] = df_mapped[target].map({'Stenotic': 1, 'Normal': 0})
            
    return df_mapped

def clean_dataset(df):
    """
    Cleans dataset in-memory without modifying original file.
    Fixes Sex typo (Fmale -> Female).
    """
    df_clean = df.copy()
    
    # Normalize Sex typo
    if 'Sex' in df_clean.columns:
        df_clean['Sex'] = df_clean['Sex'].replace({'Fmale': 'Female'})
        
    return df_clean

def get_feature_lists(df, feature_types_dict):
    """
    Extracts lists of features by type from the Step 1 feature dict,
    excluding target variables and Exertional CP.
    """
    targets = ['Cath', 'LAD', 'LCX', 'RCA']
    excluded = ['Exertional CP']
    all_excluded = set(targets + excluded)
    
    numerical = [f for f in feature_types_dict.get('numerical', []) if f not in all_excluded and f in df.columns]
    categorical = [f for f in feature_types_dict.get('categorical', []) if f not in all_excluded and f in df.columns]
    binary = [f for f in feature_types_dict.get('binary', []) if f not in all_excluded and f in df.columns]
    
    return numerical, categorical, binary

def build_preprocessor(numerical_cols, categorical_cols, binary_cols):
    """
    Builds a scikit-learn ColumnTransformer for preprocessing.
    Numerical: Median Imputer -> StandardScaler
    Categorical: Most Frequent Imputer -> OneHotEncoder(handle_unknown='ignore')
    Binary: Most Frequent Imputer -> OneHotEncoder(drop='if_binary', handle_unknown='ignore')
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])
    
    # For binary, we might want to just map or OHE drop='if_binary'. 
    # Using OHE for consistency and robustness to unseen labels, drop='if_binary' avoids collinearity.
    bin_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('ohe', OneHotEncoder(drop='if_binary', handle_unknown='ignore', sparse_output=False))
    ])
    
    transformers = []
    if numerical_cols:
        transformers.append(('num', num_pipeline, numerical_cols))
    if categorical_cols:
        transformers.append(('cat', cat_pipeline, categorical_cols))
    if binary_cols:
        transformers.append(('bin', bin_pipeline, binary_cols))
        
    preprocessor = ColumnTransformer(transformers=transformers, remainder='drop')
    return preprocessor

def assert_no_leakage(X, targets, excluded):
    """
    Asserts that targets and excluded features are not present in feature matrix X.
    """
    for col in targets + excluded:
        if col in X.columns:
            raise ValueError(f"DATA LEAKAGE DETECTED: {col} is present in feature matrix X!")
