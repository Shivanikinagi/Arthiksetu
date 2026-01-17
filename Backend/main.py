from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict
from sms_parser import SMSParser
from schemes import get_eligible_schemes, SCHEMES_DB, simplify_scheme_explanation
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime, timedelta
import numpy as np
from gemini_service import (
    parse_sms_with_ai,
    chat_with_ai_assistant,
    predict_income_risk,
    decode_financial_message,
    verify_document_with_ai
)

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

# Store chat history (in production, use a database)
chat_sessions = {}

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
    AI-based document verification using Gemini Vision.
    """
    try:
        # Read file content
        file_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"
        
        # Use AI to verify document
        result = verify_document_with_ai(file_bytes, mime_type, doc_type)
        
        if result.get("is_valid"):
            return {
                "status": "verified",
                "doc_type": doc_type,
                "extracted_id": result.get("extracted_id"),
                "message": f"{doc_type} verified successfully",
                "confidence_score": 0.95,
                "reason": result.get("reason")
            }
        else:
            return {
                "status": "rejected",
                "doc_type": doc_type,
                "message": f"{doc_type} verification failed",
                "confidence_score": 0.3,
                "reason": result.get("reason")
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse_sms")
async def parse_sms_endpoint(request: SMSRequest):
    """
    Parses SMS using AI-based NLP for better extraction.
    """
    try:
        # Use AI-based parsing instead of regex
        results = await parse_sms_with_ai(request.messages)
        
        # Calculate summary
        total_credit = sum(r.get('amount', 0) for r in results if r.get('type') == 'credit')
        total_debit = sum(r.get('amount', 0) for r in results if r.get('type') == 'debit')
        
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

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = "default"

@app.post("/api/chat")
async def chat_endpoint(request: ChatMessage):
    """
    AI Earnings Assistant Chatbot - Conversational interface for tracking income.
    """
    try:
        # Get or create chat history
        if request.session_id not in chat_sessions:
            chat_sessions[request.session_id] = []
        
        history = chat_sessions[request.session_id]
        
        # Get AI response
        response = await chat_with_ai_assistant(request.message, history)
        
        # Update history
        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": response})
        
        # Keep only last 20 messages
        chat_sessions[request.session_id] = history[-20:]
        
        return {
            "response": response,
            "session_id": request.session_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class EarningsHistory(BaseModel):
    data: List[Dict]  # [{"date": "2025-01", "amount": 45000}, ...]

@app.post("/api/predict_risk")
async def predict_risk_endpoint(request: EarningsHistory):
    """
    Income Risk Prediction - Predicts potential low-earning periods.
    """
    try:
        prediction = await predict_income_risk(request.data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MessageDecodeRequest(BaseModel):
    message: str

@app.post("/api/decode_message")
async def decode_message_endpoint(request: MessageDecodeRequest):
    """
    Financial Message Decoder - Explains confusing bank/platform messages.
    """
    try:
        decoded = await decode_financial_message(request.message)
        return {"decoded_message": decoded}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class EarningsData(BaseModel):
    platform_data: Dict[str, float]  # {"Swiggy": 15000, "Zomato": 12000}
    total_earnings: float

@app.post("/api/unified_dashboard")
async def unified_dashboard_endpoint(request: EarningsData):
    """
    Unified Earnings Dashboard - Aggregates income across platforms.
    """
    try:
        # Process and analyze earnings
        platforms = list(request.platform_data.keys())
        earnings = list(request.platform_data.values())
        
        analysis = {
            "total_earnings": request.total_earnings,
            "platform_breakdown": request.platform_data,
            "top_platform": max(request.platform_data, key=request.platform_data.get) if request.platform_data else None,
            "platform_count": len(platforms),
            "average_per_platform": request.total_earnings / len(platforms) if platforms else 0,
            "diversification_score": len(platforms) * 10  # Simple score
        }
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simplify_scheme")
async def simplify_scheme_endpoint(profile: UserProfile):
    """
    Government Scheme Simplifier - Explains schemes in simple language.
    """
    try:
        recommendations = get_eligible_schemes(profile.dict())
        
        # Simplify each scheme
        simplified = []
        for scheme in recommendations:
            simple_explanation = simplify_scheme_explanation(scheme)
            simplified.append({
                **scheme,
                "simple_explanation": simple_explanation
            })
        
        return {"schemes": simplified, "count": len(simplified)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dashboard")
def dashboard_endpoint():
    """
    Mock dashboard data for frontend compatibility
    """
    return {
        "incomeSources": [
            {"name": "Swiggy", "amount": 15000, "verified": True, "status": "verified"},
            {"name": "Zomato", "amount": 12000, "verified": True, "status": "verified"},
            {"name": "Uber", "amount": 18000, "verified": False, "status": "pending"}
        ],
        "earningsData": [
            {"month": "Jan", "amount": 42000},
            {"month": "Feb", "amount": 38500},
            {"month": "Mar", "amount": 45000}
        ],
        "arthikScore": 750
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

