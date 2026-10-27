# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild aelxand.vercel.app as a statically pre-rendered, four-locale React site using the "dossier" design system (red `#ee0022`, dithering, CRT).

**Architecture:** One Vite + React 19 app at the repo root. Pure effect logic lives in `src/lib` (dithering, text effects) and is unit-tested; React components wrap it in hooks that run only on the client. A Vite SSR build renders each locale to `dist/<locale>/index.html`, and the client hydrates it.

**Tech Stack:** Bun, Vite 8, React 19 (+ React Compiler), TypeScript, Vitest + happy-dom, @fontsource fonts, Vercel static hosting.

**Spec:** `docs/superpowers/specs/2026-10-27-portfolio-redesign-design.md`

## Global Constraints

- Dark only; accent `#ee0022` is the only accent color.
- Locales exactly `pt`, `en`, `es`, `ja`; every locale JSON has the same key set.
- Fonts: Bricolage Grotesque 800 (structure), Fraunces italic 300 (voice), Geist (reading), Fira Code (machine), DotGothic16 (labels), Noto Sans JP (ja body). Self-hosted via @fontsource; no runtime Google Fonts.
- Motion: section titles = dissolve, hero name = glitch (mount + hover), card titles = scramble. Nothing animates under `prefers-reduced-motion: reduce`.
- Scramble must never change element height or line breaks.
- CRT tokens: `--crt-scan:.32; --crt-glow:0px; --crt-mask:.16; --crt-curve:0px`.
- Background = red Bayer glow + ink halftone, layered.
- Dividers alternate `band` → `marquee`; no terminal command lines above sections.
- No decorative kanji. The motto "I want people to thrive with me" stays in English in every locale.
- Effects start in `useEffect`; server markup must be identical to the first client render.

---

### Task 1: Flatten repo into a single Vite app with tokens and fonts

**Files:**
- Delete: `api/`, `src/` (Hono), `api-server.ts`, root `package.json`, `bun.lock`, `tsconfig.json`, `client/src/**`, `client/public/assets/profile.png`, `client/public/icons.svg`, `client/README.md`
- Move: `client/*` → repo root
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/fonts.ts`, `src/styles/tokens.test.ts`, `public/portrait.jpg`
- Modify: `vite.config.ts`, `package.json`, `index.html`, `vercel.json`

**Interfaces:**
- Produces: CSS custom properties listed in the spec; font families `'Bricolage Grotesque Variable'`, `'Fraunces Variable'`, `'Geist Variable'`, `'Fira Code Variable'`, `'DotGothic16'`, `'Noto Sans JP'`; utility classes `.wrap`, `.label`, `em.v`, `.sheet`, `.sr-only`.

- [ ] **Step 1: Remove the Hono API and old client source, move client to root**

```bash
git rm -rq api src api-server.ts package.json bun.lock tsconfig.json
git rm -rq client/src client/public/assets client/public/icons.svg client/README.md
git mv client/* .
git mv client/.gitignore .gitignore.client && cat .gitignore.client >> .gitignore && git rm -q --cached .gitignore.client && rm .gitignore.client
rmdir client
mkdir -p src/styles src/lib src/hooks src/components src/sections src/i18n src/data scripts
```

- [ ] **Step 2: Install dependencies**

```bash
bun remove framer-motion
bun add @fontsource-variable/bricolage-grotesque @fontsource-variable/fraunces @fontsource-variable/geist @fontsource-variable/fira-code @fontsource/dotgothic16 @fontsource/noto-sans-jp
bun add -d vitest happy-dom
ls node_modules/@fontsource-variable/fraunces/*.css node_modules/@fontsource-variable/bricolage-grotesque/*.css
```

Expected: listing includes `wght-italic.css` for Fraunces and `index.css` for Bricolage.

- [ ] **Step 3: Write the failing token test**

`src/styles/tokens.test.ts`:
```ts
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

describe('tokens', () => {
  it('uses the README red as the only accent', () => {
    expect(css).toContain('--red:#ee0022')
  })
  it('ships the chosen CRT values', () => {
    for (const t of ['--crt-scan:.32', '--crt-glow:0px', '--crt-mask:.16', '--crt-curve:0px']) expect(css).toContain(t)
  })
  it('is dark only', () => {
    expect(css).toContain('color-scheme:dark')
    expect(css).not.toContain('prefers-color-scheme')
  })
})
```

- [ ] **Step 4: Configure Vitest and run the test to see it fail**

`vite.config.ts`:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
})
```

`package.json` scripts:
```json
"scripts": {
  "dev": "vite",
  "fetch-repos": "bun scripts/fetch-repos.ts",
  "build": "bun run fetch-repos && tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && bun scripts/prerender.ts",
  "preview": "vite preview",
  "test": "vitest run",
  "lint": "eslint ."
}
```

Run: `bun run test src/styles` → FAIL (tokens.css missing).

- [ ] **Step 5: Write tokens, base styles and fonts**

`src/styles/tokens.css`:
```css
:root{
  --paper:#0b0a0d;--raised:#15121a;--well:#1c1822;
  --ink:#ede6e9;--ink-dim:#c2b9be;--ink-muted:#9a9197;--ink-faint:#7a7278;
  --red:#ee0022;--red-dim:#9e0a20;--on-red:#0b0a0d;
  --line:color-mix(in srgb,var(--ink) 20%,transparent);
  --line-soft:color-mix(in srgb,var(--ink) 10%,transparent);
  --line-strong:color-mix(in srgb,var(--ink) 38%,transparent);
  --tint:color-mix(in srgb,var(--ink) 5%,transparent);
  --f-structure:'Bricolage Grotesque Variable',system-ui,sans-serif;
  --f-voice:'Fraunces Variable',Georgia,serif;
  --f-read:'Geist Variable',system-ui,sans-serif;
  --f-mono:'Fira Code Variable',ui-monospace,monospace;
  --f-label:'DotGothic16','Fira Code Variable',ui-monospace,monospace;
  --crt-bg:#0e0507;--crt-fg:#ff3347;--crt-scan:.32;--crt-glow:0px;--crt-mask:.16;--crt-curve:0px;
  --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;--s6:32px;--s7:48px;--s8:64px;
  --radius:2px;--ease:cubic-bezier(.215,.61,.355,1);--snap:90ms;--move:.18s;
  color-scheme:dark;
}
:root:lang(ja){--f-read:'Geist Variable','Noto Sans JP',system-ui,sans-serif}
```

`src/styles/base.css`:
```css
*,*::before,*::after{box-sizing:border-box}
html{background:var(--paper);scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:400 16px/1.6 var(--f-read);-webkit-font-smoothing:antialiased;overflow-x:hidden}
::selection{background:var(--red);color:var(--on-red)}
a{color:inherit}
h1,h2,h3,h4{margin:0;font-weight:400;text-wrap:balance}
p{margin:0}
ul{margin:0;padding:0;list-style:none}
:focus-visible{outline:1px solid var(--red);outline-offset:3px}
.wrap{max-width:1100px;margin-inline:auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.sheet{padding-block:clamp(56px,9vw,112px);position:relative}
.label{font-family:var(--f-label);font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-faint)}
em.v{font-family:var(--f-voice);font-style:italic;font-weight:300;letter-spacing:0;color:var(--red)}
.mono{font-family:var(--f-mono)}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}
```

`src/styles/fonts.ts`:
```ts
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/fira-code'
import '@fontsource/dotgothic16'
import '@fontsource/noto-sans-jp/400.css'
```

Copy the processed avatar (200×200 grayscale JPEG from the plan session) to `public/portrait.jpg`.

- [ ] **Step 6: Template and Vercel config**

`index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0b0a0d" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```

`vercel.json`:
```json
{
  "buildCommand": "bun run build",
  "outputDirectory": "dist",
  "installCommand": "bun install",
  "cleanUrls": true,
  "trailingSlash": false
}
```

- [ ] **Step 7: Run test to verify it passes, then commit**

Run: `bun run test src/styles` → PASS (3 tests).

```bash
git add -A
git commit -m "chore: flatten into single Vite app, add dossier tokens and fonts"
```

---

### Task 2: Dithering library

**Files:**
- Create: `src/lib/dither.ts`, `src/lib/dither.test.ts`

**Interfaces:**
- Produces:
  - `type RGB = readonly [number, number, number]`, `RED: RGB`, `INK: RGB`
  - `bayer8(): number[][]` (ints 0–63), `B8: number[][]` (thresholds in (0,1))
  - `toDarkness(rgba: Uint8ClampedArray, n: number): Float32Array`
  - `ditherBayer(dark: Float32Array, w: number, h: number, out: Uint8ClampedArray, color: RGB, jitter?: number): number` (returns pixels on)
  - `ditherAtkinson(dark: Float32Array, w: number, h: number, out: Uint8ClampedArray, color: RGB): number`
  - `paintBackground(out: Uint8ClampedArray, w: number, h: number): void`
  - `paintBand(out: Uint8ClampedArray, w: number, h: number): void`

- [ ] **Step 1: Write the failing tests**

`src/lib/dither.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { B8, RED, bayer8, ditherAtkinson, ditherBayer, paintBackground, paintBand, toDarkness } from './dither'

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

describe('paintBackground / paintBand', () => {
  it('paints a sparse, translucent background', () => {
    const o = out(120, 90)
    paintBackground(o, 120, 90)
    let on = 0
    for (let i = 3; i < o.length; i += 4) if (o[i]) { on++; expect(o[i]).toBeLessThan(80) }
    expect(on / (120 * 90)).toBeGreaterThan(0.05)
    expect(on / (120 * 90)).toBeLessThan(0.45)
  })
  it('paints a band that is denser at the top than the bottom', () => {
    const w = 64, h = 22, o = out(w, h)
    paintBand(o, w, h)
    const row = (y: number) => { let n = 0; for (let x = 0; x < w; x++) if (o[(y * w + x) * 4 + 3]) n++; return n }
    expect(row(0)).toBeGreaterThan(row(h - 1))
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/lib/dither` → FAIL (module not found).

- [ ] **Step 3: Implement**

`src/lib/dither.ts`:
```ts
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

/** Red Bayer glow in two corners, then an ink halftone where the glow left gaps. */
export function paintBackground(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x
    const r1 = Math.hypot(((x - w * 0.92) / w) * 1.18, (y + h * 0.05) / h)
    const r2 = Math.hypot((x - w * 0.05) / w, ((y - h * 1.05) / h) * 1.26)
    if (Math.max(0.62 - r1 * 1.05, 0.32 - r2 * 0.9, 0) > B8[y % 8][x % 8]) { put(out, i, RED, 58); continue }
    const cx = (x % 6) - 2.5, cy = (y % 6) - 2.5
    const v = ((x / w) * 0.55 + (1 - y / h) * 0.45) * 0.85
    if (v > Math.hypot(cx, cy) / 3.6) put(out, i, INK, 40)
  }
}

