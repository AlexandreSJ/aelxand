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

export function ditherBayer(dark: Float32Array, w: number, h: number, out: Uint8ClampedArray, color: RGB, jitter = 0): number {
  let on = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x
    if (dark[i] > B8[(y + jitter) % 8][(x + jitter * 3) % 8]) { put(out, i, color); on++ }
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

/** Near parallax layer: single ink dots on a coarse grid, denser toward the top-right. */
export function paintHalftone(out: Uint8ClampedArray, w: number, h: number): void {
  // One lit cell per grid point, never a cluster, so no dot grows into a block behind text.
  for (let y = 1; y < h; y += 3) for (let x = 1; x < w; x += 3) {
    const v = (x / w) * 0.5 + (1 - y / h) * 0.4
    if (v > B8[((y - 1) / 3) % 8][((x - 1) / 3) % 8]) put(out, y * w + x, INK, 34)
  }
}

/** Integer hash in [0,1): stable noise without Math.random, so layers repaint identically. */
const hash = (x: number, y: number) => {
  let n = Math.imul(x, 374761393) + Math.imul(y, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

/** Nearest parallax layer: sparse red specks that drift fastest and give the ground depth. Red only: light specks pulled the eye to the ground. */
export function paintSpecks(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (hash(x, y) < 0.001) put(out, y * w + x, RED, 150)
  }
}

/**
 * Lit cells grouped by colour as flat [x0, y0, x1, y1, …] cell coordinates,
 * so a renderer can draw every dot of one colour in a single path.
 */
export function dotsByColor(out: Uint8ClampedArray, w: number, h: number): Map<string, number[]> {
  const groups = new Map<string, number[]>()
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const o = (y * w + x) * 4
    if (!out[o + 3]) continue
    const key = `rgba(${out[o]},${out[o + 1]},${out[o + 2]},${(out[o + 3] / 255).toFixed(3)})`
    let g = groups.get(key)
    if (!g) groups.set(key, (g = []))
    g.push(x, y)
  }
  return groups
}
