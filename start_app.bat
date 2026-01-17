@echo off
echo Starting ArthikSetu Project...

:: Start Backend
start "ArthikSetu Backend" cmd /k "cd Backend && pip install -r requirements.txt && uvicorn main:app --reload"

:: Wait a moment for backend to initialize
timeout /t 5

:: Start Frontend
start "ArthikSetu Frontend" cmd /k "cd Frontend && npm install && npm run dev"

echo Project started! 
echo Backend running at http://localhost:8000
echo Frontend running at http://localhost:5173
echo.
echo Press any key to close this launcher (servers will keep running)...
pause >nul
