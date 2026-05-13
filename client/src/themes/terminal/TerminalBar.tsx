import { LanguageToggle } from '../../components/LanguageToggle'
import { ColorModeToggle } from '../../components/ColorModeToggle'

interface Props {
  title?: string
  onToggleMobile?: () => void
}

export function TerminalBar({ title = 'alexandresj / portfolio', onToggleMobile }: Props) {
  return (
    <div className="terminal-bar">
      <div className="terminal-bar__dots">
        <span className="terminal-bar__dot terminal-bar__dot--red" />
        <span className="terminal-bar__dot terminal-bar__dot--yellow" />
        <span className="terminal-bar__dot terminal-bar__dot--green" />
      </div>
      <span className="terminal-bar__title">{title}</span>
      <div className="terminal-bar__controls">
        <LanguageToggle />
        <ColorModeToggle />
      </div>
      {onToggleMobile && (
        <button
          className="terminal-bar__hamburger"
          onClick={onToggleMobile}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      )}
    </div>
  )
}
