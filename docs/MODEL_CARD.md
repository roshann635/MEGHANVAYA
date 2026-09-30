# MODEL CARD: MEGHANVAYA POST-PROCESSING ENGINE
**MEGHANVAYA — SIH 2026 | Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. Model Overview
- **Model Name:** MEGHANVAYA Regime-Aware CSGD-EMOS + ECC-Q
- **Version:** `1.0.0-pilot`
- **Model Type:** Hybrid Statistical-Dynamical Post-Processing Architecture
- **Primary Function:** Calibrates 24-hour Numerical Weather Prediction ensemble precipitation forecasts over India, generating parametric predictive distributions, calibrated probabilities of precipitation, 90% predictive intervals, and spatially rank-consistent scenario ensembles.

---

## 2. Intended Use
- **Primary Users:** 
  1. Operational Meteorologists & Forecasters
  2. Disaster Management Authorities (NDMA, SDMAs, DDMAs)
  3. Hydrological Engineers & Reservoir Operators
  4. General Public
- **Decision Scope:** Decision support, risk prioritization, flood staging, and quantitative forecast interpretation.
- **Out of Scope:** Statutory emergency declarations (which remain the exclusive jurisdiction of the India Meteorological Department).

---

## 3. Core Mathematical Components
1. **Soft Monsoon Weather Regime Gating:**
   - Active weight: $w_{active} = \frac{1}{1 + e^{-(\mu_{ens} - 5)}}$
   - Break weight: $w_{break} = 1 - w_{active}$
   - Eliminates hard spatial classification boundaries.
2. **Censored Shifted Gamma Distribution (CSGD-EMOS):**
   - Shape $k = \frac{\mu^2}{\sigma^2}$, Scale $\theta = \frac{\sigma^2}{\mu}$
   - Shift parameter $\delta > 0$
   - Discrete mass at zero: $P(Y=0) = F(\delta; k, \theta)$
   - Non-linear link functions: $\mu = a + b \cdot \mu_{ens}$, $\sigma^2 = c + d \cdot s^2_{ens}$
3. **Continuous Probability of Precipitation (PoP):**
   - $P(Y \ge y) = 1 - F_{CSGD}(y + \delta; k, \theta)$
4. **90% Predictive Interval:**
   - $[P_{10}, P_{90}] = [F^{-1}(0.10) - \delta, F^{-1}(0.90) - \delta]$
5. **Ensemble Copula Coupling (ECC-Q):**
   - Quantile transformation: $x^{(m)} = F^{-1}\left(\frac{m}{M+1}\right) - \delta$
   - Permutation: $\tilde{x}^{(m)}(s) = x^{(\text{rank}(R_m(s)))}(s)$ (Schefzik et al., 2013)

---

## 4. Quantitative Performance Scorecard
Evaluated on locked out-of-sample test partition (June 6–7, 2004, $N=9,928$ correlated records):
- **Raw NWP Native Brier Score:** **0.2351**
- **CSGD-EMOS Calibrated Brier Score:** **0.1880**
- **Relative Brier Improvement vs Native Ensemble:** **20.04%** ($1 - 0.1880 / 0.2351 = 0.2004$)
- **Standard Climatological BSS:** Not estimated in current pilot.
- **Root Mean Squared Error (RMSE):**
  - Raw NWP: **10.43 mm**
  - CSGD-EMOS P50: **10.35 mm**
  - ECC Ensemble: **10.06 mm (-3.5% error reduction)**
- **Mean Bias:**
  - Raw NWP: **-3.25 mm**
  - CSGD-EMOS: **-3.22 mm**
  - ECC Ensemble: **-2.40 mm (+26.2% bias reduction)**

---

## 5. Explicit Limitations
- **Current Pilot Status:** Validated on 7-cycle June 2004 onset period.
- **Regime Circularity:** Pilot regime gating uses a rainfall-derived transition between active and break conditions. Production requires independent circulation variables (MSLP, 850 hPa winds, PWAT).
- **Global Pooling:** Current pilot parameters are globally pooled across all of India. Regional or agro-climatic zone pooling is planned for Phase 2.
