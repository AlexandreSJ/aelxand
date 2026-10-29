import './styles/fonts'
import './styles/tokens.css'
import './styles/base.css'
import './styles/fx.css'
import './components/primitives.css'
import './components/canvas.css'
import './sections/sections.css'
import { I18nProvider, useI18n, type Locale } from './i18n'
import { profile } from './data/profile'
import { Background } from './components/Background'
import { Rule } from './components/Rule'
import { Marquee } from './components/Marquee'
import { Header } from './sections/Header'
import { Intro } from './sections/Intro'
import { Record } from './sections/Record'
import { Backstage } from './sections/Backstage'
import { SideB } from './sections/SideB'
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
        <Intro />
        <Record />
        <Rule />
        <Backstage />
        <Credits />
        <SideB />
        <Rule />
        <div className="wrap duo">
          <Contact />
          <Rotation />
        </div>
      </main>
      <Footer />
    </I18nProvider>
  )
}
