import type { ReactNode } from 'react'

/** A red dot that pulses like an on-air lamp: the thing is deployed and reachable right now. */
export function LiveDot() {
  return <i className="live-dot" aria-hidden="true" />
}

export function Pill({ dot, live, children }: { dot?: boolean; live?: boolean; children: ReactNode }) {
  return <span className="pill">{live ? <LiveDot /> : dot && <i aria-hidden="true" />}{children}</span>
}
