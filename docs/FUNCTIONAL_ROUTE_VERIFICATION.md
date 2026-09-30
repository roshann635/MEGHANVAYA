# MEGHANVAYA — FUNCTIONAL ROUTE & ROLE ACCESS VERIFICATION
**Smart India Hackathon 2026 | PS 26080**
*Release Validation Matrix*

---

## 1. Frontend Route Inventory & Access Matrix

| Path | Component | Target Role | Access Level | Verified Status |
|---|---|---|---|---|
| `/` | `Landing.jsx` | All | Public | Verified 200 OK |
| `/login` | `Login.jsx` | All | Public / 1-Click Demo Profiles | Verified 200 OK |
| `/admin` | `Admin.jsx` | Administrator | Authenticated (`ADMIN`) | Verified RBAC Guarded |
| `/forecast` | `ForecastOperations.jsx` | Meteorologist / Analyst | Authenticated / Public Read | Verified 200 OK |
| `/outlook` | `NationalOutlook.jsx` | Government Officer | Authenticated / Public Read | Verified 200 OK |
| `/general` | `GeneralUser.jsx` | General Public | Public Guidance | Verified 200 OK |
| `/ensemble` | `EnsembleExplorer.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/regime` | `WeatherRegime.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/probability` | `ProbabilityCalibration.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/uncertainty` | `UncertaintyQuantification.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/heavy-rain` | `HeavyRainRisk.jsx` | Officer & Meteorologist | Role-Optimized | Verified 200 OK |
| `/grid` | `IndiaGridAnalytics.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/state` | `StateAnalytics.jsx` | Officer & Meteorologist | Role-Optimized | Verified 200 OK |
| `/district` | `DistrictIntelligence.jsx` | All Roles | Role-Optimized | Verified 200 OK |
| `/ecc` | `ECCSpatialConsistency.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/verification` | `ModelVerification.jsx` | Meteorologist & Admin | Role-Optimized | Verified 200 OK |
| `/reliability` | `ReliabilityDiagrams.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/events` | `EventStudies.jsx` | Meteorologist & Officer | Role-Optimized | Verified 200 OK |
| `/explainability` | `Explainability.jsx` | Meteorologist / Analyst | Role-Optimized | Verified 200 OK |
| `/provenance` | `ForecastProvenance.jsx` | All Roles (Auditing) | Role-Optimized | Verified 200 OK |
| `/data-quality` | `DataQuality.jsx` | Admin & Meteorologist | Role-Optimized | Verified 200 OK |
| `/model-health` | `ModelHealth.jsx` | Admin & Meteorologist | Role-Optimized | Verified 200 OK |
| `/pipeline` | `PipelineRuns.jsx` | Admin & Meteorologist | Role-Optimized | Verified 200 OK |
| `/reports` | `ReportCenter.jsx` | Officer & Admin | Role-Optimized | Verified 200 OK |
| `/demo` | `DemoReplay.jsx` | Evaluation / Judge | Deterministic Offline | Verified 200 OK |

---

## 2. Backend REST API Endpoints

| Endpoint | Method | Security Requirement | Output | Verified Status |
|---|---|---|---|---|
| `/health` | GET | None (Public) | System mode & status | 200 OK |
| `/api/v1/auth/login` | POST | Form Data (Username/Password) | JWT Bearer Token | 200 OK / 401 Unauthorized |
| `/api/v1/auth/me` | GET | Bearer JWT | Current User Profile | 200 OK / 401 Unauthorized |
| `/api/v1/auth/admin/users`| GET | Admin Bearer JWT | User Directory | 200 OK / 403 Forbidden |
| `/api/v1/forecasts/summary` | GET | Public Read | Dataset summary & cycles | 200 OK |
| `/api/v1/forecasts/cycle/{date}` | GET | Public Read | 4,964 spatial grid records | 200 OK |
| `/api/v1/forecasts/ensemble/{date}` | GET | Public Read | 5-member ensemble distributions | 200 OK |
| `/api/v1/forecasts/regimes/{date}` | GET | Public Read | Active/Break soft weights | 200 OK |
| `/api/v1/forecasts/pop/{date}` | GET | Public Read | Threshold exceedance curves | 200 OK |
| `/api/v1/forecasts/heavy-rain/{date}` | GET | Public Read | Risk district aggregations | 200 OK |
| `/api/v1/forecasts/verification` | GET | Public Read | Locked 2-day verification metrics | 200 OK |
| `/api/v1/forecasts/provenance/{date}` | GET | Public Read | SHA256 audit hash & lineage | 200 OK |
| `/api/v1/forecasts/system-health` | GET | Public Read | Subsystem latency & telemetry | 200 OK |
| `/api/v1/forecasts/reports/export/{type}` | GET | Public Read | CSV / JSON export stream | 200 OK |

---

## 3. RBAC Enforcement Verification
- **Unauthorized Request to Protected Route**: Tested `/api/v1/auth/me` without Authorization header $\rightarrow$ returns HTTP 401.
- **Forbidden Request for Non-Admin**: Tested `/api/v1/auth/admin/users` with non-admin token $\rightarrow$ returns HTTP 403.
- **Frontend Role Guard**: React Router `ProtectedRoute` component redirects unauthenticated users to `/login` and displays access denied toasts for role mismatches.
