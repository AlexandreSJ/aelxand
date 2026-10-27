import { useI18n } from '../i18n'
import { LangSwitch } from './Footer'

export function Header() {
  const { t } = useI18n()
  return (
    <header className="topbar">
      <div className="wrap topbar__in">
        <a className="topbar__mark" href="#top"><b>~/</b>aelxand</a>
        <nav className="topbar__nav" aria-label="primary">
          <a href="#about">{t('nav.about')}</a>
          <a href="#projects">{t('nav.projects')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        <LangSwitch />
      </div>
    </header>
  )
}
