# ArthikSetu AI Integration Guide

This project now includes an AI-powered backend for SMS parsing and Scheme recommendation.

## Components

1.  **SMS Parser (`Backend/sms_parser.py`)**:
    -   Uses Regex and Pattern Matching to extract financial data from transaction SMS messages.
    -   Identifies: Amount, Merchant/Source, Transaction Type (Credit/Debit).
    -   Logic: Mimics "Google Natural Language API" intent extraction using local processing (faster, cheaper, privacy-focused).

2.  **Scheme Recommender (`Backend/schemes.py`)**:
    -   Matches user profile (Age, Income, Occupation) against a database of government schemes.
    -   Filters eligible schemes based on criteria.

3.  **FastAPI Backend (`Backend/main.py`)**:
    -   Exposes these features via REST API.
    -   Runs on `http://localhost:8000`.

## How to Run

1.  **Install Dependencies**:
    Open a terminal in `Arthiksetu/Arthiksetu` and run:
    ```bash
    pip install -r Backend/requirements.txt
    ```

2.  **Start the Backend**:
    ```bash
    cd Backend
    uvicorn main:app --reload
    ```
    The server will start at `http://localhost:8000`.

3.  **Start the Frontend**:
    Open another terminal in `Arthiksetu/Frontend`:
    ```bash
    npm run dev
    ```

## Testing

You can test the API at `http://localhost:8000/docs` (Swagger UI).
or use the new "AI Assistant" section in the Dashboard.

## Sample SMS Data for Testing

You can copy-paste these into the analyzer:
- "Rs 1,200 credited to your a/c XX1234 on 12-Jan-24 by ZOMATO PAYOUT. Avl Bal Rs 5000." (Credit, Zomato)
- "Paid Rs 500 at Petrol Pump using UPI. Ref 123456." (Debit, UPI)
- "Rs 450 debited for SWIGGY order #1234." (Debit, Swiggy)
