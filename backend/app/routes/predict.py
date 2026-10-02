import time
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import PatientInput, PredictionResponse, AnalyzeResponse
from app.services.model_service import ModelService
from app.services.explanation_service import ExplanationService
from app.services.validation_service import ValidationService
from app.dependencies import get_model_service, get_explanation_service, get_validation_service

logger = logging.getLogger("cardiovision.predict")
router = APIRouter(tags=["Inference"])

@router.post("/predict", response_model=PredictionResponse, summary="Predict CAD & Vessel Stenosis Probabilities")
def predict_patient(
    patient: PatientInput,
    model_svc: ModelService = Depends(get_model_service),
    val_svc: ValidationService = Depends(get_validation_service)
):
    """
    Executes ML inference across CAD, LAD, LCX, and RCA models for a single patient input.
    Returns model-estimated probabilities, threshold predictions, and 3D visualization statuses.
    """
    t0 = time.perf_counter()
    try:
        df_patient = val_svc.validate_and_format_input(patient)
        response = model_svc.predict_all(df_patient)
        duration_ms = (time.perf_counter() - t0) * 1000
        logger.info(f"POST /predict completed in {duration_ms:.2f}ms")
        return response
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Inference error in POST /predict: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during model inference."
        )

@router.post("/analyze", response_model=AnalyzeResponse, summary="Combined Prediction & SHAP Explanation Analysis")
def analyze_patient(
    patient: PatientInput,
    model_svc: ModelService = Depends(get_model_service),
    exp_svc: ExplanationService = Depends(get_explanation_service),
    val_svc: ValidationService = Depends(get_validation_service)
):
    """
    Combined endpoint returning predictions, 3D visualization statuses,
    and local SHAP explanations for all 4 targets (CAD, LAD, LCX, RCA).
    """
    t0 = time.perf_counter()
    try:
        df_patient = val_svc.validate_and_format_input(patient)
        pred_res = model_svc.predict_all(df_patient)
        exp_res = exp_svc.explain_all(df_patient)

        duration_ms = (time.perf_counter() - t0) * 1000
        logger.info(f"POST /analyze completed in {duration_ms:.2f}ms")

        return AnalyzeResponse(
            predictions=pred_res.predictions,
            visualization=pred_res.visualization,
            explanations=exp_res
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Error in POST /analyze: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred during full patient analysis."
        )
