import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Record } from './Record'
import { SideB } from './SideB'
import { Contact } from './Contact'
import { Backstage } from './Backstage'
import { record } from '../data/record'

const r = (node: React.ReactNode, locale: 'en' | 'pt' | 'ja' = 'en') => renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>)

describe('Record (first viewport)', () => {
  it('puts the name in the h1 and the translated motto on the sleeve', () => {
    expect(r(<Record />)).toMatch(/<h1[^>]*>AlexandreSJ<\/h1>/)
    expect(r(<Record />, 'ja')).toContain('関わる人が、私と一緒に成長できるように')
  })
  it('pre-renders every side A note so descriptions are in the HTML', () => {
    const html = r(<Record />)
    record.sideA.forEach((t, i) => {
      expect(html).toContain(`>A${i + 1}<`)
      expect(html).toContain(`id="track-${t.name}"`)
    })
    expect(html).toContain('My TUI workspace and terminal multiplexer')
  })
  it('starts on the cover with no track pressed', () => {
    expect(r(<Record />)).not.toContain('aria-pressed="true"')
  })
})

describe('Backstage', () => {
  it('shows the approximate years without the start month', () => {
    const html = r(<Backstage />, 'pt')
    expect(html).toMatch(/~\d+ anos como fullstack dev/)
    expect(html).not.toContain('fevereiro')
  })
  it('titles the terminal with the home path and no size/encoding meta', () => {
    const html = r(<Backstage />)
    expect(html).toContain('/home/aelxand')
    expect(html).not.toContain('80×24')
  })
})

describe('SideB', () => {
  it('lists every other public repository', () => {
    const html = r(<SideB />)
    for (const t of record.sideB) expect(html).toContain(`>${t.name}</a>`)
  })
})

describe('Contact', () => {
  it('lists GitHub first and has no languages line', () => {
    const html = r(<Contact />)
    expect(html.indexOf('github.com/AlexandreSJ')).toBeLessThan(html.indexOf('linkedin.com'))
    expect(html).not.toContain('any of these languages')
  })
})

describe('Contact wrapping', () => {
  it('only breaks URLs after a slash', () => {
    expect(r(<Contact />).replaceAll('<!-- -->', '')).toContain('buymeacoffee.com/<wbr/>aelxand')
  })
})
