import { describe, expect, it } from 'vitest'
import { B8, RED, bayer8, ditherAtkinson, ditherBayer, paintBand, paintGlow, paintHalftone, toBrightness, toDarkness } from './dither'

const field = (w: number, h: number, v: number) => new Float32Array(w * h).fill(v)
const out = (w: number, h: number) => new Uint8ClampedArray(w * h * 4)

describe('bayer8', () => {
  it('has 64 unique thresholds 0..63', () => {
    const flat = bayer8().flat()
    expect(new Set(flat).size).toBe(64)
    expect(Math.min(...flat)).toBe(0)
    expect(Math.max(...flat)).toBe(63)
  })
  it('normalizes thresholds into (0,1)', () => {
    for (const v of B8.flat()) expect(v > 0 && v < 1).toBe(true)
  })
})

describe('ditherBayer', () => {
  it('draws nothing for white and everything for black', () => {
    expect(ditherBayer(field(16, 16, 0), 16, 16, out(16, 16), RED)).toBe(0)
    expect(ditherBayer(field(16, 16, 1), 16, 16, out(16, 16), RED)).toBe(256)
  })
  it('turns on exactly half of an 8x8 tile at 50% gray', () => {
    expect(ditherBayer(field(8, 8, 0.5), 8, 8, out(8, 8), RED)).toBe(32)
  })
  it('writes the given color with full alpha', () => {
    const o = out(1, 1)
    ditherBayer(field(1, 1, 1), 1, 1, o, RED)
    expect([...o]).toEqual([238, 0, 34, 255])
  })
})

describe('ditherAtkinson', () => {
  it('keeps mid gray between 35% and 65% coverage', () => {
    const on = ditherAtkinson(field(64, 64, 0.5), 64, 64, out(64, 64), RED)
    expect(on / 4096).toBeGreaterThan(0.35)
    expect(on / 4096).toBeLessThan(0.65)
  })
})

describe('toDarkness', () => {
  it('maps white to 0 and black to 1', () => {
    const rgba = new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255])
    const d = toDarkness(rgba, 2)
    expect(d[0]).toBe(0)
    expect(d[1]).toBe(1)
  })
})

describe('toBrightness', () => {
  it('maps white to 1 and black to 0, for light-on-dark sources', () => {
    const d = toBrightness(new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255]), 2)
    expect([d[0], d[1]]).toEqual([1, 0])
  })
})

describe('background layers', () => {
  const coverage = (o: Uint8ClampedArray, n: number) => { let on = 0; for (let i = 3; i < o.length; i += 4) if (o[i]) on++; return on / n }
  it('paints a sparse, translucent red glow', () => {
    const o = out(120, 90)
    paintGlow(o, 120, 90)
    for (let i = 3; i < o.length; i += 4) if (o[i]) { expect(o[i]).toBeLessThan(80); expect(o[i - 3]).toBe(238) }
    expect(coverage(o, 120 * 90)).toBeGreaterThan(0.03)
    expect(coverage(o, 120 * 90)).toBeLessThan(0.3)
  })
  it('paints a faint ink halftone', () => {
    const o = out(120, 90)
    paintHalftone(o, 120, 90)
    for (let i = 3; i < o.length; i += 4) if (o[i]) expect(o[i]).toBeLessThan(50)
    expect(coverage(o, 120 * 90)).toBeGreaterThan(0.03)
    expect(coverage(o, 120 * 90)).toBeLessThan(0.4)
  })
})

describe('paintBand', () => {
  it('paints a band that is denser at the top than the bottom', () => {
    const w = 64, h = 22, o = out(w, h)
    paintBand(o, w, h)
    const row = (y: number) => { let n = 0; for (let x = 0; x < w; x++) if (o[(y * w + x) * 4 + 3]) n++; return n }
    expect(row(0)).toBeGreaterThan(row(h - 1))
  })
})
