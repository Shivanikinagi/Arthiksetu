import urllib.request
req = urllib.request.Request("http://localhost:8000/api/predict_risk", data=b"""{"data":[{"date":"2026-03","amount":14500}]}""", headers={"Content-Type": "application/json"})
import urllib.error
try: urllib.request.urlopen(req)
except urllib.error.HTTPError as e: print(e.read().decode())
