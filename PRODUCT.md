# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix, in this order: recruiters and tech leads deciding whether to talk to Alexandre about a fullstack role; developers who arrived from GitHub (noct, aoi) and want to explore his work; occasional freelance clients. All of them skim first and dig only when something catches them.

## Product Purpose

The personal portfolio of Alexandre da Silva Junior (AlexandreSJ), fullstack developer from Brazil. Success is that a visitor leaves remembering him as a specific person, and that his GitHub repositories reach the visitor early enough to make them curious and open one. Contact (LinkedIn, GitHub) follows from that interest.

## Positioning

His repositories are the proof. A terminal workspace (noct), a TUI typing test with a web version (aoi, aoi-web), and Go/TypeScript/Java APIs show the work directly instead of describing it. The site pairs that with a recognizable personal identity taken from his GitHub README: red #ee0022, Fira Code, `> cat who.md`, and the motto "I want people to thrive with me".

## Operating Context

- Visitors arrive from LinkedIn, the GitHub profile README, and links in repositories, on desktop and mobile.
- Content comes from the GitHub REST API at build time (all public, non-fork repositories, so new projects appear automatically), enriched by hand-written overrides per repository: context per locale, status, tags, links and media (GIF/image).
- Four locales: pt, en, es, ja.

## Capabilities and Constraints

- Static, pre-rendered site (Vite + React 19, Bun) deployed on Vercel; no backend.
- Years of experience are computed from 2022-02-17 and must roll over exactly on that date each year; the page shows an approximation ("N+ years") because an earlier frontend trainee period is not counted.
- Experience details live on LinkedIn; the site does not list employers yet.
- Public email: not provided; contact goes through LinkedIn and GitHub.

## Brand Commitments

- Dark only. Accent #ee0022 is the only accent.
- Techniques borrowed from ryoku.dev: hairline rules (thin gray, ~0.5px), spec rows, numbered sheets, dithered pixel art, token-swapped themes. Not its fonts.
- Fonts chosen by the owner: Bricolage Grotesque 800 (structure), Fraunces italic 300 (voice), Geist (reading), Fira Code (machine), DotGothic16 (labels).
- Dithering is the signature technique: portrait, background, effects.
- No decorative kanji; Japanese only as a locale.
- "arch btw" is a joke for the who.md, never a skill or tool listing.
- The motto "I want people to thrive with me" is translated per locale.

## Evidence on Hand

- Portrait: GitHub avatar, processed to `public/portrait.jpg` (200×200 grayscale).
- noct demo GIFs: `docs/assets/hero.gif` and `docs/assets/tour.gif` in github.com/AlexandreSJ/noct.
- Live deployments: aoi-web, web-dj, portfolio-api(-node), fsp-recicle, x-connectivity-and-crypto (homepage fields on GitHub).
- GitHub profile README (who.md / what.md text, Spotify widget).
- Absent, must not be invented: employer names, client names, testimonials, metrics, a public email. aoi and other GIFs are planned by the owner, not yet made.

## Product Principles

1. The work is the argument: repositories appear early and lead to the real thing (source, live demo, GIF).
2. One person, not a template: every section carries something only Alexandre's site would have.
3. New repositories show up without editing the site; curation adds depth, never gates presence.
4. Truthful numbers only: everything shown is computed from GitHub or the start date.

## Accessibility & Inclusion

Motion respects `prefers-reduced-motion`; all content is readable without JavaScript (pre-rendered); four languages including Japanese typography.