export function paintBand(out: Uint8ClampedArray, w: number, h: number): void {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = Math.pow(1 - y / h, 1.6) * (0.75 + 0.25 * Math.sin(x / 19) * Math.cos(x / 7))
    if (v > B8[y % 8][x % 8]) put(out, y * w + x, RED)
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `bun run test src/lib/dither` → PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/dither.ts src/lib/dither.test.ts
git commit -m "feat: add dithering library (bayer, atkinson, background, band)"
```

---

### Task 3: Text effects library (stable scramble, dissolve, glitch)

**Files:**
- Create: `src/lib/textfx.ts`, `src/lib/textfx.test.ts`, `src/styles/fx.css`

**Interfaces:**
- Produces:
  - `type FxKind = 'scramble' | 'dissolve' | 'glitch'`
  - `charify(el: HTMLElement): HTMLSpanElement[]`
  - `scramble(el: HTMLElement, opts?: { duration?: number; rand?: () => number }): () => void`
  - `dissolve(el: HTMLElement): () => void`
  - `glitch(el: HTMLElement): () => void`
  - `runFx(kind: FxKind, el: HTMLElement): () => void`
  - CSS classes `.fx`, `.fx .w`, `.fx .ch`, `.fx.glitching`

- [ ] **Step 1: Write the failing tests**

`src/lib/textfx.test.ts`:
```ts
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
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/lib/textfx` → FAIL (module not found).

- [ ] **Step 3: Implement**

`src/lib/textfx.ts`:
```ts
import { B8 } from './dither'

export type FxKind = 'scramble' | 'dissolve' | 'glitch'

type Charified = HTMLElement & { _chars?: HTMLSpanElement[] }
const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz0123456789#%&*+=/<>'

/**
 * Split text nodes into nowrap words of inline-block chars and lock each
 * char box to its measured width, so swapping glyphs can never reflow lines.
 */
export function charify(el: HTMLElement): HTMLSpanElement[] {
  const host = el as Charified
  if (host._chars) return host._chars
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) nodes.push(walker.currentNode as Text)
  for (const node of nodes) {
    const frag = document.createDocumentFragment()
    for (const tok of (node.nodeValue ?? '').split(/(\s+)/)) {
      if (!tok) continue
      if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); continue }
      const word = document.createElement('span')
      word.className = 'w'
      word.setAttribute('aria-hidden', 'true')
      for (const c of tok) {
        const ch = document.createElement('span')
        ch.className = 'ch'
        ch.textContent = c
        ch.dataset.c = c
        word.appendChild(ch)
      }
      frag.appendChild(word)
    }
    node.parentNode?.replaceChild(frag, node)
  }
  const chars = [...el.querySelectorAll<HTMLSpanElement>('.ch')]
  for (const ch of chars) ch.style.width = `${ch.getBoundingClientRect().width}px`
  host._chars = chars
  return chars
}

export function scramble(el: HTMLElement, opts: { duration?: number; rand?: () => number } = {}): () => void {
  const chars = charify(el)
  const rand = opts.rand ?? Math.random
  const n = chars.length
  const duration = opts.duration ?? 600 + n * 16
  const t0 = performance.now()
  let raf = 0
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / duration)
    chars.forEach((ch, i) => {
      ch.textContent = i / n < p * 1.15 - 0.15 ? ch.dataset.c! : GLYPHS[(rand() * GLYPHS.length) | 0]
    })
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => {
    cancelAnimationFrame(raf)
    chars.forEach(ch => { ch.textContent = ch.dataset.c! })
  }
}

let masks: string[] | null = null
/** 17 Bayer coverage steps as 24px mask tiles (3px cells). */
function dissolveMasks(): string[] {
  if (masks) return masks
  masks = []
  for (let k = 0; k <= 16; k++) {
    const c = document.createElement('canvas')
    c.width = c.height = 24
    const g = c.getContext('2d')!
    g.fillStyle = '#000'
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (B8[y][x] < k / 16) g.fillRect(x * 3, y * 3, 3, 3)
    masks.push(`url(${c.toDataURL()})`)
  }
  return masks
}

export function dissolve(el: HTMLElement): () => void {
  const m = dissolveMasks()
  const t0 = performance.now(), duration = 560
  let raf = 0
  el.style.maskSize = '24px 24px'
  const clear = () => { el.style.maskImage = '' }
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / duration)
    el.style.maskImage = m[Math.round(p * 16)]
    if (p < 1) raf = requestAnimationFrame(step)
    else clear()
  }
  raf = requestAnimationFrame(step)
  return () => { cancelAnimationFrame(raf); clear() }
}

export function glitch(el: HTMLElement): () => void {
  el.classList.remove('glitching')
  void el.offsetWidth
  el.classList.add('glitching')
  const id = setTimeout(() => el.classList.remove('glitching'), 700)
  return () => { clearTimeout(id); el.classList.remove('glitching') }
}

export function runFx(kind: FxKind, el: HTMLElement): () => void {
  if (kind === 'scramble') return scramble(el)
  if (kind === 'dissolve') return dissolve(el)
  return glitch(el)
}
```

`src/styles/fx.css`:
```css
.fx{position:relative}
.fx .w{white-space:nowrap}
.fx .ch{display:inline-block;text-align:center;white-space:pre}
.fx.glitching{animation:fx-jit .62s steps(1) both}
.fx.glitching::before,.fx.glitching::after{content:attr(data-text);position:absolute;inset:0;pointer-events:none}
.fx.glitching::before{color:var(--red);clip-path:inset(10% 0 55% 0);animation:fx-sl1 .62s steps(1) both}
.fx.glitching::after{color:var(--ink-faint);clip-path:inset(58% 0 8% 0);animation:fx-sl2 .62s steps(1) both}
@keyframes fx-jit{0%{transform:translate(3px,-1px)}15%{transform:translate(-4px,1px)}30%{transform:translate(2px,2px)}45%{transform:translate(-2px,-2px)}60%{transform:translate(4px,0)}75%{transform:translate(-1px,1px)}100%{transform:none}}
@keyframes fx-sl1{0%{transform:translate(-8px,0)}25%{transform:translate(6px,0);clip-path:inset(40% 0 30% 0)}50%{transform:translate(-3px,0);clip-path:inset(5% 0 80% 0)}75%{transform:translate(9px,0)}100%{transform:none;opacity:0}}
@keyframes fx-sl2{0%{transform:translate(7px,0)}33%{transform:translate(-9px,0);clip-path:inset(70% 0 2% 0)}66%{transform:translate(4px,0)}100%{transform:none;opacity:0}}
```

- [ ] **Step 4: Run to verify pass**

Run: `bun run test src/lib/textfx` → PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/textfx.ts src/lib/textfx.test.ts src/styles/fx.css
git commit -m "feat: add text effects with width-locked scramble"
```

---

### Task 4: i18n (four locales, key parity, locale picking)

**Files:**
- Create: `src/i18n/{en,pt,es,ja}.json`, `src/i18n/index.tsx`, `src/i18n/pickLocale.ts`, `src/i18n/i18n.test.ts`

**Interfaces:**
- Produces:
  - `LOCALES = ['pt','en','es','ja'] as const`, `type Locale`, `isLocale(s: string): s is Locale`
  - `HTML_LANG: Record<Locale,string>` (`pt-BR`, `en`, `es`, `ja`)
  - `type MessageKey = keyof typeof en`
  - `I18nProvider({ locale, children })`, `useI18n(): { locale: Locale; t: (k: MessageKey) => string }`
  - `pickLocale(languages: readonly string[]): Locale` (**owner writes the body**)

- [ ] **Step 1: Write the failing tests**

`src/i18n/i18n.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import en from './en.json'
import pt from './pt.json'
import es from './es.json'
import ja from './ja.json'
import { pickLocale } from './pickLocale'

describe('locale files', () => {
  const keys = Object.keys(en).sort()
  for (const [name, dict] of Object.entries({ pt, es, ja })) {
    it(`${name} has exactly the same keys as en`, () => {
      expect(Object.keys(dict).sort()).toEqual(keys)
    })
    it(`${name} has no empty strings`, () => {
      for (const v of Object.values(dict)) expect(v.trim()).not.toBe('')
    })
  }
})

describe('pickLocale', () => {
  it('maps regional tags to our locales', () => {
    expect(pickLocale(['pt-BR'])).toBe('pt')
    expect(pickLocale(['ja-JP'])).toBe('ja')
    expect(pickLocale(['es-MX'])).toBe('es')
  })
  it('respects preference order', () => {
    expect(pickLocale(['de-DE', 'es-AR', 'pt-BR'])).toBe('es')
  })
  it('falls back to en', () => {
    expect(pickLocale(['de', 'fr'])).toBe('en')
    expect(pickLocale([])).toBe('en')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/i18n` → FAIL.

- [ ] **Step 3: Write the locale files**

