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
