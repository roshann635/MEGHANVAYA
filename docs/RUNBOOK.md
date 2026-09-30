# OPERATIONAL RUNBOOK
**MEGHANVAYA — Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. System Startup
```bash
# 1. Start Backend FastAPI Server
cd /path/to/MEGHANVAYA
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000

# 2. Start Frontend Development Server
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

## 2. Health Check Endpoints
- **Liveness:** `GET http://localhost:8000/health` → `{"status": "ok", "mode": "production_pilot"}`
- **System Telemetry:** `GET http://localhost:8000/api/v1/forecasts/system-health`
- **Model Health:** `GET http://localhost:8000/api/v1/forecasts/model-health`
- **Data Quality:** `GET http://localhost:8000/api/v1/forecasts/data-quality`

## 3. Production Verification
```bash
# Run backend test suite
pytest

# Run frontend production build
cd frontend && npm run build
```

## 4. Evaluation Profiles (Demo Access)
- **Administrator:** `admin@meghanvaya.in` / `demo123`
- **Meteorologist:** `analyst@meghanvaya.in` / `demo123`
- **Government Officer:** `officer@meghanvaya.in` / `demo123`
- **General User:** `user@meghanvaya.in` / `demo123`
