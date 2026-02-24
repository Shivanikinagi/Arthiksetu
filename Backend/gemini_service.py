try:
    import google.generativeai as genai
except ImportError:
    genai = None

import os
import time
import json
import re
from datetime import datetime, timedelta
from typing import List, Dict

# Load API key from environment variable only (never hardcode keys!)
from dotenv import load_dotenv
load_dotenv()

_gemini_api_key = os.getenv("GEMINI_API_KEY", "")
if not _gemini_api_key:
    print("WARNING: GEMINI_API_KEY not set in .env file. AI features will not work.")

API_KEYS = [k.strip() for k in _gemini_api_key.split(",") if k.strip()]
_current_key_index = 0

def configure_gemini(model_name='gemini-2.5-flash'):
    """Configure Gemini API with automatic key rotation on quota errors."""
    global _current_key_index
    if genai is None:
        raise ImportError("Google Generative AI module not found. Install google-generativeai")
    genai.configure(api_key=API_KEYS[_current_key_index % len(API_KEYS)])
    return genai.GenerativeModel(model_name)

def _rotate_key_and_retry(func, *args, max_retries=2, **kwargs):
    """Retry a Gemini call with the next API key on 429 errors."""
    global _current_key_index
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            last_err = e
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "Resource has been exhausted" in err_str:
                _current_key_index = (_current_key_index + 1) % len(API_KEYS)
                genai.configure(api_key=API_KEYS[_current_key_index])
                time.sleep(1)
            else:
                raise
    raise last_err

def _generate_with_retry(model, content, max_retries=2):
    """Call model.generate_content with automatic key rotation on quota errors."""
    global _current_key_index
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            if isinstance(content, list):
                return model.generate_content(content)
            else:
                return model.generate_content(content)
        except Exception as e:
            last_err = e
            err_str = str(e)
            if "429" in err_str or "quota" in err_str.lower() or "Resource has been exhausted" in err_str:
                _current_key_index = (_current_key_index + 1) % len(API_KEYS)
                genai.configure(api_key=API_KEYS[_current_key_index])
                model = configure_gemini()
                time.sleep(1)
            else:
                raise
    raise last_err

