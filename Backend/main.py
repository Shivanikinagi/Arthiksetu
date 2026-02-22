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

# ============================================
# DYNAMIC IN-MEMORY DATA STORE
# ============================================
# This stores all earnings data dynamically
earnings_store = {
    "income_sources": [],
    "monthly_earnings": [],
    "total_monthly_income": 0,
}

def get_total_monthly_income():
    """Calculate total monthly income from all sources"""
    return sum(s.get("amount", 0) for s in earnings_store["income_sources"])

def update_monthly_earnings():
    """Update the monthly earnings history based on current income sources"""
    total = get_total_monthly_income()
    earnings_store["total_monthly_income"] = total
    
    # Update the current month in monthly earnings
    current_month = datetime.now().strftime("%b")
    found = False
    for entry in earnings_store["monthly_earnings"]:
        if entry["month"] == current_month:
            entry["amount"] = total
            found = True
            break
    if not found:
        earnings_store["monthly_earnings"].append({"month": current_month, "amount": total})
    
    # Keep only last 6 months
    earnings_store["monthly_earnings"] = earnings_store["monthly_earnings"][-6:]

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

@app.get("/api/dashboard")
def get_dashboard():
    """
    Get dashboard data with income sources and monthly earnings.
    Returns dynamic data from the earnings store.
    """
    total = get_total_monthly_income()
    
    return {
        "incomeSources": earnings_store["income_sources"],
        "earningsData": earnings_store["monthly_earnings"],
        "totalMonthlyIncome": total
    }

@app.post("/api/verify_document")
async def verify_document(file: UploadFile = File(...), doc_type: str = Form(...)):
    """
    AI-based document verification using Gemini Vision.
    For income proof, extracts earnings and adds to the dynamic store.
    For identity documents, performs strict verification.
    """
    try:
        # Read file content
        file_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"
        
        # Use AI to verify document
        result = verify_document_with_ai(file_bytes, mime_type, doc_type)
        
        is_income_proof = doc_type.lower() in ['income proof', 'income_proof', 'salary slip', 'bank statement', 'earning proof']
        
        if is_income_proof:
            # Handle income proof - extract earnings and add to store
            if result.get("is_valid"):
                total_amount = result.get("total_amount", 0)
                source_name = result.get("source_name", "Uploaded Document")
                description = result.get("description", "Income proof uploaded")
                date_found = result.get("date_found")
                
                # Try to parse total_amount if it's a string
                if isinstance(total_amount, str):
                    import re
                    nums = re.findall(r'[\d,]+\.?\d*', total_amount.replace(',', ''))
                    total_amount = float(nums[0]) if nums else 0
                
                total_amount = float(total_amount) if total_amount else 0
                
                if total_amount > 0:
                    # Add to earnings store
                    new_source = {
                        "name": source_name if source_name != "Unknown" else f"Upload ({file.filename})",
                        "amount": total_amount,
                        "verified": True,
                        "source": source_name,
                        "description": description,
                        "date": date_found,
                        "upload_time": datetime.now().isoformat()
                    }
                    earnings_store["income_sources"].append(new_source)
                    update_monthly_earnings()
                
                return {
                    "status": "verified",
                    "doc_type": "Income Proof",
                    "extracted_id": result.get("extracted_id"),
                    "total_amount": total_amount,
                    "source_name": source_name,
                    "description": description,
                    "date_found": date_found,
                    "amounts_found": result.get("amounts_found", []),
                    "message": f"Income proof verified. Detected ₹{total_amount:,.0f} from {source_name}",
                    "confidence_score": 0.92 if total_amount > 0 else 0.5,
                    "reason": result.get("reason"),
                    "current_total": get_total_monthly_income()
                }
            else:
                return {
                    "status": "rejected",
                    "doc_type": "Income Proof",
                    "total_amount": 0,
                    "message": "Could not extract income information from this document",
                    "confidence_score": 0.3,
                    "reason": result.get("reason", "Unable to verify income from this document")
                }
        else:
            # Handle identity document verification
            if result.get("is_valid"):
                confidence = result.get("confidence", "medium")
                confidence_score = {"high": 0.95, "medium": 0.75, "low": 0.5}.get(confidence, 0.75)
                
                return {
                    "status": "verified",
                    "doc_type": doc_type,
                    "extracted_id": result.get("extracted_id"),
                    "message": f"{doc_type} verified successfully",
                    "confidence_score": confidence_score,
                    "reason": result.get("reason"),
                    "features_found": result.get("document_features_found", [])
                }
            else:
                return {
                    "status": "rejected",
                    "doc_type": doc_type,
                    "message": f"{doc_type} verification failed",
                    "confidence_score": 0.2,
                    "reason": result.get("reason", "Document does not appear to be a valid " + doc_type)
                }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/add_income")
