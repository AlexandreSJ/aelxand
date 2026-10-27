import { useEffect, useRef } from 'react'
import { runFx, type FxKind } from '../lib/textfx'
import { useReducedMotion } from './useReducedMotion'

/** idle: repeat every 5–9s while the element is on screen. */
type Trigger = 'view' | 'mount' | 'hover' | 'idle'

export function useTextFx<T extends HTMLElement>(kind: FxKind, triggers: Trigger[]) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const key = triggers.join()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let cancel = () => {}
    let alive = true
    const run = () => { cancel(); cancel = runFx(kind, el) }
    const cleanups: (() => void)[] = []
    document.fonts.ready.then(() => {
      if (!alive) return
      if (key.includes('mount')) run()
      if (key.includes('view')) {
        const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && run()), { threshold: 0.6 })
        io.observe(el)
        cleanups.push(() => io.disconnect())
      }
      if (key.includes('idle')) {
        let visible = false, timer = 0
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
        io.observe(el)
        const loop = () => { if (visible) run(); timer = window.setTimeout(loop, 5000 + Math.random() * 4000) }
        timer = window.setTimeout(loop, 5000)
        cleanups.push(() => { io.disconnect(); clearTimeout(timer) })
      }
      if (key.includes('hover')) {
        el.addEventListener('pointerenter', run)
        cleanups.push(() => el.removeEventListener('pointerenter', run))
      }
    })
    return () => { alive = false; cancel(); cleanups.forEach(f => f()) }
  }, [kind, key, reduced])
  return ref
}
