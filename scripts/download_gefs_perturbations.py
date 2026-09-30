import boto3
from botocore import UNSIGNED
from botocore.config import Config
import logging
import os
import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_gefs_perturbations():
    logging.info("Starting GEFS 5-Member Download (c00 + p01-p04, 2004-06-01 to 2004-06-07)")
    
    bucket_name = 'noaa-gefs-retrospective'
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    
    target_dir = 'data/raw/gefs/2004'
    os.makedirs(target_dir, exist_ok=True)
    
    start_date = datetime.date(2004, 6, 1)
    members = ['c00', 'p01', 'p02', 'p03', 'p04']
    
    for i in range(7): 
        current_date = start_date + datetime.timedelta(days=i)
        date_str = current_date.strftime("%Y%m%d")
        
        for member in members:
            prefix = f"GEFSv12/reforecast/2004/{date_str}00/{member}/Days:1-10/"
            
            try:
                response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
                contents = response.get('Contents', [])
                
                for obj in contents:
                    key = obj['Key']
                    if "apcp_sfc" in key and not key.endswith(".idx"):
                        local_path = os.path.join(target_dir, os.path.basename(key))
                        if not os.path.exists(local_path):
                            logging.info(f"Downloading {member} for {date_str} -> {local_path}")
                            s3.download_file(bucket_name, key, local_path)
                        break
            except Exception as e:
                logging.error(f"Failed to fetch {date_str} {member}: {e}")

if __name__ == "__main__":
    download_gefs_perturbations()
