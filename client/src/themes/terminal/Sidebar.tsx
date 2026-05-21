import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../../contexts/I18nContext'
import { LanguageToggle } from '../../components/LanguageToggle'
import { ColorModeToggle } from '../../components/ColorModeToggle'

const navItems = [
  { key: 'nav.about', section: 'about' },
  { key: 'nav.projects', section: 'projects' },
  { key: 'nav.stack', section: 'stack' },
  { key: 'nav.contact', section: 'contact' },
] as const

export type Section = typeof navItems[number]['section']

interface Props {
  active: Section
  onSelect: (section: Section) => void
  mobileOpen: boolean
  onToggleMobile: () => void
}

export function Sidebar({ active, onSelect, mobileOpen, onToggleMobile }: Props) {
  const { t } = useI18n()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="terminal-sidebar__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggleMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`terminal-sidebar ${mobileOpen ? 'terminal-sidebar--open' : ''}`}>
        <div className="terminal-sidebar__header">
          <div className="terminal-sidebar__logo">
            <span className="terminal-sidebar__prompt">~</span> AlexandreSJ
          </div>
          <button
            className="terminal-sidebar__close"
            onClick={onToggleMobile}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <nav className="terminal-sidebar__nav">
          {navItems.map((item, i) => (
            <motion.button
              key={item.section}
              className={`terminal-sidebar__item ${active === item.section ? 'active' : ''}`}
              onClick={() => { onSelect(item.section); if (mobileOpen) onToggleMobile() }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="terminal-sidebar__item-prompt">❯</span>
              {t(item.key)}
            </motion.button>
          ))}
        </nav>

        <div className="terminal-sidebar__footer">
          <ColorModeToggle />
          <LanguageToggle />
        </div>
      </aside>
    </>
  )
}