`src/i18n/en.json`:
```json
{
  "meta.title": "AlexandreSJ — Fullstack developer",
  "meta.description": "Portfolio of Alexandre da Silva Junior, fullstack developer from Brazil. Projects, experience and stack.",
  "nav.projects": "projects",
  "nav.about": "about",
  "nav.contact": "contact",
  "hero.label": "Fullstack developer · Brazil",
  "hero.status": "building noct · learning WAPT · arch btw",
  "hero.philosophy_rest": ", and to bring great solutions to real problems.",
  "hero.cta_projects": "see projects",
  "hero.portrait_alt": "Portrait of Alexandre, dithered in red",
  "about.title": "Who I",
  "about.em": "am",
  "about.l1": "Fullstack developer",
  "about.l2": "Linux and cybersecurity enthusiast (arch btw)",
  "about.l3": "D&D player and DM",
  "about.l4": "Guitar and bass player",
  "about.l5": "Portuguese (native) · English (fluent) · Spanish (intermediate) · Japanese (learning)",
  "projects.title": "Things I",
  "projects.em": "build",
  "projects.noct": "My TUI workspace and terminal multiplexer.",
  "projects.aoi": "A typing test for the terminal, to relax and practice.",
  "projects.aoi-web": "aoi in the browser, with a live version.",
  "projects.puddle": "REST API written in Go with Gin.",
  "projects.aelxand": "This site: React, Vite and a dithering engine.",
  "projects.source": "source",
  "projects.live": "live",
  "projects.stars": "stars",
  "status.building": "building",
  "status.live": "live",
  "status.stable": "stable",
  "experience.title": "Where I've",
  "experience.em": "been",
  "experience.degree": "BSc in Computational Science",
  "experience.present": "present",
  "stack.title": "Tools I",
  "stack.em": "trust",
  "stack.frontend": "frontend",
  "stack.backend": "backend",
  "stack.data": "data",
  "stack.tools": "tools",
  "offline.title": "Away from the",
  "offline.em": "keyboard",
  "offline.dnd": "D&D",
  "offline.dnd_d": "Running campaigns as a DM.",
  "offline.music": "Music",
  "offline.music_d": "Guitar and bass.",
  "offline.pixel": "Pixel art",
  "offline.pixel_d": "Drawing one pixel at a time.",
  "offline.languages": "Languages",
  "offline.languages_d": "Currently learning Japanese.",
  "now.title": "Now",
  "now.em": "playing",
  "now.alt": "Recently played on Spotify",
  "contact.title": "Let's",
  "contact.em": "talk",
  "contact.lede": "Messages are welcome, in any of these languages.",
  "contact.email": "email",
  "contact.copy": "copy",
  "contact.copied": "copied",
  "footer.source": "source",
  "footer.language": "language"
}
```

`src/i18n/pt.json`:
```json
{
  "meta.title": "AlexandreSJ — Desenvolvedor fullstack",
  "meta.description": "Portfólio de Alexandre da Silva Junior, desenvolvedor fullstack do Brasil. Projetos, experiência e stack.",
  "nav.projects": "projetos",
  "nav.about": "sobre",
  "nav.contact": "contato",
  "hero.label": "Desenvolvedor fullstack · Brasil",
  "hero.status": "construindo o noct · estudando WAPT · arch btw",
  "hero.philosophy_rest": ", and to bring great solutions to real problems.",
  "hero.cta_projects": "ver projetos",
  "hero.portrait_alt": "Retrato de Alexandre com dithering em vermelho",
  "about.title": "Quem eu",
  "about.em": "sou",
  "about.l1": "Desenvolvedor fullstack",
  "about.l2": "Entusiasta de Linux e cibersegurança (arch btw)",
  "about.l3": "Jogador e mestre de D&D",
  "about.l4": "Toco guitarra e baixo",
  "about.l5": "Português (nativo) · Inglês (fluente) · Espanhol (intermediário) · Japonês (aprendendo)",
  "projects.title": "Coisas que eu",
  "projects.em": "construo",
  "projects.noct": "Meu workspace TUI e multiplexador de terminal.",
  "projects.aoi": "Teste de digitação no terminal, para relaxar e praticar.",
  "projects.aoi-web": "O aoi no navegador, com versão ao vivo.",
  "projects.puddle": "API REST escrita em Go com Gin.",
  "projects.aelxand": "Este site: React, Vite e um motor de dithering.",
  "projects.source": "código",
  "projects.live": "ao vivo",
  "projects.stars": "estrelas",
  "status.building": "construindo",
  "status.live": "no ar",
  "status.stable": "estável",
  "experience.title": "Por onde eu",
  "experience.em": "passei",
  "experience.degree": "Bacharelado em Ciência da Computação",
  "experience.present": "atual",
  "stack.title": "Ferramentas em que eu",
  "stack.em": "confio",
  "stack.frontend": "frontend",
  "stack.backend": "backend",
  "stack.data": "dados",
  "stack.tools": "ferramentas",
  "offline.title": "Longe do",
  "offline.em": "teclado",
  "offline.dnd": "D&D",
  "offline.dnd_d": "Mestrando campanhas.",
  "offline.music": "Música",
  "offline.music_d": "Guitarra e baixo.",
  "offline.pixel": "Pixel art",
  "offline.pixel_d": "Desenhando um pixel por vez.",
  "offline.languages": "Idiomas",
  "offline.languages_d": "Aprendendo japonês agora.",
  "now.title": "Tocando",
  "now.em": "agora",
  "now.alt": "Tocadas recentemente no Spotify",
  "contact.title": "Vamos",
  "contact.em": "conversar",
  "contact.lede": "Mensagens são bem-vindas, em qualquer um desses idiomas.",
  "contact.email": "email",
  "contact.copy": "copiar",
  "contact.copied": "copiado",
  "footer.source": "código",
  "footer.language": "idioma"
}
```

`src/i18n/es.json`:
```json
{
  "meta.title": "AlexandreSJ — Desarrollador fullstack",
  "meta.description": "Portafolio de Alexandre da Silva Junior, desarrollador fullstack de Brasil. Proyectos, experiencia y stack.",
  "nav.projects": "proyectos",
  "nav.about": "sobre mí",
  "nav.contact": "contacto",
  "hero.label": "Desarrollador fullstack · Brasil",
  "hero.status": "construyendo noct · estudiando WAPT · arch btw",
  "hero.philosophy_rest": ", and to bring great solutions to real problems.",
  "hero.cta_projects": "ver proyectos",
  "hero.portrait_alt": "Retrato de Alexandre con dithering en rojo",
  "about.title": "Quién",
  "about.em": "soy",
  "about.l1": "Desarrollador fullstack",
  "about.l2": "Entusiasta de Linux y ciberseguridad (arch btw)",
  "about.l3": "Jugador y máster de D&D",
  "about.l4": "Toco guitarra y bajo",
  "about.l5": "Portugués (nativo) · Inglés (fluido) · Español (intermedio) · Japonés (aprendiendo)",
  "projects.title": "Cosas que",
  "projects.em": "construyo",
  "projects.noct": "Mi espacio de trabajo TUI y multiplexor de terminal.",
  "projects.aoi": "Prueba de mecanografía en la terminal, para relajarse y practicar.",
  "projects.aoi-web": "aoi en el navegador, con versión en vivo.",
  "projects.puddle": "API REST escrita en Go con Gin.",
  "projects.aelxand": "Este sitio: React, Vite y un motor de dithering.",
  "projects.source": "código",
  "projects.live": "en vivo",
  "projects.stars": "estrellas",
  "status.building": "construyendo",
  "status.live": "en vivo",
  "status.stable": "estable",
  "experience.title": "Dónde he",
  "experience.em": "estado",
  "experience.degree": "Licenciatura en Ciencias de la Computación",
  "experience.present": "actual",
  "stack.title": "Herramientas en las que",
  "stack.em": "confío",
  "stack.frontend": "frontend",
  "stack.backend": "backend",
  "stack.data": "datos",
  "stack.tools": "herramientas",
  "offline.title": "Lejos del",
  "offline.em": "teclado",
  "offline.dnd": "D&D",
  "offline.dnd_d": "Dirijo campañas como máster.",
  "offline.music": "Música",
  "offline.music_d": "Guitarra y bajo.",
  "offline.pixel": "Pixel art",
  "offline.pixel_d": "Dibujando un píxel a la vez.",
  "offline.languages": "Idiomas",
  "offline.languages_d": "Ahora aprendiendo japonés.",
  "now.title": "Sonando",
  "now.em": "ahora",
  "now.alt": "Reproducido recientemente en Spotify",
  "contact.title": "Hablemos",
  "contact.em": "un rato",
  "contact.lede": "Los mensajes son bienvenidos, en cualquiera de estos idiomas.",
  "contact.email": "correo",
  "contact.copy": "copiar",
  "contact.copied": "copiado",
  "footer.source": "código",
  "footer.language": "idioma"
}
```

`src/i18n/ja.json`:
```json
{
  "meta.title": "AlexandreSJ — フルスタック開発者",
  "meta.description": "ブラジルのフルスタック開発者、Alexandre da Silva Junior のポートフォリオ。プロジェクト、経歴、技術スタック。",
  "nav.projects": "プロジェクト",
  "nav.about": "自己紹介",
  "nav.contact": "連絡先",
  "hero.label": "フルスタック開発者 · ブラジル",
  "hero.status": "noct 開発中 · WAPT 勉強中 · arch btw",
  "hero.philosophy_rest": ", and to bring great solutions to real problems.",
  "hero.cta_projects": "プロジェクトを見る",
  "hero.portrait_alt": "赤いディザリングで描かれた Alexandre の肖像",
  "about.title": "私に",
  "about.em": "ついて",
  "about.l1": "フルスタック開発者",
  "about.l2": "Linux とサイバーセキュリティが好き (arch btw)",
  "about.l3": "D&D プレイヤー兼 DM",
  "about.l4": "ギターとベースを弾きます",
  "about.l5": "ポルトガル語 (母語) · 英語 (流暢) · スペイン語 (中級) · 日本語 (勉強中)",
  "projects.title": "作っている",
  "projects.em": "もの",
  "projects.noct": "ターミナル用の TUI ワークスペース兼マルチプレクサ。",
  "projects.aoi": "ターミナルでリラックスしながら練習できるタイピングテスト。",
  "projects.aoi-web": "ブラウザ版の aoi。ライブ版あり。",
  "projects.puddle": "Go と Gin で書いた REST API。",
  "projects.aelxand": "このサイト。React、Vite、ディザリングエンジン。",
  "projects.source": "ソース",
  "projects.live": "ライブ",
  "projects.stars": "スター",
  "status.building": "開発中",
  "status.live": "公開中",
  "status.stable": "安定",
  "experience.title": "これまでの",
  "experience.em": "経歴",
  "experience.degree": "計算科学 学士",
  "experience.present": "現在",
  "stack.title": "信頼している",
  "stack.em": "道具",
  "stack.frontend": "フロントエンド",
  "stack.backend": "バックエンド",
  "stack.data": "データ",
  "stack.tools": "ツール",
  "offline.title": "キーボードから",
  "offline.em": "離れて",
  "offline.dnd": "D&D",
  "offline.dnd_d": "DM としてキャンペーンを運営。",
  "offline.music": "音楽",
  "offline.music_d": "ギターとベース。",
  "offline.pixel": "ドット絵",
  "offline.pixel_d": "1 ピクセルずつ描いています。",
  "offline.languages": "言語",
  "offline.languages_d": "今は日本語を勉強中。",
  "now.title": "再生",
  "now.em": "中",
  "now.alt": "Spotify で最近再生した曲",
  "contact.title": "お気軽に",
  "contact.em": "どうぞ",
  "contact.lede": "メッセージはどの言語でも歓迎です。",
  "contact.email": "メール",
  "contact.copy": "コピー",
  "contact.copied": "コピーしました",
  "footer.source": "ソース",
  "footer.language": "言語"
}
```

