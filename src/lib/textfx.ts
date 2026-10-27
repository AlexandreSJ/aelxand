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
  const id = setTimeout(() => el.classList.remove('glitching'), 950)
  return () => { clearTimeout(id); el.classList.remove('glitching') }
}

export function runFx(kind: FxKind, el: HTMLElement): () => void {
  if (kind === 'scramble') return scramble(el)
  if (kind === 'dissolve') return dissolve(el)
  return glitch(el)
}
