# REST API SPECIFICATION
**MEGHANVAYA — Problem Statement 26080**  
**API Base URL:** `/api/v1`  
**Protocol:** RESTful JSON  

---

## 1. Authentication & Security
- `POST /auth/login` — Authenticate and receive JWT bearer token (form-data: `username`, `password`)
- `GET /auth/me` — Retrieve authenticated user profile, permissions, and active role
- `GET /auth/admin/users` — **[ADMIN ONLY]** List all registered identities (enforces HTTP 403 Forbidden for non-admins)

## 2. Core Meteorological Endpoints
- `GET /forecasts/summary` — Returns available cycles, grid dimensions, and latest forecast metadata
- `GET /forecasts/cycle/{valid_time}` — Full spatial grid records (4,964 cells) with raw, P50, P90, and PoP
- `GET /forecasts/ensemble/{valid_time}` — 5-member raw GEFSv12 diagnostics, spread, and member values
- `GET /forecasts/regimes/{valid_time}` — Continuous monsoon regime gating probabilities and weights
- `GET /forecasts/pop/{valid_time}` — Calibrated PoP exceedance across IMD thresholds and relative Brier metric
- `GET /forecasts/uncertainty/{valid_time}` — 90% predictive interval bounds $[P_{10}, P_{90}]$
- `GET /forecasts/heavy-rain/{valid_time}` — Tail probabilities for $P(Y \ge 64.5\text{ mm})$ and $P(Y \ge 115.6\text{ mm})$
- `GET /forecasts/ecc/{valid_time}` — Ensemble Copula Coupling empirical rank permutation statistics

## 3. Spatial Aggregation Endpoints
- `GET /forecasts/states/{valid_time}` — State-aggregated expected rainfall and heavy rain risk counts
- `GET /forecasts/districts/{valid_time}` — District-level risk advisory queue across 74 monitored districts
- `GET /forecasts/districts/{valid_time}/{district_name}` — Detailed single-district advisory profile

## 4. Verification & Governance Endpoints
- `GET /forecasts/verification` — Chronological locked out-of-sample metrics (RMSE, MAE, Bias, Relative Brier Gain)
- `GET /forecasts/reliability` — Binned calibration curves and reliability diagram points
- `GET /forecasts/events` — June 2004 pilot event case studies
- `GET /forecasts/provenance/{valid_time}` — Cryptographic SHA-256 hashes and lineage metadata
- `GET /forecasts/data-quality` — Quality control audit, missing value checks, and completeness scores
- `GET /forecasts/model-health` — Optimization objective, parameter bounds, and training partition metadata
- `GET /forecasts/pipeline` — 14-stage automated pipeline execution status and durations
- `GET /forecasts/system-health` — System uptime, memory utilization, worker counts, and cluster state
