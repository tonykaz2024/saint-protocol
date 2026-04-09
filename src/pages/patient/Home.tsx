import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import type { AudioTrack, PatientProgram } from '../../types/database'
import { Sun, Eye, Moon, Play, Check, Calendar } from 'lucide-react'

const sessionIcons = { morning: Sun, visualization: Eye, evening: Moon }
const sessionLabels = { morning: 'Morning Session', visualization: 'Visualization', evening: 'Evening Session' }

export default function PatientHome() {
  const { profile } = useAuth()
  const [program, setProgram] = useState<PatientProgram | null>(null)
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    loadData()
  }, [profile])

  async function loadData() {
    const { data: pp } = await supabase
      .from('patient_programs')
      .select('*')
      .eq('patient_id', profile!.id)
      .eq('status', 'active')
      .single()

    const currentDay = pp?.current_day || 1
    if (pp) setProgram(pp)

    const { data: audioTracks } = await supabase
      .from('audio_tracks')
      .select('*')
      .eq('day_number', currentDay)
      .order('session_type')

    setTracks(audioTracks || [])

    const today = new Date().toISOString().split('T')[0]
    const { data: moods } = await supabase
      .from('mood_entries')
      .select('session_type')
      .eq('patient_id', profile!.id)
      .eq('day_number', currentDay)
      .gte('created_at', today)

    setCompletedToday(new Set((moods || []).map((m: { session_type: string }) => m.session_type)))
    setLoading(false)
  }

  if (loading) return <div className="animate-pulse text-text-muted text-center py-20">Loading...</div>

  const currentDay = program?.current_day || 1
  const week = Math.ceil(currentDay / 7)
  const dayOfWeek = ((currentDay - 1) % 7) + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light text-text">Today&apos;s Sessions</h1>
          <p className="text-text-muted text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} />
            Week {week}, Day {dayOfWeek}
          </p>
        </div>
        <div className="text-right">
          <div className="text-accent text-sm font-medium">{completedToday.size}/{tracks.length}</div>
          <div className="text-text-muted text-xs">completed</div>
        </div>
      </div>

      {/* Session cards */}
      <div className="space-y-3">
        {tracks.length === 0 && (
          <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
            No audio sessions available for today. Contact your therapist.
          </div>
        )}
        {tracks.map(track => {
          const Icon = sessionIcons[track.session_type] || Sun
          const done = completedToday.has(track.session_type)
          const minutes = Math.ceil(track.duration_seconds / 60)

          return (
            <Link
              key={track.id}
              to={`/app/player/${track.id}`}
              className={`block bg-surface border rounded-xl p-5 transition-all hover:border-accent/40 ${
                done ? 'border-success/30 opacity-80' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    done ? 'bg-success/10' : 'bg-accent/10'
                  }`}>
                    {done ? <Check size={20} className="text-success" /> : <Icon size={20} className="text-accent" />}
                  </div>
                  <div>
                    <h3 className="text-text font-medium">{sessionLabels[track.session_type]}</h3>
                    <p className="text-text-muted text-sm">{track.technique} &middot; {minutes} min</p>
                  </div>
                </div>
                {!done && (
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Play size={16} className="text-accent ml-0.5" />
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick progress */}
      {completedToday.size > 0 && (
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-text-secondary text-sm mb-2">Today&apos;s Progress</div>
          <div className="w-full bg-bg rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedToday.size / Math.max(tracks.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
