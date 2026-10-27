---
name: aelxand
description: The portfolio of AlexandreSJ, pressed as an LP. He is the cover, his repositories are the tracks.
colors:
  paper: "#0b0a0d"
  raised: "#15121a"
  sleeve-board: "#120f15"
  ink: "#ede6e9"
  ink-dim: "#c2b9be"
  ink-muted: "#9a9197"
  ink-faint: "#878085"
  red: "#ee0022"
  red-ink: "#ff3a50"
  red-dim: "#9e0a20"
  on-red: "#0b0a0d"
  line: "color-mix(in srgb, #ede6e9 20%, transparent)"
  line-strong: "color-mix(in srgb, #ede6e9 38%, transparent)"
  tint: "color-mix(in srgb, #ede6e9 5%, transparent)"
  crt-bg: "#0e0507"
  crt-fg: "#ff3347"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.4vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  title-row:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  voice:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "clamp(1.15rem, 1.7vw, 1.45rem)"
    fontWeight: 300
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "'Geist Variable', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "'Fira Code Variable', ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'DotGothic16', 'Fira Code Variable', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sm: "2px"
  disc: "50%"
spacing:
  gutter: "20px"
  cell: "14px"
  row: "16px"
  sheet: "clamp(56px, 9vw, 112px)"
components:
  tracklist-row:
    textColor: "{colors.ink}"
    typography: "{typography.title-row}"
    padding: "15px 4px"
  tracklist-row-active:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.red}"
  track-code:
    textColor: "{colors.red-ink}"
    typography: "{typography.label}"
  pill:
    textColor: "{colors.ink-dim}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "5px 8px"
  link:
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
  link-hover:
    textColor: "{colors.red}"
  sleeve:
    backgroundColor: "{colors.sleeve-board}"
    rounded: "{rounded.none}"
    width: "min(46vw, calc(100svh - 150px))"
  disc-label:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.disc}"
  now-playing-bar:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink-muted}"
    padding: "8px 14px 8px 8px"
  crt-window:
    backgroundColor: "{colors.crt-bg}"
    textColor: "{colors.crt-fg}"
    typography: "{typography.mono}"
  lang-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "5px 6px"
---

# Design System: aelxand

## Overview

**Creative North Star: "The Pressing"**

The site is a single LP on a near-black board. Alexandre is the cover: a square sleeve with his portrait dithered to 1-bit red, a catalog number (AELX-001) and his name set huge in Bricolage. His repositories are the tracks, ruled by 0.5px gray hairlines, coded A1–A6 and B1–Bn in DotGothic, timed in Fira Code. The sleeve is sticky and plays whatever track is being read: its artwork re-dithers into the project's video or a generated type cover, and a vinyl disc behind it turns with scroll. The rest of the record follows the physical object: liner notes (who.md on a CRT), Side B as a mirrored index spread with its own disc, a stack marquee for credits, bonus tracks, "on rotation", and a back cover that closes on contact.

Density is editorial, not dashboard: few elements per viewport, very large structural type against small machine type, and nothing but hairlines dividing it. Red #ee0022 is the only ink color; everything else is warm-violet grays on paper black. Dithering is the material, not a filter: portrait, track art, background, and even section-title entrances are built from the same 8×8 Bayer matrix.

The world rejects the centered hero over a row of equal project cards, light mode, any second accent, and decorative kanji (Japanese appears only as a locale).

**Key Characteristics:**
- One ink: red #ee0022 on near-black, with a lifted red (#ff3a50) for small red text.
- 1-bit Bayer dithering at 3px cells everywhere imagery appears; `image-rendering: pixelated`.
- 0.5px gray hairlines are the only dividers; surfaces are square-cornered.
- Five type roles with fixed jobs: structure, voice, reading, machine, labels.
- Motion is a grammar: titles dissolve, track names scramble, the name glitches, the disc spins with scroll, the CRT types.

## Colors

One saturated red against a family of warm, faintly violet near-blacks and grays; no second hue exists.

