"""
CardioVision 3D - Step 1: Dataset Audit Utilities
Module: ml/src/dataset_audit.py
Goal: Modular, reusable utilities for auditing the UCI Extension of Z-Alizadeh Sani Dataset.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple, Optional, Any

# Fixed Random Seed for reproducibility
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# Default target column definitions as per problem statement
KNOWN_TARGET_COLS = ['CAD', 'LAD', 'LCX', 'RCA', 'Cath']

# Standard search paths for the Z-Alizadeh Sani dataset
DEFAULT_DATASET_PATHS = [
    os.path.join("data", "extention+of+z+alizadeh+sani+dataset", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("data", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("..", "data", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("..", "..", "data", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("..", "data", "extention+of+z+alizadeh+sani+dataset", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("..", "..", "data", "extention+of+z+alizadeh+sani+dataset", "extention of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("data", "extension of Z-Alizadeh sani dataset.xlsx"),
    os.path.join("data", "Z-Alizadeh_sani_dataset.xlsx"),
    os.path.join("data", "Z-Alizadeh_sani_dataset.csv"),
    os.path.join("data", "z_alizadeh_sani.xlsx"),
    os.path.join("data", "z_alizadeh_sani.csv"),
    os.path.join("ml", "data", "Z-Alizadeh_sani_dataset.xlsx"),
    os.path.join("ml", "data", "Z-Alizadeh_sani_dataset.csv"),
    "Z-Alizadeh_sani_dataset.xlsx",
    "Z-Alizadeh_sani_dataset.csv"
]


def locate_dataset(custom_path: Optional[str] = None) -> Tuple[Optional[str], bool]:
    """
    Locates the dataset in the workspace.
    Returns (path, exists_flag).
    """
    if custom_path and os.path.exists(custom_path):
        return custom_path, True

    for p in DEFAULT_DATASET_PATHS:
        if os.path.exists(p):
            return p, True

    # Dynamic parent folder lookup strategy from current working directory
    curr = os.path.abspath(os.getcwd())
    for _ in range(5):
        candidate = os.path.join(curr, "data", "extention of Z-Alizadeh sani dataset.xlsx")
        if os.path.exists(candidate):
            return candidate, True
        parent = os.path.dirname(curr)
        if parent == curr:
            break
        curr = parent

    return None, False


def load_dataset(filepath: str) -> pd.DataFrame:
    """
    Loads dataset from CSV or Excel file cleanly without modifications.
    """
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")

    ext = os.path.splitext(filepath)[1].lower()
    if ext in ['.xlsx', '.xls']:
        df = pd.read_excel(filepath)
    elif ext in ['.csv', '.txt']:
        df = pd.read_csv(filepath)
    else:
        # Fallback attempting csv then excel
        try:
            df = pd.read_csv(filepath)
        except Exception:
            df = pd.read_excel(filepath)
    return df


def dataset_basic_info(df: pd.DataFrame, filepath: str) -> Dict[str, Any]:
    """
    Calculates basic dataset dimensions, dtypes, and memory footprint.
    """
    memory_mb = df.memory_usage(deep=True).sum() / (1024 * 1024)
    info = {
        "dataset_path": os.path.abspath(filepath),
        "num_rows": df.shape[0],
        "num_cols": df.shape[1],
        "columns": list(df.columns),
        "dtypes": df.dtypes.astype(str).to_dict(),
        "memory_usage_mb": round(memory_mb, 4)
    }
    return info


def build_data_dictionary(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generates data dictionary table for every column in the dataset.
    """
    dict_list = []
    for col in df.columns:
        series = df[col]
        n_unique = series.nunique(dropna=False)
        n_missing = series.isnull().sum()
        pct_missing = (n_missing / len(series)) * 100
        
        # Simple heuristic check for numerical vs categorical
        if pd.api.types.is_numeric_dtype(series) and n_unique > 10:
            suggested_type = "Numerical"
        elif n_unique <= 10:
            suggested_type = "Categorical / Binary"
        else:
            suggested_type = "Categorical / Text"

        # Obtain clean example values
        sample_vals = series.dropna().unique()[:3]
        examples_str = ", ".join(map(str, sample_vals)) if len(sample_vals) > 0 else "N/A"

        dict_list.append({
            "column_name": col,
            "data_type": str(series.dtype),
            "num_unique_values": n_unique,
            "missing_count": n_missing,
            "missing_percentage": round(pct_missing, 2),
            "suggested_type": suggested_type,
            "example_values": examples_str,
            "medical_meaning": "Meaning requires verification"
        })

    return pd.DataFrame(dict_list)


