import pg8000
import ssl
import urllib.request
import json

# Disable email confirmation via Supabase Management API
# This requires the service_role key
BASE_URL = 'https://midpnvsmoqhzqvltiryv.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZHBudnNtb3Foenp2bHRpcnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDA0MjE3MiwiZXhwIjoyMDU5NjE4MTcyfQ.L0LPIcLJxJ7cT-tIAUOtIFCJ3LDPn0lQMwxcpK6k-d4'

# Method 1: Direct DB - auto-confirm existing unconfirmed users
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
conn = pg8000.connect(
    host='aws-0-eu-west-1.pooler.supabase.com', port=6543,
    user='postgres.midpnvsmoqhzqvltiryv', password='Habibula2024',
    database='postgres', ssl_context=ctx, timeout=15
)
conn.autocommit = True
c = conn.cursor()

# Auto-confirm all unconfirmed users
try:
    c.execute("""
        UPDATE auth.users 
        SET email_confirmed_at = NOW(),
            confirmed_at = NOW()
        WHERE email_confirmed_at IS NULL
    """)
    print(f'Auto-confirmed users: {c.rowcount}')
except Exception as e:
    print(f'Error: {e}')

# Check if our test user exists
try:
    c.execute("SELECT id, email, email_confirmed_at FROM auth.users WHERE email LIKE '%testpatient%'")
    rows = c.fetchall()
    for r in rows:
        print(f'User: {r[1]}, confirmed: {r[2]}')
    if not rows:
        print('No test patient user found')
except Exception as e:
    print(f'Error checking users: {e}')

conn.close()
print('Done')
