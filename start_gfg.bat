@echo off
echo ==========================================
echo    🚀 GFG Club - Starting Everything...
echo ==========================================
echo.
echo [1/2] Starting Backend Server...
start /b cmd /c "node server.js"
echo [2/2] Starting Frontend Website...
echo.
echo Please wait for the address to appear.
echo Then go to: http://localhost:5173/admin
echo.
node node_modules\vite\bin\vite.js
pause
