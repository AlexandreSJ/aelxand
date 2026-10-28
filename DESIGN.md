---
name: aelxand
description: The portfolio of AlexandreSJ, pressed as an LP. He is the cover, his repositories are the tracks, and the sleeve plays whichever track is selected.
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
  crt-hi: "#ffd0d5"
  crt-fringe-b: "rgba(0, 170, 255, 0.18)"
  crt-fringe-r: "rgba(255, 0, 80, 0.3)"
  crt-mask-r: "rgba(255, 0, 0, 0.9)"
  crt-mask-g: "rgba(0, 255, 0, 0.7)"
  crt-mask-b: "rgba(0, 80, 255, 0.9)"
  crt-vignette: "rgba(0, 0, 0, 0.5)"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(2.4rem, calc(var(--sleeve-size) * .135), 5.6rem)"
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
    fontSize: "clamp(1.7rem, 2.6vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  title-row:
    fontFamily: "'Bricolage Grotesque Variable', system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  voice:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "clamp(1.02rem, 1.4vw, 1.2rem)"
    fontWeight: 300
    lineHeight: 1.4
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
  group: "18px"
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
  track-note-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  track-note-voice:
    textColor: "{colors.ink-dim}"
    typography: "{typography.voice}"
  pill:
    textColor: "{colors.ink-dim}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "5px 8px"
  live-dot:
    backgroundColor: "{colors.red}"
    rounded: "{rounded.disc}"
    size: "7px"
  link:
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
  link-hover:
    textColor: "{colors.red-ink}"
  sleeve:
    backgroundColor: "{colors.sleeve-board}"
    rounded: "{rounded.none}"
    width: "min(40vw, calc(100svh - 356px), 620px)"
  disc-label:
    backgroundColor: "{colors.red}"
    textColor: "{colors.on-red}"
    rounded: "{rounded.disc}"
  terminal:
    backgroundColor: "{colors.crt-bg}"
    textColor: "{colors.crt-fg}"
    typography: "{typography.mono}"
  terminal-bar:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink-muted}"
    padding: "9px 12px"
  spec-row:
    textColor: "{colors.ink-dim}"
    padding: "16px 0"
  contact-row:
    textColor: "{colors.ink}"
    padding: "18px 0"
  contact-row-hover:
    textColor: "{colors.red-ink}"
  mobile-deck:
    backgroundColor: "{colors.paper}"
    width: "min(100%, 34svh)"
  lang-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "5px 6px"
---

# Design System: aelxand

## Overview

**Creative North Star: "The Pressing"**

The site is a single LP on a near-black board, and the first viewport is the record player. Alexandre is the cover: a square sleeve with his portrait Bayer-dithered to 1-bit red and shimmering continuously, the catalog number AELX-001 and his role in DotGothic across the top, his name huge in Bricolage at the foot. A vinyl disc slides out from behind the sleeve's right edge and turns with scroll. Beside it, Side A is a hairline-ruled tracklist coded A1–A5. The stage is pinned: each stretch of scroll (or hovering a row) plays the next track, and the sleeve swaps its artwork to that project's real footage or a name-only type cover while the track's note (code, title, one Fraunces line, metadata, links) appears under it. Past the record, the page follows the object: Backstage (a vertical rail title, a rolling terminal, and credits), a stack marquee, Side B as a mirrored index spread with its own disc, and a closing duo of Contact beside On rotation.

Density is editorial, not dashboard: few elements per viewport, very large structural type against small machine type, and nothing but hairlines dividing it. Red #ee0022 is the only color the site authors; everything else is warm-violet grays on paper black. Dithering is reserved for the person and the ground: the portrait and a three-layer background with depth blur. The work shows itself as it is.

The world rejects the centered hero over a row of equal project cards, light mode, any second accent, and decorative kanji (Japanese appears only as a locale).

**Key Characteristics:**
- One authored ink: red #ee0022 on near-black, with a lifted red (#ff3a50) for small red text.
- 1-bit Bayer dithering on the portrait and the background only; projects appear as real footage or a type cover.
- 0.5px gray hairlines are the only dividers; surfaces are square-cornered.
- Five type roles with fixed jobs: structure, voice, reading, machine, labels.
- Motion has two verbs for text: the name and section titles glitch, note titles scramble. Everything else moves with scroll: the stage steps, the disc spins, the ground drifts.

