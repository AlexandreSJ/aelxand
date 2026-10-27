import { useState } from 'react'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Button } from '../components/Button'

export function Contact() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard.writeText(profile.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400) })
  return (
    <section className="sheet wrap" aria-labelledby="contact">
      <SectionHead id="contact" no="07" title={t('contact.title')} em={t('contact.em')} />
      <p className="contact__lede">{t('contact.lede')}</p>
      <dl className="specs">
        {profile.email && (
          <div className="specs__row">
            <dt className="label">{t('contact.email')}</dt>
            <dd className="contact__email"><a className="mono" href={`mailto:${profile.email}`}>{profile.email}</a>
              <Button size="sm" onClick={copy}>{copied ? t('contact.copied') : t('contact.copy')}</Button></dd>
          </div>
        )}
        <div className="specs__row"><dt className="label">github</dt><dd><a className="mono" href={profile.github}>AlexandreSJ ↗</a></dd></div>
        <div className="specs__row"><dt className="label">linkedin</dt><dd><a className="mono" href={profile.linkedin}>alexandre-da-silva-junior ↗</a></dd></div>
        <div className="specs__row"><dt className="label">coffee</dt><dd><a className="mono" href={profile.coffee}>buymeacoffee.com/aelxand ↗</a></dd></div>
      </dl>
    </section>
  )
}
