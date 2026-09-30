import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = {"env_file": ".env", "extra": "ignore"}

    PROJECT_NAME: str = "MEGHANVAYA"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")  # REQUIRED: set via environment variable
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # DB configuration
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "meghanvaya")
    
    # Direct DATABASE_URL support (Render / Supabase / Neon / AWS RDS)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")  # Set via .env; empty triggers SQLite fallback

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        url = self.DATABASE_URL or os.getenv("DATABASE_URL", "")
        if url:
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            # Neon / AWS poolers require sslmode=require
            return url
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
    
    # Fallback to SQLite if PostgreSQL is unreachable or not yet configured
    USE_SQLITE_FALLBACK: bool = os.getenv("USE_SQLITE_FALLBACK", "True").lower() == "true"
    SQLITE_URL: str = "sqlite:///./meghanvaya_demo.db"

settings = Settings()
