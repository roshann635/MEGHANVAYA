import numpy as np

class RegimeConditionedEMOS:
    def __init__(self):
        self.regimes = ['Active Monsoon', 'Break Monsoon', 'Depression', 'Western Disturbance', 'Coastal', 'Orographic', 'Inland']
        # MOCK EXPERTS
        self.experts = {r: lambda f: np.random.normal(10, 5, size=23) for r in self.regimes}
        
    def predict_distribution(self, features, soft_regime_weights, pop_prob):
        # Generates a calibrated marginal predictive distribution (CSGD)
        # using the Mixture of Experts weighted by soft_regime_weights
        
        # MOCK IMPLEMENTATION
        # For each of the 23 NEPS-G members
        base_distribution = np.random.lognormal(mean=2, sigma=1, size=23)
        
        # Apply hurdle logic: if very low PoP, distribution is zero-inflated
        if pop_prob < 0.1:
            base_distribution = np.zeros(23)
            
        return {
            'calibrated_members': base_distribution,
            'median': float(np.median(base_distribution)),
            'p90': float(np.percentile(base_distribution, 90)),
            'p95': float(np.percentile(base_distribution, 95))
        }
