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

# Configure the API key
API_KEY = "AIzaSyBzVZtrEryFJ2tntrymz_PBXE_osReq6vo"

def configure_gemini():
    """Configure Gemini API"""
    if genai is None:
        raise ImportError("Google Generative AI module not found. Install google-generativeai")
    
    genai.configure(api_key=API_KEY)
    return genai.GenerativeModel('gemini-2.5-flash')

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

        response = model.generate_content(prompt)
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
            
            response = model.generate_content(prompt)
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
    AI Earnings Assistant Chatbot - conversational interface.
    """
    try:
        model = configure_gemini()
        
        # Build context from history
        context = "\\n".join([f"{h['role']}: {h['content']}" for h in history[-10:]])
        
        prompt = f"""
        You are ArthikSetu's AI Assistant, a friendly and empathetic financial guide for gig workers (delivery partners, drivers, freelancers) in India.
        
        Your Goal: Help them maximize earnings, manage money, save tax, and access government schemes.
        
        Context of conversation:
        {context}
        
        User Query: {message}
        
        Guidelines:
        1. Be Conversational & Real: Use natural language, acknowledge their hard work.
        2. Hinglish Friendly: You can use occasional Hindi words (like 'Bhai', 'Paisa', 'Bachat') if it fits naturally.
        3. Actionable Advice: Don't just give generic advice. Give specific tips relevant to Indian gig economy (e.g., peak hours, petrol saving, schemes like Ayushman Bharat).
        4. If they ask about features (like "How do I check my tax?"), guide them to the Tax section of the app.
        5. Keep responses concise (max 3-4 sentences) unless a detailed explanation is asked for.
        
        Answer the user's query now:
        """
        
        response = model.generate_content(prompt)
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
        
        response = model.generate_content(prompt)
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
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Could not decode: {str(e)}"


def verify_document_with_ai(file_bytes, mime_type, doc_type):
    """
    Verifies document using Vision capabilities of Gemini.
    """
    try:
        model = configure_gemini()
        
        prompt = f"""
        Analyze this image. Determine if it is a valid Indian {doc_type}.
        Return a strict JSON response (no markdown formatting) with the following structure:
        {{
            "is_valid": true/false,
            "extracted_id": "extracted number if found (e.g. Aadhaar/PAN number), else null",
            "reason": "reason for validity or invalidity"
        }}
        """
        
        image_part = {
            "mime_type": mime_type,
            "data": file_bytes
        }
        
        response = model.generate_content([prompt, image_part])
        
        # Clean response text to ensure JSON
        text = response.text.replace('```json', '').replace('```', '').strip()
        import json
        return json.loads(text)
        
    except Exception as e:
        print(f"Error in AI verification: {e}")
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
