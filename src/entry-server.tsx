import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { headFor } from './head'
import type { Locale } from './i18n'

export { LOCALES, HTML_LANG } from './i18n'

export function render(locale: Locale) {
  const html = renderToString(<StrictMode><App locale={locale} /></StrictMode>)
  return { html, head: headFor(locale) }
}
