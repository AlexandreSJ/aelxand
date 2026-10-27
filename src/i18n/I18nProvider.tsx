import type { ReactNode } from 'react'
import { I18nContext } from './context'
import { translate, type Locale, type MessageKey, type Vars } from './locales'

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = (k: MessageKey, vars?: Vars) => translate(locale, k, vars)
  return <I18nContext value={{ locale, t }}>{children}</I18nContext>
}
