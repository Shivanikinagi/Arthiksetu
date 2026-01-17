import requests
import json

# Define a sample user profile (Gig Worker)
user_profile = {
    "age": 28,
    "income": 150000,          # 1.5 Lakhs (Eligible for many)
    "occupation": "street vendor", # Target for PM-SVANidhi
    "category": "General"
}

print(f"--- 1. Sending Profile to AI Backend ---")
print(json.dumps(user_profile, indent=2))

try:
    # Call the API
    response = requests.post('http://localhost:8000/api/recommend_schemes', json=user_profile)
    data = response.json()
    
    print(f"\n--- 2. AI Recommendation Result ---")
    print(f"Total Eligible Schemes: {data['count']}")
    
    print(f"\n--- 3. Recommended Schemes List ---")
    for scheme in data['schemes']:
        print(f"✅ {scheme['name']}")
        print(f"   Benefit: {scheme['benefit']}")
        print(f"   Reason: Matches Age {user_profile['age']} & Income < {scheme.get('criteria',{}).get('max_income', 'N/A')}")
        print("-" * 30)
        
except Exception as e:
    print(f"Error: Could not connect to backend. Is it running? {e}")
