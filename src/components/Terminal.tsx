import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export type Line = { cmd?: string; out?: string }
type Shown = { id: number; text: string; cmd: boolean }

const ROWS = 16

/**
 * A shell session that types itself forever and scrolls like a real terminal.
 * Decorative: the page states the same facts elsewhere, so the stream is hidden
 * from assistive tech. The server renders a still first screen.
 */
export function Terminal({ script, path }: { script: Line[]; path: string }) {
  const reduced = useReducedMotion()
  const still = script.flatMap((l, i) => [
    ...(l.cmd ? [{ id: i * 2, text: l.cmd, cmd: true }] : []),
    ...(l.out ? [{ id: i * 2 + 1, text: l.out, cmd: false }] : []),
  ]).slice(0, ROWS)
  const [lines, setLines] = useState<Shown[]>(still)

  useEffect(() => {
    if (reduced) return
    let i = 0, ch = 0, id = 10_000, timer = 0
    let buf: Shown[] = []
    const push = (l: Shown) => { buf = [...buf, l].slice(-ROWS); setLines(buf) }
    const tick = () => {
      const l = script[i % script.length]
      if (l.cmd && ch < l.cmd.length) {
        ch = Math.min(l.cmd.length, ch + 1 + (Math.random() < 0.3 ? 1 : 0))
        const typed = { id, text: l.cmd.slice(0, ch), cmd: true }
        buf = ch === 1 || buf.at(-1)?.id !== id ? [...buf, typed].slice(-ROWS) : [...buf.slice(0, -1), typed]
        setLines(buf)
        timer = window.setTimeout(tick, 28 + Math.random() * 50)
        return
      }
      id++
      if (l.out) push({ id: id++, text: l.out, cmd: false })
      i++; ch = 0
      timer = window.setTimeout(tick, l.cmd ? 380 + Math.random() * 500 : 120)
    }
    timer = window.setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [script, reduced])

  return (
    <figure className="term" aria-hidden="true">
      <figcaption className="term__bar">
        <span className="term__dots"><i /><i /><i /></span>
        <span className="term__path">{path}</span>
      </figcaption>
      <div className="term__screen">
        <pre className="term__rows">
          {lines.map(l => (
            <span key={l.id} className={l.cmd ? 'term__cmd' : 'term__out'}>
              {l.cmd && <b>~ $ </b>}{l.text}{'\n'}
            </span>
          ))}
          <span className="term__cur" />
        </pre>
        <div className="term__roll" />
        <div className="term__vig" />
      </div>
    </figure>
  )
}
