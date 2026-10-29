import { useEffect, useRef, useState } from 'react'
import { useI18n, type MessageKey } from '../i18n'
import { RED, ditherBayer } from '../lib/dither'
import { stack, reposFor, type Tech } from '../data/stack'

const N = 32

/** Honeycomb cell for item i with `per` hexagons a row: every other row shifts half a cell right. */
const cell = (i: number, per: number) => {
  const row = Math.floor(i / per)
  return { c: `${(i % per) * 2 + 1 + (row % 2)} / span 2`, r: row + 1 }
}

/** Brand marks that are black would vanish on the dark page; those show in ink instead. */
const tint = (hex: string) => (parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4), 16) < 90 ? 'var(--ink)' : `#${hex}`)

/** One logo, Bayer-dithered in red from its own vector path (or a monogram when it has no mark). */
function Mark({ tech }: { tech: Tech }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const scratch = document.createElement('canvas').getContext('2d')!
    scratch.canvas.width = scratch.canvas.height = N
    if (tech.icon) {
      scratch.scale(N / 24, N / 24)
      scratch.fill(new Path2D(tech.icon.path))
    } else {
      scratch.font = `800 ${N * 0.5}px 'Bricolage Grotesque Variable', sans-serif`
      scratch.textAlign = 'center'
      scratch.textBaseline = 'middle'
      scratch.fillText(tech.name.split(' ').map(w => w[0]).join(''), N / 2, N / 2 + 1)
    }
    const alpha = scratch.getImageData(0, 0, N, N).data
    const dark = new Float32Array(N * N).map((_, i) => (alpha[i * 4 + 3] / 255) * 0.9)
    const g = canvas.current!.getContext('2d')!
    const out = g.createImageData(N, N)
    ditherBayer(dark, N, N, out.data, RED)
    g.putImageData(out, 0, 0)
  }, [tech])

  return (
    <span className="stack__mark" aria-hidden="true">
      <canvas ref={canvas} width={N} height={N} />
      {tech.icon
        ? <svg viewBox="0 0 24 24" style={{ fill: tint(tech.icon.hex) }}><path d={tech.icon.path} /></svg>
        : <b>{tech.name.split(' ').map(w => w[0]).join('')}</b>}
    </span>
  )
}

/**
 * The stack as a honeycomb of dithered logos (5 a row on desktop, 3 on phones). Names are always visible; pointing at
 * (or focusing) a logo reveals it in its brand colour and says where it is used.
 */
export function StackGrid() {
  const { t } = useI18n()
  const [on, setOn] = useState<Tech | null>(null)
  const repos = on ? reposFor(on) : []
  const glow = useRef<HTMLElement>(null)
  const frame = useRef(0)

  // The pointer, in viewport coordinates, lights the hexagon borders around it (see .stack__tile in CSS).
  const track = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const { clientX: x, clientY: y } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const s = glow.current?.style
      s?.setProperty('--mx', `${x}px`)
      s?.setProperty('--my', `${y}px`)
      s?.setProperty('--glow', '1')
    })
  }
  const dim = () => { cancelAnimationFrame(frame.current); glow.current?.style.setProperty('--glow', '0') }
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return (
    <figure ref={glow} className="stack" onPointerMove={track} onPointerLeave={dim}>
      <ul className="stack__grid" onPointerLeave={() => setOn(null)}>
        {stack.map((tech, i) => {
          const d = cell(i, 5), m = cell(i, 3)
          return (
          <li key={tech.name} style={{ '--c': d.c, '--r': d.r, '--cm': m.c, '--rm': m.r } as React.CSSProperties}>
            <button type="button" className="stack__tile" aria-pressed={on?.name === tech.name}
              onPointerEnter={() => setOn(tech)} onFocus={() => setOn(tech)} onClick={() => setOn(tech)}>
              <Mark tech={tech} />
              <span className="stack__name">{tech.name}</span>
            </button>
          </li>
          )
        })}
      </ul>
      <figcaption className="stack__read" aria-live="polite">
        {on
          ? <><b>{on.name}</b><span>{t(`stack.${on.layer}` as MessageKey)}</span><span>{repos.length ? t('stack.in', { repos: repos.join(', ') }) : t('stack.private')}</span></>
          : t('stack.hint')}
      </figcaption>
    </figure>
  )
}
