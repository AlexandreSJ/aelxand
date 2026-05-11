import { useColorMode } from '../contexts/ColorModeContext'

export function ColorModeToggle() {
  const { mode, toggle } = useColorMode()

  return (
    <button className="color-mode-toggle" onClick={toggle} title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
      <span className="color-mode-toggle__icon">{mode === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  )
}
