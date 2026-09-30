from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "GENERAL_USER"

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True

class ModelVersionSchema(BaseModel):
    id: str
    name: str
    status: str
    metrics: Dict[str, Any]
    
    class Config:
        from_attributes = True

class ForecastGridPoint(BaseModel):
    lat: float
    lon: float
    raw_nwp: float
    corrected_rainfall: float
    p50: float
    p90: float
    p95: float
    pop: float
    uncertainty: float
    heavy_rain_prob: float
    regime_label: str
