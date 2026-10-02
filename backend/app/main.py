import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.model_service import model_service
from app.services.explanation_service import explanation_service
from app.routes.health import router as health_router
from app.routes.metadata import router as metadata_router
from app.routes.predict import router as predict_router
from app.routes.explain import router as explain_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("cardiovision.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and Shutdown Lifespan Manager.
    Loads models and reference background data once at startup.
    """
    logger.info("Initializing CardioVision 3D Backend Services...")
    try:
        model_service.load_models()
        explanation_service.initialize()
        logger.info("ML Models and Explanation Infrastructure initialized successfully.")
    except Exception as e:
        logger.error(f"Critical error loading ML models at startup: {str(e)}", exc_info=True)
    yield
    logger.info("Shutting down CardioVision 3D Backend Services.")

app = FastAPI(
    title="CardioVision 3D Backend API",
    description=(
        "Production-grade FastAPI backend for CardioVision 3D.\n"
        "Exposes multi-vessel CAD ML predictions (CAD, LAD, LCX, RCA), "
        "vessel 3D risk categories, and local SHAP feature explanations."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handler to prevent exposing stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error handling request {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

# Include API Routers under /api/v1
api_prefix = "/api/v1"
app.include_router(health_router, prefix=api_prefix)
app.include_router(metadata_router, prefix=api_prefix)
app.include_router(predict_router, prefix=api_prefix)
app.include_router(explain_router, prefix=api_prefix)
