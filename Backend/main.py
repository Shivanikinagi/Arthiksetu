from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional
from sms_parser import SMSParser
from schemes import get_eligible_schemes, SCHEMES_DB
from fastapi.middleware.cors import CORSMiddleware
import asyncio

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

@app.post("/api/verify_document")
async def verify_document(file: UploadFile = File(...), doc_type: str = Form(...)):
    """
    Simulates AI verification of uploaded documents.
    """
    try:
        # Simulate processing delay
        await asyncio.sleep(2)
        
        # In a real app, we would:
        # 1. Save the file temporarily
        # 2. Run OCR/Extraction (using Tesseract or Gemini Vision)
        # 3. Validate extracted data against expected patterns
        
        return {
            "status": "verified",
            "doc_type": doc_type,
            "message": f"{doc_type} verified successfully",
            "confidence_score": 0.98
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@app.get("/api/loans")
def get_loans():
    """
    Returns a list of available loan options.
    """
    loans = [
        {
            "id": 1,
            "lender": "Kotak Mahindra Bank",
            "min_income": "₹10,000 (salary account)",
            "notes": "Offers \"Mid-Month Advance\" and assesses overall profile."
        },
        {
            "id": 2,
            "lender": "Axis Bank",
            "min_income": "₹15,000",
            "notes": "Offers competitive interest rates and low processing fees."
        },
        {
            "id": 3,
            "lender": "Bajaj Finserv",
            "min_income": "Varies by profile",
            "notes": "Offers up to ₹10 lakh with minimal documentation and instant approval in some cases."
        },
        {
            "id": 4,
            "lender": "IDFC FIRST Bank",
            "min_income": "Varies by profile",
            "notes": "Specializes in digital loans for gig workers without traditional income proof."
        },
        {
            "id": 5,
            "lender": "HDFC Bank",
            "min_income": "₹25,000",
            "notes": "Offers quick digital processing for existing customers."
        },
        {
            "id": 6,
            "lender": "IDBI Bank",
            "min_income": "Annual income up to ₹3,00,000",
            "notes": "Primarily microfinance loans to low-income households/SHGs."
        }
    ]
    return {"loans": loans}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
