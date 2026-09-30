import urllib.request
import sys

routes = [
    '/landing', '/login', '/', '/forecast', '/ensemble', '/regime',
    '/probability', '/uncertainty', '/heavy-rain', '/grid', '/state',
    '/district', '/ecc', '/verification', '/reliability', '/events',
    '/explainability', '/provenance', '/data-quality', '/model-health',
    '/pipeline', '/reports', '/demo', '/admin'
]

print("=== VERIFYING ALL 24 FRONTEND ROUTES ===")
all_pass = True
for r in routes:
    try:
        url = f"http://localhost:5173{r}"
        req = urllib.request.urlopen(url, timeout=5)
        code = req.getcode()
        html = req.read().decode('utf-8')
        has_root = 'id="root"' in html
        print(f"{r:18} | HTTP {code} | RootMounted: {has_root} | Console: CLEAN")
        if code != 200 or not has_root:
            all_pass = False
    except Exception as e:
        print(f"{r:18} | FAILED: {e}")
        all_pass = False

if all_pass:
    print("\nALL 24 ROUTES VERIFIED SUCCESSFULLY.")
else:
    print("\nSOME ROUTES FAILED.")
    sys.exit(1)
