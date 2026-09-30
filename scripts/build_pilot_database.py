import os
import datetime
import json
import warnings
import numpy as np
import pandas as pd
import xarray as xr
from scipy.optimize import minimize
from scipy.stats import gamma
from sklearn.metrics import mean_squared_error, mean_absolute_error, brier_score_loss

warnings.filterwarnings('ignore')

# ---------------------------------------------------------
# CSGD Likelihood & Fitting
# ---------------------------------------------------------
def csgd_nll(params, ens_mean, ens_var, obs):
    a0, a1, b0, b1, delta = params
    mu = np.maximum(a0 + a1 * ens_mean, 1e-4)
    sigma2 = np.maximum(b0 + b1 * ens_var, 1e-4)
    k = np.maximum((mu ** 2) / sigma2, 1e-4)
    theta = np.maximum(sigma2 / mu, 1e-4)
    
    y = obs
    zero_idx = (y <= 0)
    pos_idx = (y > 0)
    
    ll = np.zeros_like(y, dtype=np.float64)
    cdf_at_delta = np.clip(gamma.cdf(delta, a=k, scale=theta), 1e-15, 1.0)
    ll[zero_idx] = np.log(cdf_at_delta[zero_idx])
    
    shifted_y = y[pos_idx] + delta
    pdf_y = np.clip(gamma.pdf(shifted_y, a=k[pos_idx], scale=theta[pos_idx]), 1e-15, None)
    ll[pos_idx] = np.log(pdf_y)
    
    return -np.sum(ll) / len(obs)

def fit_csgd(ens_mean, ens_var, obs):
    init_params = [0.1, 1.0, 0.1, 1.0, 0.5]
    bounds = [(1e-4, None), (1e-4, None), (1e-4, None), (1e-4, None), (1e-4, 50.0)]
    res = minimize(csgd_nll, init_params, args=(ens_mean, ens_var, obs), method='L-BFGS-B', bounds=bounds)
    return res.x

def csgd_cdf(params, ens_mean, ens_var, threshold):
    a0, a1, b0, b1, delta = params
    mu = np.maximum(a0 + a1 * ens_mean, 1e-4)
    sigma2 = np.maximum(b0 + b1 * ens_var, 1e-4)
    k = np.maximum((mu ** 2) / sigma2, 1e-4)
    theta = np.maximum(sigma2 / mu, 1e-4)
    return gamma.cdf(threshold + delta, a=k, scale=theta)

def csgd_ppf(params, ens_mean, ens_var, q):
    a0, a1, b0, b1, delta = params
    mu = np.maximum(a0 + a1 * ens_mean, 1e-4)
    sigma2 = np.maximum(b0 + b1 * ens_var, 1e-4)
    k = np.maximum((mu ** 2) / sigma2, 1e-4)
    theta = np.maximum(sigma2 / mu, 1e-4)
    p0 = gamma.cdf(delta, a=k, scale=theta)
    quantiles = np.where(q <= p0, 0.0, gamma.ppf(q, a=k, scale=theta) - delta)
    return np.maximum(quantiles, 0.0)

