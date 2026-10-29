import { LOCALES, LOCALE_NAME, useI18n } from '../i18n'

export function LangSwitch() {
  const { locale, t } = useI18n()
  return (
    <nav className="langs" aria-label={t('footer.language')}>
      {LOCALES.map(l => (
        <a key={l} href={`/${l}`} hrefLang={l} aria-current={l === locale ? 'page' : undefined}>{LOCALE_NAME[l]}</a>
      ))}
    </nav>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="wrap footer">
      <span>© 2026 AlexandreSJ</span>
      <a href="https://github.com/AlexandreSJ/aelxand" target="_blank" rel="noreferrer">{t('footer.source')}</a>
      <LangSwitch />
    </footer>
  )
}
