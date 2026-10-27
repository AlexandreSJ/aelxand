import { isLocale, type Locale } from './index'

/**
 * Choose the site locale from the browser's ordered preferences
 * (navigator.languages), e.g. ['de-DE', 'es-AR', 'pt-BR'] -> 'es'.
 * Regional variants collapse to their base language ('pt-PT' -> 'pt').
 */
export function pickLocale(languages: readonly string[]): Locale {
  for (const tag of languages) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}
