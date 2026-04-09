import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart3, Shield, Users, ChevronRight, Headphones, Brain, Heart, Sun, Eye, Moon, Globe } from 'lucide-react'
import { t, setLang, getLang, type Lang } from '../lib/i18n'

const langs: Lang[] = ['en', 'ro', 'ru']

export default function Landing() {
  const [, setTick] = useState(0)
  const forceUpdate = () => setTick(n => n + 1)

  const switchLang = (lang: Lang) => {
    setLang(lang)
    forceUpdate()
  }

  const features = [
    { icon: Headphones, title: t('feat.audio'), desc: t('feat.audio.desc') },
    { icon: Brain, title: t('feat.techniques'), desc: t('feat.techniques.desc') },
    { icon: BarChart3, title: t('feat.mood'), desc: t('feat.mood.desc') },
    { icon: Shield, title: t('feat.secure'), desc: t('feat.secure.desc') },
    { icon: Users, title: t('feat.dashboard'), desc: t('feat.dashboard.desc') },
    { icon: Heart, title: t('feat.offline'), desc: t('feat.offline.desc') },
  ]

  const phases = [
    { week: '1-2', name: t('phase.regulation'), desc: t('phase.regulation.desc') },
    { week: '3-4', name: t('phase.restructuring'), desc: t('phase.restructuring.desc') },
    { week: '5-6', name: t('phase.consolidation'), desc: t('phase.consolidation.desc') },
    { week: '7-8', name: t('phase.maintenance'), desc: t('phase.maintenance.desc') },
  ]

  const sessions = [
    { icon: Sun, name: t('patient.morning'), duration: '12:00', progress: 75, color: 'text-amber-400' },
    { icon: Eye, name: t('patient.visualization'), duration: '15:00', progress: 40, color: 'text-purple-400' },
    { icon: Moon, name: t('patient.evening'), duration: '10:00', progress: 0, color: 'text-blue-400' },
  ]

  const moodSliders = [
    { label: t('patient.tension'), value: 35, left: t('patient.relaxed'), right: t('patient.tense') },
    { label: t('patient.rumination'), value: 25, left: t('patient.clearMind'), right: t('patient.overthinking') },
    { label: t('patient.mood'), value: 70, left: t('patient.low'), right: t('patient.great') },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-accent font-semibold text-xl tracking-widest">{t('app.name')}</span>
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-full px-1 py-0.5">
            <Globe size={14} className="text-text-muted ml-1.5" />
            {langs.map(lang => (
              <button
                key={lang}
                onClick={() => switchLang(lang)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase transition-colors ${
                  getLang() === lang
                    ? 'bg-accent text-bg'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <Link to="/login" className="text-text-secondary hover:text-text text-sm transition-colors">{t('nav.signIn')}</Link>
          <Link to="/register" className="bg-accent/10 text-accent px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors">{t('nav.getStarted')}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-surface px-4 py-1.5 rounded-full text-xs text-text-secondary mb-8 border border-border">
          <Play size={12} className="text-accent" />
          {t('landing.badge')}
        </div>
        <h1 className="text-4xl md:text-6xl font-light text-text leading-tight mb-6">
          {t('landing.h1a')}<br />
          <span className="text-accent">{t('landing.h1b')}</span>
        </h1>
        <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('landing.desc')}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-accent text-bg px-8 py-3.5 rounded-xl font-medium hover:bg-accent-dim transition-colors flex items-center gap-2"
          >
            {t('landing.cta')}
            <ChevronRight size={18} />
          </Link>
          <a href="#features" className="text-text-secondary hover:text-text px-6 py-3.5 transition-colors">
            {t('landing.learn')}
          </a>
        </div>
      </section>

      {/* Program Phases */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-center mb-12 text-text">{t('landing.program')}</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {phases.map((p, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
              <div className="text-accent text-xs font-medium mb-2">WEEKS {p.week}</div>
              <div className="text-text font-medium mb-2">{p.name}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-center mb-12 text-text">{t('landing.clinical')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-colors">
              <f.icon size={24} className="text-accent mb-4" />
              <h3 className="text-text font-medium mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Preview */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-light text-center mb-12 text-text">{t('landing.preview')}</h2>
        <div className="flex justify-center">
          {/* Phone mockup */}
          <div className="w-full max-w-sm bg-surface border-2 border-border rounded-[2rem] p-4 shadow-2xl shadow-black/30">
            {/* Phone notch */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-1.5 bg-border rounded-full" />
            </div>

            {/* App header inside phone */}
            <div className="flex items-center justify-between mb-5 px-2">
              <span className="text-accent font-semibold text-sm tracking-widest">{t('app.name')}</span>
              <span className="text-text-muted text-xs">{t('patient.week')} 3 · {t('patient.day')} 2</span>
            </div>

            {/* Session cards */}
            <div className="space-y-3 mb-6">
              {sessions.map((s, i) => (
                <div key={i} className="bg-bg border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg bg-surface flex items-center justify-center ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text text-sm font-medium truncate">{s.name}</div>
                    <div className="text-text-muted text-xs">{s.duration}</div>
                    {/* Audio progress bar */}
                    <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Play size={14} className="text-accent ml-0.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Mood sliders */}
            <div className="border-t border-border pt-4 px-1">
              <div className="text-text-secondary text-xs font-medium mb-3 uppercase tracking-wide">{t('patient.howFeel')}</div>
              <div className="space-y-3">
                {moodSliders.map((slider, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-text text-xs">{slider.label}</span>
                    </div>
                    <div className="relative h-1.5 bg-border rounded-full">
                      <div
                        className="absolute h-full bg-accent/60 rounded-full"
                        style={{ width: `${slider.value}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full shadow-md"
                        style={{ left: `calc(${slider.value}% - 6px)` }}
                      />
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <span className="text-text-muted text-[10px]">{slider.left}</span>
                      <span className="text-text-muted text-[10px]">{slider.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone bottom bar */}
            <div className="flex justify-center mt-5">
              <div className="w-28 h-1 bg-border rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto bg-surface border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-light text-text mb-4">{t('landing.ctaTitle')}</h2>
          <p className="text-text-secondary mb-8">{t('landing.ctaDesc')}</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-accent text-bg px-8 py-3.5 rounded-xl font-medium hover:bg-accent-dim transition-colors"
          >
            {t('landing.ctaBtn')}
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border text-center text-text-muted text-sm">
        {t('landing.footer', { year: new Date().getFullYear().toString() })}
      </footer>
    </div>
  )
}
