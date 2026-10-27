import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Button } from './Button'
import { SectionHead } from './SectionHead'
import { Divider } from './Divider'

describe('primitives (server markup)', () => {
  it('Button renders a link when href is set', () => {
    expect(renderToString(<Button href="/x" variant="red">go</Button>)).toMatch(/^<a[^>]+class="btn btn--red"[^>]+href="\/x"/)
  })
  it('SectionHead keeps the full title readable and marks the emphasis', () => {
    const html = renderToString(<SectionHead id="p" no="03" title="Things I" em="build" />)
    expect(html).toContain('aria-label="Things I build"')
    expect(html).toContain('<em class="v">build</em>')
  })
  it('Divider marquee duplicates words for a seamless loop and hides from AT', () => {
    const html = renderToString(<Divider kind="marquee" words={['a', 'b']} />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<em>b<\/em>/g)).toHaveLength(2)
  })
})
