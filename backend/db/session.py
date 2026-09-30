from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Attempt to connect to PostgreSQL. Fallback to SQLite if not available (for local demo safety)
try:
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
    engine.connect().close()
    logger.info("Successfully connected to PostgreSQL database.")
except Exception as e:
    if settings.USE_SQLITE_FALLBACK:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite DEMO database.")
        engine = create_engine(settings.SQLITE_URL, connect_args={"check_same_thread": False})
    else:
        raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
