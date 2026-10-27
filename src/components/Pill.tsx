import type { ReactNode } from 'react'

export function Pill({ dot, children }: { dot?: boolean; children: ReactNode }) {
  return <span className="pill">{dot && <i aria-hidden="true" />}{children}</span>
}
