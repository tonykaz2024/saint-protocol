@echo off
echo Step 1: Click Patient
agent-browser click @e3 2>&1
echo Step 1 done
timeout /t 1 /nobreak >nul
echo Step 2: Fill name
agent-browser fill @e4 "Test Patient" 2>&1
echo Step 2 done
echo Step 3: Fill email
agent-browser fill @e5 "testpatient99@saint.dev" 2>&1
echo Step 3 done
echo Step 4: Fill password
agent-browser fill @e6 "TestPass123" 2>&1
echo Step 4 done
echo Step 5: Screenshot
agent-browser screenshot "F:\AI-INFRA\saint-assistant\saint-app\test-03-filled.png" 2>&1
echo Step 5 done
