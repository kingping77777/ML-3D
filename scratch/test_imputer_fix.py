import joblib
import numpy as np
import pandas as pd

cad_model = joblib.load("ml/artifacts/final/cad_model.joblib")
preprocessor = cad_model.named_steps['preprocessor']

def fix_unpickled_imputers(transformer):
    if hasattr(transformer, "transformers_"):
        for name, trans, cols in transformer.transformers_:
            if hasattr(trans, "steps"):
                for step_name, step_obj in trans.steps:
                    if hasattr(step_obj, "statistics_") and not hasattr(step_obj, "_fill_dtype"):
                        step_obj._fill_dtype = step_obj.statistics_.dtype

fix_unpickled_imputers(preprocessor)
print("Fix function executed without error!")
