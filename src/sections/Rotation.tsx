import { useState } from 'react'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'

export function Rotation() {
  const { t } = useI18n()
  const [failed, setFailed] = useState(false)
  return (
    <section className="sheet rotation" aria-labelledby="rotation">
      <SectionHead id="rotation" title={t('now.title')} em={t('now.em')} variant="sm" />
      <a className="rotation__player" href={profile.spotifyHref} target="_blank" rel="noreferrer">
        {failed
          ? <span className="rotation__fallback">{t('now.alt')}<Icon name="arrow" /></span>
          : <img src={profile.spotifyImg} alt={t('now.alt')} width={480} height={170} loading="lazy" decoding="async" onError={() => setFailed(true)} />}
      </a>
    </section>
  )
}
