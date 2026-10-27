import { mkdir } from 'node:fs/promises'
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

for (const l of LOCALES as string[]) {
  await mkdir(`dist/${l}`, { recursive: true })
  await Bun.write(`dist/${l}/index.html`, page(l))
}
await Bun.write('dist/index.html', page('en'))
console.log(`prerender: ${(LOCALES as string[]).join(', ')} + /`)
