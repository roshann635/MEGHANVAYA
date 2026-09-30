from fastapi import APIRouter
from backend.api.v1.endpoints import auth, forecast

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(forecast.router, prefix="/forecasts", tags=["forecasts"])
api_router.include_router(forecast.router, tags=["meteorology"])
