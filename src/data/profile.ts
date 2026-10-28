
export const profile = {
  name: 'Alexandre da Silva Junior',
  handle: 'AlexandreSJ',
  email: '',
  github: 'https://github.com/AlexandreSJ',
  linkedin: 'https://www.linkedin.com/in/alexandre-da-silva-junior/',
  coffee: 'https://buymeacoffee.com/aelxand',
  spotifyHref: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&redirect=true',
  spotifyImg: 'https://spotify-github-profile.kittinanx.com/api/view?uid=31qxydlur4yyxhsxfputmv56a66u&cover_image=true&theme=natemoo-re&show_offline=false&background_color=0b0a0d&interchange=true&profanity=true&hide_remaster=false&bar_color=ee0022&bar_color_cover=false',
  /** Everything the ticker cycles through: languages from the repositories plus tools used in them. */
  marquee: ['Go', 'TypeScript', 'React', 'Java', 'Spring Boot', 'Node.js', 'Next.js', 'Bun', 'Angular', 'PostgreSQL', 'Ionic', 'MongoDB',
    'Fastify', 'Redis', 'Hono', 'Docker', 'Gin', 'Vite', 'Bubble Tea', 'Git', 'Lip Gloss', 'Linux', 'JavaScript', 'Vercel', 'Vitest',
    'REST'],
  /** What the backstage terminal cats: the main stacks across the repositories, by layer. */
  stacks: [
    { title: 'backend', items: [['go', 'gin'], ['java', 'spring boot'], ['node.js', 'bun', 'fastify', 'hono'], ['postgresql', 'mongodb', 'redis']] },
    { title: 'frontend', items: [['typescript', 'react', 'next.js'], ['angular', 'ionic', 'vite'], ['bubble tea', 'lip gloss', 'charm.land']] },
    { title: 'infra', items: [['docker', 'vercel'], ['git', 'linux']] },
  ],
}
