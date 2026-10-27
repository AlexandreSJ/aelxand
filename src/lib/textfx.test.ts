import { afterEach, describe, expect, it } from 'vitest'
import { charify, scramble } from './textfx'

const mount = (html: string) => {
  const el = document.createElement('h2')
  el.innerHTML = html
  document.body.appendChild(el)
  return el
}
afterEach(() => { document.body.innerHTML = '' })

describe('charify', () => {
  it('keeps the visible text identical', () => {
    const el = mount('Things I <em class="v">build</em>')
    charify(el)
    expect(el.textContent).toBe('Things I build')
  })
  it('keeps nested emphasis elements', () => {
    const el = mount('Things I <em class="v">build</em>')
    charify(el)
    expect(el.querySelector('em.v')?.textContent).toBe('build')
  })
  it('wraps each word in a nowrap span and each char in a fixed-width box', () => {
    const el = mount('ab cd')
    const chars = charify(el)
    expect(el.querySelectorAll('.w')).toHaveLength(2)
    expect(chars).toHaveLength(4)
    for (const c of chars) expect(c.style.width).toMatch(/px$/)
  })
  it('is idempotent', () => {
    const el = mount('noct')
    const a = charify(el)
    const b = charify(el)
    expect(b).toBe(a)
    expect(el.querySelectorAll('.ch')).toHaveLength(4)
  })
})

describe('scramble', () => {
  it('settles on the original text', async () => {
    const el = mount('Terminal <em>multiplexer</em>')
    scramble(el, { duration: 1 })
    await new Promise(r => setTimeout(r, 60))
    expect(el.textContent).toBe('Terminal multiplexer')
  })
  it('only swaps glyphs inside existing char boxes', () => {
    const el = mount('aoi web')
    const before = charify(el).length
    scramble(el, { duration: 1000, rand: () => 0.5 })
    expect(el.querySelectorAll('.ch')).toHaveLength(before)
  })
})
