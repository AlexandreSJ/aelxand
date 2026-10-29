import {
  siAngular, siBun, siDocker, siFastify, siGin, siGit, siGo, siHono, siIonic, siLinux, siMongodb, siNextdotjs, siNodedotjs,
  siOpenjdk, siPostgresql, siReact, siRedis, siSpringboot, siTailwindcss, siTypescript, siVercel, siVite,
} from 'simple-icons'
import { record } from './record'

export type Layer = 'backend' | 'data' | 'frontend' | 'tui' | 'infra'
type Icon = { path: string; hex: string }

export type Tech = {
  name: string
  layer: Layer
  /** Brand mark; tools without one get a type monogram instead. */
  icon?: Icon
  /** GitHub language whose repositories count as using it. */
  lang?: string
  /** Repositories that use it, checked against their package.json / go.mod. */
  repos?: string[]
}

const tech: Tech[] = [
  { name: 'Go', layer: 'backend', icon: siGo, lang: 'Go' },
  { name: 'Gin', layer: 'backend', icon: siGin, repos: ['puddle'] },
  { name: 'Java', layer: 'backend', icon: siOpenjdk },
  { name: 'Spring Boot', layer: 'backend', icon: siSpringboot },
  { name: 'Node.js', layer: 'backend', icon: siNodedotjs, repos: ['web-dj'] },
  { name: 'Bun', layer: 'backend', icon: siBun, repos: ['aelxand', 'aoi-web', 'web-dj'] },
  { name: 'Hono', layer: 'backend', icon: siHono, repos: ['web-dj'] },
  { name: 'Fastify', layer: 'backend', icon: siFastify },
  { name: 'PostgreSQL', layer: 'data', icon: siPostgresql },
  { name: 'MongoDB', layer: 'data', icon: siMongodb },
  { name: 'Redis', layer: 'data', icon: siRedis },
  { name: 'TypeScript', layer: 'frontend', icon: siTypescript, lang: 'TypeScript' },
  { name: 'React', layer: 'frontend', icon: siReact, repos: ['aelxand', 'aoi-web'] },
  { name: 'Next.js', layer: 'frontend', icon: siNextdotjs },
  { name: 'Angular', layer: 'frontend', icon: siAngular },
  { name: 'Ionic', layer: 'frontend', icon: siIonic },
  { name: 'Vite', layer: 'frontend', icon: siVite, repos: ['aelxand'] },
  { name: 'Tailwind', layer: 'frontend', icon: siTailwindcss, repos: ['aoi-web'] },
  { name: 'Bubble Tea', layer: 'tui', repos: ['aoi'] },
  { name: 'Lip Gloss', layer: 'tui', repos: ['noct', 'aoi'] },
  { name: 'Docker', layer: 'infra', icon: siDocker },
  { name: 'Vercel', layer: 'infra', icon: siVercel, repos: ['aelxand', 'aoi-web'] },
  { name: 'Git', layer: 'infra', icon: siGit },
  { name: 'Linux', layer: 'infra', icon: siLinux },
]

const all = [...record.sideA, ...record.sideB]

/** The repositories a tool shows up in: by language from GitHub, plus the checked list. */
export function reposFor(t: Tech): string[] {
  const byLang = t.lang ? all.filter(r => r.language === t.lang).map(r => r.name) : []
  return [...new Set([...byLang, ...(t.repos ?? [])])]
}

export const stack = tech
