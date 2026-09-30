import xgboost as xgb
import numpy as np

class PoPClassifier:
    def __init__(self):
        self.model = xgb.XGBClassifier(objective='binary:logistic')
        
    def predict_prob(self, features):
        # MOCK IMPLEMENTATION
        # In reality, this would evaluate P(rain > 0)
        p_rain = float(np.random.rand())
        return p_rain
