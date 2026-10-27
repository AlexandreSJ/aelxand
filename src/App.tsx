import './styles/fonts'
import './styles/tokens.css'
import './styles/base.css'
import './styles/fx.css'
import './components/primitives.css'
import './components/canvas.css'
import './components/crt.css'
import './components/card.css'
import './sections/sections.css'
import { I18nProvider, type Locale } from './i18n'
import { Background } from './components/Background'
import { Divider } from './components/Divider'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'
import { Offline } from './sections/Offline'
import { NowPlaying } from './sections/NowPlaying'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

export function App({ locale }: { locale: Locale }) {
  return (
    <I18nProvider locale={locale}>
      <Background />
      <Header />
      <main>
        <Hero />
        <Divider kind="band" />
        <About />
        <Divider kind="marquee" words={['AlexandreSJ', 'fullstack', 'arch btw', 'D&D', 'noct', 'aoi']} />
        <Projects />
        <Divider kind="band" />
        <Experience />
        <Divider kind="marquee" words={['go', 'react', 'spring', 'bun', 'postgres', 'docker']} />
        <Stack />
        <Divider kind="band" />
        <Offline />
        <Divider kind="marquee" words={['PT', 'EN', 'ES', '日本語']} />
        <NowPlaying />
        <Divider kind="band" />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  )
}
