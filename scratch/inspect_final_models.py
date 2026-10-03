import joblib
import json
import pandas as pd
import numpy as np

with open("ml/artifacts/final/model_metadata.json", "r") as f:
    meta = json.load(f)

print("Loaded metadata for targets:", list(meta.keys()))

for target in ["cad", "lad", "lcx", "rca"]:
    model_path = f"ml/artifacts/final/{target}_model.joblib"
    model_obj = joblib.load(model_path)
    print(f"\n--- TARGET: {target.upper()} ---")
    print("Metadata info:", meta[target])
    print("Model object type:", type(model_obj))
    if hasattr(model_obj, 'named_steps'):
        print("Pipeline steps:", model_obj.named_steps.keys())
        classifier = model_obj.named_steps.get('classifier')
        print("Classifier type:", type(classifier))
        if hasattr(classifier, 'estimator'):
            print("  Base estimator inside wrapper:", type(classifier.estimator))
        if hasattr(classifier, 'calibrated_classifiers_'):
            print("  Calibrated classifiers count:", len(classifier.calibrated_classifiers_))
    else:
        print("Attributes:", dir(model_obj))
