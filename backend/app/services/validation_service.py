import pandas as pd
from app.schemas import PatientInput

class ValidationService:
    @staticmethod
    def validate_and_format_input(patient_input: PatientInput) -> pd.DataFrame:
        """
        Validates patient input and converts it to a single-row pandas DataFrame
        with exact feature names expected by saved pipelines.
        """
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
