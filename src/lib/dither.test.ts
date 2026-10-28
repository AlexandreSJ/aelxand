import { describe, expect, it } from 'vitest'
import { B8, RED, bayer8, ditherBayer, paintGlow, paintHalftone, paintSpecks, toDarkness } from './dither'

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

describe('toDarkness', () => {
  it('maps white to 0 and black to 1', () => {
    const rgba = new Uint8ClampedArray([255, 255, 255, 255, 0, 0, 0, 255])
    const d = toDarkness(rgba, 2)
    expect(d[0]).toBe(0)
    expect(d[1]).toBe(1)
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

describe('paintSpecks', () => {
  it('scatters a sparse, deterministic near layer', () => {
    const a = out(160, 120), b = out(160, 120)
    paintSpecks(a, 160, 120); paintSpecks(b, 160, 120)
    expect([...a]).toEqual([...b])
    let on = 0
    for (let i = 3; i < a.length; i += 4) if (a[i]) on++
    expect(on / (160 * 120)).toBeGreaterThan(0.002)
    expect(on / (160 * 120)).toBeLessThan(0.03)
  })
})
