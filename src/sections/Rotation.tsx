import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'
import { Disc } from '../components/Disc'

/**
 * The text link is the default; the external widget replaces it only once it
 * has actually loaded, so the box is never empty while loading or on failure.
 * The page's only vinyl slides half out from behind it.
 */
export function Rotation() {
  const { t } = useI18n()
  const img = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  // The image can finish loading before hydration attaches onLoad.
  useEffect(() => {
    const el = img.current
    if (el?.complete && el.naturalWidth > 0) setLoaded(true)
  }, [])
  return (
    <section className="sheet rotation" aria-labelledby="rotation">
      <div className="rotation__head">
        <span className="eq" aria-hidden="true"><i /><i /><i /></span>
        <SectionHead id="rotation" title={t('now.title')} em={t('now.em')} variant="sm" />
      </div>
      <div className="rotation__deck">
        <Disc><b>aelx</b><span>33⅓</span></Disc>
        <a className="rotation__player" href={profile.spotifyHref} target="_blank" rel="noreferrer" data-loaded={loaded || undefined}>
          <img ref={img} src={profile.spotifyImg} alt={t('now.alt')} width={480} height={170} decoding="async"
            onLoad={e => e.currentTarget.naturalWidth > 0 && setLoaded(true)} />
          <span className="rotation__fallback">{t('now.alt')}<Icon name="arrow" /></span>
        </a>
      </div>
    </section>
  )
}
