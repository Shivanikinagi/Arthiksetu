import google.generativeai as genai
import os
import time

# Configure the API key
# ideally this would be os.getenv("GEMINI_API_KEY")
# For this demo, we will check if the variable exists, otherwise return a mock response or error.

def analyze_earning_trend(earnings_data):
    """
    Uses Google Gemini to analyze earning trends and provide advice.
    """
    # api_key = os.getenv("GEMINI_API_KEY")
    api_key = "AIzaSyBOmRJQ8Q21Ln5FvpHx8sglC6CsyeTqcPA"
    
    # if not api_key:
    #    return "Gemini API Key not configured. Please set GEMINI_API_KEY environment variable to use AI insights."

    try:
        genai.configure(api_key=api_key)
        # using the latest stable model
        model = genai.GenerativeModel('gemini-1.5-flash')

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

# Mock usage if run directly
if __name__ == "__main__":
    print(analyze_earning_trend(sample_data))


def verify_document_with_ai(file_bytes, mime_type, doc_type):
    """
    Verifies document using Vision capabilities of Gemini.
    """
    # api_key = os.getenv("GEMINI_API_KEY")
    api_key = "AIzaSyBOmRJQ8Q21Ln5FvpHx8sglC6CsyeTqcPA"
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Analyze this image. determine if it is a valid Indian {doc_type}.
        Return a strict JSON response (no markdown formatting) with the following structure:
        {{
            "is_valid": true/false,
            "extracted_id": "extracted number if found (e.g. adhaar/pan number), else null",
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
