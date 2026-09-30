# RELATED WORK & LITERATURE SURVEY
**MEGHANVAYA — SIH 2026 | Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. Overview of Ensemble Post-Processing

Raw Numerical Weather Prediction (NWP) precipitation forecasts from dynamical physical cores systematically suffer from location displacement errors, representation biases, and severe ensemble underdispersion during intense convective events like the Indian summer monsoon. To address these issues, statistical and machine-learning post-processing methods calibrate forecast distributions to observational reality.

---

## 2. Key Literature Foundations

### A. Ensemble Model Output Statistics (EMOS) & Censored Distributions
- **Gneiting et al. (2005):** *Calibrated Probabilistic Forecasting Using Ensemble Model Output Statistics and Minimum CRPS Estimation.* Monthly Weather Review.
  - *Contribution:* Introduced EMOS, establishing parametric regression of ensemble mean and spread onto predictive distribution parameters.
- **Scheuerer & Hamill (2015):** *Statistical Postprocessing of Ensemble Precipitation Forecasts by Fitting Censored, Shifted Gamma Distributions.* Monthly Weather Review, 143(11), 4578–4596.
  - *Contribution:* Established the CSGD formulation specifically tailored for precipitation. The left-censoring barrier at shift parameter $\delta$ captures the discrete probability mass of non-occurrence ($P(Y=0)$) while avoiding unphysical negative rainfall clipping.
  - *MEGHANVAYA Adoption:* Direct adoption of the CSGD likelihood and non-linear parameter link functions.

### B. Multivariate & Spatial Rank Preservation
- **Schefzik, Thorarinsdottir, & Gneiting (2013):** *Uncertainty Quantification in Complex Simulation Models Using Ensemble Copula Coupling.* Statistical Science, 28(4), 616–640.
  - *Contribution:* Introduced Ensemble Copula Coupling (ECC). Proved that univariate marginal distributions can be reordered according to the rank order of raw ensemble members, preserving the physical empirical copula.
- **Schefzik (2017):** *Ensemble model output statistics for multivariate weather variables.* Statistical Methodology.
  - *Contribution:* Formulated the combination of parametric EMOS with ECC (EMOS-ECC), preserving spatial correlation across meteorological fields.
  - *MEGHANVAYA Adoption:* MEGHANVAYA implements ECC-Q across 5 quantiles at every grid cell, restoring physical storm fronts and squall lines.

### C. Indian Monsoon Post-Processing Precedents
- **Angus et al. (2024):** *A comparison of two statistical postprocessing methods for heavy-precipitation forecasts over India during the summer monsoon.* Quarterly Journal of the Royal Meteorological Society, DOI: 10.1002/qj.4677.
  - *Contribution:* Peer-reviewed benchmark comparing Quantile Mapping (QM) and EMOS over India using NCMRWF NEPS-G forecasts. Established that parametric EMOS reliably improves rainfall forecast skill over raw numerical forecasts across the Indian subcontinent.
  - *Boundary:* Angus et al. did not implement soft regime mixture gating; MEGHANVAYA builds upon this finding by conditioning statistical post-processing on synoptic weather regimes.

### D. Deep Learning & Point-Scale Operational Analogs
- **Hu et al. (2023):** *Deep Learning Forecast Uncertainty for Precipitation over the Western United States.* Monthly Weather Review, DOI: 10.1175/MWR-D-22-0268.1.
  - *Contribution:* Demonstrated U-Net architectures optimizing CSGD loss functions for precipitation uncertainty.
- **ECMWF ecPoint (Hewson et al.):** *Weather-dependent grid-to-point post-processing.*
  - *Contribution:* Demonstrates operational precedent for conditioning statistical post-processing parameters on prevailing atmospheric convective regimes and sub-grid topography.

---

## 3. MEGHANVAYA Novel Architectural Synthesis
MEGHANVAYA bridges scientific research and operational decision support by:
1. Formulating continuous soft mixture gating across monsoon synoptic regimes.
2. Generating closed-form parametric predictive distributions $[P_{10}, P_{50}, P_{90}, P_{95}]$.
3. Restoring spatial multivariate storm geometry via Schefzik ECC copula coupling.
4. Integrating 74 monitored district administrative geometries with automated GIS exports.
5. Providing 4 distinct role-based experiences (Administrator, Meteorologist, Government Officer, General User).
