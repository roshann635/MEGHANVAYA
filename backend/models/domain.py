from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default="GENERAL_USER") # Roles: ADMIN, METEOROLOGIST, GOVT_OFFICER, GENERAL_USER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="SUCCESS")

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(String, primary_key=True, index=True) # e.g. 'CSGD-EMOS-v1.0'
    name = Column(String, nullable=False)
    status = Column(String, default="PILOT") # EXPERIMENTAL, PILOT, VALIDATED, PRODUCTION
    training_start = Column(DateTime)
    training_end = Column(DateTime)
    metrics = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
