# MEGHANVAYA — FINAL GOVERNMENT SHIP REPORT
**Problem Statement 26080**
**Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts**
*Evaluation & Deployment Readiness Audit*

---

## 1. Executive Summary
MEGHANVAYA is an operational meteorological decision-support and post-processing platform designed for Indian monsoon precipitation forecasting. It calibrates raw Numerical Weather Prediction (NWP) ensemble forecasts (NOAA GEFSv12) against India Meteorological Department (IMD) high-resolution gridded observations. 

Through a closed-form Censored Shifted Gamma Distribution Extended Model Output Statistics (CSGD-EMOS) engine combined with soft weather-regime conditioning and Ensemble Copula Coupling (ECC), MEGHANVAYA achieves a **20.04% Relative Brier-Score Improvement** over the native 5-member NWP ensemble on out-of-sample chronological test cases.

```
====================================================================
SCIENTIFIC STATUS: RESEARCH / DECISION-SUPPORT PROTOTYPE (PILOT)
====================================================================
Pilot Dataset: 7-Cycle June 2004 Chronological Benchmark
Total Co-registered Records: 34,748 across 4,964 Spatial Cells
Primary Locked Out-of-Sample Test: June 6–7, 2004 (9,928 spatial records, 2 independent temporal cycles)
====================================================================
```

---

## 2. Product Architecture
The end-to-end processing pipeline preserves strict chronological ordering to prevent future-data leakage:

```
[NWP 5-Member Ensemble (c00, p01-p04)]
               │
               ▼
[Stage 1-4: Ingestion, QC, Temporal & Bilinear Spatial Alignment (0.25°)]
               │
               ▼
[Stage 5-6: Feature Extraction & Soft Regime Conditioning (Active vs Break)]
               │
               ▼
[Stage 7-8: Probability of Precipitation (PoP) & CSGD-EMOS Intensity Calibration]
               │
               ▼
[Stage 9-10: Predictive Uncertainty Quantiles (P10, P50, P90, P95) & Heavy Tail Probabilities]
               │
               ▼
[Stage 11: Ensemble Copula Coupling (ECC Rank Restoration)]
               │
               ▼
[Stage 12-14: GIS District Aggregation, Provenance Signatures & Verification]
```

---

## 3. Four Distinct User Roles
The platform implements genuine, role-governed workflows with frontend route guards and backend OAuth2/JWT authorization:

1. **Administrator (`/admin`)**:
   - System governance, node health checks, database status, pipeline throughput, user administration, model/data registries, and immutable audit logs.
2. **Meteorologist / Analyst (`/forecast`, `/ensemble`, `/regime`, `/verification`, etc.)**:
   - Deep scientific analytics, raw vs calibrated ensemble spread, CSGD parameter link sensitivities, rank restoration histograms, reliability diagrams, and feature attributions.
3. **Government Officer (`/outlook`)**:
   - High-level decision support, national monsoon overview, priority district action queue sorted by risk and exceedance probabilities ($P \ge 64.5$ mm/day), advisory summaries.
4. **General Public (`/general`)**:
   - Simple district finder, expected rainfall ranges, rain probability, plain-language guidance, and mandatory authorized agency safety disclaimers.

---

## 4. Scientific Engine & Formulations
- **Link Functions**:
  $$\mu = \max(a_0 + a_1 \bar{x}_{\text{ens}}, 10^{-4})$$
  $$\sigma^2 = \max(b_0 + b_1 s^2_{\text{ens}}, 10^{-4})$$
  $$\delta = \text{Censoring Shift Parameter}$$
- **Zero-Mass Point Probability**:
  $$P_0 = F_{\Gamma}(\delta; k, \theta), \quad \text{where } k = \frac{\mu^2}{\sigma^2}, \; \theta = \frac{\sigma^2}{\mu}$$
- **Heavy Rain Probabilities**:
  $$P(Y \ge 64.5) = 1 - F_{\Gamma}(64.5 + \delta; k, \theta)$$
  $$P(Y \ge 115.6) = 1 - F_{\Gamma}(115.6 + \delta; k, \theta)$$
- **Ensemble Copula Coupling (ECC)**: Restores the spatial rank permutation of the raw ensemble to calibrated quantile forecasts, ensuring physically coherent spatial covariance.

---

## 5. Data Accounting & Lineage
| Partition | Dates | Records | Independent Temporal Cycles | Role |
|---|---|---|---|---|
| **Train** | June 2–4, 2004 | 14,892 | 3 | Parameter optimization |
| **Val Buffer** | June 5, 2004 | 4,964 | 1 | Leakage guard buffer |
| **Locked Test** | June 6–7, 2004 | 9,928 | 2 | Primary out-of-sample evaluation |
| **Extended Test** | June 6–8, 2004 | 14,892 | 3 | Secondary verification |
| **Total** | June 2–8, 2004 | 34,748 | 7 | Full pilot benchmark |

