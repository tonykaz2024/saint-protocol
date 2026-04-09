import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { Profile, MoodEntry, PatientProgram, Program } from '../../types/database'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ArrowLeft, Activity, Calendar, TrendingDown, TrendingUp, Play } from 'lucide-react'

export default function TherapistPatientDetail() {
  const { patientId } = useParams<{ patientId: string }>()
  const { profile: therapistProfile } = useAuth()
  const [patient, setPatient] = useState<Profile | null>(null)
  const [moods, setMoods] = useState<MoodEntry[]>([])
  const [program, setProgram] = useState<PatientProgram | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])
  const [assigningProgram, setAssigningProgram] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) return
    loadData()
  }, [patientId])

  async function loadData() {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', patientId!)
      .single()
    setPatient(p)

    const { data: pp } = await supabase
      .from('patient_programs')
      .select('*')
      .eq('patient_id', patientId!)
      .eq('status', 'active')
      .single()
    setProgram(pp)

    const { data: m } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('patient_id', patientId!)
      .order('created_at', { ascending: true })
    setMoods(m || [])

    const { data: progs } = await supabase
      .from('programs')
      .select('*')
      .eq('therapist_id', therapistProfile!.id)
    setPrograms(progs || [])

    setLoading(false)
  }

  async function assignProgram() {
    if (!selectedProgramId || !patientId) return
    setAssigningProgram(true)

    await supabase.from('patient_programs').insert({
      patient_id: patientId,
      program_id: selectedProgramId,
      start_date: new Date().toISOString().split('T')[0],
      current_day: 1,
      status: 'active',
    })

    setAssigningProgram(false)
    loadData()
  }

  const chartData = moods.map(m => ({
    day: `D${m.day_number}`,
    tension: m.tension,
    rumination: m.rumination,
    mood: m.mood,
  }))

  const avgOf = (key: 'tension' | 'rumination' | 'mood') => {
    if (moods.length === 0) return '-'
    return (moods.reduce((sum, e) => sum + e[key], 0) / moods.length).toFixed(1)
  }

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>
  if (!patient) return <div className="text-text-secondary text-center py-20">Patient not found</div>

  return (
    <div className="space-y-6">
      <Link to="/dashboard/patients" className="flex items-center gap-2 text-text-muted hover:text-text text-sm transition-colors">
        <ArrowLeft size={16} />
        Back to patients
      </Link>

      {/* Patient header */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h1 className="text-xl font-light text-text">{patient.full_name}</h1>
        <div className="flex gap-4 mt-2 text-text-muted text-sm">
          <span className="flex items-center gap-1"><Calendar size={14} /> Language: {patient.language}</span>
          <span className="flex items-center gap-1"><Activity size={14} /> {moods.length} sessions</span>
          <span className="flex items-center gap-1">
            <Play size={14} />
            {program ? `Day ${program.current_day}` : 'No program'}
          </span>
        </div>
      </div>

      {/* Assign program if none */}
      {!program && (
        <div className="bg-surface border border-warning/30 rounded-xl p-5">
          <h3 className="text-text text-sm font-medium mb-3">No active program</h3>
          {programs.length === 0 ? (
            <p className="text-text-secondary text-sm">
              Create a program first in <Link to="/dashboard/programs" className="text-accent hover:underline">Programs</Link>.
            </p>
          ) : (
            <div className="flex gap-2 items-center">
              <select
                value={selectedProgramId}
                onChange={e => setSelectedProgramId(e.target.value)}
                className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm focus:border-accent focus:outline-none"
              >
                <option value="">Select a program...</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.duration_weeks} weeks)</option>
                ))}
              </select>
              <button
                onClick={assignProgram}
                disabled={!selectedProgramId || assigningProgram}
                className="bg-accent text-bg px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-dim disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          )}
        </div>
      )}

      {/* Averages */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Tension', value: avgOf('tension'), color: '#c97070', icon: TrendingDown },
          { label: 'Avg Rumination', value: avgOf('rumination'), color: '#d4a853', icon: TrendingDown },
          { label: 'Avg Mood', value: avgOf('mood'), color: '#6db89a', icon: TrendingUp },
        ].map(m => (
          <div key={m.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-text-muted text-xs mb-1">{m.label}</div>
            <div className="text-text text-2xl font-light">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-text-secondary text-sm mb-4">Mood Trends</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3a" />
              <XAxis dataKey="day" stroke="#4a5568" fontSize={11} />
              <YAxis domain={[1, 10]} stroke="#4a5568" fontSize={11} />
              <Tooltip
                contentStyle={{ background: '#161922', border: '1px solid #2a2e3a', borderRadius: '8px' }}
                labelStyle={{ color: '#e8e0d5' }}
              />
              <Line type="monotone" dataKey="tension" stroke="#c97070" strokeWidth={2} dot={{ r: 3 }} name="Tension" />
              <Line type="monotone" dataKey="rumination" stroke="#d4a853" strokeWidth={2} dot={{ r: 3 }} name="Rumination" />
              <Line type="monotone" dataKey="mood" stroke="#6db89a" strokeWidth={2} dot={{ r: 3 }} name="Mood" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
          No session data yet. Patient will start recording mood after their first session.
        </div>
      )}

      {/* Recent entries */}
      {moods.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-text-secondary text-sm mb-3">Recent Entries</div>
          <div className="space-y-2">
            {moods.slice(-5).reverse().map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="text-text text-sm">
                  Day {m.day_number} - {m.session_type}
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="text-error">T:{m.tension}</span>
                  <span className="text-warning">R:{m.rumination}</span>
                  <span className="text-success">M:{m.mood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
