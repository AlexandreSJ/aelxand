import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { record, type Track } from '../data/record'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scramble } from '../lib/textfx'
import { Sleeve } from '../components/Sleeve'
import { SectionHead } from '../components/SectionHead'
import { Pill, LiveDot } from '../components/Pill'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

const DESKTOP = '(min-width: 901px)'
/** One wheel step per this long: a steady scroll still runs through the projects, a single notch moves exactly one. */
const WHEEL_STEP_MS = 380
/** How far off a marker still counts as on it: a smooth scroll can settle a few px short, which must not cost a notch. */
const NEAR = 12
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
        {track.status && <Pill dot={track.status === 'building'} live={track.status === 'live'}>{t(`status.${track.status}`)}</Pill>}
      </div>
      <p className="note__voice">{track.descKey ? t(track.descKey) : track.description}</p>
      <p className="note__meta">
        {track.language && <span>{track.language.toLowerCase()}</span>}
        {track.stars > 0 && <span><Icon name="star" />{track.stars}</span>}
        <span>{t('projects.updated')} <time dateTime={track.pushedAt}>{yearMonth(track.pushedAt)}</time></span>
      </p>
      <p className="note__actions">
        {track.live && <a className="btn btn--live" href={track.live} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>{t('projects.open_live')}<Icon name="arrow" /></a>}
        <a className="btn" href={`https://github.com/AlexandreSJ/${track.name}`} target="_blank" rel="noreferrer" tabIndex={on ? 0 : -1}>{t('projects.open_source')}<Icon name="arrow" /></a>
      </p>
    </article>
  )
}

/**
 * The record player. On desktop the stage is pinned while the section scrolls
 * past: each short stretch of scroll (or clicking a row) plays the next track,
 * and its note appears under the sleeve. On phones, tapping a row plays it.
 */
