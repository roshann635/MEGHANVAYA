# TEMPORAL LEAKAGE AUDIT

## Protocol Definition
- **Train Window**: Valid dates up to 2004-06-04
- **Validation Window**: Valid date 2004-06-05
- **Locked Test Window**: Valid dates 2004-06-06 to 2004-06-07

## Audit Checks

| Check | Status | Justification |
| :--- | :--- | :--- |
| Future observations in inference? | **PASS** | Train partition explicitly hard-clipped at 2004-06-04. |
| Future derived regime labels? | **PASS** | Regimes derived purely from NWP `ensemble_mean` at forecast issue time. |
| Climatology fitted on test data? | **PASS** | CSGD parameter mapping strictly fitted entirely on Train data (`train_active`, `train_break`). |
| Target rainfall in inference? | **PASS** | `y_test` strictly separated and only invoked in metric verification functions. |
| EMOS parameters tuned on test set? | **PASS** | L-BFGS-B optimization ran solely on `train` subset. |
| Probability calibration mapped on test? | **PASS** | Not applicable; true probabilistic distributions (CSGD CDF) inherently calibrated to Train. |
| Random shuffling across time? | **PASS** | Strict chronological slicing used. Test blocks are unbroken temporal contiguous arrays. |
