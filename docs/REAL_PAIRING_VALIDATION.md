# REAL PAIRING VALIDATION

## Temporal Alignment
- **GEFS**: Forecast issued at 2004-06-01 00:00 UTC. Step +24h valid at 2004-06-02 00:00 UTC.
- **IMD**: Observations recorded for the 24h window ending at 2004-06-02 03:00 UTC (08:30 IST).
- **Overlap**: 21/24 hours (87.5% overlap). Passed alignment threshold without synthetic scaling.

## Spatial Alignment
- **Method**: Linear interpolation of `latitude`/`longitude` from GEFS (0-360) onto IMD (66.5-100.0E, 6.5-38.5N).
- **Yield**: 4964 paired grid cells successfully mapped.
