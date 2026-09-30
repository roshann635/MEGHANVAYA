# SCIENTIFIC FOUNDATIONS & LITERATURE POSITIONING
**MEGHANVAYA — SIH 2026 | Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. Context & Literature Positioning

Statistical and machine-learning post-processing of Numerical Weather Prediction (NWP) ensemble precipitation forecasts is an established, active domain of international meteorological research. MEGHANVAYA builds upon peer-reviewed foundational literature while maintaining rigorous boundaries between established methodology, our system architecture, and our current pilot-phase empirical validation.

### Scientific Foundations Matrix

| Paper / System | What it establishes | Relationship to MEGHANVAYA |
| :--- | :--- | :--- |
| **Angus et al. 2024** | Indian NEPS-G QM vs EMOS benchmark | India-specific statistical post-processing precedent. |
| **Scheuerer & Hamill 2015** | CSGD precipitation post-processing | Foundation for probabilistic rainfall calibration. |
| **Schefzik et al. 2013** | ECC | Foundation for dependence/rank restoration. |
| **Schefzik 2017** | EMOS-ECC | Explicit combination of probabilistic post-processing and dependence preservation. |
| **Vannitsem et al. 2021** | Statistical weather post-processing review | Operational/scientific challenges. |
| **Hu et al. 2023** | U-Net probabilistic precipitation post-processing | Spatial/deep-learning benchmark context. |
| **ECMWF ecPoint** | Weather-dependent rainfall post-processing | International operational precedent. |

---

## 2. Rigorous Literature Attribution

### Angus et al. (2024)
- **Contribution:** Peer-reviewed comparison of Quantile Mapping (QM) and Ensemble Model Output Statistics (EMOS) for heavy-precipitation post-processing of NCMRWF NEPS-G forecasts over India.
- **Full Reference:** Angus, M., et al. (2024). *A comparison of two statistical postprocessing methods for heavy-precipitation forecasts over India during the summer monsoon.* Quarterly Journal of the Royal Meteorological Society, DOI: 10.1002/qj.4677.
- **Attribution Boundary:** Provides an essential India-specific benchmark confirming that parametric EMOS improves raw numerical precipitation skill during the summer monsoon over the subcontinent. Does *not* implement MEGHANVAYA's regime-aware mixture model.

### Hu et al. (2023)
- **Contribution:** U-Net-based probabilistic precipitation post-processing and forecast-uncertainty estimation using a censored shifted gamma distribution over the western United States.
- **Full Reference:** Hu, Y., et al. (2023). *Deep Learning Forecast Uncertainty for Precipitation over the Western United States.* Monthly Weather Review, DOI: 10.1175/MWR-D-22-0268.1.
- **Attribution Boundary:** Demonstrates how CSGD loss functions can be optimized in deep learning / spatial architectures. Does *not* validate the India-specific MEGHANVAYA architecture or monsoon circulation dynamics.

### Schefzik et al. (2013) & Schefzik (2017)
- **Contribution:** 
  - *Schefzik, Thorarinsdottir, & Gneiting (2013):* Foundational Ensemble Copula Coupling (ECC) framework.
  - *Schefzik (2017):* EMOS-ECC / preservation of rank dependence across univariate post-processed marginals.
- **Attribution Boundary:** MEGHANVAYA implements ECC-Q directly based on the Schefzik framework to reorder calibrated CSGD quantiles according to the empirical copula ranks of the raw NWP ensemble. ECC was developed in the referenced literature and is adopted by MEGHANVAYA to maintain realistic storm geometry.

---

## 3. Distinguishing Architecture vs. Current Pilot vs. Future Work

To ensure absolute scientific honesty during SIH 2026 evaluation, the system clearly separates three tiers:

### A. Existing Research (What We Stand On)
- Parametric EMOS (Gneiting et al., 2005)
- CSGD likelihood optimization (Scheuerer & Hamill, 2015)
- Foundational ECC framework (Schefzik et al., 2013) and EMOS-ECC dependence preservation (Schefzik, 2017)
- Verification scores: Brier Score, CRPS, Reliability diagrams, Contingency Metrics (Wilks, 2011)

### B. Our System Architecture (What We Designed)
- A complete, government-grade decision-support platform integrating:
  1. Soft mixture gating across monsoon synoptic regimes
  2. CSGD-EMOS parameter estimation with guaranteed variance positivity
  3. Continuous CDF tail integration for standard IMD categories: $P(Y \ge 64.5\text{ mm/day})$, $P(Y \ge 115.6\text{ mm/day})$, $P(Y \ge 204.5\text{ mm/day})$
  4. 90% Predictive Interval calculation $[P_{10}, P_{90}]$
  5. Automated district-level spatial aggregation with cryptographic provenance tracing
  6. Closed-loop MLOps governance with data quality audits and model health monitoring

### C. Current Pilot Evidence (What Is Scientifically Validated Today)
- **Validation Scope:** 7-Cycle June 2004 Chronological Pilot (June 2–8, 2004).
- **Data Partitions:**
  - Training: June 2–4, 2004 (14,892 records, 3 cycles)
  - Validation Separation Buffer: June 5, 2004 (4,964 records, 1 cycle)
  - Primary Locked Test: June 6–7, 2004 (9,928 records, 2 independent temporal days)
  - Extended 3-Day Test: June 6–8, 2004 (14,892 records, 3 temporal cycles)
- **Empirical Results (Locked Test June 6–7, N=9,928):**
  - **Raw NWP Native 5-Member Brier Score:** 0.2351 (Native ensemble probability uses fraction of ensemble members exceeding 2.5 mm: $P_{raw} = \sum_{m=1}^5 \mathbb{I}(R_m \ge 2.5) / 5$)
  - **Calibrated CSGD-EMOS Brier Score:** 0.1880
  - **Relative Brier Improvement vs Native Ensemble:** **20.04%** (Relative improvement in Brier score over the native 5-member ensemble baseline: $1 - 0.1880 / 0.2351 = 0.2004$)
  - **Standard Climatological BSS:** Not estimated in current pilot.
  - **RMSE:** Raw 10.43 mm $\rightarrow$ EMOS 10.35 mm $\rightarrow$ **ECC 10.06 mm (-3.5% error reduction)**
  - **Bias:** Raw -3.25 mm $\rightarrow$ EMOS -3.22 mm $\rightarrow$ **ECC -2.40 mm (+26.2% bias reduction)**
- **Pilot Limitations:**
  - Parameters are globally pooled across all of India.
  - Regime conditioning currently uses a rainfall-conditioned soft transition between Active and Break states (potential circularity risk acknowledged).
  - Spatial grid cells are spatially correlated and not independent test degrees of freedom.

### D. Future Production Work (Operational Scaling Roadmap)
- Ingest multi-year historical paired archives (1980–2020) spanning 20+ monsoon seasons.
- Deploy independent multi-field synoptic circulation clustering (K-Means / EOF on forecast-time MSLP, 850 hPa $u/v$ winds, PWAT, and 500 hPa geopotential height).
- Implement elevation- and agro-climatic zone-stratified parameter pooling.
