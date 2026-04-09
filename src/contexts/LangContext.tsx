import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { setLang as setI18nLang, getLang, t as rawT, type Lang } from '../lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: typeof rawT
}

const LangContext = createContext<LangCtx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLang())

  const setLang = useCallback((l: Lang) => {
    setI18nLang(l)
    setLangState(l)
  }, [])

  return (
    <LangContext.Provider value={{ lang, setLang, t: rawT }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
