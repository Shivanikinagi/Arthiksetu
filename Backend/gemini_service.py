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
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        return "Gemini API Key not configured. Please set GEMINI_API_KEY environment variable to use AI insights."

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

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
    sample_data = [{"month": "Jul", "amount": 42000}, {"month": "Aug", "amount": 45000}]
    print(analyze_earning_trend(sample_data))
