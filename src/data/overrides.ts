import type { MessageKey } from '../i18n'

export type Media = { video: string; poster: string }

/**
 * Hand-written context layered over GitHub data. A repository with no entry
 * here still appears on side B; adding `side: 'A'` features it.
 */
export type Override = {
  side?: 'A'
  order?: number
  descKey?: MessageKey
  status?: 'building' | 'live' | 'stable'
  tags?: string[]
  live?: string
  media?: Media
  hidden?: boolean
}

export const overrides: Record<string, Override> = {
  noct: {
    side: 'A', order: 1, descKey: 'projects.noct', status: 'building', tags: ['tui', 'terminal', 'multiplexer'],
    media: { video: '/media/noct.mp4', poster: '/media/noct.jpg' },
  },
  aoi: {
    side: 'A', order: 2, descKey: 'projects.aoi', status: 'stable', tags: ['tui', 'typing'],
    media: { video: '/media/aoi.mp4', poster: '/media/aoi.jpg' },
  },
  'aoi-web': {
    side: 'A', order: 3, descKey: 'projects.aoi-web', status: 'live', tags: ['web', 'typing'], live: 'https://aoi-online.vercel.app/',
    media: { video: '/media/aoi-web.mp4', poster: '/media/aoi-web.jpg' },
  },
  puddle: { side: 'A', order: 4, descKey: 'projects.puddle', status: 'stable', tags: ['rest', 'api'] },
  aelxand: { side: 'A', order: 5, descKey: 'projects.aelxand', status: 'live', tags: ['react', 'canvas'] },
  AlexandreSJ: { hidden: true },
}
