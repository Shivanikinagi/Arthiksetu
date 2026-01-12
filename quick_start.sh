#!/bin/bash

echo "==================================="
echo "ArthikSetu - Quick Start Script"
echo "==================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Python and Node.js found"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd Backend

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "🚀 Starting Backend Server..."
echo "Backend will run at http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"
echo ""

# Start backend in background
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../Frontend

echo "Installing Node dependencies..."
npm install

echo ""
echo "🚀 Starting Frontend Server..."
echo "Frontend will run at http://localhost:5173"
echo ""

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "==================================="
echo "✅ ArthikSetu is running!"
echo "==================================="
echo ""
echo "🌐 Open your browser and visit:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user to stop
wait

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
echo ""
echo "Servers stopped. Goodbye!"
