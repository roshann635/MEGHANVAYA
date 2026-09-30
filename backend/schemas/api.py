from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class ForecastResponse(BaseModel):
    id: int
    issue_time: datetime
    valid_time: datetime
    lead_time: int
    regime: str
    regime_confidence: float
    corrected_rainfall: float
    correction_confidence: float
    heavy_rain_probability: float
    status: str
    metadata: Dict[str, Any]

class ForecastProvenance(BaseModel):
    forecast_id: int
    nwp_source: str
    model_version: str
    issue_time: datetime
    dataset_version: str
    software_version: str
    approval_state: str

class SystemHealth(BaseModel):
    status: str
    mode: str
