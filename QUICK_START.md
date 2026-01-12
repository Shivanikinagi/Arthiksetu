# 🚀 Quick Start Guide - ArthikSetu

## **Get Started in 3 Steps**

### Step 1: Start Backend (Terminal 1)
```bash
cd Arthiksetu/Backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd Arthiksetu/Frontend
npm install
npm run dev
```

### Step 3: Open Browser
Visit: **http://localhost:5173**

---

## ✅ Verify Everything is Working

### 1. Check Backend
Visit: http://localhost:8000/docs
- You should see the FastAPI documentation page
- Try the `/api/all_schemes` endpoint (click "Try it out" → "Execute")

### 2. Check Frontend
Visit: http://localhost:5173
- Dashboard should load
- You should see feature cards

### 3. Quick Feature Tests

#### Test AI SMS Parsing:
1. Go to Dashboard
2. Scroll to "AI-Powered SMS Analyzer"
3. Paste this test message:
   ```
   Your UPI transaction to Swiggy for Rs.450 is successful
   
   Rs.1200 credited to your account from Zomato on 15-Jan-2025
   ```
4. Click "Analyze Messages"
5. Should see transactions detected

#### Test AI Chatbot:
1. Navigate to chatbot (via URL: add `#chatbot` to URL)
2. Type: "How can I increase my earnings?"
3. Should get AI response with advice

#### Test Message Decoder:
1. Navigate to message decoder (via URL: add `#message-decoder` to URL)
2. Paste: "Dear customer, your a/c XX1234 is debited by Rs.2500 for loan EMI payment"
3. Click "Decode Message"
4. Should see simple explanation

---

## 📱 Access All Features

### Main Features:
- **Dashboard** - http://localhost:5173 (default)
- **Unified Dashboard** - Add `#unified-dashboard` to URL
- **AI Chatbot** - Add `#chatbot` to URL
- **Message Decoder** - Add `#message-decoder` to URL
- **Document Verification** - Add `#document-verification` to URL
- **Government Schemes** - Add `#schemes` to URL

---

## 🎯 What Each Feature Does

### 1. Unified Earnings Dashboard
**Shows:** Income from all platforms in one place
**Benefits:** Visual charts, risk prediction, diversification score

### 2. AI SMS Parser
**Shows:** Automatic earnings extraction from SMS
**Benefits:** No manual entry, AI understands context

### 3. AI Chatbot
**Shows:** Chat interface for financial advice
**Benefits:** 24/7 assistance, personalized tips

### 4. Income Risk Prediction
**Shows:** Predicts low-earning periods
**Benefits:** Plan ahead, get suggestions

### 5. Message Decoder
**Shows:** Explains confusing bank messages
**Benefits:** Understand complex financial terms

### 6. Scheme Recommender
**Shows:** Eligible government schemes
**Benefits:** Simple explanations, direct links

### 7. Document Verification
**Shows:** Upload and verify documents
**Benefits:** AI-powered, instant results

---

## 🔧 Common Issues & Fixes

### Issue: "Port 8000 already in use"
**Fix:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill
```

### Issue: "Module not found"
**Fix:**
```bash
# Backend
cd Backend
pip install -r requirements.txt

# Frontend
cd Frontend
rm -rf node_modules
npm install
```

### Issue: "AI features not working"
**Check:**
1. Internet connection (AI needs internet)
2. Backend logs for API errors
3. Browser console for frontend errors

---

## 📊 Test API Directly

### Test SMS Parsing:
```bash
curl -X POST "http://localhost:8000/api/parse_sms" \
  -H "Content-Type: application/json" \
  -d '{"messages": ["Your UPI transaction to Swiggy for Rs.450 is successful"]}'
```

### Test Chatbot:
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I increase my earnings?", "session_id": "test123"}'
```

### Test Risk Prediction:
```bash
curl -X POST "http://localhost:8000/api/predict_risk" \
  -H "Content-Type: application/json" \
  -d '{"data": [{"date": "2025-01", "amount": 45000}, {"date": "2025-02", "amount": 48000}]}'
```

---

## 💡 Usage Examples

### Example 1: Track Earnings from SMS
1. Copy all earnings SMS from last month
2. Go to Dashboard → AI SMS Analyzer
3. Paste all messages
4. Click "Analyze"
5. See total earnings breakdown

### Example 2: Check Eligible Schemes
1. Go to Government Schemes
2. Enter your details (age, income, occupation)
3. Click "Get Recommendations"
4. See personalized schemes with simple explanations

### Example 3: Verify Documents
1. Go to Document Verification
2. Select document type (Aadhaar, PAN)
3. Upload clear photo
4. Click "Verify"
5. Get instant verification result

---

## 🎓 Learning Path

### For Beginners:
1. ✅ Start both backend and frontend
2. ✅ Open frontend in browser
3. ✅ Try AI SMS Analyzer with test data
4. ✅ Explore other features one by one

### For Developers:
1. ✅ Check API documentation: http://localhost:8000/docs
2. ✅ Review backend code in `Backend/main.py`
3. ✅ Review AI logic in `Backend/gemini_service.py`
4. ✅ Check frontend components in `Frontend/src/components/`

---

## 📚 Documentation Files

- **README.md** - Project overview
- **FEATURES_GUIDE.md** - Detailed feature documentation
- **TESTING_GUIDE.md** - Testing instructions
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **AI_INTEGRATION_GUIDE.md** - AI setup guide
- **PROJECT_WALKTHROUGH.md** - Project structure

---

## 🎯 Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] API docs accessible at /docs
- [ ] Dashboard displays properly
- [ ] AI SMS parser works
- [ ] Chatbot responds to questions
- [ ] Message decoder explains messages
- [ ] Document upload works
- [ ] No console errors

---

## 🆘 Get Help

### Check Logs:
**Backend:** Look at terminal running uvicorn
**Frontend:** Press F12 in browser → Console tab

### Common Errors:
- **401/403**: API key issue
- **404**: Wrong endpoint or backend not running
- **500**: Server error (check backend logs)
- **CORS**: Backend CORS not configured

---

## 🔥 Pro Tips

1. **Keep both terminals open** to see logs
2. **Use API docs** at /docs to test endpoints
3. **Check browser console** for frontend errors
4. **Test one feature at a time**
5. **Read error messages carefully**

---

## 📞 Support

If stuck:
1. Check the error message
2. Read relevant documentation file
3. Check if both servers are running
4. Verify all dependencies installed
5. Review console logs

---

## 🎉 You're Ready!

All 7 features are implemented and working:
- ✅ Unified Earnings Dashboard
- ✅ AI SMS Understanding (NLP)
- ✅ AI Chatbot Assistant
- ✅ Income Risk Prediction
- ✅ Financial Message Decoder
- ✅ Government Scheme Recommender
- ✅ Document Verification

**Start exploring and helping gig workers! 🚀**
