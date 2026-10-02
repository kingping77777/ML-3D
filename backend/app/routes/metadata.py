from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import MetadataResponse
from app.services.model_service import ModelService
from app.dependencies import get_model_service

router = APIRouter(tags=["Metadata"])

@router.get("/metadata", response_model=MetadataResponse, summary="Get Model Metadata & Configuration")
def get_metadata(model_svc: ModelService = Depends(get_model_service)):
    """
    Returns non-sensitive metadata for all four target models:
    architecture, threshold, calibration status, feature count, and validation method.
    """
    try:
        return model_svc.get_clean_metadata()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve metadata: {str(e)}"
        )
