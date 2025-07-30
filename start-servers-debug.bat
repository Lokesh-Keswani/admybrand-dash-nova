@echo off
echo Starting AdMyBrand servers...
echo.

echo Killing any existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo.
echo Starting backend server...
cd backend
start "Backend" cmd /k "npm run dev"

echo Waiting 10 seconds for backend to start...
timeout /t 10 >nul

echo.
echo Testing backend health...
curl -s http://localhost:3001/health && echo Backend is healthy! || echo Backend is not responding!

echo.
echo Starting frontend server...
cd ..\admybrand-dash-nova
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: Will be displayed in the frontend terminal
echo.
echo Press any key to exit this window...
pause >nul 