def analyze_earning_trend(earnings_data):
    """
    Uses Google Gemini to analyze earning trends and provide advice.
    """
    try:
        model = configure_gemini()
        
        prompt = f"""
        You are a financial advisor for a gig worker in India.
        Here is their monthly earnings data: {earnings_data}
        
        Please provide:
        1. A brief analysis of their earning trend (up/down/stable).
        2. One actionable tip to increase their income based on gig economy trends in India.
        3. Keep it encouraging and under 50 words.
        """

        response = _generate_with_retry(model, prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis currently unavailable: {str(e)}"

async def parse_sms_with_ai(messages: List[str]) -> List[Dict]:
    """
    AI-based SMS parsing using NLP instead of regex.
    Extracts earnings information from SMS messages.
    """
    try:
        model = configure_gemini()
        
        # Batch process messages
        results = []
        for msg in messages:
            prompt = f"""
            Analyze this SMS message and extract financial transaction information.
            SMS: {msg}
            
            Return a JSON object with these fields:
            - amount: numeric value (0 if no amount found)
            - merchant: name of platform/merchant (Swiggy, Zomato, Uber, etc., or "Unknown")
            - type: "credit" or "debit" or "unknown"
            - date: date if mentioned, else null
            - description: brief summary
            
            Only return the JSON, no markdown formatting.
            """
            
            response = _generate_with_retry(model, prompt)
            text = response.text.replace('```json', '').replace('```', '').strip()
            
            try:
                parsed = json.loads(text)
                parsed['raw'] = msg
                results.append(parsed)
            except json.JSONDecodeError:
                # Fallback
                results.append({
                    "amount": 0,
                    "merchant": "Unknown",
                    "type": "unknown",
                    "date": None,
                    "description": "Could not parse",
                    "raw": msg
                })
        
        return results
    except Exception as e:
        # Fallback to simple parsing
        return [{"amount": 0, "merchant": "Unknown", "type": "unknown", "raw": msg, "error": str(e)} for msg in messages]

async def chat_with_ai_assistant(message: str, history: List[Dict]) -> str:
    """
    Unified AI Assistant - handles ALL platform features conversationally.
    Can parse SMS, decode messages, recommend schemes, help with taxes, and more.
    """
    try:
        model = configure_gemini()
        
        # Build context from history
        context = "\n".join([f"{h['role']}: {h['content']}" for h in history[-10:]])
        
        prompt = f"""You are "ArthikSetu Assistant" — a comprehensive, friendly AI assistant for India's gig workers (delivery partners, drivers, freelancers, etc.). 
You help with EVERYTHING on the ArthikSetu platform. You speak in simple English mixed with Hindi (Hinglish) when helpful for the user.

YOUR CAPABILITIES:
1. **SMS & Transaction Analysis**: If the user pastes an SMS or transaction message, extract the amount, merchant, credit/debit type, and explain it simply.
2. **Financial Message Decoder**: If the user sends a confusing bank/platform message, explain what it means in simple language.
3. **Government Schemes**: Recommend relevant schemes (PM-SVANidhi, Atal Pension Yojana, PMJJBY, Ayushman Bharat, PMEGP, Stand-Up India, PM-SBY) based on the user's profile.
4. **Tax Guidance**: Explain Indian tax slabs (New Regime FY 2024-25), help estimate tax, explain TDS, Section 87A rebate, and ITR filing.
5. **Loan Advice**: Guide users about personal loans from banks like Kotak, Axis, Bajaj Finserv, IDFC FIRST, HDFC, IDBI — mention minimum income requirements.
6. **Income Tracking Tips**: Help users track earnings from multiple gig platforms (Swiggy, Zomato, Uber, Ola, UrbanCompany, Porter, etc.)
7. **Document Verification Help**: Guide users on how to upload and verify Aadhaar, PAN, and other documents on the platform.
8. **Financial Planning**: Provide savings tips, emergency fund advice, and budgeting strategies for irregular income.
9. **Platform Navigation**: Help users navigate ArthikSetu features — Dashboard, SMS Analyzer, Tax Calculator, Schemes, Loans, Reports, Document Verification, Profile.

RULES:
- Keep responses concise (under 150 words unless the user asks for detail).
- Be encouraging and supportive — many users are first-time digital finance users.
- Use rupee symbol for Indian currency.
- If a user pastes an SMS, automatically analyze it without being asked.
- If asked about a scheme, provide eligibility criteria and the apply URL.
- Never give incorrect tax advice — always recommend visiting incometax.gov.in for official filing.
- Format responses with bullet points and emojis for readability.

Previous conversation:
{context}

User: {message}
"""
        
        response = _generate_with_retry(model, prompt)
        return response.text
    except Exception as e:
        return f"I'm having trouble connecting right now. Error: {str(e)}"

async def predict_income_risk(earnings_history: List[Dict]) -> Dict:
    """
    Predicts potential low-earning periods using historical patterns.
    """
    try:
        model = configure_gemini()
        
        prompt = f"""
        Analyze this earnings history for a gig worker: {json.dumps(earnings_history)}
        
        Predict:
        1. Risk level (Low/Medium/High) of low-earning periods
        2. Which months might be challenging
        3. Suggestions to mitigate risk
        
        Return as JSON:
        {{
            "risk_level": "Low/Medium/High",
            "risk_score": 0-100,
            "predicted_low_months": ["month names"],
            "suggestions": ["tip 1", "tip 2"],
            "trend": "improving/stable/declining"
        }}
        
        Only return JSON, no markdown.
        """
        
        response = _generate_with_retry(model, prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        
        try:
            return json.loads(text)
        except:
            return {
                "risk_level": "Medium",
                "risk_score": 50,
                "predicted_low_months": [],
                "suggestions": ["Diversify income sources", "Build emergency fund"],
                "trend": "stable"
            }
    except Exception as e:
        return {"error": str(e), "risk_level": "Unknown"}

async def decode_financial_message(message: str) -> str:
    """
    Explains confusing bank/platform messages in simple language.
    """
    try:
        model = configure_gemini()
        
        prompt = f"""
        A gig worker received this message: "{message}"
        
        Explain what it means in simple Hindi-English (Hinglish) that a common person can understand.
        Keep it under 50 words.
        """
        
        response = _generate_with_retry(model, prompt)
        return response.text
    except Exception as e:
        return f"Could not decode: {str(e)}"


def verify_document_with_ai(file_bytes, mime_type, doc_type):
    """
    Verifies document using Vision capabilities of Gemini.
    Uses gemini-1.5-flash which supports both text and image input.
    """
    try:
        # Use gemini-2.5-flash for vision capabilities
        model = configure_gemini('gemini-2.5-flash')
        
        import base64
        
        # Determine if this is an income proof or identity document
        is_income_proof = doc_type.lower() in ['income proof', 'income_proof', 'salary slip', 'bank statement', 'earning proof']
        
        if is_income_proof:
            prompt = f"""Analyze this uploaded document carefully. It is claimed to be an Income Proof document.

Your task:
1. Identify the type of document (salary slip, bank statement, payment screenshot, invoice, earnings report, etc.)
2. Extract ALL monetary amounts visible in the document
3. Identify the source/platform/employer name if visible
4. Find any dates mentioned
5. Calculate or identify the total earnings amount

Return a strict JSON response (no markdown, no code blocks) with this exact structure:
{{
    "is_valid": true or false,
    "document_type": "type of income document detected",
    "extracted_id": null,
    "total_amount": numeric total earnings amount found (just the number, no currency symbol),
    "amounts_found": [list of individual amounts found as numbers],
    "source_name": "platform or employer name if found, else Unknown",
    "date_found": "date if found, else null",
    "currency": "INR",
    "description": "brief description of what the document shows",
    "reason": "explanation of why valid or invalid as income proof"
}}

Be thorough in extracting amounts. Look for numbers preceded by Rs, ₹, INR, or in amount/total/earning/salary fields."""
        else:
            prompt = f"""You are an expert Indian document verification AI. Analyze this image VERY CAREFULLY. It is claimed to be an Indian {doc_type}.

Your task:
1. Verify if this is genuinely a valid Indian {doc_type} document
2. Check for ALL mandatory government document features 
3. Extract the document ID number if visible
4. Check if the document appears authentic (not a random image, screenshot of text, or fake)

STRICT VERIFICATION CRITERIA:

For **Aadhaar Card** (MUST have ALL of these):
- UIDAI (Unique Identification Authority of India) logo/emblem clearly visible
- Government of India / भारत सरकार text
- 12-digit Aadhaar number in XXXX XXXX XXXX format (masked or full)
- Passport-style photograph of the cardholder
- Full name of the cardholder in both English and Hindi/regional language
- Date of Birth or Year of Birth
- Gender (Male/Female/Transgender)
- Address of the cardholder
- QR code (mandatory on all genuine Aadhaar cards)
- The card should have the standard Aadhaar card layout (blue header with Aadhaar logo)
- Reject if: no photo, no QR code, no UIDAI logo, number is not 12 digits, or image shows just text/numbers without card format

For **PAN Card** (MUST have ALL of these):
- "INCOME TAX DEPARTMENT" or "आयकर विभाग" header text clearly visible at the top
- "GOVT. OF INDIA" or "भारत सरकार" text 
- The word "Permanent Account Number" or "PAN" prominently displayed
- 10-character PAN number in EXACT format: 5 uppercase letters + 4 digits + 1 uppercase letter (e.g., ABCDE1234F)
  * First 3 characters: AAA to ZZZ (alphabetic series)
  * 4th character: C/P/H/F/A/T/B/L/J/G (entity type)
  * 5th character: First letter of surname
  * Next 4: sequential digits 0001-9999
  * Last: check letter A-Z
- Passport-style photograph of the cardholder
- Full name of the cardholder
- Father's name
- Date of Birth
- Signature of the cardholder
- Embossed or printed hologram (if physical card)
- The Indian national emblem (Ashoka Pillar / Lion Capital)
- Reject if: no photo, PAN format invalid, no "Income Tax Department" text, random image or screenshot, just a number without card layout

For **Driving License**: Must have state transport authority header, DL number, photo, validity dates
For **Voter ID**: Must have Election Commission logo, EPIC number, photo, name, address
For **Passport**: Must have Republic of India header, passport number, photo, personal details

Return a strict JSON response (no markdown, no code blocks) with this exact structure:
{{
    "is_valid": true or false,
    "extracted_id": "extracted document number if found, else null",
    "reason": "detailed reason for validity or invalidity, including what specific features were found or missing",
    "document_features_found": ["list of authentic features detected"],
    "confidence": "high/medium/low"
}}

IMPORTANT: Only mark as valid if the image actually shows a genuine-looking {doc_type}. Reject random images, screenshots, non-document images, or clearly fake documents.

ADDITIONAL CROSS-CHECKS:
- If text appears digitally typed over a blank template, mark as suspicious (low confidence).
- Check for consistent font styles — genuine documents use government-issued typography.
- Verify structural layout matches official {doc_type} format.
- If document ID is visible, validate the format (e.g., Aadhaar = 12 digits, PAN = 5 letters + 4 digits + 1 letter).
- Flag any signs of tampering (misaligned text, resolution mismatches, cut/paste artifacts).
- Assign confidence "high" ONLY if all mandatory features are present and authentic-looking."""
        
        image_part = {
            "mime_type": mime_type,
            "data": base64.b64encode(file_bytes).decode('utf-8') if isinstance(file_bytes, bytes) else file_bytes
        }
        
        # Use inline_data dict format compatible with all google-generativeai versions
        response = _generate_with_retry(model, [prompt, {"inline_data": image_part}])
        
        # Clean response text to ensure JSON
        text = response.text.replace('```json', '').replace('```', '').strip()
        result = json.loads(text)
        
        # For income proof, ensure proper amount extraction
        if is_income_proof and result.get("is_valid"):
            total = result.get("total_amount", 0)
            if total == 0 and result.get("amounts_found"):
                total = sum(result["amounts_found"])
                result["total_amount"] = total
        
        return result
        
    except Exception as e:
        print(f"Error in AI verification: {e}")
        import traceback
        traceback.print_exc()
        return {
            "is_valid": False, 
            "extracted_id": None, 
            "reason": f"AI service error: {str(e)}"
        }

# Mock usage if run directly
if __name__ == "__main__":
    sample_data = [
        {"month": "Jan", "amount": 42000},
        {"month": "Feb", "amount": 38500},
        {"month": "Mar", "amount": 45200}
    ]
    print(analyze_earning_trend(sample_data))
