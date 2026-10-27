import { useI18n } from '../i18n'
import { views } from '../data/projects'
import { SectionHead } from '../components/SectionHead'
import { Card } from '../components/Card'

export function Projects() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="projects">
      <SectionHead id="projects" no="02" title={t('projects.title')} em={t('projects.em')} />
      <div className="cards">{views.map(p => <Card key={p.id} p={p} />)}</div>
    </section>
  )
}
