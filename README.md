# ArthikSetu - Empowering India's Gig Economy 🇮🇳

![ArthikSetu Banner](https://via.placeholder.com/1200x400/0A1F44/ffffff?text=ArthikSetu+Financial+Bridge)

**ArthikSetu** is a comprehensive financial wellness platform tailored for the unique needs of India's 15M+ gig workers. We bridge the gap between hard work and financial stability by providing a unified interface for earnings tracking, simplified financial insights, and direct access to eligible government schemes.

## 🚀 Key Features

### 📊 1. Unified Earnings Dashboard
*   **One-View Financials**: Aggregates income across multiple platforms (Swiggy, Zomato, Uber, Blinkit).
*   **Income Stability Score**: Proprietary AI score to measure financial health.
*   **Trend Analysis**: Visualizes daily, weekly, and monthly earning trends to identify peak periods.

### 🤖 2. Smart SMS Analyzer (AI-Powered)
*   **Zero-Entry Tracking**: Uses NLP (Natural Language Processing) to parse transaction SMS notifications automatically.
*   **Merchant categorization**: Smartly identifies sources like "Swiggy Credit" vs "Personal Transfer".
*   **Privacy First**: Runs purely on transaction text, isolating personal messages.

### 💬 3. AI Earnings Assistant
*   **24/7 Financial Guide**: A conversational chatbot (Hinglish supported) for queries like *"How can I save tax on 5 Lakh income?"*.
*   **Personalized Tips**: Gives actionable advice based on realtime earning data.

### 🔍 4. Scheme Recommender & Simplifier
*   **Eligibility Engine**: Matches worker profile (Age, Income, Occupation) with 100+ Central & State schemes.
*   **Jargon Buster**: Simplifies complex government circulars into 2-line easy explanations.

### 📜 5. Financial Message Decoder
*   **Bank-to-Human Translator**: Translates confusing banking SMS (e.g., "Amount Lien marked...") into simple language.

### 🆔 6. Instant Document Verification
*   **Vision AI**: Verifies KYC documents (Aadhaar, PAN, DL) instantly using computer vision.
*   **Fraud Detection**: Checks for document validity and consistency.

---

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), TypeScript, TailwindCSS, Lucide Icons, Recharts
*   **Backend**: Python (FastAPI), Google Gemini 2.5 Flash (LLM), Pydantic
*   **AI/ML**: Google Generative AI (NLP & Vision)

---

## ⚙️ Quick Start Guide

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Shivanikinagi/Arthiksetu.git
cd Arthiksetu
```

### 2️⃣ Automatic Setup (Windows)
Simply double-click the `start_app.bat` file in the root directory. This will:
1.  Install Python dependencies.
2.  Install Node.js dependencies.
3.  Launch both Backend and Frontend servers.

### 3️⃣ Manual Setup

**Backend:**
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

---

## 📸 Screenshots

| Dashboard | Chatbot |
|:---:|:---:|
| *(Add Dashboard Screenshot)* | *(Add Chatbot Screenshot)* |

---

## 🤝 Contribution
Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
