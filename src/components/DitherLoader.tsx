import { useEffect, useRef } from 'react'
import { RED, ditherBayer } from '../lib/dither'
import { useReducedMotion } from '../hooks/useReducedMotion'

const W = 120, H = 60
const FRAME_MS = 50

/** A red Bayer wave sweeping across while something loads; one still frame under reduced motion. */
export function DitherLoader({ label }: { label: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const g = canvas.current!.getContext('2d')!
    const out = g.createImageData(W, H)
    const dark = new Float32Array(W * H)
    let raf = 0, last = 0
    const draw = (now: number) => {
      raf = reduced ? 0 : requestAnimationFrame(draw)
      if (now - last < FRAME_MS) return
      last = now
      const t = now / 1000
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        // A diagonal band sweeping left to right, fading toward the edges of the box.
        const band = Math.sin((x - y * 0.6) * 0.09 - t * 3.2) * 0.5 + 0.5
        const edge = Math.min(1, Math.min(x, W - x, y, H - y) / 14)
        dark[y * W + x] = band ** 2 * edge
      }
      out.data.fill(0)
      ditherBayer(dark, W, H, out.data, RED, Math.floor(t * 6) % 8)
      g.putImageData(out, 0, 0)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div className="loader" role="status">
      <canvas ref={canvas} width={W} height={H} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
