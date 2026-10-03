import os
from typing import List

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict

    class Settings(BaseSettings):
        model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

        API_ENV: str = "development"
        MODEL_DIR: str = "ml/artifacts/final"
        EXPLANATION_DIR: str = "ml/artifacts/explanations"
        ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000"

        @property
        def cors_origins(self) -> List[str]:
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    settings = Settings()
except ImportError:
    # Resilient fallback if pydantic-settings is not installed in the active environment
    class Settings:
        def __init__(self):
            self.API_ENV: str = os.getenv("API_ENV", "development")
            self.MODEL_DIR: str = os.getenv("MODEL_DIR", "ml/artifacts/final")
            self.EXPLANATION_DIR: str = os.getenv("EXPLANATION_DIR", "ml/artifacts/explanations")
            self.ALLOWED_ORIGINS: str = os.getenv(
                "ALLOWED_ORIGINS",
                "http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000"
            )

        @property
        def cors_origins(self) -> List[str]:
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    settings = Settings()
