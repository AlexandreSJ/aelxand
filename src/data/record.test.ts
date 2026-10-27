import { describe, expect, it } from 'vitest'
import { pressRecord, type Repo } from './record'
import type { Override } from './overrides'

const repo = (name: string, pushedAt: string, extra: Partial<Repo> = {}): Repo =>
  ({ name, description: null, language: 'Go', stars: 0, pushedAt, homepage: null, fork: false, ...extra })

const repos: Repo[] = [
  repo('old', '2023-01-01T00:00:00Z'),
  repo('noct', '2026-10-25T00:00:00Z', { stars: 3 }),
  repo('fresh', '2026-10-26T00:00:00Z', { homepage: 'https://fresh.example' }),
  repo('aoi', '2026-05-25T00:00:00Z'),
  repo('forked', '2026-10-27T00:00:00Z', { fork: true }),
  repo('AlexandreSJ', '2026-10-27T00:00:00Z'),
]
const overrides: Record<string, Override> = {
  aoi: { side: 'A', order: 2, live: 'https://aoi.example' },
  noct: { side: 'A', order: 1 },
  AlexandreSJ: { hidden: true },
}

describe('pressRecord', () => {
  const { sideA, sideB } = pressRecord(repos, overrides)

  it('puts curated repos on side A in their chosen order', () => {
    expect(sideA.map(t => [t.code, t.name])).toEqual([['A1', 'noct'], ['A2', 'aoi']])
  })
  it('puts every other public repo on side B, newest first', () => {
    expect(sideB.map(t => [t.code, t.name])).toEqual([['B1', 'fresh'], ['B2', 'old']])
  })
  it('drops forks and hidden repos', () => {
    const names = [...sideA, ...sideB].map(t => t.name)
    expect(names).not.toContain('forked')
    expect(names).not.toContain('AlexandreSJ')
  })
  it('prefers the curated live link and falls back to the GitHub homepage', () => {
    expect(sideA[1].live).toBe('https://aoi.example')
    expect(sideB[0].live).toBe('https://fresh.example')
  })
  it('keeps GitHub stats on curated tracks', () => {
    expect(sideA[0].stars).toBe(3)
  })
})
