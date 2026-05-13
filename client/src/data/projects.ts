export interface Project {
  id: string
  name: string
  descriptionKey: string
  tech: string[]
  githubUrl: string
}

export const projects: Project[] = [
  {
    id: 'aoi',
    name: 'aoi',
    descriptionKey: 'projects.aoi.desc',
    tech: ['Go', 'Bubble Tea', 'Lipgloss'],
    githubUrl: 'https://github.com/AlexandreSJ/aoi',
  },
  {
    id: 'puddle',
    name: 'puddle',
    descriptionKey: 'projects.puddle.desc',
    tech: ['Go', 'Gin'],
    githubUrl: 'https://github.com/AlexandreSJ/puddle',
  },
  {
    id: 'aelxand',
    name: 'aelxand',
    descriptionKey: 'projects.aelxand.desc',
    tech: ['React', 'Hono', 'Vite', 'Typescript', 'Bun'],
    githubUrl: 'https://github.com/AlexandreSJ/aelxand',
  },
  {
    id: 'todo',
    name: 'coming soon...',
    descriptionKey: '',
    tech: [],
    githubUrl: '',
  },
]