## Colors

One saturated red against a family of warm, faintly violet near-blacks and grays; the site authors no second hue.

### Primary
- **Pressing Red** (`red`): the only accent. The dithered portrait, the disc label, the Fraunces voice phrase in every section head, the active or hovered track name in the Side A tracklist, the live dot, the selection highlight, focus outlines, the Rotation frame on hover, the terminal's first window dot. Used at display sizes or as fill.
- **Lifted Red Ink** (`red-ink`): the same hue lifted for small text (5.6:1 on paper where #ee0022 is 4.4:1). Track codes, the "live" label, the `~/` of the mark, link and contact hover, Side B names on hover, the glitch slice.
- **Deep Red** (`red-dim`): scrollbar thumb only.

### Neutral
- **Paper Black** (`paper`): page ground, the frosted top bar, the phone deck; also the text on red (`on-red`) and the disc's spindle hole.
- **Sleeve Board** (`sleeve-board`): the face of the sleeve and the ground of a type cover; one step above paper so the square reads as printed board.
- **Raised Violet** (`raised`): the terminal's title bar, the one piece of window chrome.
- **Ink** (`ink`): primary text and headlines; the inverted current-language tab.
- **Ink Dim** (`ink-dim`): voice lines, credit values, Side B descriptions, pills.
- **Ink Muted** (`ink-muted`): nav links, tracklist metadata, the terminal path and prompt, footer links.
- **Ink Faint** (`ink-faint`): labels, dates, run times, note metadata, footer, contact keys and arrows, the disc's rim notch.
- **Hairline** (`line`, ink at 20%): every divider and frame. **Strong Hairline** (`line-strong`, 38%): link underlines, the marquee's outlined stroke, empty window dots. **Tint** (`tint`, 5%): active/hover row wash.
- **CRT Phosphor** (`crt-bg`, `crt-fg`): inside the terminal screen only (crt-bg also letterboxes project video); a red-shifted black and a hotter red so the screen reads as emitting, not printed. Output lines sit in a pale pink (#ffd0d5 at 75%).

### Named Rules
**The One Ink Rule.** Red #ee0022 is the only chromatic color the site authors. Grays carry a faint violet cast; nothing else gets hue. Two sanctioned exceptions, both contained: the CRT's channel-fringe text-shadow lives only on the terminal screen, and a project's own footage plays in its own colors only inside the sleeve frame.

**The Lifted Ink Rule.** Red text below display size uses `red-ink`, never `red`. `red` is for fills, artwork, and type large enough to pass on its own.

## Typography

**Structure Font:** Bricolage Grotesque Variable 800 (system-ui fallback)
**Voice Font:** Fraunces Variable, italic 300 only (Georgia fallback)
**Reading Font:** Geist Variable (Noto Sans JP added for ja)
**Machine Font:** Fira Code Variable
**Label Font:** DotGothic16

**Character:** A tight, heavy grotesque does the shouting; one thin italic serif phrase per heading does the feeling; a dot-matrix face prints catalog numbers like a pressing plant would; Fira Code keeps the developer's own voice in every number, link, and the terminal.

### Hierarchy
- **Display** (Bricolage 800, scales with the sleeve: clamp(2.4rem, 13.5% of sleeve, 5.6rem), 0.9, -0.035em): the name on the sleeve. A type cover sets the project name at clamp(2.6rem, 6vw, 5.5rem) with the same leading and tracking.
- **Headline** (Bricolage 800, clamp(2rem, 4.4vw, 3.6rem), 1, -0.025em): section heads, always ending in one Fraunces italic red phrase ("Side A *featured*"). Small variant clamp(1.6rem, 2.8vw, 2.3rem) for the closing duo; above 900px the Backstage head runs as a vertical rail at clamp(2.4rem, 4.4vw, 4rem).
- **Title** (Bricolage 800, clamp(1.7rem, 2.6vw, 2.4rem), 1, -0.025em): the active track's note title; 1.5rem on phones.
- **Row Title** (Bricolage 800, clamp(1.4rem, 2.2vw, 1.9rem), 1, -0.02em): tracklist names. Side B index names step to 1.15rem; contact values to clamp(1.1rem, 1.8vw, 1.5rem).
- **Voice** (Fraunces italic 300, `ink-dim`): note lines at clamp(1.02rem, 1.4vw, 1.2rem)/1.4, max 52ch (two lines on phones); the motto scales with the sleeve to 1.35rem, first clause in ink; the Side B lede at 1.15rem; alternating marquee items.
- **Body** (Geist 400, 16px, 1.6): credit values and Side B descriptions (0.9rem).
- **Machine** (Fira Code 400, 0.68–0.8rem): metadata, languages, stars, dates, nav, links, pills, the years readout, footer, the terminal.
- **Label** (DotGothic16 400, 0.75–0.78rem, 0.06em, uppercase, `ink-faint`): catalog strip, credit keys, contact keys. Track codes use it uncased at 0.8–0.95rem in `red-ink`.

### Named Rules
**The Five Jobs Rule.** Each face has one job and does not take another's: structure is always Bricolage 800, the emotional phrase is always Fraunces italic 300, numbers and links are always Fira Code, catalog marks are always DotGothic.

**The Upright Voice Rule.** CJK has no italic and only Fraunces' italic file ships, so under `lang="ja"` every voice element swaps to the reading face, upright, keeping its color and weight (`font-synthesis: none`). Never synthesize an oblique.

## Layout

A single column of sheets (vertical padding clamp(56px, 9vw, 112px)) inside a 1100px wrap with 20px gutters that respect safe-area insets. The top bar and the record stage run wider, to 1320px. Every in-page anchor lands 96px below the top (`scroll-margin-top`) to clear the 56px sticky bar.

**The record player.** The first section is taller than the viewport by 28svh per track (100svh + steps × 28svh) and holds a stage pinned under the top bar (sticky at 56px, height 100svh − 56px). The scroll travel is split into one step for the cover plus one per track. The stage is a two-column grid: the sleeve column is min(40vw, 100svh − 356px, 620px), leaving roughly 300px under it for the note; the column gap is 0.26 × the sleeve, the band where the disc label shows between sleeve and tracklist. The left column stacks sleeve and notes (18px apart); notes are layered in one grid cell (min 150px) so swapping never shifts layout. Hovering a row with a mouse or focusing it plays it; clicking scrolls to that track's step so scroll and selection agree.

**Spreads.** Backstage is a rail head beside a 7fr/5fr grid (terminal, credits). Side B is the index beside a sticky clamp(240px, 30vw, 400px) disc column, the mirror of the cover. The closing duo is 1fr/1fr: Contact beside On rotation. Rows are grids with fixed code columns (40px) and right-aligned tabular dates.

**Rhythm.** 14px is the in-row gap; row padding is 13–18px by density (index 13, tracklist 15, credits 16, contact 18); 18–24px between groups; spread gaps clamp(24–32px … 56–80px).

**Breakpoints.** At 900px the stage unpins and goes to one column; the deck (sleeve at min(100%, 34svh) plus the note) sticks under the top bar on a paper ground with a hairline bottom edge, bleeding to the screen edges, and the stage gains 40svh of bottom padding so the last row can pass under it. The last tracklist row whose top has passed under the deck's edge plays. The note voice clamps to two lines, the disc and the Side B disc hide, the nav hides, every spread goes to one column, and Side B descriptions wrap to a second line while dates hide. At 520px the years readout, tracklist dates, and the sleeve's role label hide, and credit rows stack.

## Elevation & Depth

Depth is material, not UI elevation. The page sits on a fixed three-layer dithered background, each painted once at 3px cells and moved only by transforms: a far layer of red Bayer glow pooling top-right and bottom-left (alpha 46, blur 2.4px), a middle layer of ink halftone dots growing toward the top-right (alpha 18, capped so dots never merge behind text, blur 1.4px), and a near layer of sparse 2×2 specks, a few red (alpha 70, blur 0.6px). The blur is a depth of field: the farther the layer, the softer. Scroll drifts the layers at speeds set by depth (0.35, 0.7, 1.3) over 60% of a viewport, and a mouse pointer tilts them up to 16px × depth against each other. Physical objects cast one soft drop shadow; nothing else lifts. The top bar is frosted paper (88% + 8px blur).

### Shadow Vocabulary
- **Sleeve drop** (`box-shadow: 0 30px 60px -28px #000`): the sleeve and the terminal.
- **Disc drop** (`box-shadow: 0 18px 50px -20px #000`): vinyl discs.

### Named Rules
**The Object Shadow Rule.** Only standalone objects on the board (sleeve, disc, terminal) cast shadows, and always a soft downward drop into black. Rows, pills, links, notes, the phone deck, and sections stay flat.

**The Soft Far Rule.** Background layers blur in proportion to their distance and never sharpen behind text; the ground is texture, never content.

## Shapes

Square. The sleeve, terminal, video, rows, and the Rotation frame have no radius; only the pill takes 2px. Round forms belong to the record and to signals: the vinyl (repeating 2px/1px radial grooves, a run-out ring at 38%, a red label inset 38% on Side A and 30% on Side B, a paper spindle hole, an off-centre rim notch and off-centre label text so rotation is visible), the 7px live dot, and the terminal's three window dots. Every frame and divider is a 0.5px `line` hairline; the pill uses a 1px `line` border. The dithered canvases always render pixelated.

## Components

### Sleeve (signature)
The record cover in the pinned stage. A 200×200 canvas of the portrait, Bayer-dithered in red and scaled up pixelated, develops from black over 700ms on load and then shimmers continuously (the threshold matrix shifts every 110ms while on screen). Square sleeve-board frame, 0.5px hairline, sleeve drop. Top strip: catalog number and role in DotGothic over a paper scrim. Foot: the name (Display, glitches) and the motto in Fraunces with its first clause in ink, over a paper scrim. Each Side A track has a layer above the portrait that fades in over 350ms while active: the project's real video (muted, looping, `object-fit: cover` at 50% 45%, only the active one plays) or a type cover (the name in Bricolage 800 over a soft 32% red glow and a bottom scrim on sleeve-board, not dithered). While a track plays, the foot fades out and drops 10px.

### Track note
One per Side A track, all pre-rendered and stacked in one cell under the sleeve; the active note fades and rises 6px in over 300ms. A row of code (DotGothic, `red-ink`), title (Title role, scrambles each time the track starts), and a right-aligned status pill; a Fraunces voice line; a Fira Code metadata line (language, stars, updated date) with source and live links. Before any track plays, the slot holds a short Fira Code cover note in `ink-muted`.

### Disc
Vinyl behind the sleeve, 72% of its width, sliding out from its right edge (right −50%, top 14%), rotating a quarter turn per viewport of scroll via `--spin`. Label in DotGothic 0.56rem on red with a Bricolage 800 line. The Side B disc is in-flow and sticky at 96px, and labels itself with the code and name of the row under the pointer.

### Tracklist and index rows
Hairline-ruled grids: code (DotGothic, `red-ink`), name (Bricolage 800), info (Fira Code, `ink-muted`; language, live dot + "live" in `red-ink`, stars), time (Fira Code, `ink-faint`, right-aligned, tabular). Tracklist rows are buttons: hover and the playing row get the `tint` wash and the name turns red. Side B rows add a Geist description and a live arrow; the hovered row washes and its name turns `red-ink`. No cards, no thumbnails.

### Pill and live dot
Fira Code 0.68rem, `ink-dim`, 1px `line` border, 2px radius. "building" carries a 6px square red dot; "live" carries the live dot: a 7px red circle with a ring that pulses out to 2.8× and fades every 1.6s, like an on-air lamp. The live dot also marks live tracks in the tracklist.

### Links
Fira Code 0.8rem in ink with a 0.5px `line-strong` underline offset 5px and an authored 16px arrow; hover turns text and underline `red-ink` and nudges the arrow 2px up-right. Contact rows scale this up: DotGothic key (84px column), Bricolage value that may break only after "/", a 1.1rem arrow in `ink-faint` that turns `red-ink` and moves 3px up-right on hover.

### Navigation
Sticky 56px top bar of frosted paper with a hairline bottom: `~/aelxand` mark (`~/` in `red-ink`), Fira Code nav in `ink-muted` (hover ink), the "~N years as a fullstack dev" readout in `ink-faint`, and a language switch whose current tab is inverted (ink fill, paper text). The footer repeats the language switch.

### Terminal (Backstage)
A decorative shell window, hidden from assistive tech, beside the credits. Title bar on `raised` with a hairline bottom: three 10px window dots (the first filled red, the others hairline rings) and the path `/home/aelxand` centered in Fira Code. The screen holds 16 rows pinned to the bottom so it scrolls like a real terminal: `~ $ ` prompts in `ink-muted`, commands in `crt-fg` typed 1–2 characters per 28–78ms, outputs in pale pink, looping forever. Red/blue channel fringe, 1px-in-3px scanlines at 0.32, an RGB aperture mask at 16%, a slow 8s roll band, vignette, a 5s flicker. The server renders a still first screen.

### Credits
Hairline spec rows: DotGothic key (120px column, uppercase, `ink-faint`), Geist value in `ink-dim`. Years are computed ("~N years as a fullstack dev"). A LinkedIn link closes the column.

### Marquee (stack)
Two identical groups translate exactly one group width over 60s so the loop is seamless; spacing lives inside items. Items alternate outlined Bricolage 800 (1px `line-strong` stroke, transparent fill) and solid red Fraunces italic. Hairline top and bottom, edge fade mask, pauses on hover.

### On rotation
A hairline-framed link to the Spotify widget; the image replaces a Fira Code fallback line only once it has actually loaded, so the frame is never empty. The frame turns red on hover.

### Motion
- **Glitch** (the name: mount, hover, and idle every 5–9s while on screen; section heads: on view at 60%): 0.9s stepped jitter and skew with a `red-ink` channel shadow, plus two clipped slices of the text (`red-ink` and `ink-faint`).
- **Scramble** (note titles, each time the track activates): characters locked to measured widths cycle random glyphs, resolving left to right over 600ms + 16ms per char; layout never reflows.
- **Stage step**: notes cross-fade 300ms, sleeve layers 350ms, sleeve foot 300ms.
- **Portrait shimmer**: Bayer offset steps every 110ms, cycle of 8.
- **Disc spin**: 90° per viewport of scroll. **Background**: scroll and pointer parallax by depth.
- Transitions use `cubic-bezier(.215,.61,.355,1)` at 90ms (color) and 180ms (movement).
- **Reduced motion:** all CSS animation and transitions off, smooth scroll off, glitch and scramble skipped, the portrait shows at once and holds still, videos do not play, the disc and the background stay still, the terminal shows its still screen.

## Do's and Don'ts

### Do:
- **Do** divide with 0.5px `line` hairlines and nothing else; frame physical objects with the same hairline.
- **Do** end every section head with one Fraunces italic phrase in red.
- **Do** keep Bayer dithering (shared 8×8 matrix, 3px cells, rendered pixelated) for the portrait and the ground; show project work as its real footage or a type cover inside the sleeve.
- **Do** use `red-ink` (#ff3a50) for red text below display size, and DotGothic for codes and catalog marks.
- **Do** keep numbers in Fira Code with tabular figures, and make every number computed (years, stars, dates).
- **Do** give new animated text one of the two verbs (glitch, scramble) and gate it on reduced motion.
- **Do** mark anything deployed and reachable with the pulsing live dot.
- **Do** swap the voice to the reading face, upright, under `lang="ja"`.

### Don't:
- **Don't** add a second accent hue, a light theme, or gradients other than paper scrims and the type cover's red glow.
- **Don't** set project grids of equal cards; work is a tracklist that plays on the sleeve.
- **Don't** round surfaces; only the pill takes 2px.
- **Don't** shadow anything that is not a standalone object on the board.
- **Don't** let a background layer sharpen or brighten enough to compete with text.
- **Don't** use decorative kanji or set Japanese outside the ja locale.
- **Don't** synthesize an italic or oblique for CJK.
