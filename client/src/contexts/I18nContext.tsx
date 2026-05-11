import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import ptBR from '../i18n/pt-BR.json'
import en from '../i18n/en.json'
import es from '../i18n/es.json'

export type Lang = 'pt-BR' | 'en' | 'es'

interface I18nState {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nState | null>(null)

const translations: Record<Lang, Record<string, string>> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem('portfolio-lang')
      if (stored && ['pt-BR', 'en', 'es'].includes(stored)) return stored as Lang

      // Detect browser locale
      const browserLang = navigator.language.toLowerCase().slice(0, 2)
      if (browserLang === 'pt') return 'pt-BR'
      if (browserLang === 'es') return 'es'
      return 'en' // fallback
    } catch {
      return 'en'
    }
  })

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key
  }, [lang])

  return (
    <I18nContext value={{ lang, setLang, t }}>
      {children}
    </I18nContext>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
