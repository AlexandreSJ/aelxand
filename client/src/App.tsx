import { ColorModeProvider } from './contexts/ColorModeContext'
import { I18nProvider } from './contexts/I18nContext'
import { TerminalLayout } from './themes/terminal/TerminalLayout'

function App() {
  return (
    <ColorModeProvider>
      <I18nProvider>
        <TerminalLayout />
      </I18nProvider>
    </ColorModeProvider>
  )
}

export default App
