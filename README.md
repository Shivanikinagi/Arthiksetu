# ArthikSetu - Financial Bridge for Gig Workers

ArthikSetu is a comprehensive financial wellness platform designed for India's gig economy workers. It provides unified earnings tracking, AI-powered insights, and access to government schemes.

## Features

*   **Unified Earnings Dashboard**: Aggregates income from platforms like Swiggy, Zomato, Uber, etc.
*   **Smart SMS Analyzer**: AI-based tool to parse transaction SMS and track income automatically.
*   **AI Chatbot Assistant**: Conversational interface for financial queries and advice.
*   **Financial Message Decoder**: Translates confusing bank messages into simple language.
*   **Document Verification**: AI-powered verification for Aadhaar, PAN, and other IDs.
*   **Government Schemes**: Smart recommendation engine for eligible government benefits.
*   **Income Risk Prediction**: Predicts potential low-earning periods based on historical data.
*   **Reports**: Generate audit-safe financial reports.

## Project Structure

*   `Backend/`: Python (FastAPI + Django) backend.
    *   `main.py`: Primary entry point for AI features and API.
    *   `gemini_service.py`: Google Gemini AI integration.
*   `Frontend/`: React (Vite) frontend.
    *   `src/components/`: Reusable UI components and Feature pages.

## Setup Instructions

### Prerequisites
*   Python 3.10+
*   Node.js 18+

### 1. Backend Setup
Navigate to the Backend directory:
```bash
cd Arthiksetu/Backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the API server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Frontend Setup
Open a new terminal and navigate to the Frontend directory:
```bash
cd Arthiksetu/Frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open your browser and visit the URL shown (usually `http://localhost:5173`).

## Usage
1.  **Dashboard**: View your aggregated income.
2.  **SMS Analyzer**: Paste transaction SMS to test the AI parser.
3.  **Chatbot**: Ask questions like "How can I save tax?".
4.  **Schemes**: View schemes you are eligible for (based on verified income).
5.  **Decoder**: Paste a bank SMS to understand it.
6.  **Verify**: Upload a dummy ID image to test verification.

## Notes
*   This is a demo version. Data is mocked or stored in-memory for some features to facilitate easy testing without a full database setup.
*   The AI features utilize Google Gemini API.
