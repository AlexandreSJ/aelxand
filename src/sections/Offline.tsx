import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Offline() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="offline">
      <SectionHead id="offline" no="05" title={t('offline.title')} em={t('offline.em')} />
      <ul className="offline">
        {profile.offline.map(o => (
          <li key={o.key}><b>{t(o.key)}</b><span>{t(o.descKey)}</span></li>
        ))}
      </ul>
    </section>
  )
}
