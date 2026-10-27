import './styles/fonts'
import './styles/tokens.css'
import './styles/base.css'
import './styles/fx.css'
import './components/primitives.css'
import './components/canvas.css'
import './components/crt.css'
import './sections/sections.css'
import { I18nProvider, useI18n, type Locale } from './i18n'
import { profile } from './data/profile'
import { Background } from './components/Background'
import { Rule } from './components/Rule'
import { Marquee } from './components/Marquee'
import { Header } from './sections/Header'
import { Record } from './sections/Record'
import { Liner } from './sections/Liner'
import { SideB } from './sections/SideB'
import { Bonus } from './sections/Bonus'
import { Rotation } from './sections/Rotation'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

function Credits() {
  const { t } = useI18n()
  return <Marquee label={t('stack.marquee')} items={profile.marquee} />
}

export function App({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <Background />
      <Header />
      <main>
        <Record />
        <Rule />
        <Liner />
        <Credits />
        <SideB />
        <Rule />
        <div className="wrap duo">
          <Bonus />
          <Rotation />
        </div>
        <Rule />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  )
}
