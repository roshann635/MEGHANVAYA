import xarray as xr

print('Testing GEFS read without print(ds)...')
ds = xr.open_dataset('data/raw/gefs/2004/apcp_sfc_2004060100_c00.grib2', engine='cfgrib')
print('GEFS variables:', list(ds.data_vars.keys()))

print('\nTesting IMD read without print(imd)...')
imd = xr.open_dataset('data/raw/imd/2004/rainfall_2004.nc')
print('IMD variables:', list(imd.data_vars.keys()))
