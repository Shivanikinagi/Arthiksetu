# 🇮🇳 ArthikSetu: AI-Powered Platform for India's Gig Economy Workers

**ArthikSetu** is a comprehensive financial platform designed to empower India's gig workers (delivery partners, drivers, freelancers) with AI-powered tools for income tracking, financial planning, and access to government benefits.

## ✨ All Features Implemented & Working

### 1. 📊 **Unified Earnings Dashboard**
- Aggregates income across multiple gig platforms (Swiggy, Zomato, Uber, Ola, UrbanCompany)
- Visual analytics with Bar and Pie charts
- Platform-wise breakdown and diversification scoring
- Real-time earnings summary

### 2. 🧠 **Smart SMS Understanding (AI-based NLP)**
- **AI-Powered** SMS parsing using Google Gemini (not regex!)
- Automatically extracts earnings from bank/platform SMS
- Detects transaction type, amount, merchant, and date
- Supports all major gig platforms

### 3. 💬 **AI Earnings Assistant (Chatbot)**
- Conversational AI interface for income queries
- Financial advice tailored for gig workers
- Government scheme recommendations
- Persistent chat history per session

### 4. 📈 **Income Risk Prediction**
- Predicts potential low-earning periods
- Risk level classification (Low/Medium/High)
- Actionable suggestions to mitigate risks
- Trend analysis (improving/stable/declining)

### 5. 🔍 **Financial Message Decoder**
- Explains confusing bank/platform messages
- Simple language (Hinglish) explanations
- Helps understand complex financial terms
- Example message templates

### 6. 🏛️ **Government Scheme Simplifier & Recommender**
- Personalized scheme recommendations based on profile
- Simplified explanations in plain language
- Eligibility criteria clearly displayed
- Direct application links

### 7. ✅ **Document Upload & Verification**
- AI-powered verification using Gemini Vision
- Supports: Aadhaar, PAN, Driving License, Voter ID, Passport
- OCR and data extraction
- Confidence scores and validation results

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS + Shadcn/UI
- **Charts**: Recharts
- **Mobile**: Capacitor (Android support)

### Backend
- **Framework**: FastAPI (async Python)
- **Alternative**: Django REST Framework (included)
- **Database**: SQLite / Firebase
- **AI Engine**: Google Gemini 1.5 Flash
- **Libraries**: 
  - `google-generativeai` - AI/ML
  - `pydantic` - Data validation
  - `python-multipart` - File uploads
  - `numpy` - Data processing

## 🚀 Quick Start

### Option 1: Use Quick Start Scripts

**Windows:**
```bash
quick_start.bat
```

**Linux/Mac:**
```bash
chmod +x quick_start.sh
./quick_start.sh
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd Backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Server will be at http://localhost:8000
# API docs at http://localhost:8000/docs
```

#### Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Application will be at http://localhost:5173
```

## 📖 Usage

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

### Features Navigation
1. **Dashboard** - View unified earnings and platform breakdown
2. **AI Chatbot** - Chat with AI assistant for financial advice
3. **SMS Analyzer** - Paste SMS messages for automatic parsing
4. **Message Decoder** - Decode confusing financial messages
5. **Document Verification** - Upload and verify identity documents
6. **Government Schemes** - Get personalized scheme recommendations

## 🎯 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/parse_sms` | POST | AI-based SMS parsing |
| `/api/chat` | POST | AI chatbot |
| `/api/predict_risk` | POST | Income risk prediction |
| `/api/decode_message` | POST | Message decoder |
| `/api/unified_dashboard` | POST | Earnings aggregation |
| `/api/simplify_scheme` | POST | Scheme recommendations |
| `/api/verify_document` | POST | Document verification |

📚 **Full API documentation:** See [FEATURES_GUIDE.md](FEATURES_GUIDE.md)

## 🧪 Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing instructions.

Quick test:
```bash
# Test AI SMS Parsing
curl -X POST "http://localhost:8000/api/parse_sms" \
  -H "Content-Type: application/json" \
  -d '{"messages": ["Your UPI transaction to Swiggy for Rs.450 is successful"]}'
```

## 📁 Project Structure

```
Arthiksetu/
├── Backend/
│   ├── main.py                 # FastAPI application
│   ├── gemini_service.py       # AI/ML services
│   ├── sms_parser.py           # SMS parsing logic
│   ├── schemes.py              # Government schemes
│   └── requirements.txt        # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UnifiedDashboard.tsx
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── MessageDecoder.tsx
│   │   │   ├── DocumentVerification.tsx
│   │   │   └── ...
│   │   └── App.tsx
│   └── package.json
├── FEATURES_GUIDE.md          # Complete feature documentation
├── TESTING_GUIDE.md           # Testing instructions
├── quick_start.bat            # Windows quick start
└── quick_start.sh             # Linux/Mac quick start
```

## 🔒 Security & Privacy

- Gemini API key configured (use environment variables in production)
- No user data stored without consent
- Document processing happens in-memory
- CORS configured for frontend-backend communication
- Session-based chat history (non-persistent)

## 📱 Mobile Support

The application is fully responsive and can be built for Android:

```bash
cd Frontend
npm run build
npx cap sync
npx cap open android
```

## 🆘 Troubleshooting

### Backend won't start
```bash
# Verify Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend won't connect
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### AI features not working
- Check Gemini API key in `Backend/gemini_service.py`
- Verify internet connection
- Check API quotas at https://ai.google.dev/

## 📊 Feature Status

| Feature | Status | Documentation |
|---------|--------|---------------|
| Unified Dashboard | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#1-unified-earnings-dashboard-) |
| AI SMS Parsing | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#2-smart-sms-understanding-ai-based-nlp-) |
| AI Chatbot | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#3-ai-earnings-assistant-chatbot-) |
| Risk Prediction | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#4-income-risk-prediction-) |
| Message Decoder | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#5-financial-message-decoder-) |
| Scheme Recommender | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#6-government-scheme-simplifier--recommender-) |
| Document Verification | ✅ Complete | [FEATURES_GUIDE.md](FEATURES_GUIDE.md#7-document-upload--verification-) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ for India's Gig Workers**
