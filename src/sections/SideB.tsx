import { useI18n } from '../i18n'
import { record } from '../data/record'
import { SectionHead } from '../components/SectionHead'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

/** Every other public repository, straight from the GitHub API, newest first. */
export function SideB() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap side-b" aria-labelledby="side-b">
      <div className="side-b__head">
        <SectionHead id="side-b" title={t('sideB.title')} em={t('sideB.em')} />
        <p className="side-b__lede">{t('sideB.lede')}</p>
      </div>
      <ol className="index">
        {record.sideB.map(r => (
          <li key={r.name} className="index__row">
            <span className="index__code">{r.code}</span>
            <a className="index__name" href={`https://github.com/AlexandreSJ/${r.name}`} target="_blank" rel="noreferrer">{r.name}</a>
            <span className={r.description ? 'index__desc' : 'index__desc index__desc--none'}>{r.description ?? t('sideB.none')}</span>
            <span className="index__lang">{r.language?.toLowerCase() ?? '—'}</span>
            <time className="index__date" dateTime={r.pushedAt}>{yearMonth(r.pushedAt)}</time>
            <span className="index__live">
              {r.live && <a href={r.live} target="_blank" rel="noreferrer" aria-label={`${r.name} ${t('projects.live')}`}><Icon name="arrow" /></a>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