- [ ] **Step 4: Provider and locale constants**

`src/i18n/index.tsx`:
```tsx
import { createContext, useContext, type ReactNode } from 'react'
import en from './en.json'
import pt from './pt.json'
import es from './es.json'
import ja from './ja.json'

export const LOCALES = ['pt', 'en', 'es', 'ja'] as const
export type Locale = (typeof LOCALES)[number]
export type MessageKey = keyof typeof en
export const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
export const LOCALE_NAME: Record<Locale, string> = { pt: 'PT', en: 'EN', es: 'ES', ja: 'JP' }

export const isLocale = (s: string | undefined): s is Locale => !!s && (LOCALES as readonly string[]).includes(s)

const DICTS: Record<Locale, Record<MessageKey, string>> = { en, pt, es, ja }

interface I18n { locale: Locale; t: (k: MessageKey) => string }
const Ctx = createContext<I18n | null>(null)

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = (k: MessageKey) => DICTS[locale][k] ?? DICTS.en[k]
  return <Ctx value={{ locale, t }}>{children}</Ctx>
}

export function useI18n(): I18n {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n must be used within I18nProvider')
  return v
}
```

- [ ] **Step 5: Owner writes `pickLocale`** (learning-mode contribution)

`src/i18n/pickLocale.ts`:
```ts
import type { Locale } from './index'

/**
 * Choose the site locale from the browser's ordered preferences
 * (navigator.languages), e.g. ['de-DE', 'es-AR', 'pt-BR'] -> 'es'.
 * Must return one of 'pt' | 'en' | 'es' | 'ja' and fall back to 'en'.
 */
export function pickLocale(languages: readonly string[]): Locale {
  // TODO(owner): 5–8 lines
}
```

- [ ] **Step 6: Run to verify pass, commit**

Run: `bun run test src/i18n` → PASS (9 tests).

```bash
git add src/i18n
git commit -m "feat: add pt/en/es/ja locales with key parity tests"
```

---

### Task 5: Content data and build-time GitHub fetch

**Files:**
- Create: `src/data/profile.ts`, `src/data/projects.ts`, `src/data/experience.ts`, `src/data/repos.generated.json`, `scripts/fetch-repos.ts`, `src/data/projects.test.ts`

**Interfaces:**
- Consumes: `MessageKey`, `Locale` from Task 4.
- Produces:
  - `profile: { name; handle; motto; email; github; linkedin; coffee; spotifyImg; spotifyHref; stack: StackGroup[]; offline: OfflineItem[] }`
  - `type RepoMeta = { stars: number; language: string | null; pushedAt: string }`
  - `type Project = { id; repo; descKey: MessageKey; status: 'building'|'live'|'stable'; tags: string[]; live?: string }`
  - `type ProjectView = Project & Partial<RepoMeta>`
  - `projectViews(projects: Project[], meta: Record<string, RepoMeta>): ProjectView[]`
  - `type ExperienceEntry = { start: string; end?: string; org: string; role: Partial<Record<Locale,string>> & { en: string }; roleKey?: MessageKey; result?: Partial<Record<Locale,string>> }`

- [ ] **Step 1: Write the failing test**

`src/data/projects.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { projectViews, projects } from './projects'

describe('projectViews', () => {
  it('keeps local order and copy when GitHub data is missing', () => {
    const v = projectViews(projects, {})
    expect(v.map(p => p.id)).toEqual(projects.map(p => p.id))
    expect(v[0].stars).toBeUndefined()
  })
  it('merges GitHub metadata by repo name', () => {
    const v = projectViews(projects, { noct: { stars: 7, language: 'Go', pushedAt: '2026-10-01T00:00:00Z' } })
    expect(v.find(p => p.id === 'noct')).toMatchObject({ stars: 7, language: 'Go' })
  })
  it('lists the README projects', () => {
    expect(projects.map(p => p.id)).toEqual(['noct', 'aoi', 'aoi-web', 'puddle', 'aelxand'])
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/data` → FAIL.

- [ ] **Step 3: Implement data**

`src/data/projects.ts`:
```ts
import type { MessageKey } from '../i18n'
import generated from './repos.generated.json'

export type RepoMeta = { stars: number; language: string | null; pushedAt: string }
export type Project = {
  id: string
  repo: string
  descKey: MessageKey
  status: 'building' | 'live' | 'stable'
  tags: string[]
  live?: string
}
export type ProjectView = Project & Partial<RepoMeta>

export const projects: Project[] = [
  { id: 'noct', repo: 'noct', descKey: 'projects.noct', status: 'building', tags: ['tui', 'terminal', 'multiplexer'] },
  { id: 'aoi', repo: 'aoi', descKey: 'projects.aoi', status: 'stable', tags: ['go', 'bubble tea', 'lipgloss'] },
  { id: 'aoi-web', repo: 'aoi-web', descKey: 'projects.aoi-web', status: 'live', tags: ['web', 'typing'], live: 'https://aoi-online.vercel.app/' },
  { id: 'puddle', repo: 'puddle', descKey: 'projects.puddle', status: 'stable', tags: ['go', 'gin', 'rest'] },
  { id: 'aelxand', repo: 'aelxand', descKey: 'projects.aelxand', status: 'live', tags: ['react', 'vite', 'canvas'] },
]

export function projectViews(list: Project[], meta: Record<string, RepoMeta>): ProjectView[] {
  return list.map(p => ({ ...p, ...meta[p.repo] }))
}

export const views: ProjectView[] = projectViews(projects, generated as Record<string, RepoMeta>)
```

`src/data/repos.generated.json`:
```json
{}
```

`src/data/profile.ts`:
```ts
import type { MessageKey } from '../i18n'

export type StackGroup = { key: MessageKey; items: string[] }
export type OfflineItem = { key: MessageKey; descKey: MessageKey }

export const profile = {
  name: 'Alexandre da Silva Junior',
  handle: 'AlexandreSJ',
  motto: 'I want people to thrive with me',
  email: '',
  github: 'https://github.com/AlexandreSJ',
  linkedin: 'https://www.linkedin.com/in/alexandre-da-silva-junior/',
  coffee: 'https://buymeacoffee.com/aelxand',
  spotifyHref: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&redirect=true',
  spotifyImg: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&cover_image=true&theme=natemoo-re&show_offline=false&background_color=0b0a0d&interchange=true&profanity=true&hide_remaster=false&bar_color=ee0022&bar_color_cover=false',
  stack: [
    { key: 'stack.frontend', items: ['React', 'Angular', 'Ionic', 'Next.js', 'Vite'] },
    { key: 'stack.backend', items: ['Go', 'Spring', 'Node.js', 'Fastify', 'Bun'] },
    { key: 'stack.data', items: ['Postgres', 'MongoDB', 'Redis'] },
    { key: 'stack.tools', items: ['Docker', 'Git', 'Linux (Arch)'] },
  ] satisfies StackGroup[],
  offline: [
    { key: 'offline.dnd', descKey: 'offline.dnd_d' },
    { key: 'offline.music', descKey: 'offline.music_d' },
    { key: 'offline.pixel', descKey: 'offline.pixel_d' },
    { key: 'offline.languages', descKey: 'offline.languages_d' },
  ] satisfies OfflineItem[],
}
```

`src/data/experience.ts`:
```ts
import type { Locale, MessageKey } from '../i18n'

export type ExperienceEntry = {
  start: string
  end?: string
  org: string
  roleKey?: MessageKey
  role?: Partial<Record<Locale, string>> & { en: string }
  result?: Partial<Record<Locale, string>> & { en: string }
}

/** Newest first. Work entries come from the owner (see spec "Open content"). */
export const experience: ExperienceEntry[] = [
  { start: '2024', org: '', roleKey: 'experience.degree' },
]
```

- [ ] **Step 4: Build-time fetch script**

`scripts/fetch-repos.ts`:
```ts
import { projects } from '../src/data/projects'

const OUT = new URL('../src/data/repos.generated.json', import.meta.url)
const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'aelxand-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const meta: Record<string, { stars: number; language: string | null; pushedAt: string }> = {}
try {
  for (const p of projects) {
    const res = await fetch(`https://api.github.com/repos/AlexandreSJ/${p.repo}`, { headers })
    if (!res.ok) throw new Error(`${p.repo}: HTTP ${res.status}`)
    const r = await res.json()
    meta[p.repo] = { stars: r.stargazers_count, language: r.language, pushedAt: r.pushed_at }
  }
  await Bun.write(OUT, JSON.stringify(meta, null, 2) + '\n')
  console.log(`fetch-repos: wrote ${Object.keys(meta).length} repos`)
} catch (e) {
  console.warn(`fetch-repos: kept previous file (${(e as Error).message})`)
}
```

- [ ] **Step 5: Run tests and the script, commit**

Run: `bun run test src/data` → PASS (3 tests). Run: `bun run fetch-repos` → "wrote 5 repos" (or "kept previous file").

```bash
git add src/data scripts/fetch-repos.ts
git commit -m "feat: add profile, projects and build-time GitHub metadata"
```

---

### Task 6: Hooks and primitive components

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/hooks/useTextFx.ts`, `src/components/Button.tsx`, `src/components/Pill.tsx`, `src/components/SectionHead.tsx`, `src/components/Divider.tsx`, `src/components/primitives.css`, `src/components/primitives.test.tsx`

