# MODEL REGISTRY
**MEGHANVAYA — SIH 2026 | Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## Registered Model Checkpoints

### 1. Primary Operational Checkpoint
- **Model Tag:** `meghanvaya-csgd-emos-v1.0.0-pilot`
- **Framework:** Python / SciPy / NumPy / FastAPI
- **File Artifact:** `models/csgd_emos_weights.json`
- **Status:** **FROZEN PILOT RELEASE**
- **Training Partition:** June 2–4, 2004 (14,892 records)
- **Validation Buffer:** June 5, 2004 (4,964 records)
- **Locked Test:** June 6–7, 2004 (9,928 records)
- **Parameters:**
  - Active Monsoon Link Parameters: `[10.0616, 0.8310, 180.5578, 0.0001, 2.2288]`
  - Break Monsoon Link Parameters: `[2.5229, 1.9922, 69.2460, 12.9599, 0.5594]`
- **Convergence:** Negative Log-Likelihood = `0.0418` (Verified monotonic and positive variance)

### 2. Coupling Checkpoint
- **Engine:** `meghanvaya-ecc-q-v1.0.0`
- **Algorithm:** Quantile Empirical Copula Coupling (Schefzik et al., 2013)
- **Quantiles Sampled:** 5 marginal points ($P_{16.7}, P_{33.3}, P_{50.0}, P_{66.7}, P_{83.3}$)
- **Status:** **OPERATIONAL**
