import { useTextFx } from '../hooks/useTextFx'

type Variant = 'rail' | 'sm'

export function SectionHead({ id, title, em, variant }: { id: string; title: string; em: string; variant?: Variant }) {
  const ref = useTextFx<HTMLHeadingElement>('glitch', ['view'])
  const full = `${title} ${em}`
  return (
    <h2 id={id} ref={ref} className={`section-head fx${variant ? ` section-head--${variant}` : ''}`} data-text={full} aria-label={full}>
      {title} <em className="v">{em}</em>
    </h2>
  )
}
