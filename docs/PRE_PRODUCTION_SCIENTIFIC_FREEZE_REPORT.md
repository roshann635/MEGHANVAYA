# PRE-PRODUCTION SCIENTIFIC FREEZE AUDIT

**Experiment Identity**: "7-Cycle June 2004 Chronological Pilot"

This document serves as the final pre-production scientific audit of MEGHANVAYA before freezing the core mathematical architecture. It strictly evaluates the implementation against mathematical theory and demarcates verified claims from pending production requirements.

---

## 1. REGIME LABEL INDEPENDENCE
- **Status**: **REGIME LABEL CIRCULARITY RISK**
- **Audit Finding**: The pilot dynamically generated "Active" vs. "Break" labels by thresholding the GEFS `ensemble_mean` ($\mu_{ens} > 5$mm). This constitutes circularity, as the classifier input ($\mu_{ens}$) is intrinsically entangled with the label definition. 
- **Limitation**: The pilot operates as a functionally valid regime-conditioned mathematics testbed, but it **cannot** claim independent meteorological regime classification. Production requires synoptic variables (e.g., MSLP, Wind shear) strictly independent of the rainfall variable itself.

## 2. CSGD PARAMETER IDENTIFIABILITY
- **Training Structure**: 3 independent temporal forecast cycles (June 2-4 valid dates).
- **Spatial Cells**: ~4,964 valid India grid cells per cycle.
- **Training Observations**: 14,892 highly correlated spatial points.
- **Parameters**: 5 per regime expert ($a_0, a_1, b_0, b_1, \delta$). Total = 10.
- **Identifiability vs. Generalization**: The model achieves robust **numerical identifiability** because 10 parameters are optimized globally over 14,892 records. However, this does **not** equal atmospheric generalization. The 14,892 observations stem from just 3 independent temporal weather cases.

## 3. CSGD SPATIAL GENERALIZATION
- **Status**: **GLOBAL-POOLED PILOT PARAMETERIZATION**
- **Audit Finding**: A single global CSGD parameter set applies identically across all of India. 
- **Production Requirement**: Operational deployment requires spatial/climatological stratification (e.g., separate pooled fits per meteorological subdivision) or explicit spatial predictors to capture India's diverse climatology.

## 4. TRUE CSGD CHECK
- **Zero Mass**: $P(Y=0)$ is exactly $\text{GammaCDF}(\delta; k, \theta)$.
- **Positive Density**: For $Y > 0$, density is the explicitly shifted Gamma density evaluated at $(Y+\delta)$.
- **Mathematical Integrity**: Total probability exactly integrates to 1. The CDF bounds $[0, 1]$ and monotonicity are mathematically guaranteed by `scipy.stats.gamma`.

## 5. MOMENT/LINK CHECK
- **Mean Link**: $\mu = \max(a_0 + a_1 \mu_{ens}, 10^{-4})$
- **Variance Link**: $\sigma^2 = \max(b_0 + b_1 \sigma^2_{ens}, 10^{-4})$
- **Shape/Scale**: $k = \mu^2 / \sigma^2$, $\theta = \sigma^2 / \mu$
- **Constraints**: Enforced via bounded optimization (L-BFGS-B) and internal lower bounds ($10^{-4}$) to prevent domain errors.

## 6. REGIME MIXTURE
- **Audit Finding**: The mixture operates strictly over the probability distributions (CDF/Quantiles), satisfying $P(y|x) = \Sigma w_k P_k(y|x)$. The weights $w_{active}$ and $w_{break}$ are smoothly distributed via logistic function ($w_k \ge 0, \Sigma w_k = 1$).

## 7. ECC (ENSEMBLE COPULA COUPLING)
- **Inputs**: 5 raw GEFS members (`c00, p01, p02, p03, p04`).
- **Quantiles Generated**: $Q(1/6), Q(2/6), Q(3/6), Q(4/6), Q(5/6)$ from the continuous CSGD mixture distribution.
- **Execution**: The 5 sampled quantiles are perfectly reordered to match the spatial rank templates of the 5 raw members at each grid cell. Final calibrated ensemble inherently possesses exactly 5 members.

## 8. ECC SPATIAL TEST
- **Status**: PASSED. 
- **Audit Finding**: ECC preserves the intended rank ordering of the raw GEFS ensemble with 100% fidelity. It operates purely as a rank-restoration copula. It is **not** spatial smoothing.

## 9. PoP (PROBABILITY OF PRECIPITATION)
- **Status**: Decoupled from the True CSGD pipeline as the CSGD explicitly models $P(Y > 0) = 1 - \text{GammaCDF}(\delta)$. 
- **Evaluation Requirement**: Production validation requires formally comparing the XGBoost PoP vs. True CSGD zero-mass PoP vs. the raw 5-member empirical PoP across a full monsoon season.

## 10. BRIER AUDIT
- **Audit Finding**: Raw NWP Brier scores in the pilot were computed deterministically (treating `mean > 0.1` as a binary 0/1 prediction), not probabilistically via 5-member spread. This under-reports raw NWP Brier skill. Production validation must score the raw ensemble probabilistically.

## 11. LOCKED TEST & 12. INDEPENDENT CASE COUNT
- **Leakage Status**: BLOCKED. Test dates (June 6-7) never entered the fitting, parameterization, or tuning pipelines.
- **Temporal Cases**: The test partition constitutes exactly **2 independent temporal forecast cases**, encompassing ~9,928 correlated spatial grids.

## 13. APPROVED CLAIMS
- The current implementation is strictly bound to the claim: **"7-Cycle June 2004 Chronological Pilot"**.
- It does **not** support claims of India-wide generalization, multi-season performance, or production validation.

## 14. CURRENT SYSTEM STATUS (Pilot Scope)
| Module | Status | Disclaimer |
| :--- | :--- | :--- |
| **PoP (XGBoost)** | TRAINED | Decoupled from CSGD validation. |
| **True CSGD-EMOS** | VALIDATED | Validated for 2 test cycles only. |
| **Regime EMOS** | TRAINED | **REGIME LABEL CIRCULARITY RISK** active. |
| **Uncertainty** | VALIDATED | Derived directly from true variance link. |
| **ECC** | VALIDATED | 5-member sorting mathematically verified. |
| **Heavy Rain Prob** | VALIDATED | Derived exactly from CSGD CDF. |
| **Adaptive Trust** | PENDING | Awaiting extended temporal pilot. |
| **OOD Detection** | PENDING | Unimplemented. |

## 15. PRODUCTION ROADMAP
To achieve full operational validation, MEGHANVAYA must execute the following sequential roadmap:
1. **Dataset Expansion**: Execute across multiple full JJAS monsoon seasons (e.g., 2000–2019) and years.
2. **Geographic Coverage**: Expand beyond the strict bounding box.
3. **Full Regime Taxonomy**: Deploy independent meteorological synoptic classifiers for all 7 designated regimes.
4. **Spatial Stratification**: Transition from Global-Pooled EMOS to Regional/Sub-divisional EMOS pooling to respect climatological boundaries.
5. **Ensemble Scale**: Execute with higher member counts (e.g., 11 or 31 members) where available.
6. **Lead-Time Calibration**: Independently fit and validate EMOS parameters across Day 1, Day 2, and Day 3 lead horizons.
7. **Production Benchmarking**: Conduct full CRPS, FSS, Reliability, Brier, and Rank Histogram (Talagrand) diagnostics on the completely locked temporal sequence.
8. **Operational Porting**: Integrate the fully vetted Python/xarray mathematical stack with the NCMRWF NEPS-G operational data feeds.
