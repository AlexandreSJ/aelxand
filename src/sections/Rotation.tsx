import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Rotation() {
  const { t } = useI18n()
  return (
    <section className="sheet rotation" aria-labelledby="rotation">
      <SectionHead id="rotation" title={t('now.title')} em={t('now.em')} />
      <a className="rotation__player" href={profile.spotifyHref} target="_blank" rel="noreferrer">
        <img src={profile.spotifyImg} alt={t('now.alt')} width={480} height={170} loading="lazy" decoding="async" />
      </a>
    </section>
  )
}
