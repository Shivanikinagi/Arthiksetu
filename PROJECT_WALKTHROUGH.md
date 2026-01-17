# 🌉 ArthikSetu: Project Walkthrough & Team Guide

## 🚀 Vision
**ArthikSetu** is a unified financial platform designed specifically for India's Gig Economy workers (Uber drivers, Swiggy/Zomato delivery partners, Freelancers). It acts as a bridge ("Setu") to financial stability by tracking earnings, simplifying taxes, and connecting workers to government benefits.

---

## 🛠️ How It Works (The "Big Picture")

Think of ArthikSetu as a smart assistant that lives in your phone and does three main things:

1.  **Tracks Your Money**: It looks at your SMS messages to automatically figure out how much you earned from different apps (Swiggy, Zomato, etc.) so you don't have to enter it manually.
2.  **Finds You Benefits**: It looks at your profile (age, income, job) and tells you exactly which Government Schemes you are eligible for.
3.  **Verifies Your Identity**: It helps you upload and verify documents (like Aadhaar/PAN) to apply for loans or schemes.

---

## 🏗️ Technical Architecture (Under the Hood)

The project is built in two main parts:

### 1. The Frontend (What the User Sees) 🖥️
*   **Technology**: React (Vite) + TypeScript.
*   **Location**: `/Frontend` folder.
*   **Role**: This is the beautiful user interface. It shows the charts, buttons, and forms.
*   **Key Pages**:
    *   **Dashboard**: Shows a summary of total earnings and colorful cards for each income source.
    *   **AI Assistant**: A chat interface where users can paste SMS messages to analyze earnings.
    *   **Govt Schemes**: Displays recommended schemes based on the user's profile.
    *   **Profile**: Allows users to edit details and upload verification documents.

### 2. The Backend (The Brain) 🧠
*   **Technology**: Python (Django REST Framework).
*   **Location**: `/Backend` folder.
*   **Role**: This handles the logic, data storage, and AI processing.
*   **Key Features**:
    *   **Django Server**: Listens for requests from the frontend at `http://localhost:8000`.
    *   **Database (SQLite)**: Stores the list of income sources (`Swiggy`, `Zomato`) and monthly earning history.
    *   **SMS Parser (`sms_parser.py`)**: A smart script that uses "Regular Expressions" to read text messages and extract money amounts (e.g., "Credited Rs 500").
    *   **Recommendation Engine (`schemes.py`)**: A logic module that matches user attributes (like `income < 3L`) to a database of government schemes.

---

## 🔄 Data Flow (How It Connects)

1.  **User Action**: A user opens the **Dashboard** on the Frontend.
2.  **Request**: The Frontend sends a request to the Backend (`GET /api/dashboard`).
3.  **Processing**: The Django Backend queries the Database for `IncomeSource` records.
4.  **Response**: The Backend sends back JSON data (e.g., `{"name": "Swiggy", "amount": 12300}`).
5.  **Display**: The Frontend receives this and draws the colorful cards you see on screen.

---

## 🚀 How to Run the Project (For Developers)

To start working on the project, you need two terminals open:

### Terminal 1: Backend
```bash
cd Backend
# 1. Install dependencies (if new)
pip install -r requirements.txt
# 2. Run the server
python manage.py runserver
```
*Runs on: http://localhost:8000*

### Terminal 2: Frontend
```bash
cd Frontend
# 1. Install dependencies (if new)
npm install
# 2. Start the UI
npm run dev
```
*Runs on: http://localhost:3000*

---

## 📂 Key Files to Know

*   `Frontend/src/App.tsx`: The main entry point that handles routing (navigation between pages).
*   `Frontend/src/components/DashboardPage.tsx`: The main dashboard UI code.
*   `Backend/app/views.py`: The API "controllers" that decide what happens when the frontend asks for data.
*   `Backend/sms_parser.py`: The core AI logic for reading SMS messages.
