import type { MessageKey } from '../i18n'

export type OfflineItem = { key: MessageKey; descKey: MessageKey }

export const profile = {
  name: 'Alexandre da Silva Junior',
  handle: 'AlexandreSJ',
  email: '',
  github: 'https://github.com/AlexandreSJ',
  linkedin: 'https://www.linkedin.com/in/alexandre-da-silva-junior/',
  coffee: 'https://buymeacoffee.com/aelxand',
  spotifyHref: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&redirect=true',
  spotifyImg: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&cover_image=true&theme=natemoo-re&show_offline=false&background_color=15121a&interchange=true&profanity=true&hide_remaster=false&bar_color=ee0022&bar_color_cover=false',
  /** Everything the ticker cycles through: languages from the repositories plus tools used in them. */
  marquee: ['Go', 'TypeScript', 'React', 'Java', 'Spring Boot', 'Node.js', 'Next.js', 'Bun', 'Angular', 'PostgreSQL', 'Ionic', 'MongoDB',
    'Fastify', 'Redis', 'Hono', 'Docker', 'Gin', 'Vite', 'Bubble Tea', 'Git', 'Lip Gloss', 'Linux', 'JavaScript', 'Vercel', 'R', 'Vitest',
    'REST', 'Canvas'],
  offline: [
    { key: 'offline.dnd', descKey: 'offline.dnd_d' },
    { key: 'offline.music', descKey: 'offline.music_d' },
    { key: 'offline.pixel', descKey: 'offline.pixel_d' },
    { key: 'offline.languages', descKey: 'offline.languages_d' },
  ] satisfies OfflineItem[],
}
