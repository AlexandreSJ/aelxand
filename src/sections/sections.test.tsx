import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Hero } from './Hero'
import { Projects } from './Projects'
import { Contact } from './Contact'
import { projects } from '../data/projects'

const r = (node: React.ReactNode, locale: 'en' | 'ja' = 'en') => renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>)

describe('sections', () => {
  it('Hero shows the handle and the English motto in every locale', () => {
    for (const l of ['en', 'ja'] as const) {
      const html = r(<Hero />, l)
      expect(html).toContain('AlexandreSJ')
      expect(html).toContain('I want people to thrive with me')
    }
  })
  it('Projects renders a card per project', () => {
    const html = r(<Projects />)
    for (const p of projects) expect(html).toContain(`projects/${p.id}`)
  })
  it('Contact hides the email row when no email is configured', () => {
    expect(r(<Contact />)).not.toContain('mailto:')
  })
})
