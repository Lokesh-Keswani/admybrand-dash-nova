@echo off
echo ========================================
echo  AdMyBrand Dashboard Servers
echo ========================================
echo.
echo ⚠️  IMPORTANT: This system now requires MongoDB!
echo    For first-time setup, use: start-servers-with-mongo.bat
echo    Or install MongoDB and run 'net start MongoDB' first
echo.

echo Starting Backend Server...
start "Backend Server" cmd /c "cd backend && npm start"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /c "cd admybrand-dash-nova && npm run dev"

echo.
echo ========================================
echo  🎉 Both servers are starting!
echo ========================================
echo.
echo 📊 Backend API:  http://localhost:3001
echo 🌐 Frontend:     http://localhost:5173
echo 🔐 Demo Login:   demo@admybrand.com / demo123
echo.
echo If backend fails, make sure MongoDB is running!
echo.
echo Press any key to exit this script (servers will continue running)...
pause >nul 