def audit_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """
    Audits missing values per column.
    """
    missing_data = []
    total_rows = len(df)
    for col in df.columns:
        n_miss = df[col].isnull().sum()
        pct_miss = (n_miss / total_rows) * 100
        missing_data.append({
            "column": col,
            "missing_count": n_miss,
            "missing_percentage": round(pct_miss, 2)
        })
    res_df = pd.DataFrame(missing_data).sort_values(by="missing_count", ascending=False).reset_index(drop=True)
    return res_df


def audit_duplicates(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Audits duplicate rows and candidate duplicate identifier columns.
    """
    num_exact_duplicates = df.duplicated().sum()
    pct_exact_duplicates = (num_exact_duplicates / len(df)) * 100
    
    # Check potential ID columns (e.g. columns with name containing 'id', 'patient', 'no')
    id_cols = [c for c in df.columns if any(k in c.lower() for k in ['id', 'patient', 'no', 'num'])]
    id_duplicates = {}
    for c in id_cols:
        id_duplicates[c] = df.duplicated(subset=[c]).sum()

    return {
        "num_rows": len(df),
        "exact_duplicate_rows": num_exact_duplicates,
        "exact_duplicate_percentage": round(pct_exact_duplicates, 2),
        "potential_id_columns": id_cols,
        "id_column_duplicates": id_duplicates
    }


def audit_targets(df: pd.DataFrame, target_cols: List[str] = KNOWN_TARGET_COLS) -> Dict[str, Dict[str, Any]]:
    """
    Audits candidate target columns: CAD, LAD, LCX, RCA, Cath.
    """
    target_summary = {}
    present_targets = [c for c in target_cols if c in df.columns]

    for col in present_targets:
        series = df[col]
        val_counts = series.value_counts(dropna=False).to_dict()
        val_pcts = series.value_counts(normalize=True, dropna=False).mul(100).round(2).to_dict()
        n_miss = series.isnull().sum()
        
        # Check suspicious values (e.g., unexpected strings, unusual encodings)
        unique_vals = list(series.unique())

        target_summary[col] = {
            "present": True,
            "unique_values": unique_vals,
            "class_counts": val_counts,
            "class_percentages": val_pcts,
            "missing_count": n_miss,
            "missing_percentage": round((n_miss / len(df)) * 100, 2)
        }

    for col in target_cols:
        if col not in df.columns:
            target_summary[col] = {
                "present": False,
                "note": "Target column not found with exact name in dataset"
            }

    return target_summary


def audit_target_leakage(df: pd.DataFrame, target_cols: List[str] = KNOWN_TARGET_COLS) -> pd.DataFrame:
    """
    Evaluates every column for potential target leakage or indirect target encoding.
    """
    leakage_rows = []
    present_targets = [c for c in target_cols if c in df.columns]

    for col in df.columns:
        if col in present_targets:
            role = "Target Column"
            reason = f"Explicit target column ({col})"
            recommendation = "Exclude from feature set"
        elif any(k in col.upper() for k in ['CATH', 'STENOSIS', 'OCCLUSION', 'ANGIO']):
            role = "Potential Leakage / Outcome Measurement"
            reason = f"Column name '{col}' suggests post-diagnostic angiographic outcome"
            recommendation = "Needs Review / Exclude"
        else:
            # Check high association or deterministic correlation if numeric/binary
            role = "Candidate Feature"
            reason = "Clinical/demographic baseline feature"
            recommendation = "Keep"

        leakage_rows.append({
            "Column": col,
            "Potential_Role": role,
            "Reason": reason,
            "Recommendation": recommendation
        })

    return pd.DataFrame(leakage_rows)


def audit_feature_types(df: pd.DataFrame, target_cols: List[str] = KNOWN_TARGET_COLS) -> Dict[str, List[str]]:
    """
    Categorizes features conservatively into preliminary data types.
    """
    categories = {
        "numerical": [],
        "binary": [],
        "categorical": [],
        "ordinal": [],
        "text": [],
        "target": [],
        "possible_leakage": [],
        "unknown": []
    }

    for col in df.columns:
        if col in target_cols:
            categories["target"].append(col)
            continue

        if any(k in col.upper() for k in ['CATH']):
            categories["possible_leakage"].append(col)
            continue

        series = df[col]
        n_unique = series.nunique(dropna=True)
        dtype = series.dtype

        if pd.api.types.is_numeric_dtype(series):
            if n_unique == 2:
                categories["binary"].append(col)
            elif n_unique <= 10:
                categories["categorical"].append(col)
            else:
                categories["numerical"].append(col)
        elif pd.api.types.is_string_dtype(series) or pd.api.types.is_object_dtype(series):
            if n_unique == 2:
                categories["binary"].append(col)
            elif n_unique <= 20:
                categories["categorical"].append(col)
            else:
                categories["text"].append(col)
        else:
            categories["unknown"].append(col)

    return categories


def audit_unique_values(df: pd.DataFrame, max_cat_unique: int = 30) -> pd.DataFrame:
    """
    Audits unique values, frequencies, formatting inconsistencies for categorical/binary features.
    """
    cat_cols = [c for c in df.columns if df[c].nunique(dropna=False) <= max_cat_unique]
    records = []

    for col in cat_cols:
        counts = df[col].value_counts(dropna=False)
        total = len(df)
        for val, count in counts.items():
            pct = round((count / total) * 100, 2)
            
            # Check whitespace / capitalization issues
            formatting_issue = False
            if isinstance(val, str):
                if val != val.strip() or val != val.strip().capitalize():
                    formatting_issue = True

            records.append({
                "feature": col,
                "value": str(val),
                "frequency": count,
                "percentage": pct,
                "formatting_issue_flag": formatting_issue
            })

    return pd.DataFrame(records)


def audit_numerical_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates statistical properties and flags IQR outliers for numerical features.
    """
    num_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c]) and df[c].nunique() > 10]
    records = []

    for col in num_cols:
        series = df[col].dropna()
        if len(series) == 0:
            continue
            
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        
        outliers = series[(series < lower_bound) | (series > upper_bound)]
        outlier_count = len(outliers)
        outlier_pct = round((outlier_count / len(series)) * 100, 2)

        records.append({
            "feature": col,
            "count": len(series),
            "mean": round(series.mean(), 4),
            "median": round(series.median(), 4),
            "std": round(series.std(), 4),
            "min": round(series.min(), 4),
            "q1": round(q1, 4),
            "q3": round(q3, 4),
            "max": round(series.max(), 4),
            "iqr": round(iqr, 4),
            "outlier_count": outlier_count,
            "outlier_percentage": outlier_pct,
            "lower_bound": round(lower_bound, 4),
            "upper_bound": round(upper_bound, 4)
        })

    return pd.DataFrame(records)


