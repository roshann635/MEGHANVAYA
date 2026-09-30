# MEGHANVAYA — Judge Defense & Scientific Disclosures

This document provides direct answers to questions that may be raised by domain experts or software architecture judges during the SIH 2026 Evaluation.

## 1. Core Problem & Concept

**What problem does MEGHANVAYA solve?**
Raw Numerical Weather Prediction (NWP) models (like GEFS or NCMRWF) often exhibit systematic biases and poor calibration for extreme monsoon rainfall over the complex Indian terrain. MEGHANVAYA provides a purely statistical post-processing layer that corrects these biases, quantifies uncertainty probabilistically, and generates risk estimates conditioned on large-scale weather regimes.

**Why NWP post-processing? Why not replace NWP with pure AI?**
Physics-based NWP models correctly capture large-scale atmospheric dynamics. Pure AI models (like traditional Deep Learning) often struggle to extrapolate unseen extremes without physics constraints. By post-processing NWP outputs using CSGD-EMOS (Ensemble Model Output Statistics), we combine the physics-based predictability of NWP with the bias-correction strength of statistical ML.

**What is a weather regime? Why soft regime probabilities?**
A weather regime is a recurring large-scale atmospheric pattern (e.g., Active Monsoon vs Break Monsoon). Monsoon rainfall statistics change drastically depending on the regime. We use a probabilistic Mixture-of-Experts approach because the atmosphere rarely sits perfectly in one discrete regime; "soft" probabilities smoothly interpolate corrections across transitional states.

## 2. Methodology

**Why CSGD (Censored Shifted Gamma Distribution)?**
Rainfall has a point mass at zero (it often doesn't rain) and is highly skewed when it does rain. A standard Normal distribution fails because it predicts negative rainfall. A Censored Shifted Gamma elegantly handles both the zero-inflation (via left-censoring) and the heavy right-tail skewness of intense monsoon bursts.

**Why ensemble spread?**
Deterministic forecasts (a single line) cannot convey confidence. Using the 5-member ensemble variance as a predictor in the EMOS scale parameter allows the model to output a wider predictive distribution when the atmosphere is highly chaotic.

**What is ECC (Ensemble Copula Coupling)?**
EMOS calibrates rainfall probability independently at every grid cell, destroying the spatial correlation (the "shape" of the storm). ECC extracts the original spatial rank structure from the raw NWP ensemble and applies it to the calibrated EMOS margins, restoring spatial and temporal coherence.

**How is heavy rainfall probability calculated?**
It is not derived by taking a single median forecast and thresholding it. Instead, we integrate the analytical PDF of the fitted CSGD distribution from 64.5mm to infinity: $P(Y \ge 64.5) = 1 - F_{CSGD}(64.5)$. This provides true mathematically robust risk quantification.

## 3. Scientific Integrity & Limitations (Pilot Status)

**How many independent test cases are validated? Why only 2?**
The current evaluation is restricted to the **"7-Cycle June 2004 Chronological Pilot"**. We used 5 days for training and exactly 2 independent days (June 6–7) for the locked test. This extremely limited temporal sample was strictly to prove the *mathematical pipeline architecture*, not to claim nationwide climatological reliability.

**How is leakage prevented?**
The pipeline explicitly enforces chronological splitting. The CSGD parameters applied to the June 6–7 predictions were optimized exclusively on data from June 2–4. No future observations or overlapping temporal distributions were used during parameter estimation.

**Why is the regime pilot not fully independent?**
*CRITICAL SCIENTIFIC DISCLOSURE:* In this specific pilot, the regime labels were partially derived using the same rainfall statistics targeted by the model. This represents a circularity risk. For full production deployment, the regime classifier must be driven entirely by independent synoptic inputs (e.g., U850/V850 winds, OLR) to ensure generalization.

**Why are parameters globally pooled?**
Due to the tiny 7-day pilot window, calculating independent CSGD parameters for each of the 14,892 grid cells is statistically unidentifiable. Parameters were globally pooled across India to stabilize the optimization. Production systems will use localized or regionalized parameterization across multi-year NCMRWF training archives.

## 4. Operational Fallbacks

**What happens when the model is uncertain?**
The interface will show a very large gap between the $P50$ (Median) and $P90$ (90th Percentile Risk), signaling to the Government Officer that the forecast is highly volatile.

**What happens if the post-processor fails?**
The backend architecture falls back to safely returning the Raw NWP Mean. The frontend UI will explicitly flag the state as "Uncalibrated Baseline" to prevent dangerous misinterpretations.

**Is this an official warning?**
**No.** This is a research / decision-support prototype. It does not replace IMD's official color-coded warnings. It is designed to empower analysts with better probabilistic tools.
