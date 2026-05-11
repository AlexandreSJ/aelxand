import { useI18n } from '../contexts/I18nContext'
import { profile } from '../data/profile'

interface Props {
  className?: string
  variant?: 'buttons' | 'icons' | 'minimal'
}

export function ContactLinks({ className = '', variant = 'buttons' }: Props) {
  const { t } = useI18n()

  return (
    <div className={`contact-links contact-links--${variant} ${className}`}>
      {profile.contact.map(link => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-links__item"
          title={t(link.labelKey)}
        >
          <i className={`${link.icon} contact-links__icon`} />
          {variant !== 'icons' && (
            <span className="contact-links__label">{t(link.labelKey)}</span>
          )}
        </a>
      ))}
    </div>
  )
}
