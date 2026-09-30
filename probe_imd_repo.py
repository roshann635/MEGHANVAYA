import requests

url = f'https://api.github.com/repos/vidurmithal/imd_data/contents/data/rain/netcdf'
r = requests.get(url)
if r.status_code == 200:
    for item in r.json():
        if item['name'].endswith('.nc'):
            print(item['name'], item.get('download_url', 'None'))
else:
    print('Failed:', r.status_code)
