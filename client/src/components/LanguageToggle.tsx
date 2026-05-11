import { useI18n, type Lang } from '../contexts/I18nContext'

const langs: { id: Lang; flag: string; name: string }[] = [
  { id: 'pt-BR', flag: '🇧🇷', name: 'Português' },
  { id: 'en', flag: '🇺🇸', name: 'English' },
  { id: 'es', flag: '🇪🇸', name: 'Español' },
]

export function LanguageToggle() {
  const { lang, setLang } = useI18n()

  return (
    <div className="lang-switch">
      {langs.map(l => (
        <button
          key={l.id}
          className={`lang-switch__btn ${lang === l.id ? 'active' : ''}`}
          onClick={() => setLang(l.id)}
          title={l.name}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
