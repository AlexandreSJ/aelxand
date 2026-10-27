import { useI18n } from '../i18n'
import { experience } from '../data/experience'
import { SectionHead } from '../components/SectionHead'

export function Experience() {
  const { t, locale } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="experience">
      <SectionHead id="experience" no="03" title={t('experience.title')} em={t('experience.em')} />
      <ol className="log">
        {experience.map(e => (
          <li key={`${e.start}-${e.org}`} className="log__row">
            <span className="log__when mono">{e.start}{e.end !== undefined && ` — ${e.end || t('experience.present')}`}</span>
            <div>
              <b className="log__role">{e.roleKey ? t(e.roleKey) : e.role![locale] ?? e.role!.en}</b>
              {e.org && <span className="log__org"> · {e.org}</span>}
              {e.result && <p className="log__result">{e.result[locale] ?? e.result.en}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
