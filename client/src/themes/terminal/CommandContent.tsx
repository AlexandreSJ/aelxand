import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../../contexts/I18nContext'
import { useTypewriter } from '../../hooks/useTypewriter'
import { profile } from '../../data/profile'
import { projects } from '../../data/projects'
import { ProjectCard } from '../../components/ProjectCard'
import { StackBadges } from '../../components/StackBadges'
import { ContactLinks } from '../../components/ContactLinks'
import type { Section } from './Sidebar'

interface Props {
  section: Section
}

export function CommandContent({ section }: Props) {
  const { t } = useI18n()
  const { displayed: bioText } = useTypewriter(t(profile.bioKey), 30, 300)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        className="terminal-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="terminal-content__command">
          <span className="terminal-content__prompt">❯</span>
          {' cd ~/aelxand/'}
          {section}
          {''}
        </div>

        {section === 'about' && (
          <div className="terminal-content__body">
            <div className="terminal-content__command" style={{ marginBottom: 16 }}>
              <span className="terminal-content__prompt">❯</span> cat dev.md
            </div>
            <div className="terminal-content__profile">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="terminal-content__avatar"
              />
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
        )}

        {section === 'projects' && (
          <div className="terminal-content__body">
            <div className="terminal-content__command" style={{ marginBottom: 16 }}>
              <span className="terminal-content__prompt">❯</span> ls
            </div>
            <div className="terminal-content__projects">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {section === 'stack' && (
          <div className="terminal-content__body">
            <div className="terminal-content__command" style={{ marginBottom: 16 }}>
              <span className="terminal-content__prompt">❯</span> ls
            </div>
            <StackBadges />
          </div>
        )}

        {section === 'hobbies' && (
          <div className="terminal-content__body">
            <div className="terminal-content__command" style={{ marginBottom: 16 }}>
              <span className="terminal-content__prompt">❯</span> ls
            </div>
            <div className="terminal-content__hobbies">
              {profile.hobbies.map(hobby => (
                <div key={hobby.key} className="terminal-content__hobby">
                  <span className="hobby-icon">{hobby.icon}</span>
                  <span>{t(hobby.key)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'contact' && (
          <div className="terminal-content__body">
            <div className="terminal-content__command" style={{ marginBottom: 16 }}>
              <span className="terminal-content__prompt">❯</span> ls
            </div>
            <ContactLinks variant="buttons" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