**Interfaces:**
- Consumes: `runFx`, `charify`, `FxKind` (Task 3); `paintBand` (Task 2).
- Produces:
  - `useReducedMotion(): boolean`
  - `useTextFx<T extends HTMLElement>(kind: FxKind, triggers: ('view'|'mount'|'hover')[]): RefObject<T | null>`
  - `<Button href? variant='red'|'outline'|'ghost' size?='sm' onClick?>`
  - `<Pill dot?>`
  - `<SectionHead id no title em />` (dissolve on view)
  - `<Divider kind='band'|'marquee' words? />` (words alternate plain / `<em>`)

- [ ] **Step 1: Write the failing tests**

`src/components/primitives.test.tsx`:
```tsx
import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Button } from './Button'
import { SectionHead } from './SectionHead'
import { Divider } from './Divider'

describe('primitives (server markup)', () => {
  it('Button renders a link when href is set', () => {
    expect(renderToString(<Button href="/x" variant="red">go</Button>)).toMatch(/^<a[^>]+class="btn btn--red"[^>]+href="\/x"/)
  })
  it('SectionHead keeps the full title readable and marks the emphasis', () => {
    const html = renderToString(<SectionHead id="p" no="03" title="Things I" em="build" />)
    expect(html).toContain('aria-label="Things I build"')
    expect(html).toContain('<em class="v">build</em>')
  })
  it('Divider marquee duplicates words for a seamless loop and hides from AT', () => {
    const html = renderToString(<Divider kind="marquee" words={['a', 'b']} />)
    expect(html).toContain('aria-hidden="true"')
    expect(html.match(/<em>b<\/em>/g)).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/components` → FAIL.

- [ ] **Step 3: Implement hooks**

`src/hooks/useReducedMotion.ts`:
```ts
import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
```

`src/hooks/useTextFx.ts`:
```ts
import { useEffect, useRef } from 'react'
import { runFx, type FxKind } from '../lib/textfx'
import { useReducedMotion } from './useReducedMotion'

type Trigger = 'view' | 'mount' | 'hover'

export function useTextFx<T extends HTMLElement>(kind: FxKind, triggers: Trigger[]) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const key = triggers.join()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let cancel = () => {}
    let alive = true
    const run = () => { cancel(); cancel = runFx(kind, el) }
    const cleanups: (() => void)[] = []
    document.fonts.ready.then(() => {
      if (!alive) return
      if (key.includes('mount')) run()
      if (key.includes('view')) {
        const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && run()), { threshold: 0.6 })
        io.observe(el)
        cleanups.push(() => io.disconnect())
      }
      if (key.includes('hover')) {
        el.addEventListener('pointerenter', run)
        cleanups.push(() => el.removeEventListener('pointerenter', run))
      }
    })
    return () => { alive = false; cancel(); cleanups.forEach(f => f()) }
  }, [kind, key, reduced])
  return ref
}
```

- [ ] **Step 4: Implement components**

`src/components/Button.tsx`:
```tsx
import type { ReactNode } from 'react'

type Props = {
  href?: string
  variant?: 'red' | 'outline' | 'ghost'
  size?: 'sm'
  onClick?: () => void
  children: ReactNode
}

export function Button({ href, variant = 'outline', size, onClick, children }: Props) {
  const cls = `btn btn--${variant}${size ? ' btn--sm' : ''}`
  if (href) {
    const ext = href.startsWith('http')
    return <a className={cls} href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
  }
  return <button type="button" className={cls} onClick={onClick}>{children}</button>
}
```

`src/components/Pill.tsx`:
```tsx
import type { ReactNode } from 'react'

export function Pill({ dot, children }: { dot?: boolean; children: ReactNode }) {
  return <span className="pill">{dot && <i aria-hidden="true" />}{children}</span>
}
```

`src/components/SectionHead.tsx`:
```tsx
import { useTextFx } from '../hooks/useTextFx'

export function SectionHead({ id, no, title, em }: { id: string; no: string; title: string; em: string }) {
  const ref = useTextFx<HTMLHeadingElement>('dissolve', ['view'])
  const full = `${title} ${em}`
  return (
    <div className="section-head">
      <span className="section-head__no" aria-hidden="true">{no}</span>
      <h2 id={id} ref={ref} className="section-head__title fx" data-text={full} aria-label={full}>
        {title} <em className="v">{em}</em>
      </h2>
    </div>
  )
}
```

`src/components/Divider.tsx`:
```tsx
import { useEffect } from 'react'
import { paintBand } from '../lib/dither'

let bandUrl: string | null = null
function ensureBand() {
  if (bandUrl) return
  const w = 256, h = 22, c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d')!
  const img = g.createImageData(w, h)
  paintBand(img.data, w, h)
  g.putImageData(img, 0, 0)
  bandUrl = c.toDataURL()
  document.documentElement.style.setProperty('--band', `url(${bandUrl})`)
}

export function Divider({ kind, words = [] }: { kind: 'band' | 'marquee'; words?: string[] }) {
  useEffect(ensureBand, [])
  if (kind === 'band') return <div className="divider divider--band" aria-hidden="true" />
  const run = [...words, ...words].map((w, i) => (i % 2 ? <em key={i}>{w}</em> : <span key={i}>{w}</span>))
  return (
    <div className="divider divider--marquee" aria-hidden="true">
      <div className="divider__track">{run}</div>
    </div>
  )
}
```

`src/components/primitives.css`:
```css
.btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:var(--radius);background:transparent;color:var(--ink);
  font:500 .78rem/1 var(--f-mono);padding:.75rem 1.05rem;cursor:pointer;text-decoration:none;position:relative;
  transition:background-color var(--snap) var(--ease),color var(--snap) var(--ease),border-color var(--snap) var(--ease)}
.btn--sm{padding:.48rem .65rem;font-size:.7rem}
.btn--red{background:var(--red);border-color:var(--red);color:var(--on-red)}
.btn--red:hover{background:var(--ink);border-color:var(--ink)}
.btn--outline:hover{border-color:var(--red);color:var(--red)}
.btn--ghost{border-color:transparent;padding-inline:.2rem}
.btn--ghost::after{content:"";position:absolute;left:.2rem;right:.2rem;bottom:.4rem;height:1px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform var(--move) var(--ease)}
.btn--ghost:hover::after{transform:scaleX(1)}
.pill{font:400 .68rem/1 var(--f-mono);border:1px solid var(--line);padding:5px 8px;color:var(--ink-dim);display:inline-flex;gap:6px;align-items:center;border-radius:var(--radius)}
.pill i{width:6px;height:6px;background:var(--red);display:inline-block}
.section-head{display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;align-items:baseline;margin-bottom:clamp(28px,4vw,44px)}
.section-head__no{font-family:var(--f-label);font-size:.9rem;color:var(--red)}
.section-head__title{font-family:var(--f-structure);font-weight:800;font-size:clamp(2rem,5vw,3.6rem);line-height:1;letter-spacing:-.02em}
.divider{overflow:hidden}
.divider--band{height:44px;background-image:var(--band);background-size:auto 100%;background-repeat:repeat-x;image-rendering:pixelated}
.divider--band:nth-of-type(4n+3){transform:scaleY(-1)}
.divider--marquee{border-block:1px solid var(--line-soft);padding-block:14px;white-space:nowrap}
.divider__track{display:inline-flex;gap:2rem;animation:marquee 32s linear infinite;padding-right:2rem}
.divider__track span{font-family:var(--f-structure);font-weight:800;font-size:clamp(1.8rem,4.4vw,3rem);line-height:1;color:transparent;-webkit-text-stroke:1px var(--line-strong)}
.divider__track em{font-family:var(--f-voice);font-style:italic;font-weight:300;font-size:clamp(1.8rem,4.4vw,3rem);line-height:1;color:var(--red)}
@keyframes marquee{to{transform:translateX(-50%)}}
```

- [ ] **Step 5: Run to verify pass, commit**

Run: `bun run test src/components` → PASS (3 tests).

```bash
git add src/hooks src/components
git commit -m "feat: add text-fx hook and primitive components"
```

---

### Task 7: Background and Portrait canvases

**Files:**
- Create: `src/components/Background.tsx`, `src/components/Portrait.tsx`, `src/components/canvas.css`, `src/components/canvas.test.tsx`

**Interfaces:**
- Consumes: `paintBackground`, `toDarkness`, `ditherBayer`, `RED` (Task 2); `useReducedMotion` (Task 6).
- Produces: `<Background />` (fixed, aria-hidden), `<Portrait src alt />` (200×200 canvas, jitter on hover).

- [ ] **Step 1: Write the failing test**

`src/components/canvas.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/components/canvas` → FAIL.

- [ ] **Step 3: Implement**

`src/components/Background.tsx`:
```tsx
import { useEffect, useRef } from 'react'
import { paintBackground } from '../lib/dither'

const CELL = 3

export function Background() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!
    const paint = () => {
      cv.width = Math.ceil(innerWidth / CELL)
      cv.height = Math.ceil(innerHeight / CELL)
      const g = cv.getContext('2d')!
      const img = g.createImageData(cv.width, cv.height)
      paintBackground(img.data, cv.width, cv.height)
      g.putImageData(img, 0, 0)
    }
    paint()
    let t = 0
    const onResize = () => { clearTimeout(t); t = window.setTimeout(paint, 150) }
    addEventListener('resize', onResize)
    return () => { removeEventListener('resize', onResize); clearTimeout(t) }
  }, [])
  return <canvas ref={ref} className="bg-canvas" aria-hidden="true" />
}
```

