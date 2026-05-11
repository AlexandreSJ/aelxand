import { useI18n } from '../contexts/I18nContext'
import { profile } from '../data/profile'

interface Props {
  className?: string
}

export function StackBadges({ className = '' }: Props) {
  const { t } = useI18n()

  return (
    <div className={`stack-badges ${className}`}>
      {profile.stack.map(category => (
        <div key={category.key} className="stack-badges__category">
          <div className="stack-badges__label">{t(category.key)}</div>
          <div className="stack-badges__items">
            {category.items.map(item => (
              <span key={item.name} className="stack-badges__chip">
                <i className={item.icon} />
                <span>{item.name}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
