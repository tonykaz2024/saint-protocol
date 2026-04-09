-- SAINT Protocol Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/midpnvsmoqhzqvltiryv/sql

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('therapist', 'patient')),
  full_name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ro', 'ru')),
  therapist_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  duration_weeks INTEGER NOT NULL DEFAULT 8,
  phases JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Patient-Program assignments
CREATE TABLE IF NOT EXISTS patient_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  start_date DATE NOT NULL,
  current_day INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audio tracks
CREATE TABLE IF NOT EXISTS audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id),
  day_number INTEGER NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('morning', 'visualization', 'evening')),
  language TEXT NOT NULL DEFAULT 'ro' CHECK (language IN ('ro', 'ru')),
  title TEXT NOT NULL DEFAULT '',
  technique TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  day_number INTEGER NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('morning', 'visualization', 'evening')),
  tension INTEGER NOT NULL CHECK (tension >= 1 AND tension <= 10),
  rumination INTEGER NOT NULL CHECK (rumination >= 1 AND rumination <= 10),
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_therapist ON profiles(therapist_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_patient_programs_patient ON patient_programs(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_programs_status ON patient_programs(status);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_day ON audio_tracks(day_number);
CREATE INDEX IF NOT EXISTS idx_mood_entries_patient ON mood_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created ON mood_entries(created_at);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile, therapists can read their patients
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT
  USING (auth.uid() = id OR auth.uid() = therapist_id);

CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Therapists can read unassigned patients (for assignment)
CREATE POLICY "therapists_read_unassigned" ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'therapist')
    AND role = 'patient' AND therapist_id IS NULL
  );

-- Therapists can update patient's therapist_id
CREATE POLICY "therapists_assign_patients" ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'therapist')
    AND role = 'patient'
  );

-- Programs: therapists manage their own
CREATE POLICY "therapists_manage_programs" ON programs FOR ALL
  USING (therapist_id = auth.uid())
  WITH CHECK (therapist_id = auth.uid());

-- Patients can read programs assigned to them
CREATE POLICY "patients_read_programs" ON programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient_programs pp
      WHERE pp.program_id = programs.id AND pp.patient_id = auth.uid()
    )
  );

-- Patient programs
CREATE POLICY "patients_read_own_programs" ON patient_programs FOR SELECT
  USING (patient_id = auth.uid());

CREATE POLICY "therapists_manage_patient_programs" ON patient_programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = (SELECT patient_id FROM patient_programs pp2 WHERE pp2.id = patient_programs.id)
      AND p.therapist_id = auth.uid()
    )
  )
  WITH CHECK (true);

-- Audio tracks: anyone authenticated can read
CREATE POLICY "authenticated_read_audio" ON audio_tracks FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "therapists_manage_audio" ON audio_tracks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'therapist')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'therapist')
  );

-- Mood entries: patients manage own, therapists read their patients'
CREATE POLICY "patients_manage_own_moods" ON mood_entries FOR ALL
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "therapists_read_patient_moods" ON mood_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = mood_entries.patient_id AND p.therapist_id = auth.uid()
    )
  );

-- Settings: open for now (single-use)
CREATE POLICY "authenticated_settings" ON settings FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('notification_morning', '07:30'),
  ('notification_evening', '21:00')
ON CONFLICT (key) DO NOTHING;

-- Storage bucket for audio (run separately in Storage settings)
-- CREATE BUCKET: audio (public: false)
