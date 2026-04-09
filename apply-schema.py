"""Apply SAINT Protocol schema to Supabase via Management API.
Run: python apply-schema.py

Alternative: Copy contents of supabase-schema.sql and paste into
https://supabase.com/dashboard/project/midpnvsmoqhzqvltiryv/sql/new
"""
import json
import urllib.request
import urllib.error
import sys

SUPABASE_URL = 'https://midpnvsmoqhzqvltiryv.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZHBudnNtb3FoenF2bHRpcnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTczNzQwMywiZXhwIjoyMDkxMzEzNDAzfQ.h6XjiyBocr-Rd-XQRpHXSZj3li2sX9n6dBb_jWZhovY'

statements = [
    # profiles
    """CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('therapist', 'patient')),
        full_name TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ro', 'ru')),
        therapist_id UUID,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # programs
    """CREATE TABLE IF NOT EXISTS programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        therapist_id UUID NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        duration_weeks INTEGER NOT NULL DEFAULT 8,
        phases JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # patient_programs
    """CREATE TABLE IF NOT EXISTS patient_programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL,
        program_id UUID NOT NULL,
        start_date DATE NOT NULL,
        current_day INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # audio_tracks
    """CREATE TABLE IF NOT EXISTS audio_tracks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        program_id UUID,
        day_number INTEGER NOT NULL,
        session_type TEXT NOT NULL CHECK (session_type IN ('morning', 'visualization', 'evening')),
        language TEXT NOT NULL DEFAULT 'ro' CHECK (language IN ('ro', 'ru')),
        title TEXT NOT NULL DEFAULT '',
        technique TEXT NOT NULL DEFAULT '',
        storage_path TEXT NOT NULL,
        duration_seconds INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # mood_entries
    """CREATE TABLE IF NOT EXISTS mood_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL,
        program_id UUID NOT NULL,
        day_number INTEGER NOT NULL,
        session_type TEXT NOT NULL CHECK (session_type IN ('morning', 'visualization', 'evening')),
        tension INTEGER NOT NULL CHECK (tension >= 1 AND tension <= 10),
        rumination INTEGER NOT NULL CHECK (rumination >= 1 AND rumination <= 10),
        mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # settings
    """CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now()
    )""",
    # indexes
    "CREATE INDEX IF NOT EXISTS idx_profiles_therapist ON profiles(therapist_id)",
    "CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role)",
    "CREATE INDEX IF NOT EXISTS idx_patient_programs_patient ON patient_programs(patient_id)",
    "CREATE INDEX IF NOT EXISTS idx_audio_tracks_day ON audio_tracks(day_number)",
    "CREATE INDEX IF NOT EXISTS idx_mood_entries_patient ON mood_entries(patient_id)",
    "CREATE INDEX IF NOT EXISTS idx_mood_entries_created ON mood_entries(created_at)",
    # RLS
    "ALTER TABLE profiles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE patient_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE settings ENABLE ROW LEVEL SECURITY",
    # Open policies for initial setup
    "CREATE POLICY IF NOT EXISTS saint_profiles_all ON profiles FOR ALL USING (true) WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS saint_programs_all ON programs FOR ALL USING (true) WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS saint_pp_all ON patient_programs FOR ALL USING (true) WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS saint_audio_all ON audio_tracks FOR ALL USING (true) WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS saint_moods_all ON mood_entries FOR ALL USING (true) WITH CHECK (true)",
    "CREATE POLICY IF NOT EXISTS saint_settings_all ON settings FOR ALL USING (true) WITH CHECK (true)",
    # Default settings
    "INSERT INTO settings (key, value) VALUES ('notification_morning', '07:30') ON CONFLICT (key) DO NOTHING",
    "INSERT INTO settings (key, value) VALUES ('notification_evening', '21:00') ON CONFLICT (key) DO NOTHING",
]


def run_sql(sql: str) -> tuple[bool, str]:
    url = f'{SUPABASE_URL}/rest/v1/rpc/'
    headers = {
        'apikey': SERVICE_KEY,
        'Authorization': f'Bearer {SERVICE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
    }
    # Use pgrest's ability to call functions - but we need raw SQL
    # Alternative: use the pg_net extension or just print instructions
    # Since direct SQL execution via REST isn't supported, we'll guide the user
    return False, 'REST API does not support raw DDL'


def main():
    print('=== SAINT Protocol Schema Setup ===')
    print()
    print('Supabase REST API does not support DDL statements directly.')
    print('Please apply the schema by one of these methods:')
    print()
    print('METHOD 1 (Recommended): Supabase SQL Editor')
    print(f'  1. Open: https://supabase.com/dashboard/project/midpnvsmoqhzqvltiryv/sql/new')
    print(f'  2. Copy the contents of: supabase-schema.sql')
    print(f'  3. Click "Run"')
    print()
    print('METHOD 2: Supabase CLI')
    print('  1. npm install -g supabase')
    print('  2. supabase login')
    print('  3. supabase link --project-ref midpnvsmoqhzqvltiryv')
    print('  4. supabase db push')
    print()
    print('METHOD 3: psql (if installed)')
    print('  psql "postgresql://postgres.midpnvsmoqhzqvltiryv:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f supabase-schema.sql')
    print()
    
    # Try to at least verify connectivity
    try:
        url = f'{SUPABASE_URL}/rest/v1/'
        req = urllib.request.Request(url, headers={'apikey': SERVICE_KEY})
        resp = urllib.request.urlopen(req, timeout=10)
        print(f'Supabase connectivity: OK (HTTP {resp.status})')
        
        # Check if tables already exist
        for table in ['profiles', 'programs', 'patient_programs', 'audio_tracks', 'mood_entries', 'settings']:
            url = f'{SUPABASE_URL}/rest/v1/{table}?select=count&limit=0'
            req = urllib.request.Request(url, headers={
                'apikey': SERVICE_KEY,
                'Authorization': f'Bearer {SERVICE_KEY}',
            })
            try:
                resp = urllib.request.urlopen(req, timeout=5)
                print(f'  Table {table}: EXISTS')
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    print(f'  Table {table}: NOT FOUND (needs creation)')
                else:
                    print(f'  Table {table}: ERROR ({e.code})')
    except Exception as e:
        print(f'Supabase connectivity: FAILED ({e})')
        
    print()
    print('After applying the schema, run: npm run dev')


if __name__ == '__main__':
    main()