# Indian District & State Spatial Geocoding Reference (Representative Centroids)
DISTRICT_CENTROIDS = [
    {"state": "Maharashtra", "district": "Mumbai City", "lat": 18.92, "lon": 72.83},
    {"state": "Maharashtra", "district": "Mumbai Suburban", "lat": 19.12, "lon": 72.88},
    {"state": "Maharashtra", "district": "Thane", "lat": 19.22, "lon": 72.98},
    {"state": "Maharashtra", "district": "Palghar", "lat": 19.70, "lon": 72.76},
    {"state": "Maharashtra", "district": "Raigad", "lat": 18.52, "lon": 73.18},
    {"state": "Maharashtra", "district": "Ratnagiri", "lat": 16.99, "lon": 73.31},
    {"state": "Maharashtra", "district": "Sindhudurg", "lat": 16.12, "lon": 73.69},
    {"state": "Maharashtra", "district": "Pune", "lat": 18.52, "lon": 73.85},
    {"state": "Maharashtra", "district": "Nashik", "lat": 19.99, "lon": 73.79},
    {"state": "Maharashtra", "district": "Satara", "lat": 17.68, "lon": 74.00},
    {"state": "Maharashtra", "district": "Kolhapur", "lat": 16.70, "lon": 74.24},
    {"state": "Maharashtra", "district": "Nagpur", "lat": 21.14, "lon": 79.08},
    {"state": "Maharashtra", "district": "Amravati", "lat": 20.93, "lon": 77.75},
    {"state": "Maharashtra", "district": "Aurangabad", "lat": 19.87, "lon": 75.34},
    {"state": "Kerala", "district": "Wayanad", "lat": 11.68, "lon": 76.13},
    {"state": "Kerala", "district": "Idukki", "lat": 9.85, "lon": 76.97},
    {"state": "Kerala", "district": "Ernakulam", "lat": 9.98, "lon": 76.30},
    {"state": "Kerala", "district": "Kozhikode", "lat": 11.25, "lon": 75.78},
    {"state": "Kerala", "district": "Thiruvananthapuram", "lat": 8.52, "lon": 76.93},
    {"state": "Kerala", "district": "Malappuram", "lat": 11.07, "lon": 76.07},
    {"state": "Kerala", "district": "Kannur", "lat": 11.87, "lon": 75.37},
    {"state": "Kerala", "district": "Kottayam", "lat": 9.59, "lon": 76.52},
    {"state": "Karnataka", "district": "Bengaluru Urban", "lat": 12.97, "lon": 77.59},
    {"state": "Karnataka", "district": "Dakshina Kannada", "lat": 12.87, "lon": 75.00},
    {"state": "Karnataka", "district": "Udupi", "lat": 13.34, "lon": 74.74},
    {"state": "Karnataka", "district": "Uttara Kannada", "lat": 14.80, "lon": 74.13},
    {"state": "Karnataka", "district": "Shivamogga", "lat": 13.92, "lon": 75.56},
    {"state": "Karnataka", "district": "Chikkamagaluru", "lat": 13.31, "lon": 75.77},
    {"state": "Karnataka", "district": "Kodagu", "lat": 12.42, "lon": 75.73},
    {"state": "Karnataka", "district": "Belagavi", "lat": 15.84, "lon": 74.49},
    {"state": "Gujarat", "district": "Surat", "lat": 21.17, "lon": 72.83},
    {"state": "Gujarat", "district": "Ahmedabad", "lat": 23.02, "lon": 72.57},
    {"state": "Gujarat", "district": "Vadodara", "lat": 22.30, "lon": 73.18},
    {"state": "Gujarat", "district": "Rajkot", "lat": 22.30, "lon": 70.80},
    {"state": "Gujarat", "district": "Valsad", "lat": 20.61, "lon": 72.93},
    {"state": "Gujarat", "district": "Navsari", "lat": 20.95, "lon": 72.93},
    {"state": "Gujarat", "district": "Junagadh", "lat": 21.52, "lon": 70.45},
    {"state": "Gujarat", "district": "Kachchh", "lat": 23.24, "lon": 69.66},
    {"state": "Goa", "district": "North Goa", "lat": 15.55, "lon": 73.83},
    {"state": "Goa", "district": "South Goa", "lat": 15.28, "lon": 74.02},
    {"state": "Odisha", "district": "Puri", "lat": 19.81, "lon": 85.83},
    {"state": "Odisha", "district": "Khurda", "lat": 20.18, "lon": 85.62},
    {"state": "Odisha", "district": "Cuttack", "lat": 20.46, "lon": 85.88},
    {"state": "Odisha", "district": "Ganjam", "lat": 19.38, "lon": 85.05},
    {"state": "Odisha", "district": "Balasore", "lat": 21.49, "lon": 86.93},
    {"state": "West Bengal", "district": "Kolkata", "lat": 22.57, "lon": 88.36},
    {"state": "West Bengal", "district": "South 24 Parganas", "lat": 22.16, "lon": 88.43},
    {"state": "West Bengal", "district": "North 24 Parganas", "lat": 22.72, "lon": 88.48},
    {"state": "West Bengal", "district": "Darjeeling", "lat": 27.04, "lon": 88.26},
    {"state": "West Bengal", "district": "Jalpaiguri", "lat": 26.54, "lon": 88.72},
    {"state": "Assam", "district": "Kamrup Metropolitan", "lat": 26.14, "lon": 91.73},
    {"state": "Assam", "district": "Cachar", "lat": 24.83, "lon": 92.77},
    {"state": "Assam", "district": "Dibrugarh", "lat": 27.47, "lon": 94.91},
    {"state": "Assam", "district": "Darrang", "lat": 26.45, "lon": 92.03},
    {"state": "Tamil Nadu", "district": "Chennai", "lat": 13.08, "lon": 80.27},
    {"state": "Tamil Nadu", "district": "Coimbatore", "lat": 11.01, "lon": 76.95},
    {"state": "Tamil Nadu", "district": "Nilgiris", "lat": 11.41, "lon": 76.70},
    {"state": "Tamil Nadu", "district": "Kanyakumari", "lat": 8.08, "lon": 77.53},
    {"state": "Andhra Pradesh", "district": "Visakhapatnam", "lat": 17.68, "lon": 83.21},
    {"state": "Andhra Pradesh", "district": "Krishna", "lat": 16.18, "lon": 81.13},
    {"state": "Telangana", "district": "Hyderabad", "lat": 17.38, "lon": 78.48},
    {"state": "Telangana", "district": "Rangareddy", "lat": 17.20, "lon": 78.30},
    {"state": "Madhya Pradesh", "district": "Bhopal", "lat": 23.25, "lon": 77.41},
    {"state": "Madhya Pradesh", "district": "Indore", "lat": 22.71, "lon": 75.85},
    {"state": "Madhya Pradesh", "district": "Jabalpur", "lat": 23.18, "lon": 79.98},
    {"state": "Rajasthan", "district": "Jaipur", "lat": 26.91, "lon": 75.78},
    {"state": "Rajasthan", "district": "Udaipur", "lat": 24.58, "lon": 73.71},
    {"state": "Uttar Pradesh", "district": "Lucknow", "lat": 26.84, "lon": 80.94},
    {"state": "Uttar Pradesh", "district": "Varanasi", "lat": 25.31, "lon": 82.97},
    {"state": "Bihar", "district": "Patna", "lat": 25.59, "lon": 85.13},
    {"state": "Delhi", "district": "New Delhi", "lat": 28.61, "lon": 77.20},
    {"state": "Himachal Pradesh", "district": "Shimla", "lat": 31.10, "lon": 77.17},
    {"state": "Uttarakhand", "district": "Dehradun", "lat": 30.31, "lon": 78.03},
    {"state": "Punjab", "district": "Amritsar", "lat": 31.63, "lon": 74.87}
]

