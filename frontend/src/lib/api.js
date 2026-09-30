export const API_URL = "http://localhost:8000/api/v1";

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
  
  if (!res.ok) {
    throw new Error("Invalid credentials");
  }
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchForecastSummary(token) {
    const res = await fetch(`${API_URL}/forecasts/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch summary");
    return res.json();
}

export async function fetchCycleData(token, validTime) {
    const res = await fetch(`${API_URL}/forecasts/cycle/${validTime}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch cycle data");
    return res.json();
}

export async function fetchVerification(token) {
    const res = await fetch(`${API_URL}/forecasts/verification`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch verification");
    return res.json();
}
