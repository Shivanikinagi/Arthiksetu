from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sms_parser import SMSParser
from schemes import get_eligible_schemes, SCHEMES_DB
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ArthikSetu AI Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser = SMSParser()

class SMSRequest(BaseModel):
    messages: List[str]

class UserProfile(BaseModel):
    age: int
    income: float
    occupation: str
    category: Optional[str] = None # e.g., "General", "SC", "ST", "Women"

@app.get("/")
def read_root():
    return {"message": "ArthikSetu AI Backend is Running"}

@app.post("/api/parse_sms")
def parse_sms_endpoint(request: SMSRequest):
    """
    Parses a list of SMS strings to extract transaction data.
    """
    try:
        results = parser.parse_batch(request.messages)
        # Calculate summary
        total_credit = sum(r['amount'] for r in results if r['type'] == 'credit')
        total_debit = sum(r['amount'] for r in results if r['type'] == 'debit')
        
        return {
            "transactions": results,
            "summary": {
                "total_credit": total_credit,
                "total_debit": total_debit,
                "count": len(results)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend_schemes")
def recommend_schemes_endpoint(profile: UserProfile):
    """
    Recommends schemes based on user profile.
    """
    try:
        recommendations = get_eligible_schemes(profile.dict())
        return {"schemes": recommendations, "count": len(recommendations)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/all_schemes")
def get_all_schemes():
    return {"schemes": SCHEMES_DB}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
