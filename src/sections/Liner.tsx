import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { useYears } from '../hooks/useYears'
import { SectionHead } from '../components/SectionHead'
import { Crt, type CrtLine } from '../components/Crt'
import { Icon } from '../components/Icon'

/** The record's insert: who.md on a terminal beside the credits. */
export function Liner() {
  const { t } = useI18n()
  const years = useYears()
  const lines: CrtLine[] = [
    { kind: 'prompt', text: 'cat who.md' },
    { kind: 'head', text: '# AlexandreSJ' },
    ...(['about.l1', 'about.l2', 'about.l3', 'about.l4', 'about.l5'] as const).map(k => ({ kind: 'text' as const, text: `- ${t(k)}` })),
    { kind: 'text', text: '' },
    { kind: 'head', text: `## ${t('liner.philosophy')}` },
    { kind: 'text', text: `*${t('hero.motto')}*` },
  ]
  const credits: [string, React.ReactNode][] = [
    [t('liner.working'), t('liner.working_v', { n: years })],
    [t('liner.degree'), t('experience.degree')],
    [t('liner.languages'), t('liner.languages_v')],
    [t('liner.based'), t('liner.based_v')],
  ]
  return (
    <section className="sheet wrap liner" aria-labelledby="liner">
      <SectionHead id="liner" title={t('liner.title')} em={t('liner.em')} variant="rail" />
      <div className="liner__grid">
        <Crt label="who.md" meta="80×24 · utf-8" lines={lines} />
        <div className="liner__credits">
          <dl className="specs">
            {credits.map(([k, v]) => (
              <div key={k} className="specs__row"><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <a className="link liner__history" href={profile.linkedin} target="_blank" rel="noreferrer">{t('liner.history')}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  )
}
