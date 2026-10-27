import type { MessageKey } from '../i18n'
import generated from './repos.generated.json'

export type RepoMeta = { stars: number; language: string | null; pushedAt: string }
export type Project = {
  id: string
  repo: string
  descKey: MessageKey
  status: 'building' | 'live' | 'stable'
  tags: string[]
  live?: string
}
export type ProjectView = Project & Partial<RepoMeta>

export const projects: Project[] = [
  { id: 'noct', repo: 'noct', descKey: 'projects.noct', status: 'building', tags: ['tui', 'terminal', 'multiplexer'] },
  { id: 'aoi', repo: 'aoi', descKey: 'projects.aoi', status: 'stable', tags: ['go', 'bubble tea', 'lipgloss'] },
  { id: 'aoi-web', repo: 'aoi-web', descKey: 'projects.aoi-web', status: 'live', tags: ['web', 'typing'], live: 'https://aoi-online.vercel.app/' },
  { id: 'puddle', repo: 'puddle', descKey: 'projects.puddle', status: 'stable', tags: ['go', 'gin', 'rest'] },
  { id: 'aelxand', repo: 'aelxand', descKey: 'projects.aelxand', status: 'live', tags: ['react', 'vite', 'canvas'] },
]

export function projectViews(list: Project[], meta: Record<string, RepoMeta>): ProjectView[] {
  return list.map(p => ({ ...p, ...meta[p.repo] }))
}

export const views: ProjectView[] = projectViews(projects, generated as Record<string, RepoMeta>)
