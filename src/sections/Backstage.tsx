import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { useYears } from '../hooks/useYears'
import { SectionHead } from '../components/SectionHead'
import { Terminal } from '../components/Terminal'
import { Icon } from '../components/Icon'

export function Backstage() {
  const { t } = useI18n()
  const years = useYears()
  const credits: [string, string][] = [
    [t('liner.working'), t('liner.working_v', { n: years })],
    [t('liner.degree'), t('experience.degree')],
    [t('liner.languages'), t('liner.languages_v')],
    [t('liner.based'), t('liner.based_v')],
  ]
  return (
    <section className="sheet wrap backstage" id="backstage" aria-labelledby="backstage-h">
      <SectionHead id="backstage-h" title={t('liner.title')} em={t('liner.em')} variant="rail" />
      <div className="backstage__grid">
        <Terminal file="stacks.md" stacks={profile.stacks} path="/home/aelxand" />
        <div>
          <dl className="specs">
            {credits.map(([k, v]) => <div key={k} className="specs__row"><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <a className="link backstage__history" href={profile.linkedin} target="_blank" rel="noreferrer">{t('liner.history')}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  )
}
