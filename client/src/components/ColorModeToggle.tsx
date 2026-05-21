import { useColorMode } from '../contexts/ColorModeContext'

export function ColorModeToggle() {
  const { mode, toggle } = useColorMode()

  return (
    <button className="color-mode-toggle" onClick={toggle} title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
      <span className="color-mode-toggle__icon">
        <svg viewBox="0 0 20 20" width="16" height="16">
          <use href="/icons.svg#contrast-icon" />
        </svg>
      </span>
    </button>
  )
}
