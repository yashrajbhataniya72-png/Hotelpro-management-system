@echo off
title HotelPro One-Click Launcher
color 0B
echo ================================================================
echo                HOTELPRO - ONE-CLICK LAUNCHER
echo ================================================================
echo.

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is NOT installed or not added to PATH!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/4] Node.js detected:
node -v
echo.

:: 2. Check & Install Backend Dependencies
echo [2/4] Checking Backend dependencies...
if not exist "%ROOT_DIR%backend\node_modules" (
    echo Installing backend packages (this may take a minute)...
    cd /d "%ROOT_DIR%backend"
    call npm install
    cd /d "%ROOT_DIR%"
) else (
    echo Backend packages already installed.
)
echo.

:: 3. Check & Install Frontend Dependencies
echo [3/4] Checking Frontend dependencies...
if not exist "%ROOT_DIR%frontend\node_modules" (
    echo Installing frontend packages (this may take a minute)...
    cd /d "%ROOT_DIR%frontend"
    call npm install
    cd /d "%ROOT_DIR%"
) else (
    echo Frontend packages already installed.
)
echo.

:: 4. Try starting MongoDB service if available
echo [4/4] Verifying MongoDB service...
net start MongoDB >nul 2>nul
if %errorlevel% equ 0 (
    echo MongoDB Service is active.
) else (
    echo Note: If MongoDB is running as a portable app or Docker, that is fine.
    echo If MongoDB is not running, start it or use MongoDB Compass.
)
echo.

echo ================================================================
echo Launching Backend (Port 5000) & Frontend (Port 3000)...
echo ================================================================

:: Start Backend in separate window
start "HotelPro - Backend API" cmd /k "cd /d "%ROOT_DIR%backend" && echo Starting Backend... && npm run dev"

:: Start Frontend in separate window
start "HotelPro - Frontend Client" cmd /k "cd /d "%ROOT_DIR%frontend" && echo Starting Frontend... && npm run dev"

:: Wait 3 seconds and launch browser
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo All services launched! Check the two open windows for server logs.
echo If a window closes or shows red errors, see the troubleshooting guide.
echo.
pause
