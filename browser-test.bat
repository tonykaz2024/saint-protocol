@echo off
agent-browser eval "document.querySelectorAll('input')[0].focus()"
agent-browser keyboard type "Test Patient"
agent-browser press Tab
agent-browser keyboard type "testpatient@saintprotocol.dev"
agent-browser press Tab
agent-browser keyboard type "TestPass123!"
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-02-register-filled.png"
agent-browser click "button:has-text('Create Account')"
timeout /t 5 /nobreak >nul
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-03-after-register.png"
agent-browser snapshot -i
