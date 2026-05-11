import { useI18n } from '../contexts/I18nContext'
import type { Project } from '../data/projects'

interface Props {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: Props) {
  const { t } = useI18n()

  return (
    <div className={`project-card ${className}`}>
      <div className="project-card__name">{project.name}</div>
      <div className="project-card__desc">{t(project.descriptionKey)}</div>
      <div className="project-card__tags">
        {project.tech.map(tech => (
          <span key={tech} className="project-card__tag">{tech}</span>
        ))}
      </div>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="project-card__link"
      >
        GitHub →
      </a>
    </div>
  )
}
