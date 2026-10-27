import en from './en.json'
import pt from './pt.json'
import es from './es.json'
import ja from './ja.json'

export const LOCALES = ['pt', 'en', 'es', 'ja'] as const
export type Locale = (typeof LOCALES)[number]
export type MessageKey = keyof typeof en
export type Vars = Record<string, string | number>
export const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
export const LOCALE_NAME: Record<Locale, string> = { pt: 'PT', en: 'EN', es: 'ES', ja: 'JP' }

export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s)

const DICTS: Record<Locale, Record<MessageKey, string>> = { en, pt, es, ja }

/** Look up a message, falling back to English, and fill {vars}. */
export function translate(locale: Locale, k: MessageKey, vars?: Vars): string {
  const s = DICTS[locale][k] ?? DICTS.en[k]
  return vars ? s.replace(/\{(\w+)\}/g, (_, v: string) => String(vars[v] ?? `{${v}}`)) : s
}
