import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('src/styles/tokens.css', 'utf8')

describe('tokens', () => {
  it('uses the README red as the only accent', () => {
    expect(css).toContain('--red:#ee0022')
  })
  it('ships the chosen CRT values', () => {
    for (const t of ['--crt-scan:.32', '--crt-glow:0px', '--crt-mask:.16']) expect(css).toContain(t)
  })
  it('is dark only', () => {
    expect(css).toContain('color-scheme:dark')
    expect(css).not.toContain('prefers-color-scheme')
  })
})
