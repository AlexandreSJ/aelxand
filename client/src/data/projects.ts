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
    tech: ['Go'],
    githubUrl: 'https://github.com/AlexandreSJ/aoi',
  },
  {
    id: 'puddle',
    name: 'puddle',
    descriptionKey: 'projects.puddle.desc',
    tech: ['Go'],
    githubUrl: 'https://github.com/AlexandreSJ/puddle',
  },
]
