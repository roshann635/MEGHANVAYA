export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const authHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function fetchForecastSummary(token) {
  const res = await fetch(`${API_URL}/forecasts/summary`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchCycleData(token, validTime, downsample = 1) {
  const res = await fetch(`${API_URL}/forecasts/cycle/${validTime}?downsample=${downsample}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch cycle data");
  return res.json();
}

export async function fetchEnsembleData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/ensemble/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch ensemble data");
  return res.json();
}

export async function fetchRegimesData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/regimes/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch regimes data");
  return res.json();
}

export async function fetchPopData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/pop/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch PoP data");
  return res.json();
}

export async function fetchUncertaintyData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/uncertainty/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch uncertainty data");
  return res.json();
}

export async function fetchHeavyRainData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/heavy-rain/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch heavy rainfall data");
  return res.json();
}

export async function fetchEccData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/ecc/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch ECC data");
  return res.json();
}

export async function fetchStatesData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/states/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch states data");
  return res.json();
}

export async function fetchDistrictsData(token, validTime, state = "ALL") {
  const res = await fetch(`${API_URL}/forecasts/districts/${validTime}?state=${encodeURIComponent(state)}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch districts data");
  return res.json();
}

export async function fetchDistrictProfile(token, validTime, districtName) {
  const res = await fetch(`${API_URL}/forecasts/districts/${validTime}/${encodeURIComponent(districtName)}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch district profile");
  return res.json();
}

export async function fetchVerification(token) {
  const res = await fetch(`${API_URL}/forecasts/verification`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch verification");
  return res.json();
}

export async function fetchReliabilityData(token) {
  const res = await fetch(`${API_URL}/forecasts/reliability`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch reliability curve");
  return res.json();
}

export async function fetchEventsData(token) {
  const res = await fetch(`${API_URL}/forecasts/events`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchExplainabilityData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/explainability/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch explainability");
  return res.json();
}

export async function fetchProvenanceData(token, validTime) {
  const res = await fetch(`${API_URL}/forecasts/provenance/${validTime}`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch provenance");
  return res.json();
}

export async function fetchDataQuality(token) {
  const res = await fetch(`${API_URL}/forecasts/data-quality`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch data quality");
  return res.json();
}

export async function fetchModelHealth(token) {
  const res = await fetch(`${API_URL}/forecasts/model-health`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch model health");
  return res.json();
}

export async function fetchPipelineData(token) {
  const res = await fetch(`${API_URL}/forecasts/pipeline`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch pipeline data");
  return res.json();
}

export async function fetchReportsCatalog(token) {
  const res = await fetch(`${API_URL}/forecasts/reports`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function fetchSystemHealth(token) {
  const res = await fetch(`${API_URL}/forecasts/system-health`, {
    headers: authHeaders(token)
  });
  if (!res.ok) throw new Error("Failed to fetch system health");
  return res.json();
}
