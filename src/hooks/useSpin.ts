import { useEffect, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Sets --spin on the element: a quarter turn per viewport of scroll. */
export function useSpin(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const spin = () => { raf = 0; ref.current?.style.setProperty('--spin', `${(scrollY / innerHeight) * 90}deg`) }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(spin) }
    spin()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [ref, reduced])
}
