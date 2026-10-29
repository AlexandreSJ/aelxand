import { useI18n } from '../i18n'
import { useTextFx } from '../hooks/useTextFx'

/**
 * The opening line. The role is marked in each locale's string with [brackets],
 * so every language can put it where its grammar wants it.
 */
export function Intro() {
  const { t } = useI18n()
  const ref = useTextFx<HTMLHeadingElement>('glitch', ['mount'])
  const text = t('hero.title')
  const [before, role, after] = text.split(/\[|\]/)
  const plain = text.replace(/\[|\]/g, '')
  return (
    <section className="intro wrap" id="top">
      <h1 ref={ref} className="intro__title fx" data-text={plain} aria-label={plain}>
        {before}<span className="intro__role">{role}</span>{after}
      </h1>
    </section>
  )
}
