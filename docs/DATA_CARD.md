# DATA CARD: MEGHANVAYA PILOT DATASET
**MEGHANVAYA — SIH 2026 | Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. Dataset Summary
- **Dataset Identifier:** `meghanvaya-pilot-gefs-imd-200406`
- **Format:** Apache Parquet (`data/processed/final_ecc_multicycle.parquet`)
- **Temporal Horizon:** June 2, 2004 – June 8, 2004 (7 consecutive daily 00:00 UTC cycles)
- **Spatial Domain:** India Terrestrial Landmass ($6.0^\circ\text{N} - 38.5^\circ\text{N}$, $68.0^\circ\text{E} - 97.5^\circ\text{E}$)
- **Grid Resolution:** $0.25^\circ \times 0.25^\circ$ (~27 km grid cell spacing)
- **Cell Count:** Exactly 4,964 land-masked grid cells per forecast cycle
- **Total Co-Registered Records:** Exactly 34,748 rows (4,964 cells $\times$ 7 cycles)

---

## 2. Ingestion Sources
1. **Numerical Weather Prediction (NWP) Ensemble:**
   - Source: NOAA Global Ensemble Forecast System version 12 (GEFSv12) Reforecast
   - Members: 5 members ($c00$ control, $p01, p02, p03, p04$ perturbed members)
   - Lead Time: Day-1 forecast (24-hour accumulated precipitation)
2. **Observational Ground Truth:**
   - Source: India Meteorological Department (IMD) 0.25° Daily Gridded Rainfall Analysis
   - Verification Units: Millimeters per day (mm/day)

---

## 3. Chronological Partitioning (Leakage-Proof)
- **Training Partition:** June 2, 2004 – June 4, 2004 (3 cycles = 14,892 records)
- **Validation Buffer Partition:** June 5, 2004 (1 cycle = 4,964 records) — temporal buffer preventing lag-correlation leakage
- **Primary Locked Test Partition:** June 6, 2004 – June 7, 2004 (2 independent temporal cycles = 9,928 records)
- **Extended Test Partition:** June 6, 2004 – June 8, 2004 (3 temporal cycles = 14,892 records)

---

## 4. Key Variables
| Column Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `valid_time` | String | UTC | Forecast valid timestamp (YYYY-MM-DD) |
| `lat`, `lon` | Float | Degrees | Grid centroid coordinates |
| `state`, `district` | String | Categorical | Assigned administrative entity (74 monitored districts) |
| `c00`, `p01`..`p04` | Float | mm | Raw GEFSv12 5-member rainfall forecasts |
| `ensemble_mean` | Float | mm | Unweighted mean across 5 members |
| `ensemble_variance` | Float | mm² | Sample variance across 5 members |
| `calibrated_p50` | Float | mm | CSGD-EMOS parametric median |
| `p10`, `p90`, `p95` | Float | mm | Inverted CSGD cumulative distribution quantiles |
| `pop_raw` | Float | Fraction | Raw member exceedance fraction: $\sum \mathbb{I}(R_m \ge 2.5)/5$ |
| `pop_calibrated` | Float | Fraction | Calibrated PoP: $1 - F_{CSGD}(2.5 + \delta; k, \theta)$ |
| `heavy_prob` | Float | Fraction | Exceedance probability $P(Y \ge 64.5\text{ mm/day})$ |
| `ecc_p50` | Float | mm | Ensemble Copula Coupling re-permuted median |
| `observed` | Float | mm | IMD 0.25° ground truth rainfall |

---

## 5. Known Limitations
- Spatially correlated grid points: 4,964 cells per day are spatially dependent and do not represent 4,964 independent degrees of freedom.
- 2 temporal independent cycles in primary locked test: Statistical generalization is established for the early June 2004 monsoon onset, not multi-year operational regimes.