def audit_data_quality(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Audits data quality issues: constant columns, whitespace issues, zero/negative counts, etc.
    """
    constant_cols = [c for c in df.columns if df[c].nunique(dropna=False) <= 1]
    near_constant_cols = []
    for c in df.columns:
        if df[c].nunique(dropna=False) > 1:
            top_freq_pct = (df[c].value_counts(normalize=True, dropna=False).iloc[0]) * 100
            if top_freq_pct >= 95.0:
                near_constant_cols.append((c, round(top_freq_pct, 2)))

    whitespace_cols = []
    for c in df.select_dtypes(include=['object', 'string']).columns:
        has_space = df[c].astype(str).str.contains(r'^\s+|\s+$', regex=True).any()
        if has_space:
            whitespace_cols.append(c)

    zero_counts = {}
    negative_counts = {}
    for c in df.select_dtypes(include=[np.number]).columns:
        zero_counts[c] = (df[c] == 0).sum()
        negative_counts[c] = (df[c] < 0).sum()

    return {
        "constant_columns": constant_cols,
        "near_constant_columns": near_constant_cols,
        "whitespace_issue_columns": whitespace_cols,
        "zero_value_counts": {k: v for k, v in zero_counts.items() if v > 0},
        "negative_value_counts": {k: v for k, v in negative_counts.items() if v > 0}
    }


def save_reports(reports: Dict[str, pd.DataFrame], output_dir: str = "ml/reports") -> List[str]:
    """
    Saves generated DataFrame reports to CSV files.
    """
    os.makedirs(output_dir, exist_ok=True)
    saved_files = []
    for name, df in reports.items():
        if isinstance(df, pd.DataFrame) and not df.empty:
            filepath = os.path.join(output_dir, f"{name}.csv")
            df.to_csv(filepath, index=False)
            saved_files.append(filepath)
    return saved_files
