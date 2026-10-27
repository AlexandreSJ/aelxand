import { createContext, useContext } from 'react'
import type { Locale, MessageKey, Vars } from './locales'

export interface I18n { locale: Locale; t: (k: MessageKey, vars?: Vars) => string }
export const I18nContext = createContext<I18n | null>(null)

export function useI18n(): I18n {
  const v = useContext(I18nContext)
  if (!v) throw new Error('useI18n must be used within I18nProvider')
  return v
}
