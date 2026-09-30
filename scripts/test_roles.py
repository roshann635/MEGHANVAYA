import urllib.request, urllib.parse, json

roles = [
    ('admin@meghanvaya.in', 'ADMIN'),
    ('analyst@meghanvaya.in', 'METEOROLOGIST'),
    ('officer@meghanvaya.in', 'GOVT_OFFICER'),
    ('user@meghanvaya.in', 'GENERAL_USER')
]

for email, expected_role in roles:
    data = urllib.parse.urlencode({'username': email, 'password': 'demo123'}).encode()
    req = urllib.request.Request('http://localhost:8000/api/v1/auth/login', data=data)
    with urllib.request.urlopen(req) as resp:
        token = json.loads(resp.read().decode())['access_token']
    
    req_me = urllib.request.Request('http://localhost:8000/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})
    with urllib.request.urlopen(req_me) as resp:
        me = json.loads(resp.read().decode())
    
    print(f"Verified: {me['full_name']} | Role: {me['role']} | Email: {me['email']}")
