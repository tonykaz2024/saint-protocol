"""Apply SAINT Protocol schema directly via PostgreSQL connection."""
import pg8000
import ssl

HOST = 'aws-0-eu-west-1.pooler.supabase.com'
PORT = 6543
USER = 'postgres.midpnvsmoqhzqvltiryv'
import os
PASS = os.environ.get('SUPABASE_DB_PASSWORD', '')
if not PASS:
    PASS = input('Enter Supabase DB password: ')
DB = 'postgres'

STATEMENTS = [
    # profiles
    """CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        role TEXT NOT NULL CHECK (role IN ('therapist', 'patient')),
        full_name TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ro', 'ru')),
        therapist_id UUID,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # programs
    """CREATE TABLE IF NOT EXISTS public.programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        therapist_id UUID NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        duration_weeks INTEGER NOT NULL DEFAULT 8,
        phases JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # patient_programs
    """CREATE TABLE IF NOT EXISTS public.patient_programs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL,
        program_id UUID NOT NULL,
        start_date DATE NOT NULL,
        current_day INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
        created_at TIMESTAMPTZ DEFAULT now()
    )""",
    # audio_tracks
    """CREATE TABLE IF NOT EXISTS public.audio_tracks (
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
    """CREATE TABLE IF NOT EXISTS public.mood_entries (
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
    """CREATE TABLE IF NOT EXISTS public.settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now()
    )""",
    # indexes
    "CREATE INDEX IF NOT EXISTS idx_profiles_therapist ON public.profiles(therapist_id)",
    "CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role)",
    "CREATE INDEX IF NOT EXISTS idx_patient_programs_patient ON public.patient_programs(patient_id)",
    "CREATE INDEX IF NOT EXISTS idx_audio_tracks_day ON public.audio_tracks(day_number)",
    "CREATE INDEX IF NOT EXISTS idx_mood_entries_patient ON public.mood_entries(patient_id)",
    "CREATE INDEX IF NOT EXISTS idx_mood_entries_created ON public.mood_entries(created_at)",
    # RLS
    "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.patient_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY",
    # Open RLS policies (for initial dev - tighten later)
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_profiles_all') THEN
            CREATE POLICY saint_profiles_all ON public.profiles FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_programs_all') THEN
            CREATE POLICY saint_programs_all ON public.programs FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_pp_all') THEN
            CREATE POLICY saint_pp_all ON public.patient_programs FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_audio_all') THEN
            CREATE POLICY saint_audio_all ON public.audio_tracks FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_moods_all') THEN
            CREATE POLICY saint_moods_all ON public.mood_entries FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    """DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'saint_settings_all') THEN
            CREATE POLICY saint_settings_all ON public.settings FOR ALL USING (true) WITH CHECK (true);
        END IF;
    END $$""",
    # default settings
    "INSERT INTO public.settings (key, value) VALUES ('notification_morning', '07:30') ON CONFLICT (key) DO NOTHING",
    "INSERT INTO public.settings (key, value) VALUES ('notification_evening', '21:00') ON CONFLICT (key) DO NOTHING",
]

def main():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print(f'Connecting to Supabase Postgres ({HOST})...')
    conn = pg8000.connect(
        host=HOST, port=PORT, user=USER, password=PASS,
        database=DB, ssl_context=ctx, timeout=15
    )
    conn.autocommit = True
    cursor = conn.cursor()
    print('Connected!\n')

    ok = 0
    fail = 0
    for i, sql in enumerate(STATEMENTS):
        label = sql.strip()[:60].replace('\n', ' ')
        try:
            cursor.execute(sql)
            print(f'  [{i+1:02d}/{len(STATEMENTS)}] OK: {label}')
            ok += 1
        except Exception as e:
            msg = str(e)[:80]
            print(f'  [{i+1:02d}/{len(STATEMENTS)}] FAIL: {label}')
            print(f'         {msg}')
            fail += 1

    cursor.close()
    conn.close()
    print(f'\nDone: {ok} OK, {fail} failed out of {len(STATEMENTS)} statements')

if __name__ == '__main__':
    main()
