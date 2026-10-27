import { createContext, useContext, type ReactNode } from 'react'
import en from './en.json'
import pt from './pt.json'
import es from './es.json'
import ja from './ja.json'

export const LOCALES = ['pt', 'en', 'es', 'ja'] as const
export type Locale = (typeof LOCALES)[number]
export type MessageKey = keyof typeof en
export const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
export const LOCALE_NAME: Record<Locale, string> = { pt: 'PT', en: 'EN', es: 'ES', ja: 'JP' }

export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s)

const DICTS: Record<Locale, Record<MessageKey, string>> = { en, pt, es, ja }

interface I18n { locale: Locale; t: (k: MessageKey) => string }
const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = (k: MessageKey) => DICTS[locale][k] ?? DICTS.en[k]
  return <Ctx value={{ locale, t }}>{children}</Ctx>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n must be used within I18nProvider')
  return v
}