`src/components/Portrait.tsx`:
```tsx
import { useEffect, useRef } from 'react'
import { RED, ditherBayer, toDarkness } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'

const N = 200

export function Portrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const cv = ref.current!
    const g = cv.getContext('2d')!
    let dark: Float32Array | null = null
    let jitter = 0
    let timer = 0
    const draw = () => {
      if (!dark) return
      const img = g.createImageData(N, N)
      ditherBayer(dark, N, N, img.data, RED, jitter)
      g.putImageData(img, 0, 0)
    }
    const im = new Image()
    im.onload = () => {
      const c = document.createElement('canvas')
      c.width = c.height = N
      const cg = c.getContext('2d')!
      cg.drawImage(im, 0, 0, N, N)
      const raw = toDarkness(cg.getImageData(0, 0, N, N).data, N * N)
      dark = raw.map(v => Math.min(1, Math.max(0, (v - 0.1) / 0.82)))
      draw()
    }
    im.src = src
    const enter = () => {
      if (reduced) return
      timer = window.setInterval(() => { jitter = (jitter + 1) % 8; draw() }, 90)
    }
    const leave = () => { clearInterval(timer); jitter = 0; draw() }
    cv.addEventListener('pointerenter', enter)
    cv.addEventListener('pointerleave', leave)
    return () => { clearInterval(timer); cv.removeEventListener('pointerenter', enter); cv.removeEventListener('pointerleave', leave) }
  }, [src, reduced])
  return (
    <div className="portrait">
      <canvas ref={ref} width={N} height={N} role="img" aria-label={alt} />
      <span className="portrait__c portrait__c--1" /><span className="portrait__c portrait__c--2" />
      <span className="portrait__c portrait__c--3" /><span className="portrait__c portrait__c--4" />
    </div>
  )
}
```

`src/components/canvas.css`:
```css
.bg-canvas{position:fixed;inset:0;width:100%;height:100%;z-index:-1;image-rendering:pixelated;pointer-events:none}
.portrait{position:relative;aspect-ratio:1;width:100%;max-width:360px}
.portrait canvas{width:100%;height:100%;display:block;image-rendering:pixelated}
.portrait__c{position:absolute;width:14px;height:14px;border:0 solid var(--red)}
.portrait__c--1{top:-6px;left:-6px;border-width:1px 0 0 1px}
.portrait__c--2{top:-6px;right:-6px;border-width:1px 1px 0 0}
.portrait__c--3{bottom:-6px;left:-6px;border-width:0 0 1px 1px}
.portrait__c--4{bottom:-6px;right:-6px;border-width:0 1px 1px 0}
```

- [ ] **Step 4: Run to verify pass, commit**

Run: `bun run test src/components/canvas` → PASS (2 tests).

```bash
git add src/components/Background.tsx src/components/Portrait.tsx src/components/canvas.css src/components/canvas.test.tsx
git commit -m "feat: add dithered background and portrait canvases"
```

---

### Task 8: CRT component

**Files:**
- Create: `src/components/Crt.tsx`, `src/components/crt.css`, `src/components/crt.test.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 6).
- Produces: `type CrtLine = { kind: 'prompt' | 'head' | 'text'; text: string }`, `<Crt lines label />`. Renders all lines on the server (complete at rest); on the client, the first time it enters view it clears and types them.

- [ ] **Step 1: Write the failing test**

`src/components/crt.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/components/crt` → FAIL.

- [ ] **Step 3: Implement**

`src/components/Crt.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export type CrtLine = { kind: 'prompt' | 'head' | 'text'; text: string }

function Line({ l }: { l: CrtLine }) {
  if (l.kind === 'prompt') return <><span className="crt__dim">&gt; </span>{l.text}</>
  if (l.kind === 'head') return <span className="crt__hi">{l.text}</span>
  return <>{l.text}</>
}

