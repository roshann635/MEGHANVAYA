import os
import requests
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def download_imd_pilot():
    logging.info("Starting Targeted IMD Data Acquisition (Pilot: 2004, JJAS)")
    
    target_dir = 'data/raw/imd/2004'
    os.makedirs(target_dir, exist_ok=True)
    
    # We will use the secondary public mirror as instructed
    # https://github.com/vidurmithal/imd_data
    year = 2004
    url = f"https://raw.githubusercontent.com/vidurmithal/imd_data/main/data/rain/netcdf/rainfall_{year}.nc"
    local_path = os.path.join(target_dir, f"rainfall_{year}.nc")
    
    if not os.path.exists(local_path):
        logging.info(f"Downloading IMD NetCDF from mirror: {url}")
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(local_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            logging.info(f"Successfully downloaded {local_path}")
        else:
            logging.error(f"Failed to download. Status code: {response.status_code}")
            raise Exception("Download failed")
    else:
        logging.info(f"File {local_path} already exists. Skipping download.")

if __name__ == "__main__":
    download_imd_pilot()
