import { useState, useEffect, useRef, useCallback } from 'react'
import { Sidebar, type Section } from './Sidebar'
import { TerminalBar } from './TerminalBar'
import { StatusBar } from './StatusBar'
import { CommandContent } from './CommandContent'
import { ScrollNav } from './ScrollNav'
import './TerminalLayout.css'

export function TerminalLayout() {
  const [activeSection, setActiveSection] = useState<Section>('about')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const sections = container.querySelectorAll('.terminal-section')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          const id = visible[0].target.id.replace('section-', '') as Section
          setActiveSection(id)
          if (id !== 'about') setShowHint(false)
        }
      },
      { root: container, threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    )

    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = useCallback((section: Section) => {
    const el = document.getElementById(`section-${section}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="terminal-layout">
      <Sidebar
        active={activeSection}
        onSelect={scrollToSection}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />
      <main className="terminal-main">
        <TerminalBar onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <div className="terminal-scroll-area">
          <div className="terminal-scroll" ref={scrollRef}>
            <CommandContent />
          </div>
        </div>
        <ScrollNav active={activeSection} onSelect={scrollToSection} showHint={showHint} />
        <StatusBar />
      </main>
    </div>
  )
}
