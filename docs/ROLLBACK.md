# ROLLBACK PROCEDURE
**MEGHANVAYA — Problem Statement 26080**  
**Audit Date:** September 30, 2026  

---

## 1. Rollback Triggers
- Uncalibrated / broken CSGD link parameter convergence ($NLL > 2.0$ or $\sigma^2 \le 0$).
- Data pipeline truncation (total grid records $< 4,964$ cells/cycle).
- API latency exceeding statutory thresholds ($> 30\text{ seconds}$).

## 2. Emergency Fallback Sequence
1. **Fallback to Raw NWP Ensemble Mode:**
   - If statistical post-processing parameters fail to converge, the platform dynamically serves raw GEFSv12 5-member physics averages with an operational alert: `POST-PROCESSING UNAVAILABLE — RAW NWP DISPLAYED`.
2. **Database Reversion:**
   - In SQLite fallback mode, copy `data/backups/meghanvaya_golden.db` to active runtime.
3. **Container Rollback:**
   - Revert container tag to `meghanvaya:v1.0.0-pilot-stable` via deployment orchestration.
