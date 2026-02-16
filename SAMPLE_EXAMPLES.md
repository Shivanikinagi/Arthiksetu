# 🎯 Sample Examples to Try All Features

This guide provides ready-to-use examples to test every feature of ArthikSetu.

---

## 🚀 Getting Started

### 1. Start the Backend
```bash
cd Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
**Test it:** Open http://localhost:8000/docs in your browser

### 2. Start the Frontend
```bash
cd Frontend
npm run dev
```
**Test it:** Open http://localhost:5173 in your browser

---

## 📊 Feature 1: Unified Earnings Dashboard

### Sample Data to Try:

**Example 1: Multi-Platform Earnings**
```json
{
  "platform_data": {
    "Swiggy": 18500,
    "Zomato": 15200,
    "Uber": 22000,
    "Ola": 12800,
    "UrbanCompany": 8500
  },
  "total_earnings": 77000
}
```

**Example 2: Single Platform Focus**
```json
{
  "platform_data": {
    "Swiggy": 45000,
    "Zomato": 5000
  },
  "total_earnings": 50000
}
```

**Example 3: Diversified Portfolio**
```json
{
  "platform_data": {
    "Swiggy": 12000,
    "Zomato": 11500,
    "Uber": 13200,
    "Ola": 12800,
    "UrbanCompany": 10500
  },
  "total_earnings": 60000
}
```

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/unified_dashboard`
- **Via Frontend:** Navigate to Unified Dashboard and data will be visualized
- **Expected Output:** Bar charts, pie charts, diversification score, top platform

---

## 📱 Feature 2: Smart SMS Understanding (AI-based NLP)

### Sample SMS Messages to Try:

**Example 1: Swiggy Earnings**
```
Your UPI transaction to Swiggy for Rs.450.50 is successful on 15-Feb-2025
```

**Example 2: Zomato Payment**
```
Rs.1250 credited from Zomato Payments to your account HDFC XX4567 on 14-Feb-2025
```

**Example 3: Uber Earnings**
```
You received Rs.2340 from Uber Technologies. Txn ID: UBR123456789. Date: 13-Feb-2025
```

**Example 4: Ola Ride Payment**
```
INR 890.00 credited by OLA CABS to A/c XX9876 on 12-FEB-25
```

**Example 5: UrbanCompany Service**
```
Payment of Rs.1500 received from Urban Company for service completed on 11-Feb-2025
```

**Example 6: Multiple Platform Messages (Batch Test)**
```json
{
  "messages": [
    "Your UPI transaction to Swiggy for Rs.450 is successful",
    "Rs.1200 credited from Zomato on 15-Jan-2025",
    "Uber paid you Rs.2340. Check your app.",
    "INR 890 credited by OLA CABS to your account",
    "Payment of Rs.1500 received from Urban Company"
  ]
}
```

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/parse_sms`
- **Via Frontend:** Paste messages into AI Assistant / SMS Parser
- **Expected Output:** Extracted platform, amount, date, transaction type, description

---

## 💬 Feature 3: AI Earnings Assistant (Chatbot)

### Sample Questions to Ask:

**Financial Planning:**
1. "How can I increase my monthly earnings?"
2. "What should I do during low-income months?"
3. "How do I diversify my income sources?"
4. "Should I work on multiple platforms?"

**Income Tracking:**
5. "How do I track my earnings across different platforms?"
6. "What's the best way to manage gig economy income?"
7. "How can I predict my monthly income?"

**Tax & Savings:**
8. "Do I need to pay income tax?"
9. "How much should I save each month?"
10. "What are good investment options for gig workers?"

**Government Schemes:**
11. "What government schemes are available for delivery partners?"
12. "Am I eligible for PM-SVANidhi loan?"
13. "How can I get health insurance as a gig worker?"

**Platform Specific:**
14. "How do Swiggy incentives work?"
15. "What are the peak hours for Uber earnings?"
16. "How can I improve my ratings?"

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/chat`
```json
{
  "message": "How can I increase my monthly earnings?",
  "session_id": "test_session_001"
}
```
- **Via Frontend:** Open chatbot and type questions
- **Expected Output:** Contextual AI responses with financial advice

---

## 📈 Feature 4: Income Risk Prediction

### Sample Earning Data to Try:

**Example 1: Stable Earnings**
```json
{
  "data": [
    {"date": "2025-01", "amount": 45000},
    {"date": "2025-02", "amount": 48000},
    {"date": "2025-03", "amount": 46500},
    {"date": "2025-04", "amount": 47000},
    {"date": "2025-05", "amount": 49000},
    {"date": "2025-06", "amount": 48500}
  ]
}
```

