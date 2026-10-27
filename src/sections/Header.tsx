import { useI18n } from '../i18n'
import { useYears } from '../hooks/useYears'
import { LangSwitch } from './Footer'

export function Header() {
  const { t } = useI18n()
  const years = useYears()
  return (
    <header className="topbar">
      <div className="wrap topbar__in">
        <a className="topbar__mark" href="#side-a"><span>~/</span>aelxand</a>
        <nav className="topbar__nav" aria-label="primary">
          <a href="#side-a">{t('nav.sideA')}</a>
          <a href="#backstage">{t('nav.backstage')}</a>
          <a href="#side-b">{t('nav.sideB')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        <span className="topbar__years">{t('liner.working_v', { n: years })}</span>
        <LangSwitch />
      </div>
    </header>
  )
}
