import { useTextFx } from '../hooks/useTextFx'

export function SectionHead({ id, no, title, em }: { id: string; no: string; title: string; em: string }) {
  const ref = useTextFx<HTMLHeadingElement>('dissolve', ['view'])
  const full = `${title} ${em}`
  return (
    <div className="section-head">
      <span className="section-head__no" aria-hidden="true">{no}</span>
      <h2 id={id} ref={ref} className="section-head__title fx" data-text={full} aria-label={full}>
        {title} <em className="v">{em}</em>
      </h2>
    </div>
  )
}
