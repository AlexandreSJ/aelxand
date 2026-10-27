export type RGB = readonly [number, number, number]
export const RED: RGB = [238, 0, 34]
export const INK: RGB = [237, 230, 233]

/** Classic recursive Bayer matrix, integer thresholds 0..63. */
export function bayer8(): number[][] {
  let m = [[0]]
  for (let n = 1; n < 8; n *= 2) {
    const next: number[][] = []
    for (let y = 0; y < n * 2; y++) {
      next.push([])
      for (let x = 0; x < n * 2; x++) {
        const q = [[0, 2], [3, 1]][Math.floor(y / n)][Math.floor(x / n)]
        next[y].push(m[y % n][x % n] * 4 + q)
      }
    }
    m = next
  }
  return m
}

export const B8: number[][] = bayer8().map(r => r.map(v => (v + 0.5) / 64))

function put(out: Uint8ClampedArray, i: number, c: RGB, a = 255) {
  const o = i * 4
  out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = a
}

/** Luma to "ink amount": white paper = 0, black = 1. */
export function toDarkness(rgba: Uint8ClampedArray, n: number): Float32Array {
  const d = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const l = (rgba[i * 4] * 0.299 + rgba[i * 4 + 1] * 0.587 + rgba[i * 4 + 2] * 0.114) / 255
    d[i] = 1 - l
  }
  return d
}

/** Luma as ink amount for light-on-dark sources (terminal video, type covers). */
export function toBrightness(rgba: Uint8ClampedArray, n: number): Float32Array {
  const d = toDarkness(rgba, n)
  for (let i = 0; i < n; i++) d[i] = 1 - d[i]
  return d
}

export function ditherBayer(dark: Float32Array, w: number, h: number, out: Uint8ClampedArray, color: RGB, jitter = 0): number {
  let on = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x
    if (dark[i] > B8[(y + jitter) % 8][(x + jitter * 3) % 8]) { put(out, i, color); on++ }
  }
  return on
}

const ATKINSON = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]] as const

export function ditherAtkinson(dark: Float32Array, w: number, h: number, out: Uint8ClampedArray, color: RGB): number {
  const e = Float32Array.from(dark)
  let on = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, q = e[i] > 0.5 ? 1 : 0, err = (e[i] - q) / 8
    if (q) { put(out, i, color); on++ }
    for (const [dx, dy] of ATKINSON) {
      const xx = x + dx, yy = y + dy
      if (xx >= 0 && xx < w && yy < h) e[yy * w + xx] += err
    }
  }
  return on
}

/** Far parallax layer: red Bayer glow pooling in the top-right and bottom-left corners. */
export function paintGlow(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const r1 = Math.hypot(((x - w * 0.92) / w) * 1.18, (y + h * 0.05) / h)
    const r2 = Math.hypot((x - w * 0.05) / w, ((y - h * 1.05) / h) * 1.26)
    if (Math.max(0.55 - r1 * 1.05, 0.3 - r2 * 0.9, 0) > B8[y % 8][x % 8]) put(out, y * w + x, RED, 46)
  }
}

/** Near parallax layer: ink halftone dots that grow toward the top-right. */
export function paintHalftone(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const cx = (x % 6) - 2.5, cy = (y % 6) - 2.5
    const v = ((x / w) * 0.5 + (1 - y / h) * 0.4) * 0.8
    if (v > Math.hypot(cx, cy) / 3.6) put(out, y * w + x, INK, 24)
  }
}

export function paintBand(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = Math.pow(1 - y / h, 1.6) * (0.75 + 0.25 * Math.sin(x / 19) * Math.cos(x / 7))
    if (v > B8[y % 8][x % 8]) put(out, y * w + x, RED)
  }
}
