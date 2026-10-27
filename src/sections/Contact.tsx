import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { record } from '../data/record'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'

/** Bars derived from the catalog string, so the strip is stable and specific to this record. */
function Barcode({ text }: { text: string }) {
  let x = 0
  const bars = [...text].flatMap((c, i) => {
    const w = 1 + (c.charCodeAt(0) % 3), gap = 1 + ((c.charCodeAt(0) >> 2) % 2)
    const r = <rect key={i} x={x} y={0} width={w} height={40} />
    x += w + gap
    return [r]
  })
  return <svg className="back__barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">{bars}</svg>
}

/** The back cover: catalog block and reprinted tracklist beside where to find him. */
export function Contact() {
  const { t } = useI18n()
  const links: [string, string, string][] = [
    ['linkedin', profile.linkedin, 'in/alexandre-da-silva-junior'],
    ['github', profile.github, 'AlexandreSJ'],
    ['coffee', profile.coffee, 'buymeacoffee.com/aelxand'],
  ]
  const b = record.sideB
  return (
    <section className="sheet wrap back" id="contact" aria-labelledby="contact-h">
      <div className="back__panel">
        <div className="back__cat"><span>AELX-001</span><span>AlexandreSJ</span></div>
        <div className="back__sides">
          <div>
            <p className="back__side">{t('sideA.title')}</p>
            <ol>{record.sideA.map(tr => <li key={tr.name}><i>{tr.code}</i>{tr.name}</li>)}</ol>
          </div>
          <div>
            <p className="back__side">{t('sideB.title')}</p>
            <ol>
              {b.slice(0, 5).map(tr => <li key={tr.name}><i>{tr.code}</i>{tr.name}</li>)}
              {b.length > 5 && <li><i>…</i>{`${b[5].code}–${b[b.length - 1].code}`}</li>}
            </ol>
          </div>
        </div>
        <div className="back__print">
          <Barcode text="AELX-001-ALEXANDRESJ-2022" />
          <span>{t('back.printed')}</span>
        </div>
      </div>
      <div className="back__contact">
        <SectionHead id="contact-h" title={t('contact.title')} em={t('contact.em')} variant="xl" />
        <p className="back__lede">{t('contact.lede')}</p>
        <ul className="back__links">
          {links.map(([k, href, label]) => (
            <li key={k}>
              <a href={href} target="_blank" rel="noreferrer">
                <span className="back__k">{k}</span>
                <span className="back__v">{label}</span>
                <Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
