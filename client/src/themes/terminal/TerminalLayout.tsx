import { useState } from 'react'
import { Sidebar, type Section } from './Sidebar'
import { TerminalBar } from './TerminalBar'
import { StatusBar } from './StatusBar'
import { CommandContent } from './CommandContent'
import './TerminalLayout.css'

export function TerminalLayout() {
  const [section, setSection] = useState<Section>('about')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="terminal-layout">
      <Sidebar
        active={section}
        onSelect={setSection}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />
      <main className="terminal-main">
        <TerminalBar onToggleMobile={() => setMobileOpen(!mobileOpen)} />
        <CommandContent section={section} />
        <StatusBar />
      </main>
    </div>
  )
}
