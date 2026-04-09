"""Setup SAINT Protocol database tables via Supabase REST API.
Uses service_role key to create tables indirectly via RPC.
"""
import json
import urllib.request
import urllib.error
import sys

BASE = 'https://midpnvsmoqhzqvltiryv.supabase.co'
KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZHBudnNtb3FoenF2bHRpcnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczNzQwMywiZXhwIjoyMDkxMzEzNDAzfQ.h6XjiyBocr-Rd-XQRpHXSZj3li2sX9n6dBb_jWZhovY'

HEADERS = {
    'apikey': KEY,
    'Authorization': f'Bearer {KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
}

def check_table(name):
    url = f'{BASE}/rest/v1/{name}?select=count&limit=0'
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        urllib.request.urlopen(req, timeout=5)
        return True
    except:
        return False

def main():
    print('=== SAINT Protocol DB Status ===')
    tables = ['profiles', 'programs', 'patient_programs', 'audio_tracks', 'mood_entries', 'settings']
    
    existing = []
    missing = []
    for t in tables:
        if check_table(t):
            existing.append(t)
            print(f'  [OK] {t}')
        else:
            missing.append(t)
            print(f'  [--] {t} (needs creation)')
    
    if not missing:
        print('\nAll tables exist! Database is ready.')
        return
    
    print(f'\n{len(missing)} tables missing. Apply schema via SQL Editor:')
    print(f'  https://supabase.com/dashboard/project/midpnvsmoqhzqvltiryv/sql/new')
    print(f'  Then paste contents of: supabase-schema.sql')
    print()
    print('Or use the Supabase CLI:')
    print('  npx supabase login')
    print('  npx supabase db query --project-ref midpnvsmoqhzqvltiryv < supabase-schema.sql')

if __name__ == '__main__':
    main()
