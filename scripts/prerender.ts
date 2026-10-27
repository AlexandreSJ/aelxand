// @ts-expect-error built by `vite build --ssr`
import { render, LOCALES, HTML_LANG } from '../dist-ssr/entry-server.js'

const template = await Bun.file('dist/index.html').text()

function page(locale: string) {
  const { html, head } = render(locale)
  return template
    .replace('<html lang="en">', `<html lang="${HTML_LANG[locale]}" data-locale="${locale}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
}

// dist/<locale>.html: Vercel's cleanUrls and `vite preview` both serve it at /<locale>.
for (const l of LOCALES as string[]) await Bun.write(`dist/${l}.html`, page(l))
await Bun.write('dist/index.html', page('en'))
console.log(`prerender: ${(LOCALES as string[]).join(', ')} + /`)
