import type { Locale, MessageKey } from '../i18n'

export type ExperienceEntry = {
  start: string
  end?: string
  org: string
  roleKey?: MessageKey
  role?: Partial<Record<Locale, string>> & { en: string }
  result?: Partial<Record<Locale, string>> & { en: string }
}

/** Newest first. Work entries come from the owner (see spec "Open content"). */
export const experience: ExperienceEntry[] = [
  { start: '2024', org: '', roleKey: 'experience.degree' },
]
