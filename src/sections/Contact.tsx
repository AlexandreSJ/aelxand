import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { Icon } from '../components/Icon'
import { SectionHead } from '../components/SectionHead'

/** The back cover: where to find him. */
export function Contact() {
  const { t } = useI18n()
  const links: [string, string, string][] = [
    ['linkedin', profile.linkedin, 'in/alexandre-da-silva-junior'],
    ['github', profile.github, 'AlexandreSJ'],
    ['coffee', profile.coffee, 'buymeacoffee.com/aelxand'],
  ]
  return (
    <section className="sheet wrap back" id="contact" aria-labelledby="contact-h">
      <SectionHead id="contact-h" title={t('contact.title')} em={t('contact.em')} />
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
    </section>
  )
}
