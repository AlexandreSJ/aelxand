import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { SectionHead } from '../components/SectionHead'
import { Crt, type CrtLine } from '../components/Crt'

export function About() {
  const { t } = useI18n()
  const lines: CrtLine[] = [
    { kind: 'prompt', text: 'cat who.md' },
    { kind: 'head', text: `# ${profile.handle}` },
    ...(['about.l1', 'about.l2', 'about.l3', 'about.l4', 'about.l5'] as const).map(k => ({ kind: 'text' as const, text: `- ${t(k)}` })),
    { kind: 'text', text: '' },
    { kind: 'head', text: '## philosophy' },
    { kind: 'text', text: `*${profile.motto}*` },
  ]
  return (
    <section className="sheet wrap" aria-labelledby="about">
      <SectionHead id="about" no="01" title={t('about.title')} em={t('about.em')} />
      <Crt label="who.md" lines={lines} />
    </section>
  )
}
