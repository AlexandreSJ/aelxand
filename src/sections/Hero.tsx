import { useTextFx } from '../hooks/useTextFx'
import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { Button } from '../components/Button'
import { Portrait } from '../components/Portrait'

export function Hero() {
  const { t } = useI18n()
  const name = useTextFx<HTMLHeadingElement>('glitch', ['mount', 'hover'])
  return (
    <section className="hero wrap" id="top" aria-labelledby="hero-name">
      <div className="hero__text">
        <p className="label">{t('hero.label')}</p>
        <h1 id="hero-name" ref={name} className="hero__name fx" data-text={profile.handle}>{profile.handle}</h1>
        <p className="hero__status"><b>&gt;</b> {t('hero.status')}</p>
        <p className="hero__philo"><b>{profile.motto}</b>{t('hero.philosophy_rest')}</p>
        <div className="hero__cta">
          <Button variant="red" href="#projects">{t('hero.cta_projects')}</Button>
          <Button href={profile.github}>github ↗</Button>
        </div>
      </div>
      <Portrait src="/portrait.jpg" alt={t('hero.portrait_alt')} />
    </section>
  )
}