**Example 2: Declining Trend**
```json
{
  "data": [
    {"date": "2025-01", "amount": 55000},
    {"date": "2025-02", "amount": 48000},
    {"date": "2025-03", "amount": 42000},
    {"date": "2025-04", "amount": 38000},
    {"date": "2025-05", "amount": 32000},
    {"date": "2025-06", "amount": 28000}
  ]
}
```

**Example 3: Volatile Income**
```json
{
  "data": [
    {"date": "2025-01", "amount": 50000},
    {"date": "2025-02", "amount": 30000},
    {"date": "2025-03", "amount": 55000},
    {"date": "2025-04", "amount": 25000},
    {"date": "2025-05", "amount": 60000},
    {"date": "2025-06", "amount": 20000}
  ]
}
```

**Example 4: Growing Income**
```json
{
  "data": [
    {"date": "2025-01", "amount": 30000},
    {"date": "2025-02", "amount": 35000},
    {"date": "2025-03", "amount": 42000},
    {"date": "2025-04", "amount": 48000},
    {"date": "2025-05", "amount": 52000},
    {"date": "2025-06", "amount": 58000}
  ]
}
```

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/predict_risk`
- **Via Frontend:** View in Unified Dashboard (automatically calculated)
- **Expected Output:** Risk level (Low/Medium/High), score, predicted low months, suggestions, trend

---

## 🔍 Feature 5: Financial Message Decoder

### Sample Messages to Decode:

**Example 1: Bank Transaction**
```
Your a/c XX1234 is debited by Rs.2500 for loan EMI payment ref no 123456789 on 15-Feb-2025
```

**Example 2: Credit Card Bill**
```
Your HDFC CC XX4567 billed Rs.8,999.50. Min due Rs.450. Pay by 28-Feb-2025 to avoid finance charges
```

**Example 3: Insurance Premium**
```
Rs.12,000 debited from A/c XX9876 towards premium payment for Policy No 789456123 LIC of India
```

**Example 4: Mutual Fund**
```
Your SIP of Rs.5000 in HDFC Balanced Advantage Fund processed. Units allotted: 234.56 at NAV 21.32
```

**Example 5: Platform Fee Deduction**
```
Service charge of Rs.850 debited for platform commission and GST. Net earnings: Rs.6150
```

**Example 6: Wallet Recharge**
```
Paytm wallet recharged Rs.1000. Cashback of Rs.50 credited. Wallet balance: Rs.2150
```

**Example 7: Confusing Tax Message**
```
TDS of Rs.4500 deducted u/s 194C for FY 2024-25. Form 26AS will reflect this deduction
```

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/decode_message`
```json
{
  "message": "Your a/c XX1234 is debited by Rs.2500 for loan EMI payment"
}
```
- **Via Frontend:** Paste message in Message Decoder
- **Expected Output:** Simple explanation in plain language (Hinglish supported)

---

## 🏛️ Feature 6: Government Scheme Recommender

### Sample User Profiles to Try:

**Example 1: Young Delivery Partner**
```json
{
  "age": 28,
  "income": 250000,
  "occupation": "delivery partner",
  "category": "General"
}
```
**Expected Schemes:** PM-SVANidhi, Pradhan Mantri Jan Dhan Yojana

**Example 2: Senior Citizen Driver**
```json
{
  "age": 62,
  "income": 180000,
  "occupation": "driver",
  "category": "General"
}
```
**Expected Schemes:** Pradhan Mantri Vaya Vandana Yojana, Atal Pension Yojana

**Example 3: SC/ST Freelancer**
```json
{
  "age": 35,
  "income": 320000,
  "occupation": "freelancer",
  "category": "SC"
}
```
**Expected Schemes:** Stand-Up India, MUDRA Loan, National SC/ST Hub

**Example 4: Female Gig Worker**
```json
{
  "age": 30,
  "income": 200000,
  "occupation": "delivery partner",
  "category": "General",
  "gender": "Female"
}
```
**Expected Schemes:** Mudra Yojana (Women Priority), Stand-Up India

**Example 5: Low Income Worker**
```json
{
  "age": 25,
  "income": 120000,
  "occupation": "delivery partner",
  "category": "General"
}
```
**Expected Schemes:** PM-SVANidhi, Ayushman Bharat, PMJDY

**How to Test:**
- **Via API:** POST to `http://localhost:8000/api/recommend_schemes`
- **Via Frontend:** Navigate to Government Schemes section
- **Expected Output:** List of eligible schemes with simple explanations, benefits, and application links

---

## ✅ Feature 7: Document Verification

### Sample Documents to Test:

**Supported Document Types:**
1. **Aadhaar Card**
2. **PAN Card**
3. **Driving License**
4. **Voter ID**
5. **Passport**

**How to Test:**

**Option 1: Using Sample Images**
1. Find sample document images online (use dummy/demo documents only)
2. Upload via Frontend document verification page
3. Select document type
4. Click "Verify Document"

