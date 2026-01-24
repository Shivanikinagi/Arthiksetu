# Deployment Guide for ArthikSetu

This guide will walk you through deploying both the Backend (Python/FastAPI) and Frontend (React/Vite) of ArthikSetu.

## 1. Prerequisites

-   GitHub Account
-   Render Account (for Backend)
-   Vercel Account (for Frontend)
-   Google Gemini API Key

## 2. Backend Deployment (Render)

We will deploy the Python FastAPI backend to Render.com.

1.  **Push Code to GitHub:** Ensure your project is pushed to a GitHub repository.
2.  **Login to Render:** Go to [dashboard.render.com](https://dashboard.render.com/) and create a new **Web Service**.
3.  **Connect Repo:** Select your linked GitHub repository.
4.  **Configuration:**
    -   **Root Directory:** `Arthiksetu/Backend`
    -   **Runtime:** `Python 3`
    -   **Build Command:** `pip install -r requirements.txt`
    -   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables:** Add the following key-value pairs in the "Environment" tab:
    -   `GEMINI_API_KEY`: (Your Google Gemini API Key)
6.  **Deploy:** Click **Create Web Service**. Wait for the specific URL (e.g., `https://arthiksetu-api.onrender.com`). **Copy this URL**.

## 3. Frontend Deployment (Vercel)

We will deploy the React frontend to Vercel.

1.  **Login to Vercel:** Go to [vercel.com](https://vercel.com/) and add a **New Project**.
2.  **Import Repo:** Select the same GitHub repository.
3.  **Configuration:**
    -   **Root Directory:** `Arthiksetu/Frontend` (Click "Edit" next to "Root Directory" if needed).
    -   **Framework Preset:** Vite
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `dist`
4.  **Environment Variables:**
    -   Vercel allows setting build-time environment variables.
    -   Add a new variable:
        -   **Name:** `VITE_API_URL`
        -   **Value:** `https://arthiksetu-api.onrender.com` (Paste the URL from Step 2)
5.  **Deploy:** Click **Deploy**.

## 4. Verification

1.  Open your Vercel deployment URL (e.g., `https://arthiksetu.vercel.app`).
2.  The application should load.
3.  The frontend is configured (`src/config.ts`) to automatically switch between `http://localhost:8000` (development) and your `VITE_API_URL` (production).
4.  Test a feature like "Dashboard" or "Unified Dashboard" to ensure data is fetching from the live backend.

## Troubleshooting

-   **CORS Errors:** If you see network errors, ensure your Backend `main.py` has CORS middleware allowing your Vercel frontend domain.
    -   *Note:* The current backend is configured to allow `*` (all origins), so it should work out of the box.
-   **Backend 404:** Check the Start Command in Render. It must be `uvicorn main:app --host 0.0.0.0 --port $PORT`.
