const PATHS = {
  arrow: 'M5 11 11 5M6 5h5v5',
  star: 'M8 2.6l1.6 3.3 3.6.5-2.6 2.5.6 3.6L8 10.8l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z',
  play: 'M5.5 4v8l6-4z',
} as const

/** Authored 16px icons, 1.25 stroke, drawn in currentColor. */
export function Icon({ name, label }: { name: keyof typeof PATHS; label?: string }) {
  return (
    <svg className={`icon icon--${name}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined} aria-label={label} fill={name === 'arrow' ? 'none' : 'currentColor'}
      stroke="currentColor" strokeWidth={name === 'arrow' ? 1.25 : 0} strokeLinecap="square">
      <path d={PATHS[name]} />
    </svg>
  )
}