**Option 2: Using API with Base64**
```bash
# Convert image to base64
# Use online tools or command line

# POST to http://localhost:8000/api/verify_document
# Content-Type: multipart/form-data
# Body:
#   - file: [your_image.jpg]
#   - doc_type: "Aadhaar"
```

**Expected Output:**
- Verification status (Valid/Invalid)
- Extracted ID number
- Confidence score
- Validation details
- Document type confirmation

**Test Cases:**
- ✅ Clear, good quality document image
- ❌ Blurry or low quality image
- ❌ Wrong document type selected
- ✅ Multiple pages (for passport)

---

## 🧪 Complete Testing Workflow

### Test Scenario: Complete Gig Worker Journey

**Step 1: Track SMS Earnings**
```
Messages to paste:
- "Rs.1200 credited from Zomato on 15-Feb-2025"
- "Uber paid you Rs.2340"
- "Your UPI transaction to Swiggy for Rs.450 is successful"
```

**Step 2: View Unified Dashboard**
```json
{
  "platform_data": {
    "Swiggy": 450,
    "Zomato": 1200,
    "Uber": 2340
  },
  "total_earnings": 3990
}
```

**Step 3: Check Risk Prediction**
```json
{
  "data": [
    {"date": "2024-12", "amount": 45000},
    {"date": "2025-01", "amount": 48000},
    {"date": "2025-02", "amount": 3990}
  ]
}
```

**Step 4: Ask Chatbot for Advice**
```
"My earnings dropped from 48000 to 3990 this month. What should I do?"
```

**Step 5: Decode Confusing Message**
```
"Service charge of Rs.850 debited for platform commission and GST"
```

**Step 6: Find Government Schemes**
```json
{
  "age": 28,
  "income": 250000,
  "occupation": "delivery partner",
  "category": "General"
}
```

**Step 7: Verify Documents**
Upload Aadhaar and PAN card images for verification

---

## 📊 Expected Results Summary

| Feature | Input | Expected Output |
|---------|-------|-----------------|
| SMS Parser | Text message | Platform, amount, date extracted |
| Unified Dashboard | Platform earnings | Charts, diversification score |
| Risk Prediction | Historical data | Risk level, suggestions |
| Chatbot | Question | Personalized advice |
| Message Decoder | Complex message | Simple explanation |
| Scheme Recommender | User profile | Eligible schemes list |
| Document Verify | Document image | Validation status, extracted data |

---

## 🐛 Troubleshooting Examples

### Issue: Risk Prediction shows "High Risk"
**Try this:**
```json
{
  "data": [
    {"date": "2025-01", "amount": 50000},
    {"date": "2025-02", "amount": 48000},
    {"date": "2025-03", "amount": 52000}
  ]
}
```
**Expected:** Lower risk with stable earnings

### Issue: SMS not parsing correctly
**Try standard format:**
```
Rs.1234 credited from Swiggy on 15-Feb-2025
```
**Avoid:** Too vague messages without amounts or dates

### Issue: No schemes recommended
**Try lower income:**
```json
{
  "age": 25,
  "income": 150000,
  "occupation": "delivery partner",
  "category": "General"
}
```

---

## 🎯 Quick Test Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:5173
- [ ] SMS Parser extracting amounts correctly
- [ ] Chatbot responding to questions
- [ ] Risk prediction showing risk levels
- [ ] Message decoder explaining messages
- [ ] Schemes recommended based on profile
- [ ] Document verification working
- [ ] Charts displaying on dashboard
- [ ] API documentation accessible at /docs

---

## 💡 Pro Tips

1. **Use API Docs:** Visit http://localhost:8000/docs to test APIs interactively
2. **Check Console:** Open browser DevTools to see API responses
3. **Test Edge Cases:** Try invalid inputs to see error handling
4. **Mix Features:** Upload SMS, then check dashboard, then ask chatbot
5. **Save Examples:** Keep your favorite test cases for quick testing

---

## 📞 Sample Questions for Each Feature

### For Unified Dashboard:
- "Which platform gives me the most earnings?"
- "Am I diversified enough?"

### For SMS Parser:
- "Parse this: Rs.1200 from Zomato"

### For Chatbot:
- "How can I earn more during festivals?"
- "What's the best time to work?"

### For Risk Prediction:
- "Will my earnings drop next month?"
- "What can I do to stabilize income?"

### For Message Decoder:
- "What does TDS mean?"
- "Explain this bank message to me"

### For Schemes:
- "What loans am I eligible for?"
- "Any health insurance schemes?"

### For Document Verification:
- "Verify my Aadhaar card"
- "Is my PAN card valid?"

---

**🎉 You're all set! Start testing all features and explore ArthikSetu!**
