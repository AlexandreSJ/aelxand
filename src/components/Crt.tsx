import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export type CrtLine = { kind: 'prompt' | 'head' | 'text'; text: string }

function render(l: CrtLine, text = l.text): ReactNode {
  if (l.kind === 'prompt') return <><span className="crt__dim">&gt; </span>{text}</>
  if (l.kind === 'head') return <span className="crt__hi">{text}</span>
  return text
}

/**
 * A terminal window that types its lines the first time it scrolls into view.
 * The full text is always laid out underneath as an invisible ghost, so the
 * screen has its final height from the first frame and typing never resizes it.
 */
export function Crt({ lines, label, meta }: { lines: CrtLine[]; label: string; meta?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [pos, setPos] = useState<{ line: number; char: number } | null>(null)

  useEffect(() => {
    if (reduced) return
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let line = 0, char = 0
      const tick = () => {
        if (line >= lines.length) { setPos(null); return }
        const l = lines[line]
        char += l.kind === 'prompt' ? 1 : 3
        if (char >= l.text.length) {
          line++; char = 0
          setPos({ line, char })
          timer = window.setTimeout(tick, l.kind === 'prompt' ? 260 : 40)
          return
        }
        setPos({ line, char })
        timer = window.setTimeout(tick, l.kind === 'prompt' ? 45 : 14)
      }
      setPos({ line: 0, char: 0 })
      timer = window.setTimeout(tick, 200)
    }, { threshold: 0.35 })
    io.observe(ref.current!)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [lines, reduced])

  const done = pos ? lines.slice(0, pos.line) : lines
  const typing = pos && pos.line < lines.length ? lines[pos.line] : null
  const all = (
    <>
      {lines.map((l, i) => <span key={i}>{render(l)}{'\n'}</span>)}
      <span className="crt__dim">&gt; </span>
    </>
  )

  return (
    <figure className="crt-win">
      <figcaption className="crt-win__bar">
        <span className="label">{label}</span>
        {meta && <span className="crt-win__meta">{meta}</span>}
      </figcaption>
      <div className="crt" ref={ref}>
        <div className="crt__screen">
          <pre className="crt__ghost" aria-hidden="true">{all}</pre>
          <pre className="crt__type" aria-label={label}>
            {done.map((l, i) => <span key={i}>{render(l)}{'\n'}</span>)}
            {typing && <span>{render(typing, typing.text.slice(0, pos!.char))}</span>}
            {!typing && <span className="crt__dim">&gt; </span>}
            <span className="crt__cur" aria-hidden="true" />
          </pre>
        </div>
        <div className="crt__roll" aria-hidden="true" />
        <div className="crt__vig" aria-hidden="true" />
      </div>
    </figure>
  )
}
