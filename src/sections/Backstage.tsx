import { useI18n } from '../i18n'
import { profile } from '../data/profile'
import { record } from '../data/record'
import { useYears } from '../hooks/useYears'
import { SectionHead } from '../components/SectionHead'
import { Terminal, type Line } from '../components/Terminal'
import { Icon } from '../components/Icon'

const repos = record.sideA.length + record.sideB.length

/** Real names and counts; the stream is texture, the credits beside it are the content. */
const SCRIPT: Line[] = [
  { cmd: 'whoami', out: 'aelxand' },
  { cmd: 'grep ^NAME /etc/os-release', out: 'NAME="Arch Linux"   # btw' },
  { cmd: 'cd ~/projects/noct && go build ./...', out: 'ok' },
  { cmd: 'noct run release --flow ci', out: '[flow] build ok · test ok · ship ok' },
  { cmd: 'aoi --time 30', out: 'the quick brown fox jumps over the lazy dog_' },
  { cmd: `gh repo list ${profile.handle} --source | wc -l`, out: String(repos) },
  { cmd: 'cd ~/projects/puddle && go run .', out: '[GIN] listening on :8080' },
  { cmd: 'curl -s localhost:8080/ping', out: '{"message":"pong"}' },
  { cmd: 'cd ~/projects/aelxand && bun run build', out: 'prerender: pt, en, es, ja' },
  { cmd: 'ls ~/projects', out: record.sideA.map(t => t.name).join('  ') },
  { cmd: 'git log --oneline -1', out: 'feat: press side A' },
  { cmd: 'clear' },
]

export function Backstage() {
  const { t } = useI18n()
  const years = useYears()
  const credits: [string, string][] = [
    [t('liner.working'), t('liner.working_v', { n: years })],
    [t('liner.degree'), t('experience.degree')],
    [t('liner.languages'), t('liner.languages_v')],
    [t('liner.based'), t('liner.based_v')],
  ]
  return (
    <section className="sheet wrap backstage" aria-labelledby="backstage">
      <SectionHead id="backstage" title={t('liner.title')} em={t('liner.em')} variant="rail" />
      <div className="backstage__grid">
        <Terminal script={SCRIPT} path="/home/aelxand" />
        <div>
          <dl className="specs">
            {credits.map(([k, v]) => <div key={k} className="specs__row"><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <a className="link backstage__history" href={profile.linkedin} target="_blank" rel="noreferrer">{t('liner.history')}<Icon name="arrow" /></a>
        </div>
      </div>
    </section>
  )
}
