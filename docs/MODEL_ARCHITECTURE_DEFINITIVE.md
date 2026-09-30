# MEGHANVAYA — DEFINITIVE MODEL ARCHITECTURE & METHOD INVENTORY
**Audit Date:** September 30, 2026  
**Document Status:** FROZEN — Final Technical Reference  

> **One-sentence architecture summary:** MEGHANVAYA does not force one algorithm to solve every forecasting task: XGBoost is intended for nonlinear regime and precipitation-occurrence classification, CSGD-EMOS converts the ensemble into a calibrated rainfall probability distribution, and ECC restores the dependence structure needed for spatially coherent ensemble products.

---

## 1. Active Component Inventory

| Component | What It Is | Current Status |
| :--- | :--- | :--- |
| **CSGD-EMOS** | Probabilistic rainfall post-processing engine | ✅ Core active model |
| **L-BFGS-B** | Numerical optimizer for CSGD link parameters | ✅ Active (optimizer, not a model) |
| **Soft logistic regime gate** | Converts ensemble rainfall signal into regime weights | ✅ Active pilot mechanism |
| **PoP / exceedance calculation** | Probability derived from fitted CSGD predictive distribution | ✅ Active |
| **ECC-Q** | Ensemble rank/dependence restoration (Schefzik et al., 2013) | ✅ Active |
| **GEFSv12** | Raw NWP ensemble providing forecast input (5-member reforecast) | ✅ Active input model |
| **XGBoost** | Gradient-boosted ML model | ⚠️ Dependency/scaffold; not current core inference |
| **Deep Learning / U-Net** | Spatial ML alternative | ❌ Not implemented |
| **Random Forest** | ML baseline/alternative | ❌ Not current active model |
| **Quantile Mapping** | Statistical baseline | ⚠️ Research baseline, not core deployed engine |
| **Plain EMOS (Gaussian)** | Baseline parametric post-processing | ⚠️ Conceptual/research benchmark |

---

## 2. Why CSGD-EMOS Is the Rainfall Probability-Distribution Engine

MEGHANVAYA's objective is not to predict a single rainfall number. It is to generate a **calibrated predictive distribution** — including uncertainty quantification and threshold exceedance probabilities. This requires a parametric statistical engine, not a point-prediction regressor.

### Why not replace CSGD with XGBoost?

CSGD-EMOS and XGBoost solve **different problems**:

- **CSGD-EMOS** produces the full parametric predictive rainfall distribution required for calibrated precipitation amounts and exceedance probabilities.
- **XGBoost** is suited for nonlinear classification tasks (e.g., weather-regime prediction, precipitation occurrence) when sufficient labelled history is available.

Plain XGBoost regression does not inherently give you the full calibrated precipitation distribution that this application needs. That is why CSGD is valuable here.

> **Note:** XGBoost is not inherently unsuitable for rainfall. Its outputs can be constrained, transformed, and calibrated probabilistically. The issue is architectural fit: MEGHANVAYA needs a parametric distribution, not a point estimate.

### India-Specific Scientific Precedent

Angus et al. (2024) evaluated QM and EMOS on 23-member NCMRWF NEPS-G day-1 forecasts over India, finding EMOS especially useful for ensemble spread, CRPS, Brier score, and reliability — although the relative strengths vary by metric and location. This provides strong India-specific published precedent for using EMOS as the probabilistic post-processing component.

---

## 3. Current Pilot vs Production Target — Explicit Separation

This distinction must be absolutely clear to prevent any implication that XGBoost is currently running on atmospheric fields.

### CURRENT PILOT (Implemented & Validated)

| Layer | Component | Detail |
| :--- | :--- | :--- |
| **Data** | NOAA GEFSv12 5-member reforecast | Paired with IMD gridded observations |
| **Regime** | Pilot rainfall-conditioned soft gate | $w_{active} = \sigma(\mu_{ens} - 5)$ |
| **Rainfall engine** | CSGD-EMOS | L-BFGS-B optimized link parameters |
| **Spatial** | ECC-Q | Rank reordering from raw ensemble copula |

### PRODUCTION TARGET (Planned Expansion)

