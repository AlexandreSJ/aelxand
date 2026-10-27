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
