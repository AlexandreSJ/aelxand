import { useEffect, useRef } from 'react'
import { RED, ditherBayer, toBrightness, toDarkness } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'

export type Art = { kind: 'portrait' } | { kind: 'video'; src: string } | { kind: 'type'; text: string }
export type NowPlaying = { code: string; name: string } | null

const N = 200
const MORPH_MS = 320

const artKey = (a: Art) => (a.kind === 'portrait' ? 'portrait' : a.kind === 'video' ? `v:${a.src}` : `t:${a.text}`)

/** Renders a project name as a white-on-black field so it dithers like any other artwork. */
function typeField(text: string): Float32Array {
  const c = document.createElement('canvas')
  c.width = c.height = N
  const g = c.getContext('2d')!
  g.fillStyle = '#000'
  g.fillRect(0, 0, N, N)
  const glow = g.createRadialGradient(N * 0.7, N * 0.3, 4, N * 0.7, N * 0.3, N * 0.75)
  glow.addColorStop(0, 'rgba(255,255,255,.42)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, N, N)
  let size = 96
  g.font = `800 ${size}px 'Bricolage Grotesque Variable', sans-serif`
  while (g.measureText(text).width > N - 24 && size > 20) { size -= 4; g.font = `800 ${size}px 'Bricolage Grotesque Variable', sans-serif` }
  g.fillStyle = '#fff'
  g.textBaseline = 'alphabetic'
  g.fillText(text, 12, N - 18)
  return toBrightness(g.getImageData(0, 0, N, N).data, N * N)
}

function frameField(src: CanvasImageSource, sw: number, sh: number, scratch: CanvasRenderingContext2D, invert: boolean) {
  const side = Math.min(sw, sh)
  scratch.drawImage(src, (sw - side) / 2, (sh - side) / 2, side, side, 0, 0, N, N)
  const px = scratch.getImageData(0, 0, N, N).data
  const f = invert ? toBrightness(px, N * N) : toDarkness(px, N * N)
  // Cut the source's near-black backdrop (a terminal is never pure black) so only real content prints.
  for (let i = 0; i < f.length; i++) f[i] = Math.min(1, Math.max(0, (f[i] - 0.22) / 0.6))
  return f
}

/**
 * The record sleeve: a 1-bit red artwork that plays whatever track is active,
 * with the vinyl turning behind it as the page scrolls.
 */
export function Sleeve({ art, playing, years, motto, mottoRest }: { art: Art; playing: NowPlaying; years: number; motto: string; mottoRest: string }) {
  const { t } = useI18n()
  const canvas = useRef<HTMLCanvasElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const name = useTextFx<HTMLHeadingElement>('glitch', ['mount', 'hover'])
  const reduced = useReducedMotion()
  const engine = useRef<{ setArt: (a: Art) => void } | null>(null)

  // Artwork engine: lives for the component's lifetime, art changes are pushed into it.
  useEffect(() => {
    const cv = canvas.current!
    const g = cv.getContext('2d')!
    const scratch = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!
    scratch.canvas.width = scratch.canvas.height = N
    const out = g.createImageData(N, N)
    const typeCache = new Map<string, Float32Array>()
    const videos = new Map<string, HTMLVideoElement>()
    let portrait: Float32Array | null = null
    let current: Art = { kind: 'portrait' }
    const shown = new Float32Array(N * N)
    let from = shown, morphStart = 0
    let jitter = 0, hovering = false, raf = 0, alive = true

    const fieldFor = (a: Art): Float32Array | null => {
      if (a.kind === 'portrait') return portrait
      if (a.kind === 'type') {
        if (!typeCache.has(a.text)) typeCache.set(a.text, typeField(a.text))
        return typeCache.get(a.text)!
      }
      const v = videos.get(a.src)
      if (!v || v.readyState < 2) return null
      return frameField(v, v.videoWidth, v.videoHeight, scratch, true)
    }

    const draw = (now: number) => {
      raf = 0
      if (!alive) return
      const target = fieldFor(current)
      if (target) {
        const p = reduced ? 1 : Math.min(1, (now - morphStart) / MORPH_MS)
        for (let i = 0; i < shown.length; i++) shown[i] = from[i] + (target[i] - from[i]) * p
        out.data.fill(0)
        ditherBayer(shown, N, N, out.data, RED, jitter)
        g.putImageData(out, 0, 0)
        const animating = p < 1 || (current.kind === 'video' && !reduced) || (current.kind === 'portrait' && hovering && !reduced)
        if (animating) schedule()
      }
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }

    const setArt = (a: Art) => {
      if (artKey(a) === artKey(current) && morphStart) return
      for (const [src, v] of videos) if (a.kind !== 'video' || a.src !== src) v.pause()
      if (a.kind === 'video') {
        let v = videos.get(a.src)
        if (!v) {
          v = Object.assign(document.createElement('video'), { src: a.src, muted: true, loop: true, playsInline: true, preload: 'auto' })
          v.addEventListener('loadeddata', schedule)
          videos.set(a.src, v)
        }
        if (!reduced) v.play().catch(() => {})
      }
      from = Float32Array.from(shown)
      current = a
      morphStart = performance.now()
      schedule()
    }
    engine.current = { setArt }

    const img = new Image()
    img.onload = () => {
      scratch.drawImage(img, 0, 0, N, N)
      const d = toDarkness(scratch.getImageData(0, 0, N, N).data, N * N)
      portrait = d.map(v => Math.min(1, Math.max(0, (v - 0.1) / 0.82)))
      schedule()
    }
    img.src = '/portrait.jpg'
    document.fonts.ready.then(() => typeCache.clear())

    let tick = 0
    const enter = () => { hovering = true; if (!reduced) tick = window.setInterval(() => { jitter = (jitter + 1) % 8; schedule() }, 90) }
    const leave = () => { hovering = false; clearInterval(tick); jitter = 0; schedule() }
    cv.addEventListener('pointerenter', enter)
    cv.addEventListener('pointerleave', leave)

    // The disc turns with scroll: a quarter turn per viewport.
    let sraf = 0
    const spin = () => { sraf = 0; disc.current?.style.setProperty('--spin', `${(scrollY / innerHeight) * 90}deg`) }
    const onScroll = () => { if (!sraf) sraf = requestAnimationFrame(spin) }
    if (!reduced) addEventListener('scroll', onScroll, { passive: true })

    return () => {
      alive = false
      cancelAnimationFrame(raf); cancelAnimationFrame(sraf); clearInterval(tick)
      removeEventListener('scroll', onScroll)
      cv.removeEventListener('pointerenter', enter)
      cv.removeEventListener('pointerleave', leave)
      for (const v of videos.values()) { v.pause(); v.removeAttribute('src'); v.load() }
      engine.current = null
    }
  }, [reduced])

  const key = artKey(art)
  useEffect(() => { engine.current?.setArt(art) }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  const cover = art.kind === 'portrait'
  return (
    <div className="record">
      <div className="disc" ref={disc} aria-hidden="true"><div className="disc__label">AELX-001</div></div>
      <div className="sleeve">
        <canvas ref={canvas} width={N} height={N} className="sleeve__art" role="img" aria-label={t('hero.portrait_alt')} />
        <div className="sleeve__top"><span>AELX-001</span><span>{t('sleeve.role')}</span></div>
        <div className="sleeve__foot" data-mode={cover ? 'cover' : 'track'}>
          <div className="sleeve__cover">
            <h1 ref={name} className="sleeve__name fx" data-text="AlexandreSJ">AlexandreSJ</h1>
            <p className="sleeve__motto"><b>{motto}</b>{mottoRest}</p>
          </div>
          {playing && <p className="sleeve__track" aria-hidden="true"><span>{playing.code}</span>{playing.name}</p>}
        </div>
      </div>
      <p className="record__caption">
        {playing
          ? <><span className="record__dot" aria-hidden="true" />{t('sleeve.playing')} · {playing.code} {playing.name}</>
          : <>{t('sleeve.sides')} · {t('sleeve.years', { n: years })}</>}
      </p>
    </div>
  )
}
