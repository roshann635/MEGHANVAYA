# MEGHANVAYA
**Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts**

[![SIH 2026](https://img.shields.io/badge/SIH_2026-PS_26080-blue.svg)](https://sih.gov.in)
[![Status](https://img.shields.io/badge/Status-Evaluation_Prototype-emerald.svg)]()
[![Validation](https://img.shields.io/badge/Validation-7--Cycle_Pilot-amber.svg)]()

MEGHANVAYA is a probabilistic decision-support platform that applies statistical Machine Learning to correct systematic biases in Numerical Weather Prediction (NWP) ensembles. Built specifically for the Indian Summer Monsoon, it generates mathematically robust risk quantifications for extreme rainfall events conditioned on large-scale weather regimes.

---

## The Problem
Physics-based NWP models (like GEFS and NCMRWF) are excellent at predicting large-scale atmospheric dynamics, but they frequently struggle with sub-grid convective processes. Over the complex Indian terrain, this results in systematic biases—often underpredicting extreme rainfall while overpredicting light drizzle. Deterministic corrections fail to communicate the confidence required for life-saving government interventions.

## The MEGHANVAYA Solution
Instead of attempting to replace NWP with pure deep learning, MEGHANVAYA adds an intelligent statistical post-processing layer. It utilizes **CSGD-EMOS (Censored Shifted Gamma Distribution Ensemble Model Output Statistics)** to fit continuous probability density functions to raw ensemble variance.

By doing so, the system provides:
1. **Calibrated Medians (P50):** Bias-corrected deterministic forecasts.
2. **Uncertainty Bounds (P90):** True risk quantification for worst-case scenarios.
3. **Heavy Rain Probability:** Mathematically robust probabilities ($P(Y \ge 64.5mm)$) integrated directly from the predictive distribution.
4. **Spatial Coherence:** Uses **ECC (Ensemble Copula Coupling)** to restore storm shape and spatial correlations destroyed during local grid-cell processing.

## Architecture & Technology Stack
* **Scientific Computing Pipeline:** Python, NumPy, SciPy (Optimization), Xarray (NetCDF handling), XGBoost (Regime inference).
* **Backend API & Processing:** FastAPI, SQLAlchemy, PostGIS.
* **Frontend Visualization:** React (Vite), MapLibre GL JS, Recharts, Tailwind CSS (Glassmorphism).
* **Deployment:** Fully Dockerized (Nginx, Uvicorn, PostgreSQL 15 + PostGIS).

## Running Locally

MEGHANVAYA provides a fully contained Docker deployment for SIH Evaluation.

```bash
# Clone the repository
git clone https://github.com/roshann635/MEGHANVAYA.git
cd MEGHANVAYA

# Launch the entire stack (Database, Backend API, Frontend Dashboard)
docker compose up --build
```
* **Frontend Dashboard:** `http://localhost:80` (or `http://localhost:5173` if running `npm run dev`)
* **Backend API Swagger:** `http://localhost:8000/docs`

## Evaluation / Demo Mode
The repository is bundled with the **"7-Cycle June 2004 Chronological Pilot"**. This is a mathematically audited, locked dataset to demonstrate the pipeline end-to-end without requiring live downloads from meteorological servers.

**Accessing the Dashboard:**
1. Navigate to the Frontend URL.
2. Click the fast-access Demo roles (e.g., `Admin` or `Meteorologist`).
3. Enter the demo password: `demo123`.

## Scientific Validation Scope & Limitations
**Important Disclosure:** MEGHANVAYA is currently a *research and decision-support prototype*. It is **not** an official warning system.

The current repository reflects the mathematical foundation validated against a highly restricted temporal window:
1. **Pilot Dataset:** Evaluated strictly on exactly 2 independent temporal forecast cycles (June 6–7, 2004).
2. **Regime Classifier:** The current pilot utilizes rainfall-derived conditioning, which carries circularity risk. Production deployment requires fully independent synoptic labels (e.g., OLR, U850 winds).
3. **Parameter Pooling:** Due to the 7-day pilot length, CSGD parameters are globally pooled. Operational deployment will utilize regionalized parameters trained over a multi-year NCMRWF archive.

Please see the [Judge Defense Document](docs/JUDGE_DEFENSE.md) for full context regarding architectural decisions and limitations.

---
*Created for the Smart India Hackathon 2026. Data structures inspired by best practices in statistical post-processing (e.g., Baran et al. on CSGD-EMOS).*
