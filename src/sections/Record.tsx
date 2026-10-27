import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { record, type Track } from '../data/record'
import { useYears } from '../hooks/useYears'
import { useTextFx } from '../hooks/useTextFx'
import { Sleeve, type Art, type NowPlaying } from '../components/Sleeve'
import { SectionHead } from '../components/SectionHead'
import { Pill } from '../components/Pill'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

const artFor = (t: Track): Art => (t.media ? { kind: 'video', src: t.media.video } : { kind: 'type', text: t.name })

function Meta({ t }: { t: Track }) {
  const { t: tr } = useI18n()
  return (
    <dl className="track__meta">
      {t.language && <div><dt className="sr-only">language</dt><dd>{t.language.toLowerCase()}</dd></div>}
      {t.stars > 0 && <div><dt className="sr-only">{tr('projects.stars')}</dt><dd><Icon name="star" />{t.stars}</dd></div>}
      <div><dt className="sr-only">{tr('projects.updated')}</dt><dd>{tr('projects.updated')} <time dateTime={t.pushedAt}>{yearMonth(t.pushedAt)}</time></dd></div>
      {t.tags?.map(tag => <div key={tag}><dt className="sr-only">tag</dt><dd>{tag}</dd></div>)}
    </dl>
  )
}

function TrackDetail({ track, onActive }: { track: Track; onActive: (t: Track) => void }) {
  const { t } = useI18n()
  const title = useTextFx<HTMLHeadingElement>('scramble', ['view'])
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(track), { rootMargin: '-45% 0px -45% 0px' })
    io.observe(ref.current!)
    return () => io.disconnect()
  }, [track, onActive])
  return (
    <article ref={ref} id={`track-${track.name}`} className="track" aria-labelledby={`track-${track.name}-h`}>
      <div className="track__titlerow">
        <span className="track__code" aria-hidden="true">{track.code}</span>
        <h3 id={`track-${track.name}-h`} ref={title} className="track__title fx" data-text={track.name}>{track.name}</h3>
        {track.status && <Pill dot={track.status === 'building'}>{t(`status.${track.status}`)}</Pill>}
      </div>
      <p className="track__voice">{track.descKey ? t(track.descKey) : track.description}</p>
      {track.media && (
        <video className="track__media" src={track.media.video} poster={track.media.poster} aria-label={t('projects.video')}
          muted loop playsInline autoPlay preload="none" width={960} height={540} />
      )}
      <Meta t={track} />
      <p className="track__links">
        <a className="link" href={`https://github.com/AlexandreSJ/${track.name}`} target="_blank" rel="noreferrer">{t('projects.source')}<Icon name="arrow" /></a>
        {track.live && <a className="link" href={track.live} target="_blank" rel="noreferrer">{t('projects.live')}<Icon name="arrow" /></a>}
      </p>
    </article>
  )
}

/** First viewport: the sleeve (sticky) beside side A, whose tracks play on the sleeve as you read them. */
export function Record() {
  const { t } = useI18n()
  const years = useYears()
  const [active, setActive] = useState<Track | null>(null)
  const list = useRef<HTMLDivElement>(null)

  // Back at the tracklist, the sleeve returns to the cover.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: '-45% 0px -45% 0px' })
    io.observe(list.current!)
    return () => io.disconnect()
  }, [])

  const art: Art = active ? artFor(active) : { kind: 'portrait' }
  const playing: NowPlaying = active ? { code: active.code, name: active.name } : null

  return (
    <section className="lp wrap" aria-labelledby="side-a">
      <div className="lp__sleeve">
        <Sleeve art={art} playing={playing} years={years} motto={t('hero.motto')} mottoRest={t('hero.philosophy_rest')} />
      </div>
      <div className="lp__side">
        <div ref={list}>
          <SectionHead id="side-a" title={t('sideA.title')} em={t('sideA.em')} />
          <ol className="tracklist">
            {record.sideA.map(tr => (
              <li key={tr.name}>
                <a className="tracklist__row" href={`#track-${tr.name}`} aria-label={t('sideA.play', { name: tr.name })}
                  aria-current={active?.name === tr.name ? 'true' : undefined}
                  onPointerEnter={() => setActive(tr)} onFocus={() => setActive(tr)}>
                  <span className="tracklist__code">{tr.code}</span>
                  <span className="tracklist__name">{tr.name}</span>
                  <span className="tracklist__info">
                    {tr.language?.toLowerCase()}
                    {tr.live && <span className="tracklist__live">{t('projects.live')}</span>}
                    {tr.stars > 0 && <span className="tracklist__stars"><Icon name="star" />{tr.stars}</span>}
                  </span>
                  <time className="tracklist__time" dateTime={tr.pushedAt}>{yearMonth(tr.pushedAt)}</time>
                </a>
              </li>
            ))}
          </ol>
          <a className="link tracklist__more" href="#side-b">{t('sideA.more', { n: record.sideB.length })}<Icon name="arrow" /></a>
        </div>
        <div className="tracks">
          {record.sideA.map(tr => <TrackDetail key={tr.name} track={tr} onActive={setActive} />)}
        </div>
      </div>
    </section>
  )
}
