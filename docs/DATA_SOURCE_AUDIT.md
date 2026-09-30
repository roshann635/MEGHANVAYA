# Data Source Audit

## 1. NOAA GEFSv12 Reforecast
- **Role**: Primary Historical NWP Training Source
- **Status**: Publicly Accessible (AWS S3)
- **Format**: GRIB2
- **Variables**: APCP (Precipitation), U/V wind, MSLP, PWAT, CAPE
- **Resolution**: 0.25°
- **Period**: 2000-2019
- **Feasibility**: High. Data is massive; requires bounding box cropping (India: 6N-38N, 66E-100E) and specific variable extraction to be computationally feasible locally.

## 2. IMD Gridded Daily Rainfall
- **Role**: Primary Observation / Ground Truth
- **Status**: Publicly Documented (IMD Pune)
- **Format**: NetCDF / GRD
- **Variables**: Daily Rainfall Accumulation
- **Resolution**: 0.25°
- **Period**: 1901-Present
- **Feasibility**: Moderate. Requires automated scraping or manual download from IMD portals. Bounding box matches India.

## 3. NCMRWF NEPS-G
- **Role**: Target Operational NWP
- **Status**: PENDING EXTERNAL ACCESS
- **Feasibility**: Low for immediate training. No public historical archive available without government credentials. Will use NOAA GEFSv12 as the proxy during training, with adapter architecture built for NEPS-G.