async def add_income_source(name: str = Form(...), amount: float = Form(...), source: str = Form("Manual")):
    """
    Manually add an income source.
    """
    new_source = {
        "name": name,
        "amount": amount,
        "verified": False,
        "source": source,
        "description": f"Manually added income from {name}",
        "upload_time": datetime.now().isoformat()
    }
    earnings_store["income_sources"].append(new_source)
    update_monthly_earnings()
    return {"status": "success", "message": f"Added {name} with ₹{amount}", "total": get_total_monthly_income()}

@app.delete("/api/clear_income")
async def clear_income():
    """Clear all income sources (for testing)."""
    earnings_store["income_sources"] = []
    earnings_store["monthly_earnings"] = []
    earnings_store["total_monthly_income"] = 0
    return {"status": "cleared"}

@app.post("/api/parse_sms")
async def parse_sms_endpoint(request: SMSRequest):
    """
    Parses SMS using AI-based NLP for better extraction.
    Also adds detected credits to the earnings store.
    """
    try:
        # Use AI-based parsing instead of regex
        results = await parse_sms_with_ai(request.messages)
        
        # Calculate summary
        total_credit = sum(r.get('amount', 0) for r in results if r.get('type') == 'credit')
        total_debit = sum(r.get('amount', 0) for r in results if r.get('type') == 'debit')
        
        # Add credit transactions to earnings store
        for r in results:
            if r.get('type') == 'credit' and r.get('amount', 0) > 0:
                merchant = r.get('merchant', 'SMS Income')
                # Check if this source already exists
                existing = next((s for s in earnings_store["income_sources"] if s["name"] == merchant), None)
                if existing:
                    existing["amount"] += r["amount"]
                else:
                    earnings_store["income_sources"].append({
                        "name": merchant,
                        "amount": r["amount"],
                        "verified": True,
                        "source": "SMS",
                        "description": r.get("description", "Parsed from SMS"),
                        "upload_time": datetime.now().isoformat()
                    })
        
        if total_credit > 0:
            update_monthly_earnings()
        
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
    Uses dynamic income from earnings store if profile income is 0.
    """
    try:
        profile_dict = profile.dict()
        # If income is 0 or not provided, use dynamic income from earnings store
        if profile_dict.get("income", 0) <= 0:
            profile_dict["income"] = get_total_monthly_income() * 12
        
        recommendations = get_eligible_schemes(profile_dict)
        return {"schemes": recommendations, "count": len(recommendations)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/all_schemes")
def get_all_schemes():
    return {"schemes": SCHEMES_DB}

@app.get("/api/loans")
def get_loans():
    """
    Returns loan options filtered based on the user's actual verified income.
    """
    monthly_income = get_total_monthly_income()
    
    all_loans = [
        {
            "id": 1,
            "lender": "Kotak Mahindra Bank",
            "min_income": 10000,
            "min_income_display": "₹10,000",
            "max_loan": 500000,
            "interest_rate": "10.99%",
            "notes": "Offers 'Mid-Month Advance' for salary account holders. Quick digital processing.",
            "link": "https://www.kotak.com/en/personal-banking/loans/personal-loan.html",
            "eligible": monthly_income >= 10000
        },
        {
            "id": 2,
            "lender": "Axis Bank",
            "min_income": 15000,
            "min_income_display": "₹15,000",
            "max_loan": 1500000,
            "interest_rate": "10.49%",
            "notes": "Competitive interest rates with low processing fees. Pre-approved for existing customers.",
            "link": "https://www.axisbank.com/retail/loans/personal-loan",
            "eligible": monthly_income >= 15000
        },
        {
            "id": 3,
            "lender": "Bajaj Finserv",
            "min_income": 15000,
            "min_income_display": "₹15,000",
            "max_loan": 1000000,
            "interest_rate": "10.00%",
            "notes": "Up to ₹10 lakh with minimal documentation. Instant approval available.",
            "link": "https://www.bajajfinserv.in/personal-loan",
            "eligible": monthly_income >= 15000
        },
        {
            "id": 4,
            "lender": "IDFC FIRST Bank",
            "min_income": 15000,
            "min_income_display": "₹15,000",
            "max_loan": 2000000,
            "interest_rate": "9.99%",
            "notes": "Specializes in digital loans for gig workers without traditional income proof.",
            "link": "https://www.idfcfirstbank.com/personal-banking/loans/personal-loan",
            "eligible": monthly_income >= 15000
        },
        {
            "id": 5,
            "lender": "HDFC Bank",
            "min_income": 25000,
            "min_income_display": "₹25,000",
            "max_loan": 4000000,
            "interest_rate": "10.75%",
            "notes": "Quick digital processing for existing customers. Flexible tenure options.",
            "link": "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan",
            "eligible": monthly_income >= 25000
        },
        {
            "id": 6,
            "lender": "IDBI Bank",
            "min_income": 8000,
            "min_income_display": "₹8,000",
            "max_loan": 300000,
            "interest_rate": "10.50%",
            "notes": "Microfinance loans for low-income households and self-help groups.",
            "link": "https://www.idbibank.in/personal-loan.aspx",
            "eligible": monthly_income >= 8000
        }
    ]
    
    # Filter loans based on income eligibility
    eligible_loans = [l for l in all_loans if l["eligible"]]
    ineligible_loans = [l for l in all_loans if not l["eligible"]]
    
    # Sort: eligible first, then by max loan amount
    sorted_loans = sorted(eligible_loans, key=lambda x: x["max_loan"], reverse=True) + sorted(ineligible_loans, key=lambda x: x["min_income"])
    
    return {
        "loans": sorted_loans,
        "user_monthly_income": monthly_income,
        "eligible_count": len(eligible_loans),
        "total_count": len(all_loans)
    }

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

@app.get("/api/tax_calculation")
def calculate_tax():
    """
    Calculate tax based on DYNAMIC current earnings from the earnings store.
    Returns estimated annual income, tax payable, and refund eligibility.
    """
    try:
        # Use dynamic monthly income from the earnings store
        monthly_income = get_total_monthly_income()
        annual_income = monthly_income * 12
        
        # Indian Income Tax Slabs (New Tax Regime 2024-25)
        # Standard deduction (₹75,000 for FY 2024-25 new regime)
        standard_deduction = 75000
        taxable_income = max(0, annual_income - standard_deduction)
        
        # New Tax Regime slabs
        # 0 - 3,00,000: 0%
        # 3,00,001 - 7,00,000: 5%
        # 7,00,001 - 10,00,000: 10%
        # 10,00,001 - 12,00,000: 15%
        # 12,00,001 - 15,00,000: 20%
        # Above 15,00,000: 30%
        
        tax_payable = 0
        
        if taxable_income <= 300000:
            tax_payable = 0
        elif taxable_income <= 700000:
            tax_payable = (taxable_income - 300000) * 0.05
        elif taxable_income <= 1000000:
            tax_payable = 20000 + (taxable_income - 700000) * 0.10
        elif taxable_income <= 1200000:
            tax_payable = 50000 + (taxable_income - 1000000) * 0.15
        elif taxable_income <= 1500000:
            tax_payable = 80000 + (taxable_income - 1200000) * 0.20
        else:
            tax_payable = 140000 + (taxable_income - 1500000) * 0.30
        
        # Section 87A rebate (if total income <= ₹7,00,000 under new regime)
        if taxable_income <= 700000:
            tax_payable = 0
        
        # Health & Education Cess (4%)
        cess = tax_payable * 0.04
        total_tax = tax_payable + cess
        
        # Refund eligibility (if TDS was over-deducted)
        # Estimate TDS at 10% of income for freelancers/gig workers
        estimated_tds = annual_income * 0.10 if annual_income > 0 else 0
        refund_eligible = max(0, estimated_tds - total_tax) if estimated_tds > total_tax else 0
        
        # Determine tax regime recommendation
        regime_note = ""
        if annual_income <= 700000:
            regime_note = "Your income is below ₹7 lakh - No tax payable under new regime (Section 87A rebate)"
        elif annual_income <= 1200000:
            regime_note = "Consider comparing both old and new tax regimes to optimize savings"
        else:
            regime_note = "For higher income, old regime with deductions may be beneficial"
        
        return {
            "monthly_income": monthly_income,
            "annual_income": annual_income,
            "standard_deduction": standard_deduction,
            "taxable_income": taxable_income,
            "tax_payable": round(total_tax, 2),
            "tax_before_cess": round(tax_payable, 2),
            "cess": round(cess, 2),
            "refund_eligible": round(refund_eligible, 2),
            "estimated_tds": round(estimated_tds, 2),
            "regime_note": regime_note,
            "income_sources_count": len(earnings_store["income_sources"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =================== REPORT GENERATION ===================

from fastapi.responses import StreamingResponse
import io
from datetime import datetime

def _build_text_report(report_type: str) -> str:
    """Build a plain-text report based on current earnings data."""
    monthly = get_total_monthly_income()
    annual = monthly * 12
    sources = earnings_store["income_sources"]
    now = datetime.now().strftime("%d-%b-%Y %I:%M %p")
    
    lines = [
        "=" * 60,
        f"  ARTHIKSETU - {report_type.upper()}",
        "=" * 60,
        f"  Generated: {now}",
        f"  Financial Year: 2024-25",
        "-" * 60,
        "",
        f"  Total Monthly Income : ₹{monthly:,.2f}",
        f"  Estimated Annual Income : ₹{annual:,.2f}",
        f"  Income Sources Count : {len(sources)}",
        "",
        "-" * 60,
        "  INCOME SOURCE BREAKDOWN",
        "-" * 60,
    ]
    
    for src in sources:
        lines.append(f"    • {src['source']:30s}  ₹{src['amount']:>12,.2f}")
    
    lines.append("")
    lines.append("-" * 60)
    
    # Tax summary
    standard_deduction = 75000
    taxable_income = max(0, annual - standard_deduction)
    
    tax_payable = 0
    if taxable_income <= 300000:
        tax_payable = 0
    elif taxable_income <= 700000:
        tax_payable = (taxable_income - 300000) * 0.05
    elif taxable_income <= 1000000:
        tax_payable = 20000 + (taxable_income - 700000) * 0.10
    elif taxable_income <= 1200000:
        tax_payable = 50000 + (taxable_income - 1000000) * 0.15
    elif taxable_income <= 1500000:
        tax_payable = 80000 + (taxable_income - 1200000) * 0.20
    else:
        tax_payable = 140000 + (taxable_income - 1500000) * 0.30
    
    if taxable_income <= 700000:
        tax_payable = 0
    
    cess = tax_payable * 0.04
    total_tax = tax_payable + cess
    
    lines.extend([
        "  TAX SUMMARY (New Regime FY 2024-25)",
        "-" * 60,
        f"    Gross Annual Income    : ₹{annual:>12,.2f}",
        f"    Standard Deduction     : ₹{standard_deduction:>12,.2f}",
        f"    Taxable Income         : ₹{taxable_income:>12,.2f}",
        f"    Tax Payable            : ₹{tax_payable:>12,.2f}",
        f"    Health & Edu Cess (4%) : ₹{cess:>12,.2f}",
        f"    Total Tax              : ₹{total_tax:>12,.2f}",
        "",
        "=" * 60,
        "  This is a system-generated report from ArthikSetu.",
        "  For official ITR filing, visit https://www.incometax.gov.in",
        "=" * 60,
    ])
    
    return "\n".join(lines)


@app.get("/api/generate_report")
def generate_report():
    """Generate and download the annual income report as a text file."""
    try:
        content = _build_text_report("Annual Income Report 2024-25")
        buffer = io.BytesIO(content.encode("utf-8"))
        return StreamingResponse(
            buffer,
            media_type="text/plain",
            headers={"Content-Disposition": "attachment; filename=ArthikSetu_Annual_Report_2024-25.txt"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download_report/{report_id}")
def download_report(report_id: str):
    """Download a specific report by its ID."""
    try:
        report_titles = {
            "annual_2024": "Annual Income Report 2024",
            "monthly_dec_2024": "Monthly Earnings - December 2024",
            "tax_statement_24_25": "Tax Statement FY 2024-25",
            "income_proof_verified": "Income Passport (Verified)",
        }
        
        title = report_titles.get(report_id, f"Report - {report_id}")
        content = _build_text_report(title)
        safe_name = report_id.replace("/", "_").replace("\\", "_")
        buffer = io.BytesIO(content.encode("utf-8"))
        return StreamingResponse(
            buffer,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename=ArthikSetu_{safe_name}.txt"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
