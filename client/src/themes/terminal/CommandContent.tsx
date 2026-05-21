import { useState } from 'react'
import { useI18n } from '../../contexts/I18nContext'
import { useTypewriter } from '../../hooks/useTypewriter'
import { profile } from '../../data/profile'
import { projects, type Project } from '../../data/projects'
import { ProjectCard } from '../../components/ProjectCard'
import { StackBadges } from '../../components/StackBadges'
import { ProjectModal } from './ProjectModal'

export function CommandContent() {
  const { t } = useI18n()
  const { displayed: bioText } = useTypewriter(t(profile.bioKey), 30, 300)
  const [modalProject, setModalProject] = useState<Project | null>(null)

  return (
    <>
      <section className="terminal-section" id="section-about">
        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span> cd ~/about
        </div>
        <div className="terminal-content__body">
          <div className="terminal-content__command" style={{ marginBottom: 16 }}>
            <span className="terminal-content__prompt">❯</span> cat dev.md
          </div>
          <div className="terminal-content__profile">
            <div className="terminal-content__avatar-wrapper">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="terminal-content__avatar"
                loading="lazy"
                onLoad={e => (e.currentTarget.dataset.loaded = 'true')}
              />
            </div>
            <div>
              <h2 className="terminal-content__name">{profile.name}</h2>
              <p className="terminal-content__role">{t(profile.roleKey)}</p>
            </div>
          </div>
          <p className="terminal-content__bio">
            {bioText}
            <span className="terminal-content__cursor">█</span>
          </p>
          <div className="terminal-content__meta">
            <div><span className="label">location:</span> {t(profile.locationKey)}</div>
            <div><span className="label">degree:</span> {t(profile.degreeKey)}</div>
            <div><span className="label">languages:</span> {t(profile.languagesKey)}</div>
          </div>
        </div>
      </section>

      <section className="terminal-section terminal-section--scrollable" id="section-projects">
        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span> cd ~/projects
        </div>
        <div className="terminal-content__body">
          <div className="terminal-content__command" style={{ marginBottom: 16 }}>
            <span className="terminal-content__prompt">❯</span> ls
          </div>
          <div className="terminal-content__projects">
            {projects.map((project, i) => (
              <ProjectCard
                key={`${project.id}-${i}`}
                project={project}
                index={i}
                onClick={() => project.id !== 'todo' && setModalProject(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="terminal-section" id="section-stack">
        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span> cd ~/stack
        </div>
        <div className="terminal-content__body">
          <div className="terminal-content__command" style={{ marginBottom: 16 }}>
            <span className="terminal-content__prompt">❯</span> ls
          </div>
          <StackBadges />
        </div>
      </section>

      <section className="terminal-section" id="section-contact">
        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span> cd ~/contact
        </div>
        <div className="terminal-content__body">
          <div className="terminal-content__command" style={{ marginBottom: 16 }}>
            <span className="terminal-content__prompt">❯</span> ls
          </div>
          <div className="terminal-content__contacts">
            {profile.contact.map(link => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-content__contact"
                title={t(link.labelKey)}
              >
                {link.icon.includes('-icon') ? (
                  <svg className="contact-icon" viewBox="0 0 24 24" width="20" height="20">
                    <use href={`/icons.svg#${link.icon}`} />
                  </svg>
                ) : (
                  <i className={`${link.icon} contact-icon`} />
                )}
                <span>{t(link.labelKey)}</span>
              </a>
            ))}
          </div>
        </div>


        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span> cd ~/hobbies
        </div>
        <div className="terminal-content__body">
          <div className="terminal-content__command" style={{ marginBottom: 16 }}>
            <span className="terminal-content__prompt">❯</span> ls
          </div>
          <div className="terminal-content__hobbies">
            {profile.hobbies.map(hobby => (
              <div key={hobby.key} className="terminal-content__hobby">
                {hobby.icon.includes('-icon') ? (
                  <svg className="hobby-icon" viewBox="0 0 24 24" width="20" height="20">
                    <use href={`/icons.svg#${hobby.icon}`} />
                  </svg>
                ) : (
                  <span className="hobby-icon">{hobby.icon}</span>
                )}
                <span>{t(hobby.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalProject && (
        <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
      )}
    </>
  )
}
