from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import HealthResponse
from app.services.model_service import ModelService
from app.dependencies import get_model_service

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse, summary="Health & System Status Check")
def health_check(model_svc: ModelService = Depends(get_model_service)):
    """
    Returns system status and verifies that all 4 target ML models are loaded and ready.
    """
    models_ready = model_svc.is_loaded
    now_str = datetime.now(timezone.utc).isoformat()

    if not models_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML models failed to load or are not initialized."
        )

    return HealthResponse(
        status="ok",
        models_loaded=True,
        timestamp=now_str
    )
