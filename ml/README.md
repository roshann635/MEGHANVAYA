# ML Scaffold Directory

**IMPORTANT NOTE:**
The files in this directory (`ml/`) are **SCAFFOLD ONLY** and are **NOT USED** in the current runtime pipeline. 

The current live pilot implementation relies exclusively on the CSGD-EMOS (Censored Shifted Gamma) post-processing engine and Ensemble Copula Coupling (ECC) implemented in the `scripts/` directory, specifically:
- `scripts/true_emos_pipeline.py`
- `scripts/build_pilot_database.py`

The mock XGBoost classifiers, regressors, and adaptive gating logic found in this directory represent the target production architecture but are currently populated with `np.random` placeholders. They do not execute during API requests.
