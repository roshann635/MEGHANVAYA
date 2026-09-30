# Data Alignment Report

## 1. Temporal Alignment
- **NOAA GEFSv12**: Issue times typically 00Z. Lead times in 3-hour or 6-hour intervals. Accumulations (APCP) must be correctly summed to match the 24-hour observation window.
- **IMD Observations**: 24-hour accumulation window ends at 08:30 IST (03:00 UTC) the following day.
- **Alignment Strategy**: The forecast accumulation window must precisely span 03:00 UTC of Day $ to 03:00 UTC of Day +1$.

## 2. Spatial Alignment
- **Forecast Grid**: NOAA GEFS is 0.25° lat/lon.
- **Observation Grid**: IMD Gridded is 0.25° lat/lon.
- **Alignment Strategy**: Since grids have identical nominal resolution, we will perform nearest-neighbor or bilinear interpolation if the grid origins are slightly offset. We will crop both to the India bounding box (Lat: 6.5 to 38.5, Lon: 66.5 to 100.0).
