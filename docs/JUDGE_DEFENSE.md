# JUDGE DEFENSE DIRECTORY

**Q1. What is the problem?**
Global Numerical Weather Prediction (NWP) models suffer from systematic dry biases and spatial errors over the Indian monsoon region due to unresolved sub-grid convective processes. 

**Q2. Why post-process NWP instead of replacing NWP?**
NWP perfectly solves the massive atmospheric physics equations across the globe. We use AI not to reinvent fluid dynamics, but to correct the residual statistical bias (EMOS) that the physics engine fails to capture locally.

**Q3. What is regime awareness?**
Precipitation distributions behave fundamentally differently during Active Monsoon phases vs. Break phases. A single global correction model smooths out extreme events. Regime-awareness explicitly fits different statistical parameters based on the meteorological state.

**Q4. Why soft regime probabilities?**
Atmospheric states exist on a continuous spectrum. Hard thresholds create unnatural discontinuities. Soft probabilities allow us to smoothly blend the Active and Break probability distributions.

**Q5. Why use CSGD-EMOS?**
Censored Shifted Gamma Distribution (CSGD) is mathematically tailored for precipitation. Rainfall is bounded at zero (left-censored) and highly skewed (Gamma). Standard Normal models fail because they predict negative rainfall and symmetric tails.

**Q6. What does the zero-inflated/censored formulation mean?**
Instead of clipping negative predictions, we use a continuous Gamma distribution shifted left by a parameter $\delta$. The exact area of the distribution that falls below zero mathematically equates to the probability of zero rainfall ($P=0$). 

**Q7. Why ensemble spread?**
Deterministic models only output one answer. By feeding the variance of the 5-member NWP ensemble into the CSGD variance link, our AI scales its uncertainty directly to the chaotic divergence of the actual atmosphere.

**Q8. Why ECC?**
Statistical post-processing destroys spatial correlations (treating every grid cell independently). Ensemble Copula Coupling (ECC) perfectly restores the raw spatial weather systems by imposing the raw NWP spatial rank structure back onto our AI-calibrated quantiles.

**Q9. Why heavy-rain probability instead of one rainfall number?**
A point forecast (e.g., 60mm) is useless for risk management. Knowing there is a 45% chance of exceeding 64.5mm empowers objective decision-making. 

**Q10. Why 64.5 / 115.6 / 204.5 mm?**
These are the official IMD intensity classifications (Heavy, Very Heavy, Extremely Heavy).

**Q11. How do you avoid leakage?**
Strict chronological splitting. The models were fitted purely on historical data (June 2-4) and tested out-of-sample on the future (June 6-7). 

**Q12. How is the test set constructed?**
It is a locked array of contiguous future forecast cycles. We never random-shuffle, which would fatally leak temporal persistence.

**Q13. How many independent test cases do you really have?**
Exactly 2 independent temporal forecast cases (June 6 and 7). Though there are ~14,800 spatial records, they are heavily correlated. 

**Q14. Why is the current 7-cycle experiment limited?**
It is a "Chronological Pilot" strictly constrained by offline compute/data caps. It perfectly proves the mathematical viability of the pipeline, but does not prove multi-year nationwide climatological robustness.

**Q15. Is the current regime classification scientifically independent?**
No. In the pilot, regimes were derived using the ensemble rainfall itself. Production requires independent synoptic classifiers (e.g., MSLP).

**Q16. What happens if the regime is uncertain?**
The soft mixture naturally falls back to an interpolated baseline state, preventing extreme divergence.

**Q17. What happens when NWP changes version?**
CSGD parameters are purely statistical mapping coefficients. The system can be entirely recalibrated natively to a new version's bias matrix simply by refitting.

**Q18. What happens when a model is uncertain or out-of-distribution?**
The Adaptive Trust module (pending deployment integration) acts as a governor, gently weighting the correction back towards the raw NWP ensemble mean.

**Q19. What is ECC actually doing?**
It is extracting calibrated quantiles from our AI distribution and dropping them into the exact spatial footprint predicted by the physics model. It acts as a Copula (dependence structure) without altering the marginal calibration.

**Q20. How are probabilities verified?**
Brier Score (mean squared error of probability vs outcome) and Reliability diagrams.

**Q21. What is FSS?**
Fractions Skill Score evaluates spatial forecasts. It acknowledges that missing a heavy rain band by 10km is still a very good forecast, avoiding the "double penalty" of exact point matching.

**Q22. Why not judge rainfall only cell-by-cell?**
Because small spatial displacements in convective cells destroy traditional grid-point metrics (RMSE), even if the meteorological system was perfectly forecast.

**Q23. What is the role of district aggregation?**
Administrative action happens at the district level. We use PostGIS geospatial intersection to natively aggregate the probabilistic grid up to actionable administrative polygons.

**Q24. What is your fallback if post-processing fails?**
The system gracefully degrades, presenting raw NWP output. We never synthesize data or fail silently.

**Q25. Is this an official IMD forecast?**
No. This is a decision-support research prototype.

**Q26. Is this an official warning system?**
No. Official warnings remain exclusively with authorized meteorological agencies.

**Q27. What is actually validated today?**
The mathematical rigor and out-of-sample functionality of the CSGD-EMOS, ECC, and spatial aggregation pipelines, scoped strictly to the pilot period.

**Q28. What must happen before operational deployment?**
Ingestion of 20 years of monsoon reforecasts, full 7-regime independent synoptic classification, spatial parameter stratification, and deployment on the NCMRWF computing cluster.

**Q29. What is the biggest current limitation?**
Global pooling. One set of CSGD parameters treats the Himalayas and the Thar desert identically. Production must stratify parameters by climatological zone.

**Q30. How would you scale from the pilot to production?**
Transition from a local data manifest to direct AWS/S3 parquet ingestion, deploy the inference pipeline dynamically to Kubernetes, and train explicitly isolated zone-based CSGD models.
