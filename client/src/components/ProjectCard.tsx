import { useRef, useEffect, useState } from 'react'
import { useI18n } from '../contexts/I18nContext'
import type { Project } from '../data/projects'

interface Props {
  project: Project
  index: number
  onClick?: () => void
  className?: string
}

export function ProjectCard({ project, index, onClick, className = '' }: Props) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isPlaceholder = project.id === 'todo'

  return (
    <div
      ref={ref}
      className={[
        'project-card',
        visible ? 'project-card--visible' : 'project-card--enter',
        isPlaceholder ? 'project-card--placeholder' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ transitionDelay: `${index * 60}ms` }}
      onClick={onClick}
    >
      <div className="project-card__name">{project.name}</div>
      {project.descriptionKey && (
        <div className="project-card__desc">{t(project.descriptionKey)}</div>
      )}
      <div className="project-card__tags">
        {project.tech.map(tech => (
          <span key={tech} className="project-card__tag">{tech}</span>
        ))}
      </div>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__link"
          onClick={e => e.stopPropagation()}
        >
          GitHub →
        </a>
      )}
    </div>
  )
}