export function Crt({ lines, label }: { lines: CrtLine[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [shown, setShown] = useState<{ n: number; partial: number } | null>(null)

  useEffect(() => {
    if (reduced) return
    const el = ref.current!
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let n = 0, partial = 0
      const tick = () => {
        if (n >= lines.length) { setShown(null); return }
        const l = lines[n]
        partial += l.kind === 'prompt' ? 1 : 3
        if (partial >= l.text.length) { n++; partial = 0; setShown({ n, partial }); timer = window.setTimeout(tick, l.kind === 'prompt' ? 260 : 50); return }
        setShown({ n, partial })
        timer = window.setTimeout(tick, l.kind === 'prompt' ? 45 : 14)
      }
      setShown({ n: 0, partial: 0 })
      tick()
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [lines, reduced])

  const visible = shown ? lines.slice(0, shown.n) : lines
  const typing = shown && shown.n < lines.length ? lines[shown.n] : null
  return (
    <figure className="crt-bezel">
      <div className="crt" ref={ref}>
        <pre className="crt__screen" aria-label={label}>
          {visible.map((l, i) => <span key={i}><Line l={l} />{'\n'}</span>)}
          {typing && <span>{typing.kind === 'prompt' && <span className="crt__dim">&gt; </span>}{typing.text.slice(typing.kind === 'prompt' ? 0 : 0, shown!.partial)}</span>}
          <span className="crt__dim">&gt; </span><span className="crt__cur" aria-hidden="true" />
        </pre>
        <div className="crt__roll" aria-hidden="true" />
        <div className="crt__vig" aria-hidden="true" />
      </div>
      <figcaption className="crt-bezel__brand">AELXAND · 1-BIT</figcaption>
      <span className="crt-bezel__led" aria-hidden="true" />
    </figure>
  )
}
```

`src/components/crt.css`:
```css
.crt-bezel{margin:0;background:linear-gradient(160deg,#1f1b22,#121015);border:1px solid var(--line);border-radius:calc(var(--crt-curve) + 14px);padding:20px 20px 38px;position:relative;
  box-shadow:inset 0 1px 0 color-mix(in srgb,var(--ink) 10%,transparent),0 30px 60px -30px #000}
.crt-bezel__brand{position:absolute;left:26px;bottom:12px;font-family:var(--f-label);font-size:.68rem;color:var(--ink-faint);letter-spacing:.2em}
.crt-bezel__led{position:absolute;right:26px;bottom:15px;width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 8px var(--red)}
.crt{position:relative;background:var(--crt-bg);border-radius:var(--crt-curve);overflow:hidden;min-height:340px;box-shadow:inset 0 0 70px 18px #000,inset 0 0 0 1px #000}
.crt__screen{margin:0;padding:clamp(18px,4vw,36px);font:400 clamp(.72rem,1.5vw,.95rem)/1.65 var(--f-mono);color:var(--crt-fg);white-space:pre-wrap;
  text-shadow:0 0 var(--crt-glow) color-mix(in srgb,var(--crt-fg) 80%,transparent),1px 0 0 rgba(0,170,255,.22),-1px 0 0 rgba(255,0,80,.35);animation:crt-flick 4s steps(1) infinite}
.crt__dim{opacity:.62}
.crt__hi{color:#ffd0d5}
.crt__cur{display:inline-block;width:.6em;height:1.05em;background:currentColor;vertical-align:-2px;animation:crt-blink 1s steps(2) infinite}
.crt::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,var(--crt-scan)) 0 1px,transparent 1px 3px)}
.crt::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;opacity:var(--crt-mask);mix-blend-mode:multiply;
  background:repeating-linear-gradient(90deg,rgba(255,0,0,.9) 0 1px,rgba(0,255,0,.7) 1px 2px,rgba(0,80,255,.9) 2px 3px)}
.crt__roll{position:absolute;left:0;right:0;height:22%;z-index:4;pointer-events:none;background:linear-gradient(transparent,color-mix(in srgb,var(--crt-fg) 7%,transparent),transparent);animation:crt-roll 7s linear infinite}
.crt__vig{position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.55) 100%)}
@keyframes crt-flick{0%{opacity:1}12%{opacity:.96}13%{opacity:1}57%{opacity:.985}58%{opacity:1}83%{opacity:.95}84%{opacity:1}}
@keyframes crt-roll{from{transform:translateY(-110%)}to{transform:translateY(560%)}}
@keyframes crt-blink{50%{opacity:0}}
```

- [ ] **Step 4: Run to verify pass, commit**

Run: `bun run test src/components/crt` → PASS.

```bash
git add src/components/Crt.tsx src/components/crt.css src/components/crt.test.tsx
git commit -m "feat: add CRT terminal component"
```

---

### Task 9: Card and the eight sections

**Files:**
- Create: `src/components/Card.tsx`, `src/components/card.css`, `src/sections/{Header,Hero,About,Projects,Experience,Stack,Offline,NowPlaying,Contact,Footer}.tsx`, `src/sections/sections.css`, `src/sections/sections.test.tsx`

**Interfaces:**
- Consumes: everything above; `views` (Task 5), `profile`, `experience`.
- Produces: one component per section, each rendering a `<section className="sheet" aria-labelledby=…>` inside `.wrap`.

- [ ] **Step 1: Write the failing test**

`src/sections/sections.test.tsx`:
```tsx
import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { I18nProvider } from '../i18n'
import { Hero } from './Hero'
import { Projects } from './Projects'
import { Contact } from './Contact'
import { projects } from '../data/projects'

const r = (node: React.ReactNode, locale: 'en' | 'ja' = 'en') => renderToString(<I18nProvider locale={locale}>{node}</I18nProvider>)

describe('sections', () => {
  it('Hero shows the handle and the English motto in every locale', () => {
    for (const l of ['en', 'ja'] as const) {
      const html = r(<Hero />, l)
      expect(html).toContain('AlexandreSJ')
      expect(html).toContain('I want people to thrive with me')
    }
  })
  it('Projects renders a card per project', () => {
    const html = r(<Projects />)
    for (const p of projects) expect(html).toContain(`projects/${p.id}`)
  })
  it('Contact hides the email row when no email is configured', () => {
    expect(r(<Contact />)).not.toContain('mailto:')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `bun run test src/sections` → FAIL.

- [ ] **Step 3: Card**

`src/components/Card.tsx`:
```tsx
import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'
import type { ProjectView } from '../data/projects'
import { Pill } from './Pill'
import { Button } from './Button'

export function Card({ p }: { p: ProjectView }) {
  const { t } = useI18n()
  const title = useTextFx<HTMLHeadingElement>('scramble', ['view'])
  const meta = [...p.tags, p.language?.toLowerCase(), p.stars ? `★ ${p.stars}` : null].filter(Boolean)
  return (
    <article className="card">
      <div className="card__top">
        <span className="label">projects/{p.id}</span>
        <Pill dot={p.status === 'building'}>{t(`status.${p.status}`)}</Pill>
      </div>
      <h3 ref={title} className="card__title fx" data-text={p.id} aria-label={p.id}>{p.id}</h3>
      <p className="card__voice">{t(p.descKey)}</p>
      <div className="card__meta">{meta.map(m => <span key={m}>{m}</span>)}</div>
      <div className="card__foot">
        <Button size="sm" variant="ghost" href={`https://github.com/AlexandreSJ/${p.repo}`}>{t('projects.source')} ↗</Button>
        {p.live && <Button size="sm" variant="ghost" href={p.live}>{t('projects.live')} ↗</Button>}
      </div>
      <div className="card__band" aria-hidden="true" />
    </article>
  )
}
```

`src/components/card.css`:
```css
.card{position:relative;border:1px solid var(--line);border-radius:var(--radius);padding:20px 20px 0;display:flex;flex-direction:column;gap:12px;
  background:color-mix(in srgb,var(--paper) 88%,transparent);overflow:hidden;transition:border-color var(--move) var(--ease)}
.card:hover{border-color:var(--red)}
.card__top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.card__title{font-family:var(--f-structure);font-weight:800;font-size:2.1rem;line-height:1;letter-spacing:-.02em}
.card__voice{font-family:var(--f-voice);font-style:italic;font-weight:300;font-size:1.1rem;line-height:1.35;color:var(--ink-dim)}
.card__meta{font-family:var(--f-mono);font-size:.7rem;color:var(--ink-faint);display:flex;gap:10px;flex-wrap:wrap}
.card__foot{display:flex;gap:6px;margin-top:auto;padding-bottom:12px}
.card__band{height:14px;margin-inline:-20px;background-image:var(--band);background-size:auto 100%;image-rendering:pixelated;transform:scaleY(0);transform-origin:bottom;transition:transform .22s var(--ease)}
.card:hover .card__band{transform:scaleY(1)}
```

- [ ] **Step 4: Sections**

`src/sections/Header.tsx`:
```tsx
import { useI18n } from '../i18n'
import { LangSwitch } from './Footer'

export function Header() {
  const { t } = useI18n()
  return (
    <header className="topbar">
      <div className="wrap topbar__in">
        <a className="topbar__mark" href="#top"><b>~/</b>aelxand</a>
        <nav className="topbar__nav" aria-label="primary">
          <a href="#about">{t('nav.about')}</a>
          <a href="#projects">{t('nav.projects')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        <LangSwitch />
      </div>
    </header>
  )
}
```

`src/sections/Hero.tsx`:
```tsx
import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { Button } from '../components/Button'
import { Portrait } from '../components/Portrait'

export function Hero() {
  const { t } = useI18n()
  const name = useTextFx<HTMLHeadingElement>('glitch', ['mount', 'hover'])
  return (
    <section className="hero wrap" id="top" aria-labelledby="hero-name">
      <div className="hero__text">
        <p className="label">{t('hero.label')}</p>
        <h1 id="hero-name" ref={name} className="hero__name fx" data-text={profile.handle}>{profile.handle}</h1>
        <p className="hero__status"><b>&gt;</b> {t('hero.status')}</p>
        <p className="hero__philo"><b>{profile.motto}</b>{t('hero.philosophy_rest')}</p>
        <div className="hero__cta">
          <Button variant="red" href="#projects">{t('hero.cta_projects')}</Button>
          <Button href={profile.github}>github ↗</Button>
        </div>
      </div>
      <Portrait src="/portrait.jpg" alt={t('hero.portrait_alt')} />
    </section>
  )
}
```

`src/sections/About.tsx`:
```tsx
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Crt, type CrtLine } from '../components/Crt'

export function About() {
  const { t } = useI18n()
  const lines: CrtLine[] = [
    { kind: 'prompt', text: 'cat who.md' },
    { kind: 'head', text: `# ${profile.handle}` },
    ...(['about.l1', 'about.l2', 'about.l3', 'about.l4', 'about.l5'] as const).map(k => ({ kind: 'text' as const, text: `- ${t(k)}` })),
    { kind: 'text', text: '' },
    { kind: 'head', text: '## philosophy' },
    { kind: 'text', text: `*${profile.motto}*` },
  ]
  return (
    <section className="sheet wrap" aria-labelledby="about">
      <SectionHead id="about" no="01" title={t('about.title')} em={t('about.em')} />
      <Crt label="who.md" lines={lines} />
    </section>
  )
}
```

`src/sections/Projects.tsx`:
```tsx
import { useI18n } from '../i18n'
import { views } from '../data/projects'
import { SectionHead } from '../components/SectionHead'
import { Card } from '../components/Card'

export function Projects() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="projects">
      <SectionHead id="projects" no="02" title={t('projects.title')} em={t('projects.em')} />
      <div className="cards">{views.map(p => <Card key={p.id} p={p} />)}</div>
    </section>
  )
}
```

`src/sections/Experience.tsx`:
```tsx
import { useI18n } from '../i18n'
import { experience } from '../data/experience'
import { SectionHead } from '../components/SectionHead'

export function Experience() {
  const { t, locale } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="experience">
      <SectionHead id="experience" no="03" title={t('experience.title')} em={t('experience.em')} />
      <ol className="log">
        {experience.map(e => (
          <li key={`${e.start}-${e.org}`} className="log__row">
            <span className="log__when mono">{e.start}{e.end !== undefined && ` — ${e.end || t('experience.present')}`}</span>
            <div>
              <b className="log__role">{e.roleKey ? t(e.roleKey) : e.role![locale] ?? e.role!.en}</b>
              {e.org && <span className="log__org"> · {e.org}</span>}
              {e.result && <p className="log__result">{e.result[locale] ?? e.result.en}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

`src/sections/Stack.tsx`:
```tsx
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Stack() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="stack">
      <SectionHead id="stack" no="04" title={t('stack.title')} em={t('stack.em')} />
      <dl className="specs">
        {profile.stack.map(g => (
          <div key={g.key} className="specs__row">
            <dt className="label">{t(g.key)}</dt>
            <dd className="mono">{g.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
```

`src/sections/Offline.tsx`:
```tsx
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Offline() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="offline">
      <SectionHead id="offline" no="05" title={t('offline.title')} em={t('offline.em')} />
      <ul className="offline">
        {profile.offline.map(o => (
          <li key={o.key}><b>{t(o.key)}</b><span>{t(o.descKey)}</span></li>
        ))}
      </ul>
    </section>
  )
}
```

`src/sections/NowPlaying.tsx`:
```tsx
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function NowPlaying() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="now">
      <SectionHead id="now" no="06" title={t('now.title')} em={t('now.em')} />
      <a className="now" href={profile.spotifyHref} target="_blank" rel="noreferrer">
        <img src={profile.spotifyImg} alt={t('now.alt')} width={480} height={170} loading="lazy" />
      </a>
    </section>
  )
}
```

`src/sections/Contact.tsx`:
```tsx
import { useState } from 'react'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Button } from '../components/Button'

export function Contact() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400) })
  return (
    <section className="sheet wrap" aria-labelledby="contact">
      <SectionHead id="contact" no="07" title={t('contact.title')} em={t('contact.em')} />
      <p className="contact__lede">{t('contact.lede')}</p>
      <dl className="specs">
        {profile.email && (
          <div className="specs__row">
            <dt className="label">{t('contact.email')}</dt>
            <dd className="contact__email"><a className="mono" href={`mailto:${profile.email}`}>{profile.email}</a>
              <Button size="sm" onClick={copy}>{copied ? t('contact.copied') : t('contact.copy')}</Button></dd>
          </div>
        )}
        <div className="specs__row"><dt className="label">github</dt><dd><a className="mono" href={profile.github}>AlexandreSJ ↗</a></dd></div>
        <div className="specs__row"><dt className="label">linkedin</dt><dd><a className="mono" href={profile.linkedin}>alexandre-da-silva-junior ↗</a></dd></div>
        <div className="specs__row"><dt className="label">coffee</dt><dd><a className="mono" href={profile.coffee}>buymeacoffee.com/aelxand ↗</a></dd></div>
      </dl>
    </section>
  )
}
```

`src/sections/Footer.tsx`:
```tsx
import { LOCALES, LOCALE_NAME, useI18n } from '../i18n'

export function LangSwitch() {
  const { locale, t } = useI18n()
  return (
    <nav className="langs" aria-label={t('footer.language')}>
      {LOCALES.map(l => (
        <a key={l} href={`/${l}`} hrefLang={l} aria-current={l === locale ? 'page' : undefined}>{LOCALE_NAME[l]}</a>
      ))}
    </nav>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="wrap footer">
      <span className="mono">© 2026 AlexandreSJ</span>
      <a className="mono" href="https://github.com/AlexandreSJ/aelxand">{t('footer.source')} ↗</a>
      <LangSwitch />
    </footer>
  )
}
```

`src/sections/sections.css`:
```css
.topbar{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--paper) 86%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line-soft)}
.topbar__in{display:flex;align-items:center;gap:20px;min-height:56px}
.topbar__mark{font-family:var(--f-mono);text-decoration:none}
.topbar__mark b{color:var(--red);font-weight:500}
.topbar__nav{display:flex;gap:16px;margin-left:auto;font-family:var(--f-mono);font-size:.78rem}
.topbar__nav a{text-decoration:none;color:var(--ink-muted)}
.topbar__nav a:hover{color:var(--ink)}
.langs{display:flex;gap:2px;font-family:var(--f-mono);font-size:.72rem}
.langs a{padding:3px 6px;text-decoration:none;color:var(--ink-muted)}
.langs a[aria-current]{background:var(--ink);color:var(--paper)}
.hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:clamp(28px,5vw,64px);align-items:center;padding-block:clamp(64px,12vw,140px)}
.hero__name{font-family:var(--f-structure);font-weight:800;font-size:clamp(3rem,10vw,7rem);line-height:.9;letter-spacing:-.03em;margin-top:14px}
.hero__status{font-family:var(--f-mono);color:var(--ink-dim);margin-top:18px;font-size:.95rem}
.hero__status b{color:var(--red);font-weight:400}
.hero__philo{font-family:var(--f-voice);font-style:italic;font-weight:300;font-size:clamp(1.3rem,2.4vw,1.7rem);line-height:1.25;color:var(--ink-dim);margin-top:22px;max-width:30ch}
.hero__philo b{font-weight:400;color:var(--ink)}
.hero__cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
.hero .portrait{justify-self:end}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.log{display:grid;border-top:1px solid var(--line-soft);list-style:none;margin:0;padding:0}
.log__row{display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;padding:16px 0;border-bottom:1px solid var(--line-soft)}
.log__when{color:var(--ink-faint);font-size:.82rem}
.log__role{font-weight:500}
.log__org{color:var(--ink-muted)}
.log__result{font-family:var(--f-voice);font-style:italic;font-weight:300;color:var(--ink-dim);margin-top:6px;font-size:1.05rem}
.specs{margin:0;border-top:1px solid var(--line-soft)}
.specs__row{display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;padding:14px 0;border-bottom:1px solid var(--line-soft);align-items:baseline}
.specs__row dd{margin:0;color:var(--ink-dim)}
.offline{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1px;background:var(--line-soft);border:1px solid var(--line-soft)}
.offline li{background:var(--paper);padding:20px;display:flex;flex-direction:column;gap:6px}
.offline b{font-family:var(--f-structure);font-weight:800;font-size:1.4rem;letter-spacing:-.01em}
.offline span{font-family:var(--f-voice);font-style:italic;font-weight:300;color:var(--ink-dim);font-size:1.05rem}
.now{display:inline-block;border:1px solid var(--line);padding:8px;border-radius:var(--radius)}
.now img{display:block;max-width:100%;height:auto}
.contact__lede{font-family:var(--f-voice);font-style:italic;font-weight:300;font-size:1.3rem;color:var(--ink-dim);margin-bottom:24px}
.contact__email{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.footer{display:flex;gap:20px;align-items:center;flex-wrap:wrap;justify-content:space-between;padding-block:32px 48px;border-top:1px solid var(--line-soft);color:var(--ink-faint);font-size:.78rem}
@media (max-width:820px){
  .hero{grid-template-columns:1fr}
  .hero .portrait{justify-self:center;max-width:280px}
  .topbar__nav{display:none}
  .langs{margin-left:auto}
  .log__row,.specs__row{grid-template-columns:1fr;gap:4px}
}
```

- [ ] **Step 5: Run to verify pass, commit**

Run: `bun run test src/sections` → PASS (3 tests).

```bash
git add src/components/Card.tsx src/components/card.css src/sections
git commit -m "feat: add project card and all page sections"
```

---

### Task 10: App, entries, pre-rendering

**Files:**
- Create: `src/App.tsx`, `src/head.ts`, `src/entry-client.tsx`, `src/entry-server.tsx`, `scripts/prerender.ts`, `scripts/prerender.test.ts`

**Interfaces:**
- Consumes: all sections; `pickLocale`, `isLocale`, `HTML_LANG`, `LOCALES`.
- Produces: `App({ locale })`; `render(locale): { html: string; head: string }`; built files `dist/{pt,en,es,ja}/index.html` and `dist/index.html` (= en).

- [ ] **Step 1: Write the failing smoke test**

`scripts/prerender.test.ts`:
```ts
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const built = existsSync('dist/en/index.html')

describe.skipIf(!built)('prerendered pages', () => {
  const langs = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
  for (const [loc, lang] of Object.entries(langs)) {
    it(`${loc} ships complete HTML`, () => {
      const html = readFileSync(`dist/${loc}/index.html`, 'utf8')
      expect(html).toContain(`<html lang="${lang}" data-locale="${loc}">`)
      expect(html).toContain('AlexandreSJ')
      for (const p of ['noct', 'aoi', 'aoi-web', 'puddle', 'aelxand']) expect(html).toContain(`projects/${p}`)
      expect(html).not.toContain('<!--app-html-->')
    })
  }
})
```

- [ ] **Step 2: Implement app and entries**

`src/App.tsx`:
```tsx
import './styles/fonts'
import './styles/tokens.css'
import './styles/base.css'
import './styles/fx.css'
import './components/primitives.css'
import './components/canvas.css'
import './components/crt.css'
import './components/card.css'
import './sections/sections.css'
import { I18nProvider, type Locale } from './i18n'
import { Background } from './components/Background'
import { Divider } from './components/Divider'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'
import { Offline } from './sections/Offline'
import { NowPlaying } from './sections/NowPlaying'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export function App({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <Background />
      <Header />
      <main>
        <Hero />
        <Divider kind="band" />
        <About />
        <Divider kind="marquee" words={['AlexandreSJ', 'fullstack', 'arch btw', 'D&D', 'noct', 'aoi']} />
        <Projects />
        <Divider kind="band" />
        <Experience />
        <Divider kind="marquee" words={['go', 'react', 'spring', 'bun', 'postgres', 'docker']} />
        <Stack />
        <Divider kind="band" />
        <Offline />
        <Divider kind="marquee" words={['PT', 'EN', 'ES', '日本語']} />
        <NowPlaying />
        <Divider kind="band" />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  )
}
```

`src/head.ts`:
```ts
import { HTML_LANG, LOCALES, type Locale } from './i18n'
import en from './i18n/en.json'
import pt from './i18n/pt.json'
import es from './i18n/es.json'
import ja from './i18n/ja.json'

const SITE = 'https://aelxand.vercel.app'
const D = { en, pt, es, ja }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function headFor(locale: Locale): string {
  const d = D[locale]
  return [
    `<title>${esc(d['meta.title'])}</title>`,
    `<meta name="description" content="${esc(d['meta.description'])}">`,
    `<link rel="canonical" href="${SITE}/${locale}">`,
    ...LOCALES.map(l => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${SITE}/${l}">`),
    `<link rel="alternate" hreflang="x-default" href="${SITE}/en">`,
    `<meta property="og:title" content="${esc(d['meta.title'])}">`,
    `<meta property="og:description" content="${esc(d['meta.description'])}">`,
    `<meta property="og:url" content="${SITE}/${locale}">`,
    `<meta property="og:type" content="website">`,
  ].join('\n    ')
}
```

`src/entry-server.tsx`:
```tsx
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { headFor } from './head'
import type { Locale } from './i18n'

export { LOCALES, HTML_LANG } from './i18n'

export function render(locale: Locale) {
  const html = renderToString(<StrictMode><App locale={locale} /></StrictMode>)
  return { html, head: headFor(locale) }
}
```

`src/entry-client.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { isLocale, type Locale } from './i18n'
import { pickLocale } from './i18n/pickLocale'

const root = document.getElementById('root')!
const segment = location.pathname.split('/')[1]
const prerendered = root.hasChildNodes()
let locale: Locale

if (isLocale(segment)) {
  locale = segment
} else {
  const preferred = pickLocale(navigator.languages)
  const served = document.documentElement.dataset.locale
  locale = isLocale(served) ? served : preferred
  if (preferred !== locale) location.replace(`/${preferred}${location.hash}`)
  else if (!prerendered) history.replaceState(null, '', `/${locale}${location.hash}`)
}

const app = <StrictMode><App locale={locale} /></StrictMode>
if (prerendered) hydrateRoot(root, app)
else createRoot(root).render(app)
```

`scripts/prerender.ts`:
```ts
import { mkdir } from 'node:fs/promises'
// @ts-expect-error built by `vite build --ssr`
import { render, LOCALES, HTML_LANG } from '../dist-ssr/entry-server.js'

const template = await Bun.file('dist/index.html').text()

function page(locale: string) {
  const { html, head } = render(locale)
  return template
    .replace('<html lang="en">', `<html lang="${HTML_LANG[locale]}" data-locale="${locale}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
}

for (const l of LOCALES as string[]) {
  await mkdir(`dist/${l}`, { recursive: true })
  await Bun.write(`dist/${l}/index.html`, page(l))
}
await Bun.write('dist/index.html', page('en'))
console.log(`prerender: ${(LOCALES as string[]).join(', ')} + /`)
```

- [ ] **Step 3: Build and run the smoke test**

Run: `bun run build && bun run test scripts/prerender` → PASS (4 tests).

- [ ] **Step 4: Run the whole suite and lint**

Run: `bun run test && bun run lint` → all PASS, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/head.ts src/entry-client.tsx src/entry-server.tsx scripts/prerender.ts scripts/prerender.test.ts
echo "dist-ssr/" >> .gitignore && git add .gitignore
git commit -m "feat: pre-render pt/en/es/ja pages and hydrate on the client"
```

---

### Task 11: Verify in the browser and update the README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Preview the build**

Run: `bunx vite preview --port 4173` and open `http://localhost:4173/en`, `/ja`, `/`.

Check:
- `/` shows English content, then redirects to the browser's preferred locale if it differs.
- Section titles dissolve, card titles scramble without any height change, hero name glitches on load and hover.
- Portrait jitters on hover; CRT types on first view.
- With DevTools "Emulate prefers-reduced-motion: reduce": nothing moves, all text visible.
- At 400px width: no horizontal scroll; hero stacks; portrait centered.

- [ ] **Step 2: Lighthouse**

Run Lighthouse (mobile) on `http://localhost:4173/en`. Expected ≥ 95 in all four categories. Fix any failing audit before continuing.

- [ ] **Step 3: README**

Replace `README.md` with:
```markdown
# aelxand

Personal portfolio of Alexandre da Silva Junior — https://aelxand.vercel.app

Vite + React 19, pre-rendered per locale (pt, en, es, ja), with a small dithering engine for the background, portrait and text effects.

## Develop

    bun install
    bun run dev        # http://localhost:5173/en
    bun run test
    bun run build      # fetch GitHub metadata, build, SSR, pre-render to dist/

Set `GITHUB_TOKEN` to avoid GitHub API rate limits during `fetch-repos`.
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: describe the new build"
```
