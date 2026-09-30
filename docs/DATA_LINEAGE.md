# DATA LINEAGE

## Source 1: Forecast (NWP)
- **Source Name**: NOAA GEFSv12 Reforecast
- **Provider**: NOAA Open Data (AWS S3: `s3://noaa-gefs-retrospective/`)
- **Variable**: APCP (Total Precipitation Surface)
- **Resolution**: 0.25° x 0.25°
- **Units**: kg/m² (~mm)
- **Temporal Frequency**: Daily initialization (00 UTC)
- **Accumulation Period**: +24h
- **Spatial Grid**: Interpolated to India bounds (6.5N-38.5N, 66.5E-100E)
- **Version**: GEFSv12
- **Provenance**: Verified historical reforecast data downloaded securely via AWS S3 anonymously.
- **Type**: REAL

## Source 2: Observation (Target)
- **Source Name**: IMD Gridded Daily Rainfall
- **Provider**: India Meteorological Department (IMD)
- **Variable**: rainfall
- **Resolution**: 0.25° x 0.25°
- **Units**: mm/day
- **Temporal Frequency**: Daily (+24h accumulated ending 0300 UTC)
- **Spatial Grid**: India bounds (6.5N-38.5N, 66.5E-100E)
- **Version**: N/A (2004 historical)
- **Provenance**: Verified historical gridded NetCDF downloaded locally.
- **Type**: REAL

## Metadata Safety Checks
- Missing values explicitly dropped during spatial alignment (`paired.dropna()`).
- Longitudes strictly aligned to [0, 360] GEFS natively mapped to IMD logic.
- Target alignment: Forecast Day $N$ valid time perfectly corresponds to Observation valid time $N+1$. No leakage.
