@echo off
agent-browser click @e3
timeout /t 1 /nobreak >nul
agent-browser fill @e4 "Test Patient"
agent-browser fill @e5 "testpatient99@saint.dev"
agent-browser fill @e6 "TestPass123!"
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-03-filled.png"
agent-browser click @e7
timeout /t 6 /nobreak >nul
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-04-result.png"
agent-browser snapshot -i
