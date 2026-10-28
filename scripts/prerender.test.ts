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
      expect(html).toMatch(/<h1[^>]*>AlexandreSJ<\/h1>/)
      for (const t of record.sideA) expect(html).toContain(`id="track-${t.name}"`)
      for (const t of record.sideB.slice(0, 4)) expect(html).toContain(`>${t.name}</a>`)
      expect(html).toMatch(/~\d+ (years|anos|años)|約 \d+ 年/)
      expect(html).not.toContain('<!--app-html-->')
    })
  }
})
