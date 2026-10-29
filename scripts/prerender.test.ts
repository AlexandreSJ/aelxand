import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { record } from '../src/data/record'

const built = existsSync('dist/en.html')

describe.skipIf(!built)('prerendered pages', () => {
  const langs = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
  for (const [loc, lang] of Object.entries(langs)) {
    it(`${loc} ships complete HTML`, () => {
      const html = readFileSync(`dist/${loc}.html`, 'utf8')
      expect(html).toContain(`<html lang="${lang}" data-locale="${loc}">`)
      // the intro is the only h1, with the role marked; the sleeve keeps the handle as text
      expect(html.match(/<h1/g)).toHaveLength(1)
      expect(html).toMatch(/<h1[^>]*class="intro__title[^"]*"[^>]*>.*<span class="intro__role">/)
      expect(html).toContain('>AlexandreSJ</p>')
      for (const t of record.sideA) expect(html).toContain(`id="track-${t.name}"`)
      for (const t of [...record.sideA, ...record.sideB]) expect(html).toContain(`<span class="repos__name">${t.name}</span>`)
      expect(html).toMatch(/~\d+ (years|anos|años)|約 \d+ 年/)
      expect(html).not.toContain('<!--app-html-->')
    })
  }
})
