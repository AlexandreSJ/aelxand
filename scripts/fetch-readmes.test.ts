import { describe, expect, it } from 'vitest'
import { clean } from './fetch-readmes'

describe('clean (README HTML)', () => {
  it('drops scripts, handlers and styles, and points relative paths at the repository', () => {
    const html = clean(
      '<p onclick="x()">hi<script>alert(1)</script></p><style>p{}</style><img src="docs/a.png"><a href="LICENSE">l</a><a href="#top">t</a>',
      'noct',
    )
    expect(html).not.toMatch(/script|onclick|style/)
    expect(html).toContain('src="https://raw.githubusercontent.com/AlexandreSJ/noct/HEAD/docs/a.png"')
    expect(html).toContain('href="https://github.com/AlexandreSJ/noct/blob/HEAD/LICENSE" target="_blank"')
    expect(html).toContain('<a href="#md-noct-top">t</a>')
  })
  it('keeps heading anchors as per-repository scroll targets', () => {
    const html = clean('<a id="user-content-usage" class="anchor" href="#usage"><svg class="octicon"></svg></a><a href="#usage">u</a>', 'aoi')
    expect(html).toContain('<span id="md-aoi-usage"></span>')
    expect(html).toContain('<a href="#md-aoi-usage">u</a>')
  })
  it("prefers an image's original URL over GitHub's camo proxy", () => {
    expect(clean('<img src="https://camo.githubusercontent.com/x" data-canonical-src="https://img.shields.io/b">', 'aoi'))
      .toContain('src="https://img.shields.io/b"')
  })
})
