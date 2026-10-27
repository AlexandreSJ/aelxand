const OUT = new URL('../src/data/repos.generated.json', import.meta.url)
const USER = 'AlexandreSJ'
const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'aelxand-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

try {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  type GhRepo = { name: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; homepage: string | null; fork: boolean }
  const list = (await res.json()) as GhRepo[]
  const repos = list.map(r => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    pushedAt: r.pushed_at,
    homepage: r.homepage || null,
    fork: r.fork,
  }))
  await Bun.write(OUT, JSON.stringify(repos, null, 2) + '\n')
  console.log(`fetch-repos: wrote ${repos.length} repos`)
} catch (e) {
  console.warn(`fetch-repos: kept previous file (${(e as Error).message})`)
}