| Layer | Component | Detail |
| :--- | :--- | :--- |
| **Data** | Operational NWP ensemble | Preferred: NCMRWF NEPS-G (where historical/operational archive is available and verified) |
| **Regime** | Independent synoptic XGBoost softmax classifier | Trained on $u_{850}, v_{850}, MSLP, PWAT, \text{geopotential}$ |
| **Occurrence** | XGBoost PoP classifier | $P(Rain > 1\text{ mm/day})$ |
| **Intensity** | Regime-specific CSGD-EMOS experts | One expert per synoptic regime |
| **Spatial** | ECC-Q | Rank reordering from raw ensemble copula |

> **Q: "Are you currently running XGBoost on atmospheric fields?"**
>
> "Not in the current pilot. The pilot deliberately uses a simple rainfall-conditioned gate because of its limited training history. XGBoost is the planned production component for independently learned synoptic regime and occurrence classification once sufficient multi-year forecast-time atmospheric data and labels are available."

---

## 4. Current Pilot Architecture Diagram

This is what is **implemented and scientifically validated today**:

```
              GEFSv12 5-Member Reforecast
                        │
                ┌───────┼───────┐
                │       │       │
          Ens. Mean  Ens. Spread  Member Values
                │       │       │
                └───────┼───────┘
                        │
                        ▼
              PILOT SOFT REGIME CONDITIONING
              w_active = σ(μ_ens − 5)
              w_break  = 1 − w_active
                        │
                        ▼
                    CSGD-EMOS
              (L-BFGS-B optimized link parameters)
                        │
                ┌───────┼───────────────────┐
                │       │                   │
               P10     P50    P90, P95      Exceedance
                │       │       │           Probabilities
                │       │       │           P(Y≥64.5mm)
                │       │       │           P(Y≥115.6mm)
                │       │       │           P(Y≥204.5mm)
                └───────┼───────────────────┘
                        │
                        ▼
                      ECC-Q
              (Rank structure restoration)
                        │
                        ▼
              Grid / District Product
              (4,964 spatial cells → 74 pilot districts)
                        │
                        ▼
                  Verification
              (Brier, RMSE, Bias, Reliability)
```

### Evidence Boundary

- **Training:** June 2–4, 2004 (3 cycles × 4,964 cells = 14,892 records)
- **Validation Buffer:** June 5, 2004 (4,964 records)
- **Locked Test:** June 6–7, 2004 (2 independent temporal cycles × 4,964 cells = 9,928 records)
- **Extended Test:** June 6–8, 2004 (3 cycles × 4,964 = 14,892 records)
- **Pilot Regime Conditioning:** Uses rainfall-derived soft logistic transition (acknowledged circularity risk)
- **Parameters:** Globally pooled across India (limited pilot window precludes regionalization)

---

## 5. Production-Scale Scientific Architecture Diagram (Target)

This is the architecture that would be defended in front of a meteorological expert.

Note: XGBoost does **not** directly predict the rainfall distribution. XGBoost produces classification outputs (regime weights, occurrence probability) that **feed into** CSGD-EMOS.

```
         NWP Ensemble + Atmospheric Features
           MSLP / u850 / v850 / PWAT
             geopotential / terrain
                       │
              ┌────────┴────────┐
              ▼                 ▼
       Regime XGBoost       PoP XGBoost
       (softmax)            (binary)
              │                 │
              └────────┬────────┘
                       ▼
                Soft Regime Weights
           P(Active), P(Break), P(Lows), ...
                       +
               P(Rain > 1 mm/day)
                       │
                       ▼
              CSGD-EMOS EXPERTS
              (one per synoptic regime)
                       │
                       ▼
              Probabilistic Rainfall
              Distribution (mixture)
                       │
                       ▼
                 Uncertainty
              [P10, P50, P90, P95]
                       │
                       ▼
              Heavy Rain Probability
              P(Y≥64.5), P(Y≥115.6), P(Y≥204.5)
                       │
                       ▼
                     ECC-Q
              (rank/dependence restoration)
                       │
                       ▼
              Grid + Districts
                       │
                       ▼
                 Verification
```

### Why XGBoost Belongs Here — But Not as a Replacement

1. **XGBoost Regime Classifier:** Atmospheric variables ($u_{850}, v_{850}, MSLP, PWAT, \text{geopotential}$) contain nonlinear relationships with synoptic regimes. A tree-boosting classifier can learn these and produce soft gating weights — replacing the pilot's rainfall-derived logistic gate with an independent circulation-based classifier.

2. **XGBoost PoP Classifier:** A separate binary classifier for $P(Rain > 1\text{ mm/day})$. Then CSGD handles the conditional rainfall amount distribution. This is a clean decomposition:
   - XGBoost answers **"will it rain?"**
   - CSGD answers **"how much, and with what uncertainty?"**

