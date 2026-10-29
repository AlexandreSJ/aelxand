import { useEffect, useRef } from 'react'
import { RED, ditherBayer, toDarkness } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'
import type { Track } from '../data/record'

const N = 200
const REVEAL_MS = 700

/** The portrait, Bayer-dithered in red; it develops from black on load, then shimmers continuously. */
function Portrait() {
  const { t } = useI18n()
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const cv = canvas.current!
    const g = cv.getContext('2d')!
    const out = g.createImageData(N, N)
    const shown = new Float32Array(N * N)
    let field: Float32Array | null = null
    let start = 0, jitter = 0, raf = 0, tick = 0

    const draw = (now: number) => {
      raf = 0
      if (!field) return
      const p = reduced ? 1 : Math.min(1, (now - start) / REVEAL_MS)
      for (let i = 0; i < shown.length; i++) shown[i] = field[i] * p
      out.data.fill(0)
      ditherBayer(shown, N, N, out.data, RED, jitter)
      g.putImageData(out, 0, 0)
      if (p < 1) raf = requestAnimationFrame(draw)
    }
    const img = new Image()
    img.onload = () => {
      const scratch = document.createElement('canvas').getContext('2d')!
      scratch.canvas.width = scratch.canvas.height = N
      scratch.drawImage(img, 0, 0, N, N)
      field = toDarkness(scratch.getImageData(0, 0, N, N).data, N * N).map(v => Math.min(1, Math.max(0, (v - 0.1) / 0.82)))
      start = performance.now()
      raf = requestAnimationFrame(draw)
    }
    img.src = '/portrait.jpg'

    // The threshold matrix keeps shifting, so the portrait shimmers on its own while it is on screen.
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(cv)
    if (!reduced) tick = window.setInterval(() => { if (visible && field) { jitter = (jitter + 1) % 8; draw(Infinity) } }, 110)
    return () => { cancelAnimationFrame(raf); clearInterval(tick); io.disconnect() }
  }, [reduced])

  return <canvas ref={canvas} width={N} height={N} className="sleeve__art" role="img" aria-label={t('hero.portrait_alt')} />
}

/**
 * The record sleeve. The cover is the dithered portrait; each side A track has
 * its own layer (the project's real video, or a clean type cover) that fades in
 * while that track is active. A track whose media is the portrait keeps it up.
 * The tracklist beside it shows how far through the projects the scroll is.
 */
export function Sleeve({ tracks, active, motto, mottoRest }: { tracks: Track[]; active: number; motto: string; mottoRest: string }) {
  const { t } = useI18n()
  const name = useTextFx<HTMLParagraphElement>('glitch', ['mount', 'hover', 'idle'])
  const layers = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const track = tracks[active]
  // The portrait stays up for the cover and for a track whose media is the portrait itself.
  const mode = !track ? 'cover' : track.media && 'portrait' in track.media ? 'portrait' : 'track'

  // Only the active track's video plays.
  useEffect(() => {
    layers.current?.querySelectorAll<HTMLVideoElement>('video').forEach(v => {
      if (Number(v.dataset.index) === active && !reduced) v.play().catch(() => {})
      else v.pause()
    })
  }, [active, reduced])

  return (
    <div className="record">
      <div className="sleeve" data-mode={mode}>
        <Portrait />
        <div ref={layers} className="sleeve__layers">
          {tracks.map((tr, i) => (
            <div key={tr.name} className="sleeve__layer" data-on={i === active || undefined} aria-hidden="true">
              {tr.media && 'portrait' in tr.media ? null
                : tr.media
                ? <video data-index={i} src={tr.media.video} poster={tr.media.poster} muted loop playsInline preload="none" />
                : (
                  <div className="cover-type"><b>{tr.name}</b></div>
                )}
            </div>
          ))}
        </div>
        <div className="sleeve__top"><span>~/aelxand</span><span>{t('liner.based_v')}</span></div>
        <div className="sleeve__foot">
          <p ref={name} className="sleeve__name fx" data-text="AlexandreSJ">AlexandreSJ</p>
          <p className="sleeve__motto"><b>{motto}</b>{mottoRest}</p>
        </div>
      </div>
    </div>
  )
}
