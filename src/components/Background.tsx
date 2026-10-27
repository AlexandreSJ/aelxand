import { useEffect, useRef } from 'react'
import { paintGlow, paintHalftone } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'

const CELL = 3
/** Each layer is taller than the viewport by this fraction, which is how far it can travel. */
const TRAVEL = 0.35

type Layer = { el: HTMLCanvasElement; paint: (o: Uint8ClampedArray, w: number, h: number) => void; speed: number }

/**
 * Two dithered layers painted once and moved only with transforms:
 * the red glow (far) drifts half as fast as the ink halftone (near).
 */
export function Background() {
  const far = useRef<HTMLCanvasElement>(null)
  const near = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const layers: Layer[] = [
      { el: far.current!, paint: paintGlow, speed: 0.5 },
      { el: near.current!, paint: paintHalftone, speed: 1 },
    ]
    let travel = 0
    const paint = () => {
      travel = innerHeight * TRAVEL
      for (const l of layers) {
        l.el.width = Math.ceil(innerWidth / CELL)
        l.el.height = Math.ceil((innerHeight + travel) / CELL)
        l.el.style.height = `${innerHeight + travel}px`
        const g = l.el.getContext('2d')!
        const img = g.createImageData(l.el.width, l.el.height)
        l.paint(img.data, l.el.width, l.el.height)
        g.putImageData(img, 0, 0)
      }
    }
    let raf = 0
    const move = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? scrollY / max : 0
      for (const l of layers) l.el.style.transform = `translate3d(0,${-p * travel * l.speed}px,0)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(move) }
    let t = 0
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => { paint(); move() }, 150) }

    paint()
    move()
    addEventListener('resize', onResize)
    if (!reduced) addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('resize', onResize)
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [reduced])

  return (
    <div className="bg" aria-hidden="true">
      <canvas ref={far} className="bg__layer" />
      <canvas ref={near} className="bg__layer" />
    </div>
  )
}
