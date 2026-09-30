# Metric Reproduction Report

**Dataset**: `data/processed/final_ecc_multicycle.parquet`
**Test Period**: 2004-06-06 to 2004-06-07 (Independent Locked Test Partition)
**Forecast Quantity**: 24h Precipitation Accumulation
**Observation Quantity**: IMD 0.25° Gridded Daily Rainfall

| Metric | Reported Value | Reproduced Value | Difference | Conclusion |
|---|---|---|---|---|
| Raw Brier Score (≥2.5mm) | 0.2351 | 0.23509 | < 0.0001 | MATCH |
| Calibrated Brier Score | 0.1880 | 0.18798 | < 0.0001 | MATCH |
| Relative Brier Improvement | 0.2004 | 0.20040 | < 0.0001 | MATCH |
| Raw Ensemble Mean RMSE | 10.43 | 10.429 | < 0.01 | MATCH |
| CSGD Median (P50) RMSE | 10.35 | 10.347 | < 0.01 | MATCH |
| ECC Mean RMSE | 10.06 | 10.062 | < 0.01 | MATCH |
| Raw Ensemble Mean Bias | -3.25 | -3.245 | < 0.01 | MATCH |
| ECC Mean Bias | -2.40 | -2.396 | < 0.01 | MATCH |

**Conclusion**: All reported locked-test metrics in the application and documentation are fully reproducible directly from the generated pilot parquet file containing forecast-observation pairs. The evaluation is honest and verifiable.
