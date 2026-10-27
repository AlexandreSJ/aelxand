import { HTML_LANG, LOCALES, type Locale } from './i18n'
import en from './i18n/en.json'
import pt from './i18n/pt.json'
import es from './i18n/es.json'
import ja from './i18n/ja.json'

const SITE = 'https://aelxand.vercel.app'
const D = { en, pt, es, ja }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headFor(locale: Locale): string {
  const d = D[locale]
  return [
    `<title>${esc(d['meta.title'])}</title>`,
    `<meta name="description" content="${esc(d['meta.description'])}">`,
    `<link rel="canonical" href="${SITE}/${locale}">`,
    ...LOCALES.map(l => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${SITE}/${l}">`),
    `<link rel="alternate" hreflang="x-default" href="${SITE}/en">`,
    `<meta property="og:title" content="${esc(d['meta.title'])}">`,
    `<meta property="og:description" content="${esc(d['meta.description'])}">`,
    `<meta property="og:url" content="${SITE}/${locale}">`,
    `<meta property="og:type" content="website">`,
  ].join('\n    ')
}
