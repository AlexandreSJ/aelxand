import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Crt } from './Crt'

const lines = [{ kind: 'prompt' as const, text: 'cat who.md' }, { kind: 'text' as const, text: '- Fullstack developer' }]

describe('Crt', () => {
  it('server-renders every line so the content is complete without JS', () => {
    const html = renderToString(<Crt label="who.md" lines={lines} />)
    expect(html).toContain('cat who.md')
    expect(html).toContain('- Fullstack developer')
  })
  it('reserves the full text height with a hidden ghost so typing never resizes the screen', () => {
    const html = renderToString(<Crt label="who.md" lines={lines} />)
    expect(html).toMatch(/<pre class="crt__ghost" aria-hidden="true">[^]*- Fullstack developer/)
    expect(html).toContain('class="crt__type"')
  })
})
