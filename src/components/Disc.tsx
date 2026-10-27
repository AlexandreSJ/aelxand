import { useRef, type ReactNode } from 'react'
import { useSpin } from '../hooks/useSpin'

/** A vinyl disc whose off-centre label text makes the scroll rotation visible. */
export function Disc({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useSpin(ref)
  return (
    <div ref={ref} className={`disc${className ? ` ${className}` : ''}`} aria-hidden="true">
      <div className="disc__label">{children}</div>
    </div>
  )
}
