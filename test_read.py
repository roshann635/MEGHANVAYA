import xarray as xr
import sys

print('Testing GEFS read...')
try:
    ds = xr.open_dataset('data/raw/gefs/2004/apcp_sfc_2004060100_c00.grib2', engine='cfgrib')
    print('GEFS opened successfully.')
    print(ds)
except Exception as e:
    print('Failed GEFS:', e)

print('\nTesting IMD read...')
try:
    imd = xr.open_dataset('data/raw/imd/2004/rainfall_2004.nc')
    print('IMD opened successfully.')
    print(imd)
except Exception as e:
    print('Failed IMD:', e)
