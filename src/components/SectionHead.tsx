import { useTextFx } from '../hooks/useTextFx'

export function SectionHead({ id, title, em }: { id: string; title: string; em: string }) {
  const ref = useTextFx<HTMLHeadingElement>('dissolve', ['view'])
  const full = `${title} ${em}`
  return (
    <h2 id={id} ref={ref} className="section-head fx" data-text={full} aria-label={full}>
      {title} <em className="v">{em}</em>
    </h2>
  )
}
