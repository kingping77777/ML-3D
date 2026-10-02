from app.services.model_service import model_service, ModelService
from app.services.explanation_service import explanation_service, ExplanationService
from app.services.validation_service import validation_service, ValidationService

def get_model_service() -> ModelService:
    return model_service

def get_explanation_service() -> ExplanationService:
    return explanation_service

def get_validation_service() -> ValidationService:
    return validation_service
