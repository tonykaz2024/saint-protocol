export interface Profile {
  id: string
  role: 'therapist' | 'patient'
  full_name: string
  language: 'en' | 'ro' | 'ru'
  therapist_id: string | null
  created_at: string
}

export interface Program {
  id: string
  therapist_id: string
  name: string
  description: string
  duration_weeks: number
  phases: ProgramPhase[]
  created_at: string
}

export interface ProgramPhase {
  name: string
  weeks: [number, number]
  focus: string
  sessions_per_day: number
}

export interface PatientProgram {
  id: string
  patient_id: string
  program_id: string
  start_date: string
  current_day: number
  status: 'active' | 'paused' | 'completed'
  created_at: string
}

export interface AudioTrack {
  id: string
  program_id: string | null
  day_number: number
  session_type: 'morning' | 'visualization' | 'evening'
  language: 'ro' | 'ru'
  title: string
  technique: string
  storage_path: string
  duration_seconds: number
  created_at: string
}

export interface MoodEntry {
  id: string
  patient_id: string
  program_id: string
  day_number: number
  session_type: 'morning' | 'visualization' | 'evening'
  tension: number
  rumination: number
  mood: number
  notes: string | null
  created_at: string
}

export interface Setting {
  key: string
  value: string
  updated_at: string
}
