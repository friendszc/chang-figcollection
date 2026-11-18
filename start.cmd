@echo off
setlocal
cd /d "%~dp0"
set "FIGURE_NODE="
for /f "delims=" %%I in ('where node.exe 2^>nul') do if not defined FIGURE_NODE set "FIGURE_NODE=%%I"
if not defined FIGURE_NODE set "FIGURE_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%FIGURE_NODE%" (
  echo Node.js was not found. Please install Node.js and try again.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Dependencies are missing. Run npm install in this folder first.
  pause
  exit /b 1
)
echo Starting Figure Notes. Please keep this window open.
echo Your browser will open automatically. Press Ctrl+C to stop.
"%FIGURE_NODE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --open
if errorlevel 1 (
  echo.
  echo Startup failed. Please share the error shown above.
  pause
)
endlocal
