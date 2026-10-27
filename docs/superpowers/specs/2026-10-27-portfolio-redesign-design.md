# Portfolio redesign — "dossier" design system

Date: 2026-10-27 · Branch: `redesign/dossier` · Interactive plan: https://claude.ai/artifact/EYXhjSioSVjYVakVGCQAdw

## Goal

Rebuild aelxand.vercel.app as a professional, statically rendered portfolio with its own design system.
Techniques are borrowed from ryoku.dev (hairlines, spec rows, dithered art, token-swapped themes) and the identity comes from the GitHub README (red `#ee0022`, Fira Code, `> cat who.md`).

Success criteria:

- Every locale route ships complete HTML (name, sections, project list) before JS runs.
- Lighthouse ≥ 95 on Performance, Accessibility, Best Practices and SEO for `/en`.
- `prefers-reduced-motion: reduce` shows every element at rest with no animation.
- Scrambled text never changes the height or line breaks of its element.

## Fixed decisions

| Area | Decision |
|---|---|
| Theme | Dark only. No light mode, no toggle. |
| Accent | `#ee0022` is the only accent. |
| Locales | `pt`, `en`, `es`, `ja` (routes `/pt`, `/en`, `/es`, `/ja`). `/` picks from `navigator.language`, falls back to `/en`. |
| Japanese | A locale only. No decorative kanji in the design. |
| Stack | Vite 8 + React 19 + TypeScript, Bun as package manager. |
| API | The Hono server (`src/`, `api/`, `api-server.ts`) is removed; nothing uses it. |
| Projects | GitHub REST API fetched at build time into `src/data/repos.generated.json`, merged with local per-locale copy. |

## Design tokens

```css
--paper:#0b0a0d; --raised:#15121a; --well:#1c1822;
--ink:#ede6e9; --ink-dim:#c2b9be; --ink-muted:#9a9197; --ink-faint:#7a7278;
--red:#ee0022; --red-dim:#9e0a20; --on-red:#0b0a0d;
--line: ink 20%; --line-soft: ink 10%; --line-strong: ink 38%;  /* color-mix */
--radius:2px; --ease:cubic-bezier(.215,.61,.355,1); --snap:90ms; --move:.18s;
--crt-bg:#0e0507; --crt-fg:#ff3347; --crt-scan:.32; --crt-glow:0px; --crt-mask:.16; --crt-curve:0px;
spacing: 4 8 12 16 24 32 48 64 (s1–s8)
```

## Typography (five roles)

| Role | Face | Use |
|---|---|---|
| Structure | Bricolage Grotesque 800, tracking −0.02em | Section titles, hero name, card titles, marquee |
| Voice | Fraunces italic 300 | Philosophy, card one-liners, one emphasized phrase per title (`<em class="v">`, red) |
| Reading | Geist 400/500 | Body copy, nav, descriptions (max ~65ch) |
| Machine | Fira Code | Commands, dates, tags, buttons |
| Label | DotGothic16, uppercase | Eyebrows, file-path labels, section numbers |
| Japanese body | Noto Sans JP (unicode-range subsets) | Fallback after Geist in `ja` |

Fonts are self-hosted through `@fontsource` packages; no Google Fonts request at runtime.

## Components

- **Button**: `solid-red`, `outline`, `ghost` (red underline grows on hover). Fira Code 0.78rem.
- **Pill**: status chip with optional red square (`building`, `learning`, `live`).
- **SectionHead**: number (DotGothic, red) + title (structure face with one `<em class="v">`).
- **Card** (project): label `projects/<name>` · title · voice line · meta tags · ghost actions · dithered band revealed on hover; border turns red on hover.
- **Crt**: bezel + screen with scanlines, RGB mask, vignette, rolling bar, flicker; all values from `--crt-*`. Types lines on first view.
- **Divider**: `band` (dithered red band, flips on alternate dividers) and `marquee` (outlined structure face mixed with red voice-face words). Alternate band → marquee → band…
- **Portrait**: `<canvas>` Bayer 8×8 dither of the GitHub avatar in red; threshold matrix jitters on hover.
- **Background**: fixed canvas, two layers: red dithered glow (Bayer, 4px cells, α≈58) and ink halftone (3px cells, α≈40).

