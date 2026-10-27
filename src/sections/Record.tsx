import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { record, type Track } from '../data/record'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scramble } from '../lib/textfx'
import { Sleeve } from '../components/Sleeve'
import { SectionHead } from '../components/SectionHead'
import { Pill } from '../components/Pill'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

const DESKTOP = '(min-width: 901px)'
const tracks = record.sideA

/** One track's sleeve note: always in the DOM (pre-rendered), shown while active. */
function Note({ track, on }: { track: Track; on: boolean }) {
  const { t } = useI18n()
  const title = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  // The title scrambles in each time this track starts playing.
  useEffect(() => {
    if (on && title.current && !reduced) return scramble(title.current)
  }, [on, reduced])
  return (
    <article className="note" data-on={on || undefined} aria-hidden={!on} id={`track-${track.name}`}>
      <div className="note__row">
        <span className="note__code">{track.code}</span>
        <h3 ref={title} className="note__title fx" data-text={track.name}>{track.name}</h3>
        {track.status && <Pill dot={track.status === 'building'}>{t(`status.${track.status}`)}</Pill>}
      </div>
      <p className="note__voice">{track.descKey ? t(track.descKey) : track.description}</p>
      <p className="note__meta">
        {track.language && <span>{track.language.toLowerCase()}</span>}
        {track.stars > 0 && <span><Icon name="star" />{track.stars}</span>}
        <span>{t('projects.updated')} <time dateTime={track.pushedAt}>{yearMonth(track.pushedAt)}</time></span>
        <a className="link" href={`https://github.com/AlexandreSJ/${track.name}`} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>{t('projects.source')}<Icon name="arrow" /></a>
        {track.live && <a className="link" href={track.live} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>{t('projects.live')}<Icon name="arrow" /></a>}
      </p>
    </article>
  )
}

/**
 * The record player. On desktop the stage is pinned while the section scrolls
 * past: each short stretch of scroll (or hovering a row) plays the next track,
 * and its note appears under the sleeve. On phones, tapping a row plays it.
 */
export function Record() {
  const { t } = useI18n()
  const [active, setActive] = useState(-1)
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const mq = matchMedia(DESKTOP)
    let last = -2, raf = 0
    const step = () => {
      raf = 0
      const el = section.current
      if (!el || !mq.matches) return
      const travel = el.offsetHeight - innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel)) : 0
      const idx = Math.min(tracks.length, Math.floor(p * (tracks.length + 1))) - 1
      // Only a change of scroll step moves the needle, so a hovered track stays put while the page is still.
      if (idx !== last) { last = idx; setActive(idx) }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(step) }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  /** Clicking a row on desktop scrolls to that track's step, so scroll and selection agree. */
  const choose = (i: number) => {
    setActive(i)
    const el = section.current
    if (!el || !matchMedia(DESKTOP).matches) return
    const travel = el.offsetHeight - innerHeight
    scrollTo({ top: el.offsetTop + ((i + 1.5) / (tracks.length + 1)) * travel, behavior: 'smooth' })
  }

  return (
    <section ref={section} className="lp" aria-labelledby="side-a" style={{ '--steps': tracks.length } as React.CSSProperties}>
      <div className="lp__stage wrap">
        <div className="lp__deck">
          <Sleeve tracks={tracks} active={active} motto={t('hero.motto')} mottoRest={t('hero.philosophy_rest')} />
          <div className="notes">
            <p className="note note--cover" data-on={active < 0 || undefined}>{t('sideA.hint')}</p>
            {tracks.map((tr, i) => <Note key={tr.name} track={tr} on={i === active} />)}
          </div>
        </div>
        <div className="lp__side">
          <SectionHead id="side-a" title={t('sideA.title')} em={t('sideA.em')} />
          <ol className="tracklist">
            {tracks.map((tr, i) => (
              <li key={tr.name}>
                <button type="button" className="tracklist__row" aria-pressed={i === active}
                  aria-label={t('sideA.play', { name: tr.name })}
                  onPointerEnter={e => e.pointerType === 'mouse' && setActive(i)} onFocus={() => setActive(i)} onClick={() => choose(i)}>
                  <span className="tracklist__code">{tr.code}</span>
                  <span className="tracklist__name">{tr.name}</span>
                  <span className="tracklist__info">
                    {tr.language?.toLowerCase()}
                    {tr.live && <span className="tracklist__live">{t('projects.live')}</span>}
                    {tr.stars > 0 && <span className="tracklist__stars"><Icon name="star" />{tr.stars}</span>}
                  </span>
                  <time className="tracklist__time" dateTime={tr.pushedAt}>{yearMonth(tr.pushedAt)}</time>
                </button>
              </li>
            ))}
          </ol>
          <a className="link tracklist__more" href="#side-b">{t('sideA.more', { n: record.sideB.length })}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  )
}