export function Record() {
  const { t } = useI18n()
  const [active, setActive] = useState(-1)
  const section = useRef<HTMLElement>(null)
  /** While a click's smooth scroll is on its way, the track it is heading to; steps passed on the way are ignored. */
  const heading = useRef<number | null>(null)
  const release = useRef(0)

  useEffect(() => {
    const mq = matchMedia(DESKTOP)
    let last = -2, raf = 0
    const step = () => {
      raf = 0
      const el = section.current
      if (!el) return
      let idx: number
      if (mq.matches) {
        // Desktop: the pinned section's scroll travel is split into one step per track, the first step is the cover.
        const travel = el.offsetHeight - innerHeight
        const p = travel > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel)) : 0
        idx = Math.min(tracks.length, Math.floor(p * (tracks.length + 1))) - 1
      } else {
        // Phones: the deck sticks at the top; the last row whose top has passed under its bottom edge plays.
        const line = el.querySelector('.lp__deck')!.getBoundingClientRect().bottom
        const rows = [...el.querySelectorAll<HTMLElement>('.tracklist__row')]
        idx = rows.reduce((acc, r, i) => (r.getBoundingClientRect().top < line ? i : acc), -1)
      }
      // A clicked track already plays: don't replay the ones the scroll passes, nor the target on arrival.
      if (heading.current !== null) {
        if (idx !== heading.current) return
        heading.current = null
        last = idx
        return
      }
      // Only a change of step moves the needle, so a clicked track stays put while the page is still.
      if (idx !== last) { last = idx; setActive(idx) }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(step) }
    // The visitor taking over the scroll ends the click's journey; from there the scroll drives again.
    const takeOver = () => { heading.current = null }

    // Desktop wheel: inside the pinned section each wheel gesture moves exactly one step, whatever the size of
    // the notch (Firefox and trackpads send small deltas that CSS proximity snapping kept pulling back). Steady
    // scrolling still runs through the projects, one per WHEEL_STEP_MS, and past either end the page scrolls freely.
    let lockedUntil = 0
    const onWheel = (e: WheelEvent) => {
      const el = section.current
      if (!el || !mq.matches || e.ctrlKey || e.deltaY === 0) return
      const marks = [...el.querySelectorAll<HTMLElement>('.lp__snap')].map(m => m.getBoundingClientRect().top + scrollY)
      const y = scrollY, down = e.deltaY > 0
      const first = marks[0], last = marks[marks.length - 1]
      const inside = down ? y >= first - NEAR && y < last - NEAR : y > first + NEAR && y <= last + NEAR
      if (!inside) return
      e.preventDefault()
      if (performance.now() < lockedUntil) return
      const target = down ? marks.find(m => m > y + NEAR) : marks.findLast(m => m < y - NEAR)
      if (target === undefined) return
      lockedUntil = performance.now() + WHEEL_STEP_MS
      scrollTo({ top: target, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }

    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    addEventListener('wheel', onWheel, { passive: false })
    for (const ev of ['wheel', 'touchstart', 'keydown'] as const) addEventListener(ev, takeOver, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf)
      removeEventListener('wheel', onWheel)
      for (const ev of ['wheel', 'touchstart', 'keydown'] as const) removeEventListener(ev, takeOver)
      clearTimeout(release.current)
    }
  }, [])

  /** Clicking a row on desktop scrolls to that track's step, so scroll and selection agree. */
  const choose = (i: number) => {
    setActive(i)
    const el = section.current
    if (!el || !matchMedia(DESKTOP).matches) return
    const travel = el.offsetHeight - innerHeight
    heading.current = i
    // Safety net: if the scroll never reaches the step (already there, or cut short), let the scroll drive again.
    clearTimeout(release.current)
    release.current = window.setTimeout(() => { heading.current = null }, 1500)
    scrollTo({ top: el.offsetTop + ((i + 1.5) / (tracks.length + 1)) * travel, behavior: 'smooth' })
  }

  return (
    <section ref={section} className="lp" id="projects" aria-labelledby="side-a-h" style={{ '--steps': tracks.length } as React.CSSProperties}>
      {/* Step markers, one per step: where a wheel gesture lands on desktop (see onWheel and .lp__snap). */}
      {Array.from({ length: tracks.length + 1 }, (_, k) => <span key={k} className="lp__snap" aria-hidden="true" style={{ '--k': k } as React.CSSProperties} />)}
      <div className="lp__stage wrap">
        <div className="lp__deck">
          <Sleeve tracks={tracks} active={active} motto={t('hero.motto')} mottoRest={t('hero.philosophy_rest')} />
          <div className="notes">
            {tracks.map((tr, i) => <Note key={tr.name} track={tr} on={i === active} />)}
          </div>
        </div>
        <div className="lp__side">
          <SectionHead id="side-a-h" title={t('sideA.title')} em={t('sideA.em')} variant="stack" />
          <ol className="tracklist">
            {tracks.map((tr, i) => (
              <li key={tr.name} data-on={i === active || undefined} data-past={i < active || undefined}>
                <span className="tracklist__dot" aria-hidden="true" />
                <button type="button" className="tracklist__row" data-index={i} aria-pressed={i === active}
                  aria-label={t('sideA.play', { name: tr.name })}
                  onFocus={() => setActive(i)} onClick={() => choose(i)}>
                  <span className="tracklist__code">{tr.code}</span>
                  <span className="tracklist__name">{tr.name}</span>
                  <span className="tracklist__info">
                    {tr.language?.toLowerCase()}
                    {tr.live && <span className="tracklist__live"><LiveDot />{t('projects.live')}</span>}
                    {tr.stars > 0 && <span className="tracklist__stars"><Icon name="star" />{tr.stars}</span>}
                  </span>
                  <time className="tracklist__time" dateTime={tr.pushedAt}>{yearMonth(tr.pushedAt)}</time>
                </button>
              </li>
            ))}
          </ol>
          <a className="link tracklist__more" href="#repositories">{t('sideA.more', { n: record.sideB.length })}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  )
}
