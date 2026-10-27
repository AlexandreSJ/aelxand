import { projects } from '../src/data/projects'

const OUT = new URL('../src/data/repos.generated.json', import.meta.url)
const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'aelxand-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const meta: Record<string, { stars: number; language: string | null; pushedAt: string }> = {}
try {
  for (const p of projects) {
    const res = await fetch(`https://api.github.com/repos/AlexandreSJ/${p.repo}`, { headers })
    if (!res.ok) throw new Error(`${p.repo}: HTTP ${res.status}`)
    const r = await res.json()
    meta[p.repo] = { stars: r.stargazers_count, language: r.language, pushedAt: r.pushed_at }
  }
  await Bun.write(OUT, JSON.stringify(meta, null, 2) + '\n')
  console.log(`fetch-repos: wrote ${Object.keys(meta).length} repos`)
} catch (e) {
  console.warn(`fetch-repos: kept previous file (${(e as Error).message})`)
}
