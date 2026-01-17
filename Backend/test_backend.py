from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "ArthikSetu AI Backend is Running"}

def test_parse_sms():
    payload = {
        "messages": [
            "Rs 1,200 credited to your a/c XX1234 on 12-Jan-24 by ZOMATO PAYOUT.",
            "Paid Rs 500 at Petrol Pump using UPI.",
            "Rs 450 debited for SWIGGY order #1234."
        ]
    }
    response = client.post("/api/parse_sms", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Zomato (1200 Credit) and Swiggy (450 Debit) are kept. UPI is ignored.
    assert data["summary"]["total_credit"] == 1200
    assert data["summary"]["total_debit"] == 450 
    
    # Check transactions
    txs = data["transactions"]
    assert len(txs) == 2
    assert txs[0]["merchant"] == "Zomato"
    assert txs[0]["type"] == "credit"
    
    assert txs[1]["merchant"] == "Swiggy"
    assert txs[1]["type"] == "debit"

def test_recommend_schemes():
    # Profile eligible for PM-SVANidhi (Vendor, <3L income)
    profile = {
        "age": 30,
        "income": 150000,
        "occupation": "street vendor",
        "category": "General"
    }
    response = client.post("/api/recommend_schemes", json=profile)
    assert response.status_code == 200
    data = response.json()
    schemes = data["schemes"]
    
    # Check if PM-SVANidhi is recommended
    svanidhi = next((s for s in schemes if s["name"] == "PM-SVANidhi"), None)
    assert svanidhi is not None
    assert svanidhi["status"] == "eligible"

def test_recommend_schemes_ineligible():
    # Profile ineligible for PM-SVANidhi (Income too high)
    profile = {
        "age": 30,
        "income": 500000,
        "occupation": "street vendor",
        "category": "General"
    }
    response = client.post("/api/recommend_schemes", json=profile)
    assert response.status_code == 200
    data = response.json()
    schemes = data["schemes"]
    
    # Check if PM-SVANidhi is NOT recommended (or filtered out)
    # The current logic returns only eligible ones.
    svanidhi = next((s for s in schemes if s["name"] == "PM-SVANidhi"), None)
    assert svanidhi is None

if __name__ == "__main__":
    try:
        test_read_root()
        test_parse_sms()
        test_recommend_schemes()
        test_recommend_schemes_ineligible()
        print("All Backend Tests Passed Successfully!")
    except AssertionError as e:
        print(f"Backend Test Failed: {e}")
        exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        exit(1)
