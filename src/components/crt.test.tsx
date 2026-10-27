import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Crt } from './Crt'

describe('Crt', () => {
  it('server-renders every line so the content is complete without JS', () => {
    const html = renderToString(<Crt label="who.md" lines={[{ kind: 'prompt', text: 'cat who.md' }, { kind: 'text', text: '- Fullstack developer' }]} />)
    expect(html).toContain('cat who.md')
    expect(html).toContain('- Fullstack developer')
  })
})
