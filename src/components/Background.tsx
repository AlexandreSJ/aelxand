import { useEffect, useRef } from 'react'
import { paintGlow, paintHalftone, paintSpecks } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'

const CELL = 3
/** Each layer is taller than the viewport by this fraction, which is how far it can travel. */
const TRAVEL = 0.6
/** Pointer parallax amplitude, in px, for a layer of depth 1; BLEED keeps the edges off screen. */
const POINTER = 16
const BLEED = 32

type Paint = (o: Uint8ClampedArray, w: number, h: number) => void
/** far → near: the nearer the layer, the faster it moves with scroll and pointer. */
const LAYERS: { paint: Paint; depth: number }[] = [
  { paint: paintGlow, depth: 0.35 },
  { paint: paintHalftone, depth: 0.7 },
  { paint: paintSpecks, depth: 1.3 },
]

/**
 * Three dithered layers, painted once and moved only with transforms, so the
 * ground reads as depth: scroll drifts them at different speeds and the pointer
 * tilts them slightly against each other.
 */
export function Background() {
  const refs = useRef<(HTMLCanvasElement | null)[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const els = refs.current.filter((c): c is HTMLCanvasElement => !!c)
    let travel = 0, raf = 0
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 }

    const paint = () => {
      travel = innerHeight * TRAVEL
      els.forEach((el, i) => {
        el.width = Math.ceil((innerWidth + BLEED * 2) / CELL)
        el.style.width = `${innerWidth + BLEED * 2}px`
        el.height = Math.ceil((innerHeight + travel) / CELL)
        el.style.height = `${innerHeight + travel}px`
        const g = el.getContext('2d')!
        const img = g.createImageData(el.width, el.height)
        LAYERS[i].paint(img.data, el.width, el.height)
        g.putImageData(img, 0, 0)
      })
    }
    const frame = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0
      ptr.x += (ptr.tx - ptr.x) * 0.08
      ptr.y += (ptr.ty - ptr.y) * 0.08
      els.forEach((el, i) => {
        const d = LAYERS[i].depth
        const y = -p * travel * Math.min(1, d) - (d > 1 ? p * travel * 0.3 : 0)
        el.style.transform = `translate3d(${(-BLEED - ptr.x * POINTER * d).toFixed(1)}px,${(y - ptr.y * POINTER * d).toFixed(1)}px,0)`
      })
      if (Math.abs(ptr.tx - ptr.x) + Math.abs(ptr.ty - ptr.y) > 0.002) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      ptr.tx = e.clientX / innerWidth - 0.5
      ptr.ty = e.clientY / innerHeight - 0.5
      kick()
    }
    let t = 0
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => { paint(); kick() }, 150) }

    paint()
    frame()
    addEventListener('resize', onResize)
    if (!reduced) {
      addEventListener('scroll', kick, { passive: true })
      addEventListener('pointermove', onPointer, { passive: true })
    }
    return () => {
      removeEventListener('resize', onResize)
      removeEventListener('scroll', kick)
      removeEventListener('pointermove', onPointer)
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [reduced])

  return (
    <div className="bg" aria-hidden="true">
      {LAYERS.map((_, i) => <canvas key={i} ref={el => { refs.current[i] = el }} className="bg__layer" />)}
    </div>
  )
}
