from typing import List
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