### Primary
- **Pressing Red** (`red`): the only accent. Dithered artwork, the disc label, the Fraunces voice phrase in every section head, hover and active track names, the selection highlight, focus outline, live dot. Used at display sizes or as fill.
- **Lifted Red Ink** (`red-ink`): the same hue lifted for small text (5.6:1 on paper where #ee0022 is 4.4:1). Track codes (A1, B6), side letters on the back cover, the "live" marker, the now-playing code.
- **Deep Red** (`red-dim`): scrollbar thumb only.

### Neutral
- **Paper Black** (`paper`): page ground; also the text color on red (`on-red`) and the disc spindle hole.
- **Sleeve Board** (`sleeve-board`): the face of the sleeve, back-cover panel, and mini-player artwork well; one step above paper so the square object reads as a printed board.
- **Raised Violet** (`raised`): floating surfaces that are not printed matter: the mobile now-playing bar and the Spotify player frame.
- **Ink** (`ink`): primary text and headlines; the inverted current-language tab.
- **Ink Dim** (`ink-dim`): voice lines, spec values, descriptions, pills.
- **Ink Muted** (`ink-muted`): nav links, track metadata, captions.
- **Ink Faint** (`ink-faint`): labels, dates, run times, footer, the disc's rim notch.
- **Hairline** (`line`, ink at 20%): every divider and frame. **Strong Hairline** (`line-strong`, 38%): link underlines and the outlined marquee stroke. **Tint** (`tint`, 5%): active/hover row wash.
- **CRT Phosphor** (`crt-bg`, `crt-fg`): only inside the who.md terminal; a red-shifted black and a hotter red so the screen reads as emitting, not printed. Scanline 0.32, aperture mask 0.16, no glow, no curvature.

### Named Rules
**The One Ink Rule.** Red #ee0022 is the only chromatic color. Grays carry a faint violet cast; nothing else gets hue. The CRT's channel-fringe text-shadow is the single sanctioned exception, and it lives only on the screen.

**The Lifted Ink Rule.** Red text below display size uses `red-ink`, never `red`. `red` is for fills, artwork, and type large enough to pass on its own.

## Typography

**Structure Font:** Bricolage Grotesque Variable 800 (system-ui fallback)
**Voice Font:** Fraunces Variable, italic 300 only (Georgia fallback)
**Reading Font:** Geist Variable (Noto Sans JP added for ja)
**Machine Font:** Fira Code Variable
**Label Font:** DotGothic16

**Character:** A tight, heavy grotesque does the shouting; one thin italic serif phrase per heading does the feeling; a dot-matrix face prints catalog numbers like a pressing plant would; Fira Code keeps the developer's own voice in every number and link.

### Hierarchy
- **Display** (Bricolage 800, clamp(2.6rem, 5.6vw, 6rem), 0.9, -0.035em): the name on the sleeve; the active track name printed on the sleeve. The contact heading uses the xl head (clamp(2.8rem, 7vw, 6rem), 0.92).
- **Headline** (Bricolage 800, clamp(2rem, 4.4vw, 3.6rem), 1, -0.025em): section heads, always ending in one Fraunces italic red phrase ("Side A *featured*"). Small variant clamp(1.6rem, 2.8vw, 2.3rem); the liner-notes head runs as a vertical rail above 900px.
- **Title** (Bricolage 800, clamp(2.6rem, 5vw, 4.6rem), 0.92): track titles in the Side A track sections. Row titles in the tracklist step down to clamp(1.4rem, 2.2vw, 1.9rem); Side B index names to 1.15rem.
- **Voice** (Fraunces italic 300, 1.02–1.5rem, 1.3–1.4, max 34–44ch, `ink-dim`): the motto, track descriptions, ledes, bonus captions, alternating marquee items.
- **Body** (Geist 400, 16px, 1.6): reading text and spec values.
- **Machine** (Fira Code 400, 0.68–0.8rem): metadata, languages, stars, dates, nav, links, buttons, pills, the CRT.
- **Label** (DotGothic16 400, 0.75rem, 0.06em, uppercase, `ink-faint`): catalog numbers, spec keys, contact keys. Track codes use it at 0.8–1rem in `red-ink`, uncased.

### Named Rules
**The Five Jobs Rule.** Each face has one job and does not take another's: structure is always Bricolage 800, the emotional phrase is always Fraunces italic 300, numbers and links are always Fira Code, catalog marks are always DotGothic.

**The Upright Voice Rule.** CJK has no italic and only Fraunces' italic file ships, so under `lang="ja"` every voice element swaps to the reading face, upright, keeping its color and weight (`font-synthesis: none`). Never synthesize an oblique.

## Layout

A single column of "sheets" (vertical padding clamp(56px, 9vw, 112px)) inside a 1100px wrap with 20px gutters (respecting safe-area insets). The cover spread and the top bar run wider, to 1320px: the sleeve column is min(46vw, 100svh − 150px), the gap clamp(64px, 11vw, 170px) is sized so the disc label shows between sleeve and tracklist. The sleeve is sticky at 80px while Side A tracks scroll past it; each track section is at least 42vh and scroll-margins 96px under the 56px sticky top bar.

Spreads are asymmetric two-column grids: liner notes 7fr/5fr with a vertical rail head, Side B index with a sticky 240–400px disc on the right (the mirror of the cover), bonus/rotation 1fr/1fr, back cover 5fr/7fr. Rows are grids with fixed code columns (40px) and right-aligned tabular-number times.

Rhythm: 14px is the in-row gap, 15–16px row padding, 18–24px between groups.

**Breakpoints.** At 900px every spread collapses to one column; the disc and Side B disc hide; the sleeve becomes static, centered, max 560px; track sections show their own media; the nav hides; the mobile now-playing bar appears; the Side B index wraps its description to a second line. At 520px the years readout hides, bonus becomes one column, spec and contact rows stack.

## Elevation & Depth

Depth is material, not UI elevation. The page sits on a fixed two-layer dithered background: a far layer of red Bayer glow pooling top-right and bottom-left (alpha 46) and a near layer of ink halftone dots growing toward the top-right (alpha 18, capped so dots never merge behind text), both painted once at 3px cells and moved only by transform, the far layer at half the near layer's speed over 35% of a viewport. Physical objects (sleeve, back-cover panel, disc, mobile bar) cast one soft drop shadow; nothing else lifts. The top bar is frosted paper (88% + 8px blur).

### Shadow Vocabulary
- **Sleeve drop** (`box-shadow: 0 30px 60px -28px #000`): the sleeve and the back-cover panel.
- **Disc drop** (`box-shadow: 0 18px 50px -20px #000`): vinyl discs.
- **Floating bar** (`box-shadow: 0 12px 30px -12px #000`): the mobile now-playing bar.

### Named Rules
**The Object Shadow Rule.** Only things that are physical objects in the record metaphor cast shadows, and always a soft downward drop into black. Rows, pills, links, and sections stay flat.

## Shapes

Square. The sleeve, back panel, CRT window, media, and rows have no radius; only pills (and the button primitive) take 2px. The single round form is the vinyl: a disc of repeating 2px/1px radial grooves with a run-out ring at 38%, a red label inset 38% (30% on the B-side disc), a paper spindle hole, and an off-centre rim notch plus off-centre label text so rotation is visible. Every frame and divider is a 0.5px `line` hairline; controls (pill, button) use a 1px `line` border. Dithered canvases always render pixelated.

## Components

### Sleeve (signature)
The sticky record cover. A 200×200 canvas, Bayer-dithered in red, scaled up pixelated inside a square sleeve-board frame with a 0.5px hairline and the sleeve drop. Top strip: catalog number and role in DotGothic over a paper scrim. Foot: the name (Display, glitches on mount and on hover) and the motto in Fraunces with its first clause in ink. When a track becomes active the art morphs over 320ms to that track's field (project video sampled live and re-dithered every frame, or a type cover: the name rendered in Bricolage 800 over a soft glow, then dithered), and the foot cross-fades to the track code in `red-ink` plus the name. Hovering the portrait jitters the Bayer offset every 90ms. A caption under it reads "Side A / Side B · N+ years", or a blinking red dot and "now playing" with the code.

### Disc
Vinyl behind the sleeve, sliding out from its right edge (72% of the sleeve, offset right −50%), rotating a quarter turn per viewport of scroll via `--spin`. Label in DotGothic 0.56rem on red with a Bricolage 800 line. The Side B disc is in-flow, sticky, and labels itself with the row under the pointer.

### Tracklist and index rows
Hairline-ruled grids: code (DotGothic, `red-ink`), name (Bricolage 800), info (Fira Code, `ink-muted`, stars and "live"), time (Fira Code, `ink-faint`, right-aligned, tabular). Hover and current: `tint` wash and the name turns red. No cards, no thumbnails.

### Track section
Code + title (Title role, scramble on view) + optional status pill, a Fraunces voice line, a metadata row, and Fira Code links. Below 900px the dithered media appears inline.

### Pill
Fira Code 0.68rem, `ink-dim`, 1px `line` border, 2px radius, optional 6px square red dot for "building".

### Links
Fira Code 0.8rem in ink with a 0.5px `line-strong` underline offset 5px and an authored 16px arrow; hover turns text and underline red and nudges the arrow 2px up-right. Contact rows scale this up: DotGothic key, Bricolage value, 1.25rem arrow.

### Navigation
Sticky 56px top bar of frosted paper with a hairline bottom: `~/aelxand` mark, Fira Code nav in `ink-muted` (hover ink), "LP · since 2022 · N+ yrs" readout, and a language switch whose current tab is inverted (ink fill, paper text).

### CRT window (who.md)
A figure with a hairline title bar (label + "80×24 · utf-8") over a phosphor screen: Fira Code in `crt-fg` with a red/blue channel fringe, 1px-in-3px scanlines, an RGB aperture mask at 16%, a slow roll band, vignette and flicker. Lines type in once on first view (prompts 1 char/45ms, text 3 chars/14ms) over an invisible ghost of the full text so the screen never resizes.

### Marquee (credits)
Two identical groups translate exactly one group width over 60s so the loop is seamless; spacing lives inside items. Items alternate outlined Bricolage 800 (1px `line-strong` stroke, transparent fill) and solid red Fraunces italic. Hairline top and bottom, edge fade mask, pauses on hover.

### Mobile now-playing bar
Below 900px, a fixed `raised` bar with a 44px pixelated mirror of the sleeve canvas, "now playing" and the code + name, sliding up over 300ms while a track is active.

### Back cover
A square sleeve-board panel: catalog strip, both sides' tracklists in Fira Code with `red-ink` codes, a print line and barcode; beside it the contact lede and hairline contact rows.

### Motion
- **Dissolve** (section heads, on view): 17 Bayer coverage masks (24px tiles, 3px cells) stepped over 560ms.
- **Scramble** (track titles, on view): characters locked to measured widths cycle random glyphs, resolving left to right over 600ms + 16ms per char; layout never reflows.
- **Glitch** (the name, mount + hover): 620ms stepped jitter with red and `ink-faint` clipped slices.
- Transitions use `cubic-bezier(.215,.61,.355,1)` at 90ms (color) and 180ms (movement).
- **Reduced motion:** all CSS animation and transitions off, text effects skipped, art morphs instantly, video and portrait jitter do not play, disc and background parallax stay still, the CRT shows its full text.

## Do's and Don'ts

### Do:
- **Do** divide with 0.5px `line` hairlines and nothing else; frame physical objects with the same hairline.
- **Do** end every section head with one Fraunces italic phrase in red.
- **Do** make any new imagery 1-bit red through the shared Bayer matrix at 3px cells, rendered pixelated.
- **Do** use `red-ink` (#ff3a50) for red text below display size, and DotGothic for codes and catalog marks.
- **Do** keep numbers in Fira Code with tabular figures, and make every number computed (years, stars, dates).
- **Do** give each new animated text one of the three verbs (dissolve, scramble, glitch) and gate it on reduced motion.
- **Do** swap the voice to the reading face, upright, under `lang="ja"`.

### Don't:
- **Don't** add a second accent hue, a light theme, or gradients other than paper scrims.
- **Don't** set project grids of equal cards; work is a tracklist.
- **Don't** round surfaces; only pills and buttons take 2px.
- **Don't** shadow anything that is not a physical object in the record.
- **Don't** use decorative kanji or set Japanese outside the ja locale.
- **Don't** synthesize an italic or oblique for CJK.
