import pandas as pd
from app.schemas import PatientInput

CLINICAL_BOUNDS = {
    "Age": (1, 120, "years"),
    "BP": (50, 300, "mmHg"),
    "PR": (30, 250, "bpm"),
    "FBS": (30, 1000, "mg/dL"),
    "LDL": (10, 800, "mg/dL"),
    "HDL": (5, 250, "mg/dL"),
    "TG": (10, 3000, "mg/dL"),
    "EF_TTE": (10, 90, "%"),
    "Weight": (10, 350, "kg"),
    "Length": (50, 250, "cm"),
    "BMI": (10, 90, "kg/m²"),
    "CR": (0.1, 25.0, "mg/dL"),
    "HB": (2.0, 25.0, "g/dL"),
    "K": (1.0, 10.0, "mEq/L"),
    "Na": (90.0, 180.0, "mEq/L")
}

class ValidationService:
    @staticmethod
    def validate_and_format_input(patient_input: PatientInput) -> pd.DataFrame:
        """
        Validates patient input and converts it to a single-row pandas DataFrame
        with exact feature names expected by saved pipelines.
        """
        # Validate physiological bounds
        for field, (min_val, max_val, unit) in CLINICAL_BOUNDS.items():
            if hasattr(patient_input, field):
                val = getattr(patient_input, field)
                if val is not None:
                    try:
                        num_val = float(val)
                        if num_val < min_val or num_val > max_val:
                            raise ValueError(
                                f"This cannot be possible! {field} value ({num_val}) is out of realistic clinical bounds "
                                f"({min_val} to {max_val} {unit}). Please enter a valid physiological value."
                            )
                    except (ValueError, TypeError) as e:
                        if "This cannot be possible" in str(e):
                            raise e

        df = patient_input.to_df()
        
        # Verify no targets or excluded features present
        forbidden_cols = ["Cath", "y_cad", "y_lad", "y_lcx", "y_rca", "Exertional CP"]
        for col in forbidden_cols:
            if col in df.columns:
                raise ValueError(f"Forbidden column '{col}' cannot be present in patient input.")
                
        # Ensure Sex normalization
        if "Sex" in df.columns:
            val = str(df["Sex"].iloc[0]).strip().capitalize()
            if val == "Fmale":
                val = "Female"
            df["Sex"] = val
            
        return df

validation_service = ValidationService()

