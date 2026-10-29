import generated from './repos.generated.json'
import { overrides as curated, type Override } from './overrides'

export type Repo = {
  name: string
  description: string | null
  language: string | null
  stars: number
  pushedAt: string
  homepage: string | null
  fork: boolean
}

export type Track = Repo & Omit<Override, 'live'> & { code: string; live: string | null }

/** Split public repositories into curated featured projects (side A) and the automatic rest (side B), numbered 01… across both. */
export function pressRecord(repos: Repo[], overrides: Record<string, Override>): { sideA: Track[]; sideB: Track[] } {
  const visible = repos.filter(r => !r.fork && !overrides[r.name]?.hidden)
  const track = (r: Repo, code: string): Track => {
    const o = overrides[r.name] ?? {}
    return { ...r, ...o, code, live: o.live ?? r.homepage }
  }
  const a = visible
    .filter(r => overrides[r.name]?.side === 'A')
    .sort((x, y) => (overrides[x.name].order ?? 99) - (overrides[y.name].order ?? 99))
  const b = visible
    .filter(r => overrides[r.name]?.side !== 'A')
    .sort((x, y) => y.pushedAt.localeCompare(x.pushedAt))
  const code = (i: number) => String(i + 1).padStart(2, '0')
  return { sideA: a.map((r, i) => track(r, code(i))), sideB: b.map((r, i) => track(r, code(a.length + i))) }
}

export const record = pressRecord(generated as Repo[], curated)
