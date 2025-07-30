@echo off
echo ========================================
echo  ADmyBRAND Dashboard with MongoDB
echo ========================================
echo.

REM Start MongoDB service if not running
echo Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo ✅ MongoDB is already running
) else (
    echo ⚡ Starting MongoDB service...
    net start MongoDB
    if %errorlevel% == 0 (
        echo ✅ MongoDB started successfully
    ) else (
        echo ❌ Failed to start MongoDB. Please check installation.
        echo    Run 'net start MongoDB' as Administrator
        pause
        exit /b 1
    )
)
echo.

REM Wait a moment for MongoDB to fully start
timeout /t 2 /nobreak >nul

echo 🚀 Starting Backend Server (with MongoDB connection)...
start "Backend Server (MongoDB)" cmd /c "cd backend && npm start"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /c "cd admybrand-dash-nova && npm run dev"

echo.
echo ========================================
echo  🎉 All servers are starting!
echo ========================================
echo.
echo 📊 Backend API:  http://localhost:3001
echo 🌐 Frontend:     http://localhost:5173
echo 🔐 Demo Login:   demo@admybrand.com / demo123
echo.
echo Press any key to exit...
pause >nul 