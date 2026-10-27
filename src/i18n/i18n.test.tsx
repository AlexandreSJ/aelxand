import { describe, expect, it } from 'vitest'
import en from './en.json'
import pt from './pt.json'
import es from './es.json'
import ja from './ja.json'
import { pickLocale } from './pickLocale'

describe('locale files', () => {
  const keys = Object.keys(en).sort()
  for (const [name, dict] of Object.entries({ pt, es, ja })) {
    it(`${name} has exactly the same keys as en`, () => {
      expect(Object.keys(dict).sort()).toEqual(keys)
    })
    it(`${name} has no empty strings`, () => {
      for (const v of Object.values(dict)) expect(v.trim()).not.toBe('')
    })
  }
})

describe('pickLocale', () => {
  it('maps regional tags to our locales', () => {
    expect(pickLocale(['pt-BR'])).toBe('pt')
    expect(pickLocale(['ja-JP'])).toBe('ja')
    expect(pickLocale(['es-MX'])).toBe('es')
  })
  it('respects preference order', () => {
    expect(pickLocale(['de-DE', 'es-AR', 'pt-BR'])).toBe('es')
  })
  it('falls back to en', () => {
    expect(pickLocale(['de', 'fr'])).toBe('en')
    expect(pickLocale([])).toBe('en')
  })
})

describe('t()', () => {
  it('interpolates {vars}', async () => {
    const { renderToString } = await import('react-dom/server')
    const { I18nProvider, useI18n } = await import('./index')
    const Probe = () => <>{useI18n().t('sleeve.years', { n: 4 })}</>
    expect(renderToString(<I18nProvider locale="pt"><Probe /></I18nProvider>)).toBe('~4 anos')
  })
})
