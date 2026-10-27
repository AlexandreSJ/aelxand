import type { MessageKey } from '../i18n'

export type StackGroup = { key: MessageKey; items: string[] }
export type OfflineItem = { key: MessageKey; descKey: MessageKey }

export const profile = {
  name: 'Alexandre da Silva Junior',
  handle: 'AlexandreSJ',
  motto: 'I want people to thrive with me',
  email: '',
  github: 'https://github.com/AlexandreSJ',
  linkedin: 'https://www.linkedin.com/in/alexandre-da-silva-junior/',
  coffee: 'https://buymeacoffee.com/aelxand',
  spotifyHref: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&redirect=true',
  spotifyImg: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&cover_image=true&theme=natemoo-re&show_offline=false&background_color=0b0a0d&interchange=true&profanity=true&hide_remaster=false&bar_color=ee0022&bar_color_cover=false',
  stack: [
    { key: 'stack.frontend', items: ['React', 'Angular', 'Ionic', 'Next.js', 'Vite'] },
    { key: 'stack.backend', items: ['Go', 'Spring', 'Node.js', 'Fastify', 'Bun'] },
    { key: 'stack.data', items: ['Postgres', 'MongoDB', 'Redis'] },
    { key: 'stack.tools', items: ['Docker', 'Git', 'Linux'] },
  ] satisfies StackGroup[],
  offline: [
    { key: 'offline.dnd', descKey: 'offline.dnd_d' },
    { key: 'offline.music', descKey: 'offline.music_d' },
    { key: 'offline.pixel', descKey: 'offline.pixel_d' },
    { key: 'offline.languages', descKey: 'offline.languages_d' },
  ] satisfies OfflineItem[],
}
