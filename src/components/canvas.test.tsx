import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Background } from './Background'
import { Sleeve } from './Sleeve'

describe('canvas components (server markup)', () => {
  it('Background is decorative', () => {
    expect(renderToString(<Background />)).toContain('aria-hidden="true"')
  })
  it('Sleeve exposes the portrait as an image and shows the years when nothing is playing', () => {
    const html = renderToString(
      <I18nProvider locale="en"><Sleeve art={{ kind: 'portrait' }} playing={null} years={4} motto="m" mottoRest="." /></I18nProvider>,
    )
    expect(html).toContain('role="img"')
    expect(html).toContain('4+ years')
  })
})
