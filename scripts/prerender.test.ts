import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const built = existsSync('dist/en/index.html')

describe.skipIf(!built)('prerendered pages', () => {
  const langs = { pt: 'pt-BR', en: 'en', es: 'es', ja: 'ja' }
  for (const [loc, lang] of Object.entries(langs)) {
    it(`${loc} ships complete HTML`, () => {
      const html = readFileSync(`dist/${loc}/index.html`, 'utf8')
      expect(html).toContain(`<html lang="${lang}" data-locale="${loc}">`)
      expect(html).toContain('AlexandreSJ')
      for (const p of ['noct', 'aoi', 'aoi-web', 'puddle', 'aelxand']) expect(html).toContain(`projects/${p}`)
      expect(html).not.toContain('<!--app-html-->')
    })
  }
})
