import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

export type CrtLine = { kind: 'prompt' | 'head' | 'text'; text: string }

function Line({ l }: { l: CrtLine }) {
  if (l.kind === 'prompt') return <><span className="crt__dim">&gt; </span>{l.text}</>
  if (l.kind === 'head') return <span className="crt__hi">{l.text}</span>
  return <>{l.text}</>
}

export function Crt({ lines, label }: { lines: CrtLine[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [shown, setShown] = useState<{ n: number; partial: number } | null>(null)

  useEffect(() => {
    if (reduced) return
    const el = ref.current!
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      let n = 0, partial = 0
      const tick = () => {
        if (n >= lines.length) { setShown(null); return }
        const l = lines[n]
        partial += l.kind === 'prompt' ? 1 : 3
        if (partial >= l.text.length) { n++; partial = 0; setShown({ n, partial }); timer = window.setTimeout(tick, l.kind === 'prompt' ? 260 : 50); return }
        setShown({ n, partial })
        timer = window.setTimeout(tick, l.kind === 'prompt' ? 45 : 14)
      }
      setShown({ n: 0, partial: 0 })
      tick()
    }, { threshold: 0.35 })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer) }
  }, [lines, reduced])

  const visible = shown ? lines.slice(0, shown.n) : lines
  const typing = shown && shown.n < lines.length ? lines[shown.n] : null
  return (
    <figure className="crt-bezel">
      <div className="crt" ref={ref}>
        <pre className="crt__screen" aria-label={label}>
          {visible.map((l, i) => <span key={i}><Line l={l} />{'\n'}</span>)}
          {typing && <span>{typing.kind === 'prompt' && <span className="crt__dim">&gt; </span>}{typing.text.slice(typing.kind === 'prompt' ? 0 : 0, shown!.partial)}</span>}
          <span className="crt__dim">&gt; </span><span className="crt__cur" aria-hidden="true" />
        </pre>
        <div className="crt__roll" aria-hidden="true" />
        <div className="crt__vig" aria-hidden="true" />
      </div>
      <figcaption className="crt-bezel__brand">AELXAND · 1-BIT</figcaption>
      <span className="crt-bezel__led" aria-hidden="true" />
    </figure>
  )
}
