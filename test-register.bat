@echo off
REM Click Patient toggle first
agent-browser click "button:has-text('Patient')"
timeout /t 1 /nobreak >nul

REM Fill Full Name
agent-browser click "input[type='text']"
agent-browser keyboard type "Test Patient"
timeout /t 1 /nobreak >nul

REM Fill Email  
agent-browser click "input[type='email']"
agent-browser keyboard type "testpatient99@saint.dev"
timeout /t 1 /nobreak >nul

REM Fill Password
agent-browser click "input[type='password']"
agent-browser keyboard type "TestPass123!"
timeout /t 1 /nobreak >nul

REM Screenshot filled form
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-03-filled.png"

REM Submit
agent-browser click "button:has-text('Create Account')"
timeout /t 6 /nobreak >nul

REM Screenshot result
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-04-result.png"
agent-browser snapshot -i
