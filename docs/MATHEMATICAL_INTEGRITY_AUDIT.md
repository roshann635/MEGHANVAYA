# MATHEMATICAL INTEGRITY AUDIT

**Experiment:** 7-Cycle June 2004 Chronological Pilot

This document serves as the formal mathematical audit of the MEGHANVAYA pilot implementation, strictly separating verified scientific implementations from architectural scaffolding and mock surrogates.

## 1. ENSEMBLE INTEGRITY
- **Rows in Parquet**: 34,748
- **Grid Cells per Cycle**: 7,446 (0.25° India landmass)
- **Forecast Cycles**: 7 days (June 1 - June 7, 2004)
- **Members Recovered**: 1 (`c00` - Control Member).
- **Status**: The full 5-member extraction was bypassed to optimize local storage constraints. 
- **Impact**: True `ensemble_mean` and `ensemble_variance` are currently unresolvable natively in this specific `.parquet` because `p01`-`p04` were not downloaded.

## 2. ECC INTEGRITY
- **Status**: IMPLEMENTED BUT NOT VALIDATED
- **Reason**: Ensemble Copula Coupling requires a multi-member empirical CDF to perform rank restoration. Because the pilot acquired only the `c00` control member, ECC cannot be mathematically executed on this dataset.

## 3. CSGD-EMOS MATHEMATICAL AUDIT
- **Implementation Reality**: The codebase currently utilizes an `xgb.XGBRegressor(n_estimators=20)` to map raw `nwp_rainfall` and spatial coordinates directly to expected rainfall.
- **Audit Finding**: This is **NOT** a Censored Shifted Gamma Distribution (CSGD). It lacks explicit shape/scale parameter estimation and variance calibration.
- **Renamed Classification**: The current implementation must be strictly classified as an **XGBoost Deterministic Surrogate for EMOS**.
- **Missing Mathematics**: True CSGD-EMOS requires fitting: $f(y|X) = p_0 \delta_0(y) + (1-p_0) \text{Gamma}(y; k, \theta)$ where parameters are linked to ensemble mean and variance. This is currently mocked.

## 4. PoP AUDIT
- **Implementation Reality**: `xgb.XGBClassifier` trained on `P(obs > 0.1mm)`.
- **Brier Score Calculation**: 
  - Raw NWP Brier (0.3566) was computed using a deterministic step function `(NWP > 0.1)`.
  - PoP Model Brier (0.2127) was computed using the calibrated probabilities from `predict_proba()[:, 1]`.
- **Audit Finding**: The PoP mathematical execution is genuine, probabilistically coherent, and validly scored.

## 5. DATA LEAKAGE AUDIT
- **Train Window**: 2004-06-02 to 2004-06-04 (Valid Time)
- **Validation Window**: 2004-06-05 (Valid Time)
- **Locked Test Window**: 2004-06-06 to 2004-06-07 (Valid Time)
- **Audit Finding**: PASSED. The strict chronological split guarantees that no future observations were exposed during `fit()`.

## 6. TEST INDEPENDENCE
- **Total Test Rows**: 14,892
- **Grid Cells**: 7,446
- **Independent Forecast Cycles**: 2 (June 6 and June 7)
- **Audit Finding**: The test sample represents exactly **2 independent synoptic cases**. The 14,892 rows represent highly correlated spatial grids, not independent probabilistic draws.

## 7. METRIC AUDIT
- **RMSE**: Calculated via `mean_squared_error(..., squared=False)`
- **MAE**: Calculated via `mean_absolute_error`
- **Contingency Threshold**: Evaluated rigidly at **2.5 mm** (Trace rain).
- **Formulas Used**: 
  - $CSI = \frac{Hits}{Hits + Misses + False Alarms}$
  - $ETS = \frac{Hits - Hits_{rand}}{Hits + Misses + False Alarms - Hits_{rand}}$
- **Audit Finding**: All metric mathematics are exact, unscaled, and verifiable.

## 8. TRADEOFF ANALYSIS
- **RMSE**: Improved by 0.70 mm (10.86 $\rightarrow$ 10.16)
- **POD (Probability of Detection)**: Increased massively (+0.400) from 0.191 to 0.591.
- **FAR (False Alarm Ratio)**: Increased slightly (+0.046) from 0.486 to 0.532.
- **Conclusion**: The AI surrogate aggressively corrected the NWP's dry bias, capturing 3x more actual rainfall events (Hits). It paid a small mathematical penalty in over-forecasting (False Alarms). Overall, the Equitable Threat Score (ETS) more than doubled (0.082 $\rightarrow$ 0.182), proving a highly favorable scientific tradeoff.

## 9. EXPERIMENT NOMENCLATURE
- **Authorized Name**: "7-Cycle June 2004 Chronological Pilot"

## 10. & 11. FULL SYSTEM STATUS

| Module | Status | Justification |
| :--- | :--- | :--- |
| **Regime Classifier** | MOCKED | Threshold-based fallback active. |
| **PoP Classifier** | **TRAINED / VALIDATED** | True probabilistic XGBoost model fitted and scored on test. |
| **CSGD-EMOS** | APPROXIMATED | Surrogate XGBoost regression used instead of true CSGD fit. |
| **Uncertainty Calibration**| MOCKED | Ensemble variance unresolvable with 1 member. |
| **ECC** | **IMPLEMENTED BUT NOT VALIDATED** | Awaiting multi-member ingestion. |
| **Heavy Rain Prob** | MOCKED | Hardcoded thresholds on deterministic surrogate. |
| **Adaptive Trust** | MOCKED | Static thresholds active. |
| **OOD Detection** | PENDING | Not executed. |
| **Verification** | **VALIDATED** | Pipeline calculates true spatial contingency/continuous metrics. |
