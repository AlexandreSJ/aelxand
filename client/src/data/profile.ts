export interface StackCategory {
  key: string
  items: { name: string; icon: string }[]
}

export interface ContactLink {
  key: string
  labelKey: string
  url: string
  icon: string
}

export const profile = {
  name: 'Alexandre da Silva Junior',
  username: 'AlexandreSJ',
  roleKey: 'about.role',
  bioKey: 'about.bio',
  locationKey: 'about.location',
  degreeKey: 'about.degree',
  languagesKey: 'about.languages',
  avatar: 'A',
  imageUrl: '/assets/profile.png',
  stack: [
    {
      key: 'stack.frontend',
      items: [
        { name: 'React', icon: 'devicon-react-original' },
        { name: 'Angular', icon: 'devicon-angularjs-plain' },
        { name: 'Ionic', icon: 'devicon-ionic-original' },
        { name: 'Next.js', icon: 'devicon-nextjs-plain' },
        { name: 'Vite', icon: 'devicon-vitejs-plain' },
      ],
    },
    {
      key: 'stack.backend',
      items: [
        { name: 'Spring', icon: 'devicon-spring-plain' },
        { name: 'Node.js', icon: 'devicon-nodejs-plain' },
        { name: 'Fastify', icon: 'devicon-fastify-plain' },
        { name: 'Bun', icon: 'devicon-bun-plain' },
        { name: 'Go', icon: 'devicon-go-original-wordmark' },
      ],
    },
    {
      key: 'stack.database',
      items: [
        { name: 'Postgres', icon: 'devicon-postgresql-plain' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain' },
        { name: 'Redis', icon: 'devicon-redis-plain' },
      ],
    },
    {
      key: 'stack.tools',
      items: [
        { name: 'Docker', icon: 'devicon-docker-plain' },
        { name: 'Git', icon: 'devicon-git-plain' },
      ],
    },
  ] as StackCategory[],
  hobbies: [
    { key: 'hobbies.dnd', icon: '🎲' },
    { key: 'hobbies.pixelart', icon: '🎨' },
    { key: 'hobbies.music', icon: '🎵' },
    { key: 'hobbies.gamedev', icon: '🎮' },
    { key: 'hobbies.fps', icon: '🔫' },
    { key: 'hobbies.linguistics', icon: '🗣️' },
  ],
  contact: [
    { key: 'github', labelKey: 'contact.github', url: 'https://github.com/AlexandreSJ', icon: 'devicon-github-original' },
    { key: 'linkedin', labelKey: 'contact.linkedin', url: 'https://linkedin.com/in/alexandre-da-silva-junior', icon: 'devicon-linkedin-plain' },
    { key: 'spotify', labelKey: 'contact.spotify', url: 'https://spotify.com/@Aelxand', icon: 'devicon-spotify-plain' },
    { key: 'reddit', labelKey: 'contact.reddit', url: 'https://reddit.com/u/Aelxande', icon: 'devicon-reddit-plain' },
    { key: 'discord', labelKey: 'contact.discord', url: '#', icon: 'devicon-discord-plain' },
  ] as ContactLink[],
} as const
