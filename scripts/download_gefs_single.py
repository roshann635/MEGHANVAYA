import boto3
from botocore import UNSIGNED
from botocore.config import Config
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_gefs_single():
    logging.info("Starting GEFS Single File Download for Real-Data Pilot Pairing (2004060100/c00)")
    
    bucket_name = 'noaa-gefs-retrospective'
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    
    target_dir = 'data/raw/gefs/2004'
    os.makedirs(target_dir, exist_ok=True)
    
    # 2004-06-01 00Z cycle, control member (c00), days 1-10
    year = "2004"
    prefix = f"GEFSv12/reforecast/{year}/2004060100/c00/Days:1-10/"
    
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    contents = response.get('Contents', [])
    
    downloaded = False
    for obj in contents:
        key = obj['Key']
        if "apcp_sfc" in key and not key.endswith(".idx"):
            local_path = os.path.join(target_dir, os.path.basename(key))
            if not os.path.exists(local_path):
                logging.info(f"Downloading REAL GEFS file {key} -> {local_path} (Size: {obj['Size'] / 1024 / 1024:.2f} MB)")
                s3.download_file(bucket_name, key, local_path)
                logging.info("Successfully downloaded REAL GEFS GRIB2 file.")
            else:
                logging.info(f"File {local_path} already exists.")
            downloaded = True
            break
            
    if not downloaded:
        logging.error("Failed to find apcp_sfc file in the prefix.")

if __name__ == "__main__":
    download_gefs_single()
