import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'
import type { ProjectView } from '../data/projects'
import { Pill } from './Pill'
import { Button } from './Button'

export function Card({ p }: { p: ProjectView }) {
  const { t } = useI18n()
  const title = useTextFx<HTMLHeadingElement>('scramble', ['view'])
  const meta = [...new Set([...p.tags, p.language?.toLowerCase(), p.stars ? `★ ${p.stars}` : null].filter(Boolean))]
  return (
    <article className="card">
      <div className="card__top">
        <span className="label">{`projects/${p.id}`}</span>
        <Pill dot={p.status === 'building'}>{t(`status.${p.status}`)}</Pill>
      </div>
      <h3 ref={title} className="card__title fx" data-text={p.id} aria-label={p.id}>{p.id}</h3>
      <p className="card__voice">{t(p.descKey)}</p>
      <div className="card__meta">{meta.map(m => <span key={m}>{m}</span>)}</div>
      <div className="card__foot">
        <Button size="sm" variant="ghost" href={`https://github.com/AlexandreSJ/${p.repo}`}>{t('projects.source')} ↗</Button>
        {p.live && <Button size="sm" variant="ghost" href={p.live}>{t('projects.live')} ↗</Button>}
      </div>
      <div className="card__band" aria-hidden="true" />
    </article>
  )
}
