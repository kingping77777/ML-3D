import time
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import ExplainRequest, ExplanationResponse
from app.services.explanation_service import ExplanationService
from app.services.validation_service import ValidationService
from app.dependencies import get_explanation_service, get_validation_service

logger = logging.getLogger("cardiovision.explain")
router = APIRouter(tags=["Explainability"])

@router.post("/explain", response_model=ExplanationResponse, summary="Compute Target Local SHAP Explanation")
def explain_patient_target(
    request: ExplainRequest,
    exp_svc: ExplanationService = Depends(get_explanation_service),
    val_svc: ValidationService = Depends(get_validation_service)
):
    """
    Computes patient-specific local SHAP feature contributions for a selected target (cad, lad, lcx, rca).
    Returns feature ranks, values, SHAP impact scores, and non-causal natural language explanations.
    """
    t0 = time.perf_counter()
    target_clean = request.target.lower().strip()
    if target_clean not in ["cad", "lad", "lcx", "rca"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown target '{request.target}'. Must be one of: cad, lad, lcx, rca."
        )

    try:
        df_patient = val_svc.validate_and_format_input(request.patient)
        exp_res = exp_svc.explain_target(target_clean, df_patient)
        duration_ms = (time.perf_counter() - t0) * 1000
        logger.info(f"POST /explain target={target_clean} completed in {duration_ms:.2f}ms")
        return exp_res
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.error(f"Explanation error in POST /explain target={target_clean}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred while generating SHAP explanation."
        )
