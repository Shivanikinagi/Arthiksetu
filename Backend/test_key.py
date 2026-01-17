
import google.generativeai as genai
import os

key = "AIzaSyBzVZtrEryFJ2tntrymz_PBXE_osReq6vo"
genai.configure(api_key=key)
model = genai.GenerativeModel('gemini-2.5-flash')

print(f"Testing key: {key[:10]}...")
try:
    response = model.generate_content("Hello")
    print("SUCCESS! Response:", response.text)
except Exception as e:
    print("FAILURE")
    print(str(e))
