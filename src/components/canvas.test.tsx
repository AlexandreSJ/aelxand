import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Background } from './Background'
import { Sleeve } from './Sleeve'
import { record } from '../data/record'

describe('canvas components (server markup)', () => {
  it('Background is decorative and has three depth layers', () => {
    const html = renderToString(<Background />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/class="bg__layer"/g)).toHaveLength(3)
  })
  it('Sleeve dithers only the portrait; tracks get plain layers', () => {
    const html = renderToString(
      <I18nProvider locale="en"><Sleeve tracks={record.sideA} active={-1} motto="m" mottoRest="." /></I18nProvider>,
    )
    expect(html.match(/<canvas/g)).toHaveLength(1)
    expect(html).toContain('role="img"')
    expect(html).toContain('<video')
    expect(html).toContain('class="cover-type"')
  })
})
