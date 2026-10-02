# MEGHANVAYA
**Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts**  
*Probabilistic NWP Post-Processing & District Rainfall Intelligence*  

[![SIH 2026](https://img.shields.io/badge/SIH_2026-PS_26080-blue.svg)](https://sih.gov.in)
[![Status](https://img.shields.io/badge/Status-Evaluation_Ready-emerald.svg)]()
[![Validation](https://img.shields.io/badge/Validation-7--Cycle_Chronological_Pilot-amber.svg)]()
[![Tests](https://img.shields.io/badge/Tests-21_Passed-brightgreen.svg)]()
[![Live Site](https://img.shields.io/badge/Live_Deployment-Vercel-black.svg)](https://meghanvaya.vercel.app/)

MEGHANVAYA is a national-scale meteorological decision-support platform designed to correct systematic biases in Numerical Weather Prediction (NWP) ensemble precipitation forecasts over the Indian Summer Monsoon. It integrates soft weather regime gating, Censored Shifted Gamma (CSGD-EMOS) parametric predictive distributions, and Schefzik (2013) Ensemble Copula Coupling (ECC-Q) multivariate rank preservation into a four-role operational dashboard.

---

## 1. Core Architecture & Scientific Innovations

> **⚠️ NOTE ON ML ARCHITECTURE:** The active scientific post-processing engine running this pilot is the **CSGD-EMOS + ECC** pipeline implemented in `scripts/true_emos_pipeline.py`. The files located in the `ml/` directory (e.g., XGBoost classifiers) represent the Phase 2 production roadmap and are currently placeholders/scaffolds not executing in the live pilot.

1. **Soft Monsoon Weather Regime Gating:** Evaluates continuous logistic mixture weights ($w_{\text{active}}, w_{\text{break}}$) based on large-scale synoptic conditions, eliminating artificial hard boundary artifacts.
2. **Censored Shifted Gamma (CSGD-EMOS):** Assigns explicit probability mass to zero rainfall ($P(Y=0) = F(\delta; k, \theta)$) via a left-censoring barrier at shift parameter $\delta$, preventing unphysical negative rainfall without arbitrary clipping.
3. **Continuous Probability of Precipitation (PoP):** Direct CDF tail evaluation across standard IMD categories ($P \ge 2.5\text{ mm}$, $P \ge 15.6\text{ mm}$, $P \ge 64.5\text{ mm}$, $P \ge 115.6\text{ mm}$).
4. **90% Predictive Intervals:** Generates mathematically rigorous $[P_{10}, P_{90}]$ interval bounds combining physical ensemble spread with parametric residual dispersion.
5. **Ensemble Copula Coupling (ECC-Q):** Restores raw NWP multivariate spatial rank correlations (Schefzik et al., 2013), preserving physical storm geometry and squall lines without unphysical smoothing.
6. **74 Monitored Districts:** Area-weighted spatial intersection delivering operational tabular guidance across 19 states (with support for 700+ nationwide district geometries in the operational schema).
7. **Production Fault Tolerance & Resilience:** Global React Error Boundaries, contextual API error fallbacks with recovery actions, and end-to-end field name alignment.

---

## 2. Four Distinct User Experiences (Role-Based Access)

| Role | Target Persona | Default Entry | Primary Functionality |
| :--- | :--- | :--- | :--- |
| **Administrator** | System Admin / Lead DevOps | `/admin` | System Command telemetry (API, DB, Model, Data, Storage), 14-stage pipeline execution, model registry, audit logs, and RBAC enforcement. |
| **Meteorologist / Analyst** | Forecaster / Research Scientist | `/forecast` | High-density forecast operations, 5-member raw diagnostics, CSGD parameter link inspection, ECC copula fields, locked verification, and reliability diagrams. |
| **Government Officer** | Relief Commissioner / DDMA / CWC | `/outlook` | National Rainfall Outlook, ranked priority district action queues, 90% worst-case bounds ($P_{90}$), regional vulnerability summaries, and CSV/JSON briefings. |
| **General User** | Public Citizen / Farmer | `/general` | Intuitive district rainfall finder, clear verbal probability advisories, expected rainfall ranges, and public methodology summaries. |

---

## 3. Audited Scientific Validation & Data Accounting

All evaluations reflect the mathematically audited **7-Cycle June 2004 Chronological Pilot** (`data/processed/final_ecc_multicycle.parquet`):

- **Forecast Horizon:** June 2, 2004 – June 8, 2004 (7 consecutive daily cycles)
- **Spatial Grid:** 4,964 cells @ 0.25° resolution per cycle = **34,748 total co-registered records**
- **Training Partition:** June 2–4, 2004 (3 cycles = 14,892 records)
- **Validation Separation Buffer:** June 5, 2004 (1 cycle = 4,964 records)
- **Primary Locked Test Partition:** June 6–7, 2004 (2 independent temporal days = **9,928 correlated spatial records**)
- **Extended Test Partition:** June 6–8, 2004 (3 temporal days = 14,892 records)

### Out-of-Sample Scorecard (Primary Locked Test: June 6–7, 2004)
- **Raw NWP Native 5-Member Brier Score:** **0.2351** (Native ensemble probability: $P_{\text{raw}} = \sum_{m=1}^5 \mathbb{I}(R_m \ge 2.5) / 5$)
- **CSGD-EMOS Calibrated Brier Score:** **0.1880**
- **Relative Brier Improvement vs Native Ensemble:** **20.04%** ($1 - 0.1880 / 0.2351 = 0.2004$)
- **Root Mean Squared Error (RMSE):**
  - Raw GEFSv12: **10.43 mm**
  - CSGD-EMOS P50: **10.35 mm**
  - ECC Ensemble: **10.06 mm (-3.5% error reduction)**
- **Mean Bias:**
  - Raw GEFSv12: **-3.25 mm**
  - ECC Ensemble: **-2.40 mm (+26.2% bias reduction)**

---

## 4. Quick Start (Development & Evaluation)

### Backend API
```bash
# Launch FastAPI with Uvicorn
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Access the client at `http://localhost:5173`. Use the **1-Click Evaluation Access Profiles** on `/login` to explore all four role experiences.

### Automated Test Verification
```bash
# Run backend pytest suite (21 passed)
pytest

# Build frontend production bundle
cd frontend && npm run build
```

---

## 5. Explicit Pilot Limitations
1. **Pilot Scope:** Validated on the 7-cycle June 2004 onset period across 2 independent temporal test cycles. Multi-year nationwide operational skill is not claimed.
2. **Regime Gating Circularity:** Current pilot utilizes a rainfall-conditioned transition between active and break states. Production deployment will ingest independent synoptic circulation variables (MSLP, 850 hPa wind shear, PWAT).
3. **Global Parameter Pooling:** CSGD-EMOS parameters are currently pooled across the subcontinent. Regional and agro-climatic zone pooling is planned for Phase 2.
4. **Statutory Responsibility:** MEGHANVAYA is a research and decision-support prototype. Official statutory weather forecasts and severe weather warnings are issued exclusively by the India Meteorological Department (IMD).
