import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Record } from './Record'
import { SideB } from './SideB'
import { Contact } from './Contact'
import { record } from '../data/record'

const r = (node: React.ReactNode, locale: 'en' | 'ja' = 'en') => renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>)

describe('Record (first viewport)', () => {
  it('puts the name in the h1 and the translated motto on the sleeve', () => {
    expect(r(<Record />)).toMatch(/<h1[^>]*>AlexandreSJ<\/h1>/)
    expect(r(<Record />, 'ja')).toContain('関わる人が、私と一緒に成長できるように')
  })
  it('lists every side A track in order with its code', () => {
    const html = r(<Record />)
    record.sideA.forEach((_, i) => expect(html).toContain(`>A${i + 1}<`))
    for (const t of record.sideA) expect(html).toContain(`id="track-${t.name}"`)
  })
  it('has no eyebrow status line above the name', () => {
    expect(r(<Record />)).not.toContain('building noct')
  })
})

describe('SideB', () => {
  it('lists every other public repository', () => {
    const html = r(<SideB />)
    for (const t of record.sideB) expect(html).toContain(`>${t.name}</a>`)
  })
})

describe('Contact', () => {
  it('links LinkedIn and GitHub and shows no email', () => {
    const html = r(<Contact />)
    expect(html).toContain('linkedin.com/in/alexandre-da-silva-junior')
    expect(html).not.toContain('mailto:')
  })
})
