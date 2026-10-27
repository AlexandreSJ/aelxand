import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Background } from './Background'
import { Portrait } from './Portrait'

describe('canvas components (server markup)', () => {
  it('Background is decorative', () => {
    expect(renderToString(<Background />)).toContain('aria-hidden="true"')
  })
  it('Portrait exposes an accessible name and a 200x200 canvas', () => {
    const html = renderToString(<Portrait src="/portrait.jpg" alt="me" />)
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="me"')
    expect(html).toContain('width="200"')
  })
})
