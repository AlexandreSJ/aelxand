import { describe, expect, it } from 'vitest'
import { projectViews, projects } from './projects'

describe('projectViews', () => {
  it('keeps local order and copy when GitHub data is missing', () => {
    const v = projectViews(projects, {})
    expect(v.map(p => p.id)).toEqual(projects.map(p => p.id))
    expect(v[0].stars).toBeUndefined()
  })
  it('merges GitHub metadata by repo name', () => {
    const v = projectViews(projects, { noct: { stars: 7, language: 'Go', pushedAt: '2026-10-01T00:00:00Z' } })
    expect(v.find(p => p.id === 'noct')).toMatchObject({ stars: 7, language: 'Go' })
  })
  it('lists the README projects', () => {
    expect(projects.map(p => p.id)).toEqual(['noct', 'aoi', 'aoi-web', 'puddle', 'aelxand'])
  })
})