3. **ECC remains orthogonal:** ECC solves a different problem entirely (recovering ensemble dependence/rank structure after local probabilistic post-processing). It does not compete with XGBoost or CSGD.

### Why XGBoost Is NOT Activated in the Current Pilot

The current training set is **only three temporal cycles** before the validation/test periods. Training an atmospheric XGBoost classifier on three days and presenting its regime predictions as a sophisticated meteorological classifier would make the science **less defensible**, not more.

XGBoost requires a sufficiently large historical training archive with independently labelled synoptic regimes. The current pilot deliberately limits the regime conditioning to a simple parametric gate.

---

## 6. Method Decomposition

Each method in MEGHANVAYA serves a distinct, non-overlapping role:

| Method | Job | Status |
| :--- | :--- | :--- |
| **CSGD-EMOS** | Produce calibrated rainfall probability distribution | ✅ Active |
| **ECC-Q** | Restore ensemble dependence/rank structure | ✅ Active |
| **Soft logistic gate** | Pilot regime conditioning (3-day training window) | ✅ Active pilot |
| **L-BFGS-B** | Bounded quasi-Newton optimizer for CSGD parameters | ✅ Active |
| **XGBoost softmax** | Learn nonlinear atmospheric feature → regime mapping | ⚠️ Production target |
| **XGBoost binary** | Separate "will it rain?" from "how much?" | ⚠️ Production target |
| **GIS engine** | Convert grid information into district products | ✅ Active |
| **Verification** | Determine whether the system actually improves forecasts | ✅ Active |

---

## 7. What to Tell a Judge

### Q: "Why didn't you just use XGBoost?"

> "Because our objective isn't just to predict one rainfall number. We need a calibrated predictive distribution, including uncertainty and threshold exceedance probabilities. XGBoost is useful for nonlinear classification such as weather-regime or precipitation occurrence, while CSGD-EMOS is designed to produce the probabilistic precipitation distribution. So our architecture uses each method for the task it is suited to."

### Q: "Where does XGBoost fit in your system?"

> "Our current seven-cycle experiment deliberately keeps the pilot regime conditioning simple. With a multi-year archive and independently labelled synoptic regimes, the next production stage is to replace the pilot gate with an atmospheric-feature XGBoost softmax classifier, and add a separate XGBoost binary classifier for precipitation occurrence."

### Q: "Are you currently running XGBoost on atmospheric fields?"

> "Not in the current pilot. The pilot deliberately uses a simple rainfall-conditioned gate because of its limited training history. XGBoost is the planned production component for independently learned synoptic regime and occurrence classification once sufficient multi-year forecast-time atmospheric data and labels are available."

### Q: "Is this real AI/ML?"

> "MEGHANVAYA uses different methods for different tasks: boosted-tree classification is suitable for nonlinear regime/occurrence prediction when sufficient labelled history is available, while CSGD-EMOS provides the parametric predictive rainfall distribution required for calibrated precipitation amounts and exceedance probabilities. The architecture is designed so that each component does what it is best suited for."

### Q: "Why is your training sample so small?"

> "Our current system is explicitly documented as a limited June 2004 pilot rather than nationwide operational validation. The seven-cycle experiment proves the mathematical pipeline architecture. Scaling requires a multi-year paired archive (1980–2020) spanning 20+ monsoon seasons, which is the defined production roadmap."

---

## 8. References

1. Angus, M., et al. (2024). *A comparison of two statistical postprocessing methods for heavy-precipitation forecasts over India during the summer monsoon.* QJRMS, DOI: 10.1002/qj.4677.
2. Scheuerer, M. & Hamill, T.M. (2015). *Statistical postprocessing of ensemble precipitation forecasts by fitting censored, shifted gamma distributions.* MWR.
3. Schefzik, R., Thorarinsdottir, T.L. & Gneiting, T. (2013). *Uncertainty quantification in complex simulation models using ensemble copula coupling.* Statistical Science.
4. Schefzik, R. (2017). *Ensemble calibration with preserved correlations.* QJRMS.
5. Vannitsem, S., et al. (2021). *Statistical Postprocessing for Weather Forecasts: Review, Challenges and Avenues in a Big Data World.* BAMS.

---

**DOCUMENT STATUS: FROZEN**  
**No further model architecture changes.** Next work: final product testing and deployment.
