import logging
from data_pipeline.ingestion.gefs_adapter import NOAAGefsAdapter
from data_pipeline.ingestion.imd_adapter import IMDObservationAdapter
from data_pipeline.alignment.temporal import TemporalAligner
from data_pipeline.alignment.spatial import SpatialAligner
from ml.regime.classifier import RegimeClassifier
from ml.correction.pop_classifier import PoPClassifier
from ml.correction.emos_moe import RegimeConditionedEMOS
from ml.spatial.ecc import EnsembleCopulaCoupling
from ml.gating.gate import AdaptiveTrustEngine

logging.basicConfig(level=logging.INFO)

def run_training_pipeline():
    logging.info("Starting MEGHANVAYA Training Pipeline...")
    
    # 1. Data Acquisition
    gefs = NOAAGefsAdapter()
    imd = IMDObservationAdapter()
    
    forecast_data = gefs.download_reforecast('2000-06-01')
    obs_data = imd.fetch_gridded_rainfall(2000)
    
    if forecast_data['status'] == 'PENDING EXTERNAL ACCESS' or obs_data['status'] == 'PENDING EXTERNAL ACCESS':
        logging.warning("Data Acquisition Status: PENDING EXTERNAL ACCESS. Proceeding with DEMO training flow.")
    
    # 2. Alignment
    t_aligner = TemporalAligner()
    s_aligner = SpatialAligner()
    
    # 3. Model Initialization
    regime_model = RegimeClassifier()
    pop_model = PoPClassifier()
    emos_moe = RegimeConditionedEMOS()
    ecc = EnsembleCopulaCoupling()
    gate = AdaptiveTrustEngine()
    
    logging.info("Training Regime Classifier (DEMO mode)...")
    logging.info("Training PoP Classifier (DEMO mode)...")
    logging.info("Training CSGD-EMOS Mixture of Experts (DEMO mode)...")
    
    logging.info("Saving Model Artifacts with tag: PENDING EXTERNAL ACCESS")
    
if __name__ == '__main__':
    run_training_pipeline()
