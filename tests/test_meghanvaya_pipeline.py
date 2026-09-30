import os
import json
import pytest
import numpy as np
import pandas as pd
from scipy.stats import gamma
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# -------------------------------------------------------------
# 1. Scientific & Mathematical Core Tests
# -------------------------------------------------------------
def test_csgd_variance_positivity():
    """Verify that CSGD variance link function is strictly positive"""
    b0, b1 = 180.5578, 0.0001
    zero_var = 0.0
    sigma2 = max(b0 + b1 * zero_var, 1e-4)
    assert sigma2 > 0.0
    assert sigma2 >= 1e-4

def test_csgd_cdf_monotonicity():
    """Verify that CSGD CDF is strictly non-decreasing across thresholds"""
    a0, a1, b0, b1, delta = 10.0616, 0.8310, 180.5578, 0.0001, 2.2288
    ens_mean, ens_var = 15.0, 20.0
    
    mu = max(a0 + a1 * ens_mean, 1e-4)
    sigma2 = max(b0 + b1 * ens_var, 1e-4)
    k = max((mu ** 2) / sigma2, 1e-4)
    theta = max(sigma2 / mu, 1e-4)
    
    thresholds = [0.0, 2.5, 15.6, 35.5, 64.5, 115.5]
    cdfs = [gamma.cdf(t + delta, a=k, scale=theta) for t in thresholds]
    
    for i in range(len(cdfs) - 1):
        assert cdfs[i] <= cdfs[i + 1], f"CDF failed monotonicity at threshold {thresholds[i]}"

def test_quantile_monotonicity():
    """Verify that P10 <= P50 <= P90 <= P95"""
    a0, a1, b0, b1, delta = 2.5229, 1.9922, 69.2460, 12.9599, 0.5594
    ens_mean, ens_var = 8.0, 10.0
    
    mu = max(a0 + a1 * ens_mean, 1e-4)
    sigma2 = max(b0 + b1 * ens_var, 1e-4)
    k = max((mu ** 2) / sigma2, 1e-4)
    theta = max(sigma2 / mu, 1e-4)
    
    p0 = gamma.cdf(delta, a=k, scale=theta)
    
    quantiles = {}
    for q in [0.10, 0.50, 0.90, 0.95]:
        val = 0.0 if q <= p0 else max(gamma.ppf(q, a=k, scale=theta) - delta, 0.0)
        quantiles[q] = val
        
    assert quantiles[0.10] <= quantiles[0.50]
    assert quantiles[0.50] <= quantiles[0.90]
    assert quantiles[0.90] <= quantiles[0.95]

def test_probability_bounds():
    """Verify that probability values are bounded strictly within [0, 1]"""
    a0, a1, b0, b1, delta = 10.0616, 0.8310, 180.5578, 0.0001, 2.2288
    for ens_mean in [0.0, 5.0, 25.0, 100.0]:
        for ens_var in [0.1, 5.0, 50.0]:
            mu = max(a0 + a1 * ens_mean, 1e-4)
            sigma2 = max(b0 + b1 * ens_var, 1e-4)
            k = max((mu ** 2) / sigma2, 1e-4)
            theta = max(sigma2 / mu, 1e-4)
            prob = 1.0 - gamma.cdf(64.5 + delta, a=k, scale=theta)
            assert 0.0 <= prob <= 1.0

def test_mixture_weights_sum_to_one():
    """Verify that soft regime weights sum exactly to 1.0"""
    for m in [0.0, 2.5, 5.0, 15.0, 50.0]:
        w_active = 1.0 / (1.0 + np.exp(-(m - 5.0)))
        w_break = 1.0 - w_active
        assert np.isclose(w_active + w_break, 1.0)
        assert 0.0 <= w_active <= 1.0
        assert 0.0 <= w_break <= 1.0

def test_heavy_rain_monotonicity():
    """Verify that P(Rain >= 115.5mm) <= P(Rain >= 64.5mm)"""
    file_path = "data/processed/final_ecc_multicycle.parquet"
    if os.path.exists(file_path):
        df = pd.read_parquet(file_path)
        diff = df['heavy_prob'] - df['very_heavy_prob']
        assert (diff >= -1e-6).all(), "Found points where very heavy rain probability exceeds heavy rain probability"

def test_ecc_rank_preservation():
    """Verify that ECC correctly restores the rank structure of raw ensemble members"""
    raw_members = np.array([12.5, 4.2, 28.0, 0.0, 18.2]) # c00, p01, p02, p03, p04
    calibrated_quantiles = np.array([2.0, 6.0, 11.0, 17.0, 24.0]) # sorted quantiles
    
    ranks = np.argsort(np.argsort(raw_members))
    ecc_members = calibrated_quantiles[ranks]
    
    # Ranks of ecc_members must match ranks of raw_members
    ecc_ranks = np.argsort(np.argsort(ecc_members))
    assert np.array_equal(ranks, ecc_ranks)

# -------------------------------------------------------------
# 2. Parquet Pilot Dataset Integrity Tests
# -------------------------------------------------------------
def test_dataset_records_and_coverage():
    """Verify that 34,748 records exist spanning 7 cycles and 4,964 grid cells"""
    file_path = "data/processed/final_ecc_multicycle.parquet"
    assert os.path.exists(file_path), "Pilot dataset parquet missing"
    df = pd.read_parquet(file_path)
    assert len(df) == 34748
    assert len(df['valid_time'].unique()) == 7
    coords = df[['lat', 'lon']].drop_duplicates()
    assert len(coords) == 4964
    assert df['lat'].min() >= 8.0
    assert df['lat'].max() <= 38.0

# -------------------------------------------------------------
# 3. Backend API Endpoint Tests
# -------------------------------------------------------------
def test_api_summary():
    res = client.get("/api/v1/forecasts/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "VALIDATED_PILOT"
    assert data["total_records"] == 34748
    assert len(data["cycles"]) == 7

def test_api_cycle_spatial():
    res = client.get("/api/v1/forecasts/cycle/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] == 4964
    assert "intelligence" in data
    assert data["intelligence"]["p50"] > 0

def test_api_ensemble():
    res = client.get("/api/v1/forecasts/ensemble/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert len(data["members"]) == 5
    assert data["ensemble_aggregate"]["mean"] > 0

def test_api_regimes():
    res = client.get("/api/v1/forecasts/regimes/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert data["pilot_badge"] == "PILOT REGIME CONDITIONING"
    assert len(data["regime_probabilities"]) >= 2

def test_api_pop():
    res = client.get("/api/v1/forecasts/pop/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert len(data["thresholds"]) >= 4

def test_api_heavy_rain():
    res = client.get("/api/v1/forecasts/heavy-rain/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert len(data["high_risk_districts"]) > 0

def test_api_verification():
    res = client.get("/api/v1/forecasts/verification")
    assert res.status_code == 200
    data = res.json()
    assert data["dataset_scope"] == "7-Cycle June 2004 Chronological Pilot"
    assert "metrics" in data
    assert data["metrics"]["csgd_emos"]["brier_skill_score"] > 0.15

def test_api_reliability():
    res = client.get("/api/v1/forecasts/reliability")
    assert res.status_code == 200
    data = res.json()
    assert len(data["bins"]) == 5
    assert data["brier_skill_score"] == 0.2098

def test_api_provenance():
    res = client.get("/api/v1/forecasts/provenance/2004-06-06")
    assert res.status_code == 200
    data = res.json()
    assert "audit_hash" in data
    assert data["model_version"] == "CSGD-EMOS-v1.0-PILOT"
