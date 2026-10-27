import { useState } from 'react'
import { useI18n } from '../i18n'
import { record, type Track } from '../data/record'
import { SectionHead } from '../components/SectionHead'
import { Disc } from '../components/Disc'
import { Icon } from '../components/Icon'
import { yearMonth } from '../lib/month'

/** Side B, the mirrored spread: the full GitHub index on the left, the B-side disc on the right labelled with the row under the pointer. */
export function SideB() {
  const { t } = useI18n()
  const [hover, setHover] = useState<Track | null>(null)
  const first = record.sideB[0]
  const last = record.sideB[record.sideB.length - 1]
  return (
    <section className="sheet wrap side-b" aria-labelledby="side-b">
      <div className="side-b__list">
        <div className="side-b__head">
          <SectionHead id="side-b" title={t('sideB.title')} em={t('sideB.em')} />
          <p className="side-b__lede">{t('sideB.lede')}</p>
        </div>
        <ol className="index" onPointerLeave={() => setHover(null)}>
          {record.sideB.map(r => (
            <li key={r.name} className="index__row" data-active={hover?.name === r.name || undefined}
              onPointerEnter={() => setHover(r)} onFocus={() => setHover(r)}>
              <span className="index__code">{r.code}</span>
              <a className="index__name" href={`https://github.com/AlexandreSJ/${r.name}`} target="_blank" rel="noreferrer">{r.name}</a>
              <span className="index__desc">{r.description}</span>
              <span className="index__lang">{r.language?.toLowerCase()}</span>
              <time className="index__date" dateTime={r.pushedAt}>{yearMonth(r.pushedAt)}</time>
              <span className="index__live">
                {r.live && <a href={r.live} target="_blank" rel="noreferrer" aria-label={`${r.name} ${t('projects.live')}`}><Icon name="arrow" /></a>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="side-b__disc">
        <Disc className="disc--b">
          <span>{hover ? hover.code : 'Side B'}</span>
          <b>{hover ? hover.name : `${first?.code}–${last?.code}`}</b>
        </Disc>
      </div>
    </section>
  )
}
