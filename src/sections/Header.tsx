import { Fragment } from 'react'
import { useI18n } from '../i18n'
import { useYears } from '../hooks/useYears'
import { LangSwitch } from './Footer'

export function Header() {
  const { t } = useI18n()
  const years = useYears()
  const links: [string, string][] = [
    ['#side-a', t('nav.sideA')],
    ['#backstage', t('nav.backstage')],
    ['#side-b', t('nav.sideB')],
    ['#contact', t('nav.contact')],
  ]
  return (
    <header className="topbar">
      <div className="wrap topbar__in">
        <a className="topbar__mark" href="#side-a"><span>~/</span>aelxand</a>
        <nav className="topbar__nav" aria-label="primary">
          {links.map(([href, label], i) => (
            <Fragment key={href}>
              {i > 0 && <span className="topbar__sep" aria-hidden="true">/</span>}
              <a href={href}>{label}</a>
            </Fragment>
          ))}
        </nav>
        <span className="topbar__years">{t('liner.working_v', { n: years })}</span>
        <LangSwitch />
      </div>
    </header>
  )
}
