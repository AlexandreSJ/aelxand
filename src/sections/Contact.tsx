import { Fragment } from 'react'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'

/** Allow a line break only right after each "/", so URLs wrap as whole segments. */
function breakAfterSlash(label: string) {
  const parts = label.split('/')
  return parts.map((part, i) => (i < parts.length - 1 ? <Fragment key={i}>{part}/<wbr /></Fragment> : part))
}

export function Contact() {
  const { t } = useI18n()
  const links: [string, string, string][] = [
    ['github', profile.github, 'AlexandreSJ'],
    ['linkedin', profile.linkedin, 'in/alexandre-da-silva-junior'],
    ['coffee', profile.coffee, 'buymeacoffee.com/aelxand'],
  ]
  return (
    <section className="sheet contact" id="contact" aria-labelledby="contact-h">
      <SectionHead id="contact-h" title={t('contact.title')} em={t('contact.em')} variant="sm" />
      <ul className="contact__links">
        {links.map(([k, href, label]) => (
          <li key={k}>
            <a href={href} target="_blank" rel="noreferrer">
              <span className="contact__k">{k}</span>
              <span className="contact__v">{breakAfterSlash(label)}</span>
              <Icon name="arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