---

## 6. Verification Metrics
- **Native Raw Ensemble Brier Score**: $0.2351$
- **CSGD-EMOS Brier Score**: $0.1880$
- **Relative Brier-Score Improvement**:
  $$\text{Relative Gain} = 1 - \frac{0.1880}{0.2351} = 20.04\%$$
- **Root Mean Square Error (RMSE)**:
  - Raw NWP: $10.43$ mm
  - CSGD-EMOS: $10.35$ mm
  - ECC Ensemble: $10.06$ mm

---

## 7. Geographic Information System (GIS)
- **Monitored Districts in Pilot**: 74 representative districts across 19 Indian states.
- **National Schema Support**: 700+ district geometries supported in production schema.
- **Coordinate System**: WGS84, 0.25° grid (~25 km resolution) aligned with IMD gridded series.

---

## 8. API Architecture
Built with FastAPI, featuring modular routers:
- `/api/v1/auth/*`: OAuth2 password flow, JWT token generation, role verification.
- `/api/v1/forecasts/*`: Spatial cycle queries, ensemble members, regime probabilities, heavy rain alerts, provenance chains, data quality audits, and CSV/JSON report exports.

---

## 9. Database & State Management
- Production Schema: PostgreSQL / PostGIS with SQLAlchemy ORM.
- Tables: `users`, `forecast_cycles`, `grid_points`, `district_aggregates`, `audit_logs`, `model_registry`, `dataset_registry`.

---

## 10. Security & RBAC Hardening
- **Authentication**: JWT tokens signed with SHA256, bcrypt password hashing.
- **Authorization**: Granular role-based access control with HTTP 401 (Unauthenticated) and HTTP 403 (Unauthorized) responses.
- **Secret Hygiene**: Zero hardcoded secrets; fully parameterized via `.env` and `settings.py`.

---

## 11. MLOps & Model Governance
- Tracked artifacts with SHA256 checksums in `data/processed/` and `models/`.
- Model Registry lifecycle: `PILOT` $\rightarrow$ `EXPERIMENTAL` $\rightarrow$ `VALIDATED` $\rightarrow$ `APPROVED`.
- Current Model Version: `CSGD-EMOS-v1.0-PILOT`.

---

## 12. Observability & Auditability
- Comprehensive audit logging recording actor, role, resource, action, and timestamp.
- Health check endpoints at `/health` and `/api/v1/forecasts/system-health`.

---

## 13. Reporting Engine
- Dynamic generation and streaming of CSV district advisories, forecast metadata JSON, and Markdown summary briefings.

---

## 14. Deployment Packaging
- **Containerization**: `Dockerfile.backend`, `Dockerfile.frontend`, and `docker-compose.yml` configured for multi-container orchestration.
- **Production Build**: Vite + React frontend optimized and compiled (`npm run build` 0 errors).

---

## 15. Testing & Quality Assurance
- **Scientific Unit Tests**: CSGD parameter positivity, CDF monotonicity, quantile monotonicity ($P_{10} \le P_{50} \le P_{90} \le P_{95}$), heavy rain tail monotonicity, ECC rank preservation.
- **Data Integrity Tests**: Record count matching (34,748 records), grid cell validation (4,964 cells).
- **Security & RBAC Tests**: Route authorization verification and unauthenticated request rejection.

---

## 16. Deterministic Demo & Offline Resilience
- Self-contained offline demo operating entirely on stored pilot datasets without external internet dependencies.
- 2–4 minute Judge Evaluation Flow covering login, national outlook, deep scientific forecast, regime weights, uncertainty curves, provenance, and audit logs.

---

## 17. Current Scientific Limitations
1. **Spatial Correlation**: Grid records are spatially correlated and not statistically independent test samples.
2. **Temporal Window**: Primary locked test comprises 2 independent temporal forecast cycles (June 6–7, 2004).
3. **Regime Gating**: Pilot utilizes rainfall-conditioned soft gating rather than independent synoptic MSLP/wind classification.
4. **Parameter Pooling**: CSGD parameters are globally pooled across all grid points in the pilot phase.
5. **No Official Alert Authority**: Outputs represent model-derived research guidance; official meteorological warnings remain the sole responsibility of authorized national agencies (IMD/NDRF).

---

## 18. Production Roadmap
- Multi-year operational backtesting across 10+ monsoon seasons.
- Spatially varying local parameter optimization.
- Integration of synoptic atmospheric predictors (ERA5 / IMD reanalysis u850, v850, MSLP, PWAT).

---

## 19. Known Non-Blocking Issues
- Extended national district geometries (700+) operate in schema-readiness mode; pilot spatial verification is active for 74 representative districts.

---

## 20. Final Release Decision
**CLASSIFICATION: READY FOR SIH EVALUATION WITH EXPLICIT PILOT LIMITATIONS**
