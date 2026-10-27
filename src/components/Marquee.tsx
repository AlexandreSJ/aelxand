/**
 * Infinite ticker. Two identical groups sit side by side and the track moves
 * exactly one group width, so the loop has no seam. Spacing lives inside each
 * item (never as a gap between groups) to keep both halves the same width.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const group = (hidden: boolean) => (
    <ul className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={it} className={i % 2 ? 'marquee__item marquee__item--v' : 'marquee__item'}>{it}</li>
      ))}
    </ul>
  )
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">{group(false)}{group(true)}</div>
    </div>
  )
}
