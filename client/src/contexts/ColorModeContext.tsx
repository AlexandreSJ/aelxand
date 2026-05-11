import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type ColorMode = 'dark' | 'light'

interface ColorModeState {
  mode: ColorMode
  toggle: () => void
}

const ColorModeContext = createContext<ColorModeState | null>(null)

function getSystemMode(): ColorMode {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => {
    try {
      const stored = localStorage.getItem('portfolio-color-mode')
      return (stored as ColorMode) || getSystemMode()
    } catch {
      return getSystemMode()
    }
  })

  useEffect(() => {
    localStorage.setItem('portfolio-color-mode', mode)
    document.documentElement.setAttribute('data-color-mode', mode)
  }, [mode])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('portfolio-color-mode')
      if (!stored) setMode(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  // Set initial attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', mode)
  }, [])

  return (
    <ColorModeContext value={{ mode, toggle: () => setMode(m => m === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ColorModeContext>
  )
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext)
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider')
  return ctx
}
