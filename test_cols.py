import xarray as xr
imd = xr.open_dataset('data/raw/imd/2004/rainfall_2004.nc')
gefs = xr.open_dataset('data/raw/gefs/2004/apcp_sfc_2004060100_c00.grib2', engine='cfgrib')
if 'step' in gefs.coords:
    gefs_slice = gefs.isel(step=1) if len(gefs.step) > 1 else gefs.isel(step=0)
else:
    gefs_slice = gefs
gefs_interp = gefs_slice['tp'].interp(latitude=imd.lat, longitude=imd.lon, method='linear')
df = gefs_interp.to_dataframe().reset_index()
print(df.columns)
