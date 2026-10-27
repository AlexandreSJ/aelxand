import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Button } from './Button'
import { SectionHead } from './SectionHead'
import { Rule } from './Rule'
import { Marquee } from './Marquee'

describe('primitives (server markup)', () => {
  it('Button renders a link when href is set', () => {
    expect(renderToString(<Button href="/x" variant="red">go</Button>)).toMatch(/^<a[^>]+class="btn btn--red"[^>]+href="\/x"/)
  })
  it('SectionHead keeps the full title readable and marks the emphasis', () => {
    const html = renderToString(<SectionHead id="p" title="Things I" em="build" />)
    expect(html).toContain('aria-label="Things I build"')
    expect(html).toContain('<em class="v">build</em>')
  })
  it('Rule is a hairline separator', () => {
    expect(renderToString(<Rule />)).toBe('<hr class="rule"/>')
  })
})

describe('Marquee', () => {
  const items = ['Go', 'React', 'Postgres']
  const html = renderToString(<Marquee label="stack" items={items} />)

  it('renders two identical groups so the loop has no seam', () => {
    const groups = html.match(/<ul class="marquee__group"[^>]*>.*?<\/ul>/g) ?? []
    expect(groups).toHaveLength(2)
    expect(groups[0]!.replace(/ aria-hidden="true"/, '')).toBe(groups[1].replace(/ aria-hidden="true"/, ''))
  })
  it('hides the duplicate from assistive tech and labels the list', () => {
    expect(html).toContain('aria-label="stack"')
    expect(html.match(/aria-hidden="true"/g)).toHaveLength(1)
  })
  it('alternates structure and voice faces', () => {
    expect(html).toContain('<li class="marquee__item">Go</li><li class="marquee__item marquee__item--v">React</li>')
  })
})
