from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)

class DataSource(Base):
    __tablename__ = "data_sources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    source_type = Column(String)
    endpoint = Column(String)
    status = Column(String, default="ACTIVE")

class Forecast(Base):
    __tablename__ = "forecasts"
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("data_sources.id"))
    issue_time = Column(DateTime(timezone=True))
    valid_time = Column(DateTime(timezone=True))
    lead_time = Column(Integer)
    status = Column(String)
    metadata_json = Column(JSON)

class RegimePrediction(Base):
    __tablename__ = "regime_predictions"
    id = Column(Integer, primary_key=True, index=True)
    forecast_id = Column(Integer, ForeignKey("forecasts.id"))
    dominant_regime = Column(String)
    confidence = Column(Float)
    probabilities = Column(JSON)

class RainfallPrediction(Base):
    __tablename__ = "rainfall_predictions"
    id = Column(Integer, primary_key=True, index=True)
    forecast_id = Column(Integer, ForeignKey("forecasts.id"))
    model_id = Column(Integer, ForeignKey("models.id"))
    corrected_rainfall = Column(Float)
    confidence = Column(Float)
    uncertainty = Column(Float)
    heavy_rain_probability = Column(Float)

class ModelRegistry(Base):
    __tablename__ = "models"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    version = Column(String)
    architecture = Column(String)
    status = Column(String) # CANDIDATE, APPROVED, PRODUCTION
