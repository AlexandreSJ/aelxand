import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'

export function Stack() {
  const { t } = useI18n()
  return (
    <section className="sheet wrap" aria-labelledby="stack">
      <SectionHead id="stack" no="04" title={t('stack.title')} em={t('stack.em')} />
      <dl className="specs">
        {profile.stack.map(g => (
          <div key={g.key} className="specs__row">
            <dt className="label">{t(g.key)}</dt>
            <dd className="mono">{g.items.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
