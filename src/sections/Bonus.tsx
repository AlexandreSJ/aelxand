import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Bonus() {
  const { t } = useI18n()
  return (
    <section className="sheet bonus" aria-labelledby="bonus">
      <SectionHead id="bonus" title={t('bonus.title')} em={t('bonus.em')} variant="sm" />
      <ul className="bonus__list">
        {profile.offline.map(o => (
          <li key={o.key}><b>{t(o.key)}</b><span>{t(o.descKey)}</span></li>
        ))}
      </ul>
    </section>
  )
}
