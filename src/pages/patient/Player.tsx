import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import type { AudioTrack } from '../../types/database'
import { Play, Pause, ArrowLeft } from 'lucide-react'

export default function PatientPlayer() {
  const { trackId } = useParams<{ trackId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)

  const [track, setTrack] = useState<AudioTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [finished, setFinished] = useState(false)
  const [moodSubmitted, setMoodSubmitted] = useState(false)

  // Mood state
  const [tension, setTension] = useState(5)
  const [rumination, setRumination] = useState(5)
  const [mood, setMood] = useState(5)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTrack()
  }, [trackId])

  async function loadTrack() {
    if (!trackId) return
    const { data } = await supabase.from('audio_tracks').select('*').eq('id', trackId).single()
    if (data) {
      setTrack(data)
      // Public bucket - use direct public URL
      const { data: urlData } = supabase.storage
        .from('audio')
        .getPublicUrl(data.storage_path)
      if (urlData?.publicUrl && audioRef.current) {
        audioRef.current.src = urlData.publicUrl
      }
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    setPlaying(false)
    setFinished(true)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = pct * duration
  }

  const saveMood = async () => {
    if (!profile || !track) return
    setSaving(true)

    const { data: pp } = await supabase
      .from('patient_programs')
      .select('id, program_id, current_day')
      .eq('patient_id', profile.id)
      .eq('status', 'active')
      .single()

    await supabase.from('mood_entries').insert({
      patient_id: profile.id,
      program_id: pp?.program_id || null,
      day_number: pp?.current_day || track.day_number,
      session_type: track.session_type,
      tension,
      rumination,
      mood,
      notes: null,
    })

    setMoodSubmitted(true)
    setSaving(false)
    setTimeout(() => navigate('/app'), 1500)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Pulsing circle animation
  const pulseScale = playing ? 1 + Math.sin(currentTime * 0.5) * 0.08 : 1

  return (
    <div className="min-h-[80vh] flex flex-col">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Back button */}
      <button onClick={() => navigate('/app')} className="flex items-center gap-2 text-text-muted hover:text-text text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to sessions
      </button>

      {!finished && !moodSubmitted ? (
        // Player view
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Title */}
          <div className="text-text-secondary text-sm mb-2 uppercase tracking-wider">
            {track?.session_type}
          </div>
          <h2 className="text-text text-xl font-light mb-1">{track?.title || 'Session'}</h2>
          <p className="text-text-muted text-sm mb-12">{track?.technique}</p>

          {/* Pulsing circle + play button */}
          <div className="relative mb-12">
            <div
              className="w-40 h-40 rounded-full border-2 border-accent/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
              style={{ transform: `translate(-50%, -50%) scale(${pulseScale})` }}
            />
            <div
              className="w-32 h-32 rounded-full border border-accent/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
              style={{ transform: `translate(-50%, -50%) scale(${1 + (pulseScale - 1) * 0.5})` }}
            />
            <button
              onClick={togglePlay}
              className="w-24 h-24 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center hover:bg-accent/20 transition-colors relative z-10"
            >
              {playing ? <Pause size={32} className="text-accent" /> : <Play size={32} className="text-accent ml-1" />}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <div
              className="w-full h-1.5 bg-border rounded-full cursor-pointer mb-2"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-accent rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-text-muted text-xs">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      ) : moodSubmitted ? (
        // Saved confirmation
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-text text-lg">Session Complete</h3>
          <p className="text-text-secondary text-sm mt-1">Mood recorded. Returning to sessions...</p>
        </div>
      ) : (
        // Mood input
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
          <h3 className="text-text text-lg font-light mb-2">How do you feel?</h3>
          <p className="text-text-muted text-sm mb-8">Rate your current state after the session</p>

          <div className="w-full space-y-6 mb-8">
            {[
              { label: 'Internal Tension', value: tension, set: setTension, low: 'Relaxed', high: 'Tense' },
              { label: 'Rumination', value: rumination, set: setRumination, low: 'Clear mind', high: 'Overthinking' },
              { label: 'Mood', value: mood, set: setMood, low: 'Low', high: 'Great' },
            ].map(({ label, value, set, low, high }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text text-sm">{label}</span>
                  <span className="text-accent text-sm font-medium">{value}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={value}
                  onChange={e => set(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-text-muted text-xs mt-1">
                  <span>{low}</span>
                  <span>{high}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={saveMood}
            disabled={saving}
            className="w-full bg-accent text-bg py-3 rounded-xl font-medium hover:bg-accent-dim transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Complete'}
          </button>
        </div>
      )}
    </div>
  )
}
