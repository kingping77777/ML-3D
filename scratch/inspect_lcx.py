import sys, os
sys.path.insert(0, os.path.abspath("."))
import joblib

lcx_model = joblib.load("ml/artifacts/final/lcx_model.joblib")
print("LCX Model:", type(lcx_model))
if hasattr(lcx_model, 'calibrated_classifiers_'):
    sub = lcx_model.calibrated_classifiers_[0].estimator
    print("Base pipeline:", sub)
    print("Base classifier:", sub.named_steps['classifier'])
    print("Kernel:", getattr(sub.named_steps['classifier'], 'kernel', 'N/A'))
else:
    print("No calibrated_classifiers_")
