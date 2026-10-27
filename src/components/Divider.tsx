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
