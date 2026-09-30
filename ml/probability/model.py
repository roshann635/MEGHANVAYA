class ProbabilityModel:
    def predict(self, corrected_rainfall):
        return {
            'p_64_5': min(1.0, corrected_rainfall / 64.5 * 0.8),
            'p_115_6': min(1.0, corrected_rainfall / 115.6 * 0.5),
            'p_204_5': min(1.0, corrected_rainfall / 204.5 * 0.2)
        }
