# Testing Guide for ArthikSetu Features

## Quick Test Commands

### 1. Test AI SMS Parsing (NLP-based)
```bash
curl -X POST "http://localhost:8000/api/parse_sms" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      "Your UPI transaction to Swiggy for Rs.450 is successful",
      "Rs.1200 credited to your account from Zomato on 15-Jan-2025",
      "Dear customer, Rs.800 debited for Uber trip"
    ]
  }'
```

**Expected Response:**
- List of transactions with amount, merchant, type (credit/debit), description
- Summary with total_credit and total_debit

---

### 2. Test AI Chatbot
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I increase my earnings as a gig worker?",
    "session_id": "test_session_1"
  }'
```

**Expected Response:**
- Helpful AI response with advice
- Session ID for conversation continuity

---

### 3. Test Income Risk Prediction
```bash
curl -X POST "http://localhost:8000/api/predict_risk" \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"date": "2025-01", "amount": 45000},
      {"date": "2025-02", "amount": 48000},
      {"date": "2025-03", "amount": 42000},
      {"date": "2025-04", "amount": 51000},
      {"date": "2025-05", "amount": 39000}
    ]
  }'
```

**Expected Response:**
- risk_level: Low/Medium/High
- risk_score: 0-100
- predicted_low_months: array of months
- suggestions: array of tips
- trend: improving/stable/declining

---

### 4. Test Financial Message Decoder
```bash
curl -X POST "http://localhost:8000/api/decode_message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Dear customer, your a/c XX1234 is debited by Rs.2500 for loan EMI payment"
  }'
```

**Expected Response:**
- Simple explanation of the message in plain language

---

### 5. Test Unified Dashboard
```bash
curl -X POST "http://localhost:8000/api/unified_dashboard" \
  -H "Content-Type: application/json" \
  -d '{
    "platform_data": {
      "Swiggy": 15000,
      "Zomato": 12000,
      "Uber": 18000,
      "Ola": 8000,
      "UrbanCompany": 10000
    },
    "total_earnings": 63000
  }'
```

**Expected Response:**
- total_earnings
- platform_breakdown
- top_platform
- platform_count
- average_per_platform
- diversification_score

---

### 6. Test Government Scheme Recommender
```bash
curl -X POST "http://localhost:8000/api/recommend_schemes" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "income": 250000,
    "occupation": "delivery partner",
    "category": "General"
  }'
```

**Expected Response:**
- List of eligible schemes with status
- Scheme details and benefits

---

### 7. Test Scheme Simplifier
```bash
curl -X POST "http://localhost:8000/api/simplify_scheme" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "income": 250000,
    "occupation": "delivery partner"
  }'
```

**Expected Response:**
- Simplified explanations for each scheme
- Easy-to-understand benefits and eligibility

---

### 8. Test Document Verification
```bash
# Using curl with file upload
curl -X POST "http://localhost:8000/api/verify_document" \
  -F "file=@/path/to/aadhaar.jpg" \
  -F "doc_type=Aadhaar"
```

**Expected Response:**
- status: verified or rejected
- extracted_id: document number (if found)
- confidence_score
- reason: explanation

---

## Frontend Testing Checklist

### ✅ Unified Dashboard (`/unified-dashboard`)
- [ ] Shows total earnings
- [ ] Displays platform breakdown
- [ ] Bar chart renders correctly
- [ ] Pie chart renders correctly
- [ ] Risk prediction card displays
- [ ] Refresh button works

### ✅ AI Chatbot (`/chatbot`)
- [ ] Chat interface loads
- [ ] Can send messages
- [ ] AI responds appropriately
- [ ] Quick questions work
- [ ] Chat history persists during session
- [ ] Loading indicator shows

### ✅ Message Decoder (`/message-decoder`)
- [ ] Can paste messages
- [ ] Decode button works
- [ ] Simple explanation displays
- [ ] Example messages can be loaded
- [ ] Error handling works

### ✅ Document Verification (`/document-verification`)
- [ ] Can select document type
- [ ] File upload works
- [ ] Preview shows uploaded image
- [ ] Verification processes
- [ ] Results display correctly
- [ ] Confidence score shows

### ✅ AI SMS Analyzer (Dashboard)
- [ ] Can paste SMS messages
- [ ] AI parsing works (not regex)
- [ ] Transactions list displays
- [ ] Summary shows credit/debit totals
- [ ] Multiple messages supported
- [ ] Transaction details expandable

### ✅ Government Schemes
- [ ] Schemes load from API
- [ ] Eligibility filtering works
- [ ] Scheme cards display
- [ ] Benefits clearly shown
- [ ] Application links work

---

## Common Issues and Solutions

### Issue: Backend not starting
**Solution:**
```bash
cd Backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Issue: AI features returning errors
**Solution:**
- Check Gemini API key in `gemini_service.py`
- Verify internet connection
- Check API quotas at Google AI Studio

### Issue: Frontend not connecting to backend
**Solution:**
- Verify backend is running on port 8000
- Check CORS settings in `main.py`
- Clear browser cache

### Issue: Document upload failing
**Solution:**
- Check file size (< 10MB)
- Verify file format (PNG, JPG)
- Ensure `python-multipart` is installed

---

## Performance Testing

### Load Testing Commands

```bash
# Test API response time
time curl -X POST "http://localhost:8000/api/parse_sms" \
  -H "Content-Type: application/json" \
  -d '{"messages": ["Test message"]}'

# Multiple concurrent requests
for i in {1..10}; do
  curl -X POST "http://localhost:8000/api/chat" \
    -H "Content-Type: application/json" \
    -d '{"message": "Test '$i'", "session_id": "test_'$i'"}' &
done
wait
```

---

## API Documentation

Once backend is running, visit:
- **Interactive API Docs:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

---

## Feature Verification Checklist

| Feature | Backend API | Frontend Component | Tested |
|---------|-------------|-------------------|---------|
| SMS Parsing (AI) | ✅ `/api/parse_sms` | ✅ AIAssistant.tsx | ⬜ |
| Chatbot | ✅ `/api/chat` | ✅ AIChatbot.tsx | ⬜ |
| Risk Prediction | ✅ `/api/predict_risk` | ✅ UnifiedDashboard.tsx | ⬜ |
| Message Decoder | ✅ `/api/decode_message` | ✅ MessageDecoder.tsx | ⬜ |
| Unified Dashboard | ✅ `/api/unified_dashboard` | ✅ UnifiedDashboard.tsx | ⬜ |
| Scheme Recommender | ✅ `/api/simplify_scheme` | ✅ GovtSchemes.tsx | ⬜ |
| Document Verification | ✅ `/api/verify_document` | ✅ DocumentVerification.tsx | ⬜ |

---

## Success Criteria

All features are working if:
1. ✅ Backend starts without errors
2. ✅ Frontend connects to backend
3. ✅ All API endpoints return valid responses
4. ✅ AI features use Gemini (not fallback)
5. ✅ Document upload and verification works
6. ✅ Charts render correctly
7. ✅ No console errors in browser

---

**Ready to test! 🚀**