def map_coordinates_to_district(lat_arr, lon_arr):
    # KD-Tree or Euclidean nearest neighbor assignment
    d_lats = np.array([d['lat'] for d in DISTRICT_CENTROIDS])
    d_lons = np.array([d['lon'] for d in DISTRICT_CENTROIDS])
    
    assigned_states = []
    assigned_districts = []
    
    for lat, lon in zip(lat_arr, lon_arr):
        dists = (d_lats - lat)**2 + (d_lons - lon)**2
        min_idx = np.argmin(dists)
        assigned_states.append(DISTRICT_CENTROIDS[min_idx]['state'])
        assigned_districts.append(DISTRICT_CENTROIDS[min_idx]['district'])
        
    return assigned_states, assigned_districts

def run_complete_data_generation():
    print("=== STARTING COMPLETE PILOT DATASET GENERATION ===")
    imd_path = 'data/raw/imd/2004/rainfall_2004.nc'
    if not os.path.exists(imd_path):
        print(f"Error: IMD NetCDF missing at {imd_path}")
        return

    imd = xr.open_dataset(imd_path)
    start_date = datetime.date(2004, 6, 1)
    members = ['c00', 'p01', 'p02', 'p03', 'p04']
    
    all_cycles_frames = []
    
    for i in range(7):
        cur_date = start_date + datetime.timedelta(days=i)
        date_str = cur_date.strftime("%Y%m%d")
        
        member_dfs = []
        skip_day = False
        for member in members:
            grib_path = f'data/raw/gefs/2004/apcp_sfc_{date_str}00_{member}.grib2'
            if not os.path.exists(grib_path):
                print(f"Missing GRIB file: {grib_path}")
                skip_day = True
                break
            
            dt_val = 'cf' if member == 'c00' else 'pf'
            gefs = xr.open_dataset(grib_path, engine='cfgrib', backend_kwargs={'filter_by_keys': {'dataType': dt_val}})
            gefs_slice = gefs.isel(step=1) if len(gefs.step) > 1 else gefs.isel(step=0)
            gefs_interp = gefs_slice['tp'].interp(latitude=imd.lat, longitude=imd.lon, method='linear')
            df = gefs_interp.to_dataframe().reset_index()
            if 'latitude' in df.columns:
                df = df.drop(columns=['latitude', 'longitude'])
            df = df.rename(columns={'tp': member})
            member_dfs.append(df[['lat', 'lon', member]])
            
        if skip_day:
            continue
            
        merged_gefs = member_dfs[0]
        for mdf in member_dfs[1:]:
            merged_gefs = pd.merge(merged_gefs, mdf, on=['lat', 'lon'], how='inner')
            
        valid_date_obj = cur_date + datetime.timedelta(days=1)
        valid_date_str = valid_date_obj.strftime("%Y-%m-%d")
        
        try:
            imd_slice = imd['rainfall'].sel(time=valid_date_str)
            imd_df = imd_slice.to_dataframe().reset_index()
            paired = pd.merge(merged_gefs, imd_df, on=['lat', 'lon'], how='inner').dropna()
            
            paired['forecast_issue_time'] = f'{cur_date.strftime("%Y-%m-%d")}T00:00:00Z'
            paired['valid_time'] = f'{valid_date_str}T00:00:00Z'
            paired['lead_time'] = '24h'
            paired['observed_rainfall'] = paired['rainfall'].clip(lower=0.0)
            paired['ensemble_mean'] = paired[members].mean(axis=1)
            paired['ensemble_variance'] = np.maximum(paired[members].var(axis=1), 1e-4)
            paired['ensemble_std'] = np.sqrt(paired['ensemble_variance'])
            
            all_cycles_frames.append(paired)
            print(f"Loaded Cycle {valid_date_str} with {len(paired)} grid points.")
        except Exception as e:
            print(f"Error pairing {valid_date_str}: {e}")
            continue

    if not all_cycles_frames:
        print("No cycle frames loaded!")
        return

    full_df = pd.concat(all_cycles_frames, ignore_index=True)
    full_df['valid_date_only'] = full_df['valid_time'].str[:10]
    
    # Train: June 2 to June 4
    train = full_df[full_df['valid_date_only'] <= '2004-06-04'].copy()
    print(f"Total Paired Grid Records: {len(full_df)}")
    print(f"Train Records (Jun 2-4): {len(train)}")
    
    print("Fitting CSGD Parameters on Train...")
    train_active = train[train['ensemble_mean'] > 5.0]
    train_break = train[train['ensemble_mean'] <= 5.0]
    
    params_active = fit_csgd(train_active['ensemble_mean'].values, train_active['ensemble_variance'].values, train_active['observed_rainfall'].values)
    params_break = fit_csgd(train_break['ensemble_mean'].values, train_break['ensemble_variance'].values, train_break['observed_rainfall'].values)
    
    print(f"Fitted Active CSGD Params: {np.round(params_active, 4)}")
    print(f"Fitted Break  CSGD Params: {np.round(params_break, 4)}")
    
    # Evaluate across all records
    print("Calculating Calibrated Probabilities, Quantiles, and ECC across all cycles...")
    means = full_df['ensemble_mean'].values
    vars_ = full_df['ensemble_variance'].values
    
    # Soft Regime probabilities (Continuous Logistic Transition around 5 mm)
    w_active = 1.0 / (1.0 + np.exp(-(means - 5.0)))
    w_break = 1.0 - w_active
    full_df['regime_prob_active'] = np.round(w_active, 4)
    full_df['regime_prob_break'] = np.round(w_break, 4)
    full_df['regime'] = np.where(w_active >= 0.5, 'Active Monsoon', 'Break Monsoon')
    
    # Quantiles: P10, P50, P90, P95
    q10_act = csgd_ppf(params_active, means, vars_, 0.10)
    q10_brk = csgd_ppf(params_break, means, vars_, 0.10)
    full_df['emos_p10'] = np.round(w_active * q10_act + w_break * q10_brk, 2)
    
    q50_act = csgd_ppf(params_active, means, vars_, 0.50)
    q50_brk = csgd_ppf(params_break, means, vars_, 0.50)
    full_df['emos_p50'] = np.round(w_active * q50_act + w_break * q50_brk, 2)
    
    q90_act = csgd_ppf(params_active, means, vars_, 0.90)
    q90_brk = csgd_ppf(params_break, means, vars_, 0.90)
    full_df['emos_p90'] = np.round(w_active * q90_act + w_break * q90_brk, 2)
    
    q95_act = csgd_ppf(params_active, means, vars_, 0.95)
    q95_brk = csgd_ppf(params_break, means, vars_, 0.95)
    full_df['emos_p95'] = np.round(w_active * q95_act + w_break * q95_brk, 2)
    
    # 90% Predictive Interval Width (P90 - P10)
    full_df['predictive_interval_width'] = np.round(np.maximum(full_df['emos_p90'] - full_df['emos_p10'], 0.0), 2)
    
    # PoP: P(Rain >= 2.5 mm) via CSGD CDF
    pop_act = 1.0 - csgd_cdf(params_active, means, vars_, 2.5)
    pop_brk = 1.0 - csgd_cdf(params_break, means, vars_, 2.5)
    full_df['pop_calibrated'] = np.round(np.clip(w_active * pop_act + w_break * pop_brk, 0.0, 1.0), 4)
    
    # Raw Ensemble PoP
    raw_pop = (full_df[members] >= 2.5).mean(axis=1)
    full_df['pop_raw'] = np.round(raw_pop, 4)
    
    # Heavy Rain Probability: P(Rain >= 64.5 mm)
    p_heavy_act = 1.0 - csgd_cdf(params_active, means, vars_, 64.5)
    p_heavy_brk = 1.0 - csgd_cdf(params_break, means, vars_, 64.5)
    full_df['heavy_prob'] = np.round(np.clip(w_active * p_heavy_act + w_break * p_heavy_brk, 0.0, 1.0), 4)
    
    # Very Heavy Rain Probability: P(Rain >= 115.5 mm)
    p_vheavy_act = 1.0 - csgd_cdf(params_active, means, vars_, 115.5)
    p_vheavy_brk = 1.0 - csgd_cdf(params_break, means, vars_, 115.5)
    full_df['very_heavy_prob'] = np.round(np.clip(w_active * p_vheavy_act + w_break * p_vheavy_brk, 0.0, 1.0), 4)
    
    # ECC (Ensemble Copula Coupling)
    print("Performing ECC Copula Rank Restoration on 5 calibrated quantiles...")
    q_levels = [1/6, 2/6, 3/6, 4/6, 5/6]
    cal_quantiles = np.zeros((len(full_df), 5))
    for idx, q in enumerate(q_levels):
        qa = csgd_ppf(params_active, means, vars_, q)
        qb = csgd_ppf(params_break, means, vars_, q)
        cal_quantiles[:, idx] = w_active * qa + w_break * qb
        
    raw_members_arr = full_df[members].values
    ecc_members = np.zeros((len(full_df), 5))
    for i in range(len(full_df)):
        ranks = np.argsort(np.argsort(raw_members_arr[i]))
        sorted_q = np.sort(cal_quantiles[i])
        ecc_members[i] = sorted_q[ranks]
        
    for idx in range(5):
        full_df[f'ecc_{idx}'] = np.round(ecc_members[:, idx], 2)
    full_df['ecc_mean'] = np.round(np.mean(ecc_members, axis=1), 2)
    
    # Assign Geographic States and Districts
    print("Assigning India States and Districts...")
    states, districts = map_coordinates_to_district(full_df['lat'].values, full_df['lon'].values)
    full_df['state'] = states
    full_df['district'] = districts
    
    # Save Parquet
    os.makedirs('data/processed', exist_ok=True)
    out_parquet = 'data/processed/final_ecc_multicycle.parquet'
    full_df.to_parquet(out_parquet, index=False)
    print(f"Saved complete multi-cycle ECC dataset: {out_parquet} ({os.path.getsize(out_parquet):,} bytes)")
    
    # Verification Summary on Locked Test (June 6-7)
    test = full_df[full_df['valid_date_only'] >= '2004-06-06'].copy()
    y_test = test['observed_rainfall'].values
    raw_mean_test = test['ensemble_mean'].values
    emos_p50_test = test['emos_p50'].values
    ecc_mean_test = test['ecc_mean'].values
    
    rmse_raw = float(np.sqrt(mean_squared_error(y_test, raw_mean_test)))
    rmse_emos = float(np.sqrt(mean_squared_error(y_test, emos_p50_test)))
    rmse_ecc = float(np.sqrt(mean_squared_error(y_test, ecc_mean_test)))
    
    mae_raw = float(mean_absolute_error(y_test, raw_mean_test))
    mae_emos = float(mean_absolute_error(y_test, emos_p50_test))
    mae_ecc = float(mean_absolute_error(y_test, ecc_mean_test))
    
    bias_raw = float(np.mean(raw_mean_test - y_test))
    bias_emos = float(np.mean(emos_p50_test - y_test))
    bias_ecc = float(np.mean(ecc_mean_test - y_test))
    
    # Binary event metrics at 2.5 mm
    obs_rain = y_test >= 2.5
    brier_raw = float(brier_score_loss(obs_rain, test['pop_raw'].values))
    brier_emos = float(brier_score_loss(obs_rain, test['pop_calibrated'].values))
    bss = float(1.0 - (brier_emos / (brier_raw + 1e-6)))
    
    verification_metrics = {
        "dataset_scope": "7-Cycle June 2004 Chronological Pilot",
        "independent_temporal_cycles": 2,
        "test_cycles": ["2004-06-06", "2004-06-07"],
        "spatial_records_test": len(test),
        "total_spatial_records": len(full_df),
        "metrics": {
            "raw_nwp": {
                "rmse": round(rmse_raw, 2),
                "mae": round(mae_raw, 2),
                "bias": round(bias_raw, 2),
                "brier_score": round(brier_raw, 4)
            },
            "csgd_emos": {
                "rmse": round(rmse_emos, 2),
                "mae": round(mae_emos, 2),
                "bias": round(bias_emos, 2),
                "brier_score": round(brier_emos, 4),
                "relative_brier_improvement": round(bss, 4)
            },
            "ecc": {
                "rmse": round(rmse_ecc, 2),
                "mae": round(mae_ecc, 2),
                "bias": round(bias_ecc, 2)
            }
        },
        "csgd_parameters": {
            "active_monsoon": [round(float(p), 4) for p in params_active],
            "break_monsoon": [round(float(p), 4) for p in params_break]
        },
        "scientific_limitations": [
            "7-Cycle June 2004 Chronological Pilot with 2 independent temporal test cycles",
            "Spatial grid records (~14,892 test points) are spatially correlated and not independent cases",
            "CSGD parameters are globally pooled across all grid points in this pilot phase",
            "Regime conditioning uses rainfall-derived transition rather than independent synoptic fields",
            "Pilot does not claim nationwide operational skill or authority"
        ]
    }
    
    with open('data/processed/verification_summary.json', 'w') as f:
        json.dump(verification_metrics, f, indent=2)
    print("Saved verification summary: data/processed/verification_summary.json")

    print("=== PILOT DATASET GENERATION FINISHED SUCCESSFULLY ===")

if __name__ == '__main__':
    run_complete_data_generation()
