import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { HTML_LANG, isLocale, type Locale } from './i18n'
import { pickLocale } from './i18n/pickLocale'

const root = document.getElementById('root')!
const segment = location.pathname.split('/')[1]
// The dev index.html only holds the <!--app-html--> placeholder comment; a pre-rendered page has real elements.
const prerendered = root.firstElementChild !== null
let locale: Locale

if (isLocale(segment)) {
  locale = segment
} else {
  const preferred = pickLocale(navigator.languages)
  const served = document.documentElement.dataset.locale
  locale = isLocale(served) ? served : preferred
  if (preferred !== locale) location.replace(`/${preferred}${location.hash}`)
  else if (!prerendered) history.replaceState(null, '', `/${locale}${location.hash}`)
}

// The pre-render writes these on <html>; the dev server serves index.html as is, so set them here too.
// :lang() rules depend on it (the Japanese vertical headings must not be turned upside down).
document.documentElement.lang = HTML_LANG[locale]
document.documentElement.dataset.locale = locale

const app = <StrictMode><App locale={locale} /></StrictMode>
if (prerendered) hydrateRoot(root, app)
else createRoot(root).render(app)