## Motion

| Target | Effect | Trigger |
|---|---|---|
| Section titles | Dither dissolve (17 Bayer masks, 3px cells) | Enters viewport (60%) |
| Hero name | Glitch jitter (red/ink slices) | On load and on hover |
| Card titles | Scramble with locked glyph widths | Enters viewport |
| CRT | Typewriter | Enters viewport, once |

Scramble rule: split text nodes into `nowrap` word spans of `inline-block` chars, lock each char's measured width after `document.fonts.ready`, swap glyphs only inside those boxes. Text stays in the DOM; elements carry `aria-label` with the original string.

## Page map (single page per locale)

1. **Hero** (`index`): label "Fullstack developer · Brazil", name, `> building noct · learning WAPT · arch btw`, philosophy in voice face, CTAs (projects, GitHub), dithered portrait.
2. **Sobre** (`who.md`): CRT typing the README's who.md (roles, Linux/cybersecurity, D&D, music, languages, philosophy).
3. **Projetos** (`projects/`): cards for noct, aoi, aoi-web (with live link), puddle, aelxand. Order and copy from local data; stars/language/updated from GitHub.
4. **Experiência** (`work.log`): timeline of work entries + BSc Computational Science (2024).
5. **Stack** (`stack.toml`): grouped (frontend, backend, data, tools), no percentage bars.
6. **Fora do código** (`offline.md`): D&D (DM), guitar & bass, pixel art, languages.
7. **Tocando agora** (`now-playing`): the README's Spotify widget image, linked.
8. **Contato** (`contact.sh`): copyable email, GitHub, LinkedIn, Buy Me a Coffee.

Footer: language switcher, `© 2026 AlexandreSJ`, source link.

## Architecture

```
index.html                 template with <!--app-html--> and <!--head--> slots
src/entry-client.tsx       hydrateRoot
src/entry-server.tsx       render(locale) -> { html, head }
src/App.tsx                <Background/> + sections, locale from props
src/i18n/{pt,en,es,ja}.json + I18nProvider (locale passed in, no localStorage)
src/lib/dither.ts          bayer8(), ditherBayer(), ditherAtkinson(), paintGlow(), paintHalftone(), bandImage()
src/lib/textfx.ts          charify(), scramble(), dissolve(), glitch()
src/hooks/                 useInView, useReducedMotion, useTextFx(kind)
src/components/            Button, Pill, SectionHead, Card, Crt, Divider, Portrait, Background, LangSwitch
src/sections/              Hero, About, Projects, Experience, Stack, Offline, NowPlaying, Contact
src/data/                  profile.ts, projects.ts (copy per locale), experience.ts, repos.generated.json
src/styles/                tokens.css, base.css
scripts/fetch-repos.ts     GitHub API -> repos.generated.json (keeps last file on failure)
scripts/prerender.ts       vite SSR build -> dist/{pt,en,es,ja}/index.html + dist/index.html redirect
public/portrait.jpg        200×200 grayscale avatar
```

Build: `bun run fetch-repos && vite build && vite build --ssr src/entry-server.tsx && bun scripts/prerender.ts`.
Canvas, observers and fonts work only on the client: components render static markup on the server and start effects in `useEffect`.

## Error handling

- GitHub fetch fails or is rate-limited: keep the committed `repos.generated.json`; cards still render from local data.
- Portrait image fails: canvas stays empty and the fallback `<img alt>` shows.
- Missing translation key: build-time test fails (all locales must have identical key sets).
- No canvas / reduced motion: background shows flat `--paper`; text shows at rest.

## Testing

- Vitest: `bayer8` (64 unique thresholds), dither output density for known inputs, `charify` keeps text and locks widths (happy-dom), i18n key parity across 4 locales.
- Prerender smoke test: each `dist/<locale>/index.html` contains `lang="<locale>"`, the hero name and every project name.
- Manual: Lighthouse on `/en`; reduced-motion check; 400px width check.

## Out of scope

Blog/notes, light theme, CMS, analytics, contact form.

## Open content (owner to provide)

- Work experience entries (company, role, period, one result).
- Public contact email.
