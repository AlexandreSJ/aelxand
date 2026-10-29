import sanitize from 'sanitize-html'
import repos from '../src/data/repos.generated.json'
import { overrides } from '../src/data/overrides'

const USER = 'AlexandreSJ'
const OUT = new URL('../public/readme/', import.meta.url)
const headers: Record<string, string> = { Accept: 'application/vnd.github.html', 'User-Agent': 'aelxand-build' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

const absolute = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i

/**
 * GitHub's own rendering of the README, cleaned for the page: no scripts, styles or ids,
 * relative links and images pointed back at the repository, links opened in a new tab.
 */
export function clean(html: string, repo: string): string {
  const raw = `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/`
  const blob = `https://github.com/${USER}/${repo}/blob/HEAD/`
  const resolve = (url: string, base: string) => (absolute.test(url) ? url : base + url.replace(/^\.?\//, ''))
  // Heading ids are namespaced per repository so a README's "#stack" can't land on the page's own #stack.
  const slug = (id: string) => `md-${repo}-${id.replace(/^user-content-/, '')}`
  return sanitize(html, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a', 'img', 'picture', 'source', 'strong', 'b', 'em', 'i', 'del', 's',
      'code', 'pre', 'kbd', 'blockquote', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'details', 'summary', 'sup', 'sub', 'div', 'span'],
    allowedAttributes: { a: ['href', 'target', 'rel'], span: ['id'], img: ['src', 'alt', 'width', 'height', 'loading'], source: ['srcset', 'media'], '*': ['align'], th: ['align'], td: ['align'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tag, attrs) => {
        // GitHub's heading anchor becomes the scroll target for the README's own table of contents.
        if (attrs.class?.split(' ').includes('anchor') && attrs.id) return { tagName: 'span', attribs: { id: slug(attrs.id) } }
        if (attrs.href?.startsWith('#')) return { tagName: 'a', attribs: { href: `#${slug(attrs.href.slice(1))}` } }
        return { tagName: 'a', attribs: { href: resolve(attrs.href ?? '', blob), target: '_blank', rel: 'noreferrer' } }
      },
      // Prefer the original image URL over GitHub's camo proxy, and resolve repo-relative paths.
      img: (tag, attrs) => ({ tagName: 'img', attribs: { ...attrs, src: resolve(attrs['data-canonical-src'] ?? attrs.src ?? '', raw), loading: 'lazy' } }),
    },
  }).replace(/\n{3,}/g, '\n\n').trim()
}

if (import.meta.main) {
  const names = (repos as { name: string; fork: boolean }[]).filter(r => !r.fork && !overrides[r.name]?.hidden).map(r => r.name)
  let wrote = 0
  for (const name of names) {
    try {
      const res = await fetch(`https://api.github.com/repos/${USER}/${name}/readme`, { headers })
      // 404 means the repository has no README: an empty file tells the page so.
      const html = res.status === 404 ? '' : res.ok ? clean(await res.text(), name) : null
      if (html === null) throw new Error(`HTTP ${res.status}`)
      await Bun.write(new URL(`${name}.html`, OUT), html)
      wrote++
    } catch (e) {
      console.warn(`fetch-readmes: kept previous ${name} (${(e as Error).message})`)
    }
  }
  console.log(`fetch-readmes: wrote ${wrote}/${names.length}`)
}
