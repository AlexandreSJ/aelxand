import { useI18n } from '../../contexts/I18nContext'

export function StatusBar() {
  const { lang } = useI18n()

  return (
    <div className="terminal-status">
      <span className="terminal-status__item">
        {lang === 'pt-BR' ? 'PT-BR' : lang === 'es' ? 'ES' : 'EN'}
      </span>
      <span className="terminal-status__item">●</span>
      <span className="terminal-status__item">main</span>
    </div>
  )
}
