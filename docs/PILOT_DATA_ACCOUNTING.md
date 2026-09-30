# PILOT DATA ACCOUNTING & RECORD AUDIT
**MEGHANVAYA — SIH 2026 | PS 26080**  
**Audit Timestamp:** September 30, 2026  
**Dataset Lineage:** `data/processed/final_ecc_multicycle.parquet` & `rainfall_2004.nc`  

---

## 1. Master Data Partition Accounting Table

Every record in the pilot dataset represents a physical 0.25° $\times$ 0.25° grid point over India, co-registered between NOAA GEFSv12 5-member reforecasts (`c00, p01, p02, p03, p04`) and IMD gridded daily observation truth.

| Valid Date | Forecast Issue Date | Lead Time | Spatial Cells | Valid Records | Missing / NaN | Partition Split Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2004-06-02** | 2004-06-01 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **TRAIN** (Day 1) |
| **2004-06-03** | 2004-06-02 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **TRAIN** (Day 2) |
| **2004-06-04** | 2004-06-03 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **TRAIN** (Day 3) |
| **2004-06-05** | 2004-06-04 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **VALIDATION / BUFFER** (Day 4) |
| **2004-06-06** | 2004-06-05 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **LOCKED TEST** (Independent Day 1) |
| **2004-06-07** | 2004-06-06 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **LOCKED TEST** (Independent Day 2) |
| **2004-06-08** | 2004-06-07 00:00 UTC | 24 Hours | 4,964 | 4,964 | 0 | **EXTENDED TEST** (Day 7) |

---

## 2. Summary Breakdown

- **TOTAL PILOT RECORDS:** **34,748** (7 cycles $\times$ 4,964 cells)
- **TRAINING RECORDS (June 2–4):** **14,892** (3 cycles $\times$ 4,964 cells)
- **VALIDATION BUFFER (June 5):** **4,964** (1 cycle $\times$ 4,964 cells)
- **LOCKED OUT-OF-SAMPLE TEST (June 6–7):** **9,928** (2 independent temporal cycles $\times$ 4,964 cells)
- **EXTENDED TEST CYCLE (June 8):** **4,964** (1 cycle $\times$ 4,964 cells)
- **COMBINED TEST WINDOW (June 6–8):** **14,892** (3 cycles $\times$ 4,964 cells)
- **INDEPENDENT TEMPORAL TEST CYCLES:** **2** (Primary Locked Test: June 6 and June 7, 2004)
- **SPATIAL CELLS PER CYCLE:** **4,964** (Spanning Lat 8.25°N to 37.25°N, Lon 68.00°E to 97.25°E)
- **MONITORED DISTRICTS IN PILOT:** **74 representative districts** across **19 Indian states** (derived from nearest centroid assignment to 4,964 grid cells). Nationwide GIS administrative boundary database supports 700+ districts in operational schema.

---

## 3. Reconciliation of Prior Discrepancy

- **Prior Ambiguity:** An earlier draft documented "Train: June 2–4 = 14,892" and "Test: June 6–7 = 14,892".
- **Mathematical Resolution:**
  - $3 \times 4,964 = 14,892$ records.
  - June 2, 3, 4 constitutes exactly 3 days ($3 \times 4,964 = \mathbf{14,892}$ training records).
  - The primary locked test window of **2 independent temporal days (June 6–7)** contains exactly $2 \times 4,964 = \mathbf{9,928}$ spatial records.
  - When the 7th cycle (June 8) is appended to the out-of-sample test split, the 3-day test partition (June 6–8) contains exactly $3 \times 4,964 = \mathbf{14,892}$ spatial records.
  - June 5 ($4,964$ records) acts as an essential 24-hour temporal separation buffer preventing auto-regressive boundary leakage between training and testing.

---

## 4. Native 5-Member Ensemble Probabilistic Brier Baseline

The raw NWP baseline evaluates probability of precipitation ($R \ge 2.5\text{ mm}$) using native ensemble exceedance:
$$P_{raw}(R \ge 2.5) = \frac{1}{5} \sum_{m \in \{c00, p01, p02, p03, p04\}} \mathbb{I}(R_m \ge 2.5)$$

### Out-of-Sample Verification Metrics (Locked 2-Day Test: June 6–7, $N=9,928$)
- **Raw NWP Native Brier Score:** **0.2351**
- **CSGD-EMOS Calibrated Brier Score:** **0.1880**
- **Brier Skill Score (BSS):** **+0.2004 (+20.04% probabilistic skill gain)**
- **Root Mean Squared Error (RMSE):**
  - Raw NWP: **10.43 mm**
  - CSGD-EMOS P50: **10.35 mm**
  - ECC Copula Coupled: **10.06 mm (-3.5% error reduction)**
- **Mean Bias:**
  - Raw NWP: **-3.25 mm**
  - CSGD-EMOS: **-3.22 mm**
  - ECC: **-2.40 mm (+26.2% bias reduction)**

### Combined 3-Day Test Window (June 6–8, $N=14,892$)
- **Raw NWP Native Brier Score:** **0.2369**
- **CSGD-EMOS Calibrated Brier Score:** **0.1872**
- **Brier Skill Score (BSS):** **+0.2098 (+20.98% probabilistic skill gain)**
- **Root Mean Squared Error (RMSE):**
  - Raw NWP: **10.95 mm**
  - CSGD-EMOS P50: **10.86 mm**
  - ECC: **10.56 mm (-3.6% error reduction)**
