@echo off
REM Click on Full Name input and type
agent-browser eval "document.querySelectorAll('input')[0].focus()"
agent-browser keyboard type "Test Patient"

REM Tab to email
agent-browser press Tab
agent-browser keyboard type "testpatient99@saintprotocol.dev"

REM Tab to password 
agent-browser press Tab
agent-browser keyboard type "TestPass123!"

REM Screenshot filled form
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-02-filled.png"

REM Submit
agent-browser press Enter

REM Wait for response
timeout /t 6 /nobreak >nul

REM Screenshot result
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-03-result.png"
agent-browser snapshot -i
