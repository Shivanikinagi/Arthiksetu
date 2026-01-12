@echo off
echo ===================================
echo ArthikSetu - Quick Start Script
echo ===================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo ✓ Python and Node.js found
echo.

REM Setup Backend
echo ====================================
echo Setting up Backend...
echo ====================================
cd Backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting Backend Server...
echo Backend will run at http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo.

start "ArthikSetu Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Setup Frontend
echo.
echo ====================================
echo Setting up Frontend...
echo ====================================
cd ..\Frontend

echo Installing Node dependencies...
call npm install

echo.
echo Starting Frontend Server...
echo Frontend will run at http://localhost:5173
echo.

start "ArthikSetu Frontend" cmd /k "npm run dev"

echo.
echo ===================================
echo ✓ ArthikSetu is running!
echo ===================================
echo.
echo Open your browser and visit:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
