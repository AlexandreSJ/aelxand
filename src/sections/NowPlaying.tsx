import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function NowPlaying() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="now">
      <SectionHead id="now" no="06" title={t('now.title')} em={t('now.em')} />
      <a className="now" href={profile.spotifyHref} target="_blank" rel="noreferrer">
        <img src={profile.spotifyImg} alt={t('now.alt')} width={480} height={170} loading="lazy" />
      </a>
    </section>
  )
}
