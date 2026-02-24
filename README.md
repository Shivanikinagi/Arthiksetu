# ArthikSetu — AI-Powered Financial Platform for India's Gig Workers

ArthikSetu empowers delivery partners, drivers, and freelancers with AI-driven tools for earnings tracking, tax management, document verification, and access to government benefits — all with a privacy-first architecture.

## Features

### Unified Earnings Dashboard
Aggregates income across Swiggy, Zomato, Uber, Ola, UrbanCompany with visual analytics, platform-wise breakdowns, and diversification scoring.

### Smart SMS Parsing (AI)
Google Gemini-powered NLP extracts earnings from bank and platform SMS messages — detects amount, merchant, date, and transaction type automatically.

### AI Earnings Assistant
Conversational chatbot for income queries, financial advice, and government scheme recommendations, with per-session chat history.

### Income Risk Prediction
Predicts low-earning periods with risk classification (Low/Medium/High), trend analysis, and actionable suggestions.

### Financial Message Decoder
Explains confusing bank/platform messages in simple language (Hinglish) and demystifies financial terms.

### Government Scheme Recommender
Personalized scheme recommendations with simplified eligibility criteria, plain-language explanations, and direct application links.

### Document Verification (Privacy-First)
AI-powered document verification using Gemini Vision with a **live privacy pipeline**:
- Only the **last 4 digits + name** are extracted — never the full ID
- Uploaded images are **deleted from memory** immediately after processing
- Live step-by-step feedback shows exactly what's happening
- Supports Aadhaar, PAN, Driving License, Voter ID, Passport

### Privacy Dashboard
Full user control over data:
- **Permission toggles** — enable/disable SMS parsing, document upload, location access
- **Export data** — download all earnings as JSON
- **Delete all data** — one-click permanent deletion of all server-side data
- Clear summary of what is and isn't stored

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Recharts |
| Backend | FastAPI (Python), async |
| AI Engine | Google Gemini 2.5 Flash (Vision + NLP) |
| Mobile | React Native + Expo (Android) |
| Data | In-memory stores (session-based), python-dotenv for config |

## Quick Start

### Backend

```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at `http://localhost:8000` — API docs at `http://localhost:8000/docs`

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/parse_sms` | POST | AI SMS parsing |
| `/api/chat` | POST | AI chatbot |
| `/api/predict_risk` | POST | Income risk prediction |
| `/api/decode_message` | POST | Message decoder |
| `/api/unified_dashboard` | POST | Earnings aggregation |
| `/api/simplify_scheme` | POST | Scheme simplifier |
| `/api/recommend_schemes` | POST | Scheme recommendations |
| `/api/verify_document` | POST | Document verification |
| `/api/export_earnings` | GET | Export user data |
| `/api/privacy_settings` | GET | Permission toggles |
| `/api/delete_all_data` | DELETE | Delete all stored data |

Full interactive docs: `http://localhost:8000/docs`

## Project Structure

```
ArthikSetu/
├── Backend/
│   ├── main.py                 # FastAPI app — all endpoints
│   ├── gemini_service.py       # Google Gemini AI integration
│   ├── sms_parser.py           # SMS parsing logic
│   ├── schemes.py              # Government schemes data
│   ├── test_e2e.py             # End-to-end test suite
│   ├── requirements.txt
│   └── .env.example
├── Frontend/
│   ├── src/
│   │   ├── App.tsx             # Root — state-based routing
│   │   ├── config.ts           # API base URL
│   │   └── components/
│   │       ├── DashboardPage.tsx
│   │       ├── UnifiedDashboard.tsx
│   │       ├── SMSAnalyzer.tsx
│   │       ├── AIAssistantPage.tsx
│   │       ├── DocumentVerification.tsx
│   │       ├── PrivacyDashboard.tsx
│   │       ├── PrivacyBadge.tsx
│   │       ├── MessageDecoder.tsx
│   │       ├── SchemesPage.tsx
│   │       ├── TaxPage.tsx
│   │       ├── Loans.tsx
│   │       ├── ReportsPage.tsx
│   │       ├── ProfilePage.tsx
│   │       └── Navigation.tsx
│   ├── package.json
│   └── vite.config.ts
├── Mobile/                     # React Native / Expo app
├── FEATURES_GUIDE.md
├── TESTING_GUIDE.md
└── README.md
```

## Security & Privacy

- **Minimal data collection** — only last 4 digits + name extracted from documents
- **Zero storage** — images deleted from memory immediately after verification
- **In-memory processing** — no disk writes for sensitive data
- **DPDP Act 2023** — compliant with India's data protection law
- **User-controlled** — toggle permissions, export data, or delete everything from Privacy Dashboard
- **CORS** configured for frontend-backend communication
- **Environment variables** for API keys (never hardcoded)

## Testing

```bash
cd Backend
python test_e2e.py
```

Runs 23 automated tests covering all API endpoints.

## Mobile

```bash
cd Frontend
npm run build
npx cap sync
npx cap open android
```

## License

MIT

---

**Made with care for India's gig workers.**
