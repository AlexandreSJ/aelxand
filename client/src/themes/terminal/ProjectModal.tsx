import { useEffect, useRef } from 'react'
import { useI18n } from '../../contexts/I18nContext'
import type { Project } from '../../data/projects'

interface Props {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const { t } = useI18n()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal"
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <button className="project-modal__close" onClick={onClose}>✕</button>
        <div className="project-modal__header">
          <h2 className="project-modal__name">{project.name}</h2>
          {project.descriptionKey && (
            <p className="project-modal__desc">{t(project.descriptionKey)}</p>
          )}
        </div>
        <div className="project-modal__tags">
          {project.tech.map(tech => (
            <span key={tech} className="project-card__tag">{tech}</span>
          ))}
        </div>
        <div className="project-modal__demo">
          <span className="project-modal__demo-label">demo loading...</span>
        </div>
        <div className="project-modal__footer">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
