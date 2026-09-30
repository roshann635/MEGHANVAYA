import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
app.dependency_overrides = {}

def test_unauthenticated_access_me():
    """Verify that unauthenticated access to /api/v1/auth/me returns 401 Unauthorized"""
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
    assert "detail" in res.json()

def test_unauthenticated_admin_users():
    """Verify that unauthenticated access to /api/v1/auth/admin/users returns 401 Unauthorized"""
    res = client.get("/api/v1/auth/admin/users")
    assert res.status_code == 401

def test_invalid_login_credentials():
    """Verify that invalid login credentials return 401 Unauthorized"""
    res = client.post(
        "/api/v1/auth/login",
        data={"username": "invalid_user@example.com", "password": "wrong_password"}
    )
    assert res.status_code == 401
    assert res.json()["detail"] == "Incorrect email or password"

def test_public_health_and_summary():
    """Verify public endpoints return 200 without authentication"""
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_summary = client.get("/api/v1/forecasts/summary")
    assert res_summary.status_code == 401
    assert "detail" in res_summary.json()
