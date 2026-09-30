# MEGHANVAYA Master Architecture

The final unified architecture of MEGHANVAYA merges an advanced probabilistic forecasting core (EMOS + ECC) with a robust, government-grade operational and MLOps framework.

## 1. Scientific Forecasting Core

The core scientific engine shifts from deterministic XGBoost regression to a probabilistic ensemble post-processing pipeline.

1. **Input Ecosystem**:
   - **NEPS-G**: NCMRWF Ensemble Prediction System (approx. 12 km, 23-member lagged ensemble).
   - **Atmospheric Fields**: u850, v850, MSLP, PWAT, CAPE, ensemble mean/variance.
   - **Geographic Data**: CartoDEM (elevation, slope).
   - **Observations**: IMD Gridded/District rainfall.

2. **Ingestion & Alignment**:
   - Strict 24-h windowing.
   - Spatial re-gridding and temporal alignment.
   - Automated Quality Control (QC) and Leakage Guard.

3. **Soft Regime Intelligence & PoP**:
   - **Regime Classifier**: Softmax XGBoost producing probability weights for Active, Break, Depression, Orographic, Coastal, WD, and Other regimes.
   - **PoP Classifier**: A two-stage hurdle approach estimating P(rain > 0) separately from rainfall intensity.

4. **Regime-Conditioned CSGD-EMOS Mixture of Experts**:
   - Instead of a single model, each regime has its own CSGD-EMOS (Censored Shifted Gamma Distribution - Ensemble Model Output Statistics) expert.
   - The final predictive distribution is a mixture of these experts, weighted by the soft regime probabilities.

5. **Uncertainty Calibration & Probabilities**:
   - Calibration of ensemble variance.
   - Derivation of predictive intervals (e.g., P10, P50, P90).
   - Exceedance probabilities for heavy rainfall thresholds (≥64.5mm, ≥115.6mm, ≥204.5mm).

6. **Ensemble Copula Coupling (ECC)**:
   - Reorders the calibrated marginal distributions to preserve the spatial dependence and rank structure of the raw NEPS-G ensemble.

## 2. Operational Intelligence Layer

The scientific core is governed by a robust operational layer designed for decision support and risk mitigation.

1. **Skill-Weighted Adaptive Trust Engine**:
   - Dynamically determines how much to trust the AI correction vs. the raw NWP based on historical regime skill, lead-time skill, regional skill, and seasonal skill.

2. **Uncertainty & OOD Aware Fallback**:
   - Monitors for out-of-distribution (OOD) inputs, low regime confidence, and data quality failures.
   - Triggers conservative fallback to raw NWP when AI confidence drops.

3. **Spatial Consistency & District Engine**:
   - Aggregates grid-level ensemble forecasts to district-level administrative products using area-weighting and spatial masking.

4. **Explainability & Provenance**:
   - Every forecast product is traceable (issue time, NWP version, selected regime, model version).

## 3. Governance and Closed-Loop MLOps

1. **Role-Based Access Control (RBAC)**:
   - Granular permissions for Admins, Meteorologists, Government Officers, and General Users.

2. **Closed-Loop Scientific Governance**:
   - `Forecast → Observation → Verification → Drift Detection → Retraining → Backtest → Human Approval → Model Registry → Production`.

3. **System Resilience**:
   - Canary deployments, rollback mechanisms, audit logging, and automated disaster recovery protocols.
