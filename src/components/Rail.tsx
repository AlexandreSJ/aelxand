import type { Track } from '../data/record'

/**
 * Where the pinned scroll is: one tick per featured project, the active one
 * lit, and a red line filled up to it. Decorative; the tracklist carries the state.
 */
export function Rail({ tracks, active }: { tracks: Track[]; active: number }) {
  const fill = active < 0 ? 0 : (active / Math.max(1, tracks.length - 1)) * 100
  return (
    <div className="rail" aria-hidden="true" style={{ '--fill': `${fill}%` } as React.CSSProperties}>
      <i className="rail__track"><i className="rail__fill" /></i>
      {tracks.map((tr, i) => (
        <span key={tr.name} className="rail__n" data-on={i === active || undefined} data-past={i < active || undefined}>{tr.code}</span>
      ))}
    </div>
  )
}
