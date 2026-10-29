import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Record } from './Record'
import { SideB } from './SideB'
import { Contact } from './Contact'
import { Backstage } from './Backstage'
import { Intro } from './Intro'
import { record } from '../data/record'

const r = (node: React.ReactNode, locale: 'en' | 'pt' | 'ja' = 'en') => renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>)

describe('Intro', () => {
  it('is the only h1 and marks the role in every locale, wherever the grammar puts it', () => {
    expect(r(<Intro />, 'pt')).toMatch(/<h1[^>]*>Oi, me chamo Alexandre, <span class="intro__role">desenvolvedor fullstack<\/span><\/h1>/)
    expect(r(<Intro />, 'ja')).toContain('こんにちは、<span class="intro__role">フルスタック開発者</span>のアレクサンドレです')
    expect(r(<Intro />)).toContain('aria-label="Hi, I&#x27;m Alexandre, a fullstack developer"')
    expect(r(<Record />)).not.toContain('<h1')
  })
})

describe('Record (first viewport)', () => {
  it('keeps the handle and the translated motto on the sleeve', () => {
    expect(r(<Record />)).toContain('>AlexandreSJ</p>')
    expect(r(<Record />, 'ja')).toContain('関わる人が、私と一緒に成長できるように')
  })
  it('pre-renders every side A note so descriptions are in the HTML', () => {
    const html = r(<Record />)
    record.sideA.forEach((t, i) => {
      expect(html).toContain(`>${String(i + 1).padStart(2, '0')}<`)
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
  it('names every tool in the stack wall, not only on hover', () => {
    const html = r(<Backstage />)
    for (const name of ['Go', 'TypeScript', 'Spring Boot', 'Lip Gloss']) expect(html).toContain(`>${name}</span>`)
    expect(html).toContain('Hover or tap a logo')
  })
})

describe('SideB (repositories)', () => {
  it('lists the featured projects and every other repository, with the first README open', () => {
    const html = r(<SideB />)
    for (const t of [...record.sideA, ...record.sideB]) expect(html).toContain(`<span class="repos__name">${t.name}</span>`)
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1)
    expect(html).toContain(`href="https://github.com/AlexandreSJ/${record.sideA[0].name}"`)
    expect(html).toContain('role="status"')
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
