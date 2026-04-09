import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Save, Check } from 'lucide-react'

export default function PatientSettings() {
  const { profile } = useAuth()
  const [language, setLanguage] = useState<'en' | 'ro' | 'ru'>(profile?.language || 'en')
  const [morningTime, setMorningTime] = useState('07:30')
  const [eveningTime, setEveningTime] = useState('21:00')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data } = await supabase
      .from('settings')
      .select('*')

    if (data) {
      const map = Object.fromEntries(data.map(s => [s.key, s.value]))
      if (map.notification_morning) setMorningTime(map.notification_morning)
      if (map.notification_evening) setEveningTime(map.notification_evening)
    }
  }

  async function handleSave() {
    setLoading(true)
    if (profile) {
      await supabase.from('profiles').update({ language }).eq('id', profile.id)
    }

    const settings = [
      { key: 'notification_morning', value: morningTime },
      { key: 'notification_evening', value: eveningTime },
    ]
    for (const s of settings) {
      await supabase.from('settings').upsert(s, { onConflict: 'key' })
    }

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-light text-text">Settings</h1>

      <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
        {/* Language */}
        <div>
          <label className="text-text-secondary text-sm block mb-2">Language</label>
          <div className="flex gap-2">
            {(['en', 'ro', 'ru'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  language === l
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-bg border-border text-text-secondary hover:text-text'
                }`}
              >
                {l === 'en' ? 'English' : l === 'ro' ? 'Romana' : '\u0420\u0443\u0441\u0441\u043a\u0438\u0439'}
              </button>
            ))}
          </div>
        </div>

        {/* Notification times */}
        <div>
          <label className="text-text-secondary text-sm block mb-2">Morning Reminder</label>
          <input
            type="time"
            value={morningTime}
            onChange={e => setMorningTime(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-text-secondary text-sm block mb-2">Evening Reminder</label>
          <input
            type="time"
            value={eveningTime}
            onChange={e => setEveningTime(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-accent text-bg py-2.5 rounded-lg font-medium hover:bg-accent-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}</>}
        </button>
      </div>
    </div>
  )
}
