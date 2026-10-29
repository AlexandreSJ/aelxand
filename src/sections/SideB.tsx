import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { record, type Track } from '../data/record'
import { SectionHead } from '../components/SectionHead'
import { DitherLoader } from '../components/DitherLoader'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

/** Featured projects first, then the rest of GitHub, newest first. */
const repos: Track[] = [...record.sideA, ...record.sideB]

/** Fetched README HTML by repository; '' means the repository has none. */
const cache = new Map<string, string>()
/** Short enough not to slow anyone down, long enough that the loader reads as a state, not a flicker. */
const MIN_LOADING_MS = 280

type Doc = { name: string; html: string | null; failed: boolean }

/** The selected repository's README, fetched once from /readme/<name>.html (written at build time). */
function useReadme(name: string): Doc {
  const [doc, setDoc] = useState<Doc>({ name: '', html: null, failed: false })
  useEffect(() => {
    if (cache.has(name)) return
    let live = true
    const started = performance.now()
    fetch(`/readme/${name}.html`)
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(async html => {
        const wait = MIN_LOADING_MS - (performance.now() - started)
        if (wait > 0) await new Promise(res => setTimeout(res, wait))
        cache.set(name, html)
        if (live) setDoc({ name, html, failed: false })
      })
      .catch(() => { if (live) setDoc({ name, html: null, failed: true }) })
    return () => { live = false }
  }, [name])
  // A README seen before shows at once; a doc for another repository is stale, so the loader shows until this one arrives.
  if (cache.has(name)) return { name, html: cache.get(name)!, failed: false }
  return doc.name === name ? doc : { name, html: null, failed: false }
}

/**
 * Every public repository on the left; the chosen one's README on the right, in a
 * panel the selected row opens into. noct is open from the start.
 */
export function SideB() {
  const { t } = useI18n()
  const [open, setOpen] = useState(repos[0]?.name ?? '')
  const view = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const repo = repos.find(r => r.name === open)
  const doc = useReadme(open)

  /** The README's own table of contents scrolls the reader, not the page. */
  const jump = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
    const target = a && document.getElementById(a.getAttribute('href')!.slice(1))
    if (!target || !body.current) return
    e.preventDefault()
    body.current.scrollTo({ top: target.offsetTop - 16, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const choose = (name: string) => {
    setOpen(name)
    body.current?.scrollTo({ top: 0 })
    // Phones stack the reader under the list, so bring it into view.
    if (matchMedia('(max-width: 900px)').matches) view.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="sheet wrap repos" id="repositories" aria-labelledby="side-b">
      <div className="repos__head">
        <SectionHead id="side-b" title={t('sideB.title')} em={t('sideB.em')} />
        <p className="repos__lede">{t('sideB.lede')}</p>
      </div>
      <div className="repos__body">
        <ol className="repos__list">
          {repos.map(r => (
            <li key={r.name}>
              <button type="button" className="repos__row" aria-pressed={r.name === open} aria-controls="readme" onClick={() => choose(r.name)}>
                <span className="repos__code">{r.code}</span>
                <span className="repos__main">
                  <span className="repos__name">{r.name}</span>
                  <span className="repos__desc">{r.descKey ? t(r.descKey) : r.description}</span>
                </span>
                <span className="repos__meta">
                  {r.language && <span>{r.language.toLowerCase()}</span>}
                  <time dateTime={r.pushedAt}>{yearMonth(r.pushedAt)}</time>
                </span>
                <span className="repos__open">{t('repos.readme')}<Icon name="arrow" /></span>
              </button>
            </li>
          ))}
        </ol>
        {repo && (
          <div ref={view} className="repos__view" id="readme" aria-live="polite" aria-busy={doc.html === null && !doc.failed}>
            <div className="repos__bar">
              <p className="repos__title"><span>{repo.code}</span>{repo.name}<small>README.md</small></p>
              <div className="repos__actions">
                {repo.live && <a className="btn btn--live btn--sm" href={repo.live} target="_blank" rel="noreferrer">{t('projects.open_live')}<Icon name="arrow" /></a>}
                <a className="btn btn--sm" href={`https://github.com/AlexandreSJ/${repo.name}`} target="_blank" rel="noreferrer">{t('repos.github')}<Icon name="arrow" /></a>
              </div>
            </div>
            <div ref={body} className="repos__doc" tabIndex={0} aria-label={`${repo.name} README`}>
              {doc.failed
                ? <p className="repos__note">{t('repos.error')}</p>
                : doc.html === null
                  ? <DitherLoader label={t('repos.loading')} />
                  : doc.html
                    ? <div className="md" onClick={jump} dangerouslySetInnerHTML={{ __html: doc.html }} />
                    : <p className="repos__note">{t('repos.empty')}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
