class AdaptiveTrustEngine:
    def __init__(self):
        pass
        
    def evaluate(self, calibrated_ensemble_median, raw_ensemble_median, regime_conf, data_quality, ood_score, historical_skill):
        # Calculates trust factor alpha based on multiple evidence inputs
        alpha = 1.0
        
        if ood_score > 0.8 or data_quality < 0.5:
            alpha = 0.0 # NWP Fallback
        elif regime_conf < 0.6 or historical_skill < 0.4:
            alpha = 0.5 # Blend
            
        final_forecast = (alpha * calibrated_ensemble_median) + ((1 - alpha) * raw_ensemble_median)
        
        return {
            'selected_model': 'Adaptive Blend' if 0 < alpha < 1 else ('Calibrated AI' if alpha == 1 else 'Raw NEPS-G'),
            'trust_weight': alpha,
            'final_forecast': final_forecast,
            'nwp_fallback': alpha == 0.0
        }
