---
name: create-presentation
description: Create and live-edit presentation slide decks as multi-file HTML with keyboard navigation, served with hot reload via browser-sync. Use when the user wants to create a presentation or slide deck.
---

# Presentation Slide Builder

You create presentation decks as a set of HTML files: one shell (index.html) with all CSS and JS, and individual slide fragment files. The user previews in their browser with hot reload using browser-sync.

## Templates

This skill includes ready-to-use templates at `${CLAUDE_SKILL_DIR}/templates/`:

- `index.html` : complete shell with all CSS, JS, navigation, animations, and print styles
- `slides/01-title.html` through `slides/10-end.html` : one example per slide type

When generating a deck, ALWAYS start by copying `${CLAUDE_SKILL_DIR}/templates/index.html` to the project directory. Then create slide fragment files using the template examples as reference for each slide type's HTML structure.

Do NOT write CSS or JS from scratch. The template index.html already contains everything needed. Only modify the `:root` token block if the user wants a different theme.

## When triggered

When the user says `/create-presentation`, ask:
1. What is the presentation about?
2. Who is the audience?
3. Roughly how many slides?
4. Any design reference? (website URL, brand colors, or style preference)

If the user provides arguments (e.g., `/create-presentation AI Marketing for Small Business`), use those as the topic and skip asking question 1. Still ask the remaining questions if not clear from context.

Then generate the deck.

### Pre-generation checklist

Before writing any slide files:
1. **Read ALL source material first.** If the user references files, URLs, or documents, enumerate and read every single one before writing the first slide. Do not start generating slides with partial knowledge — this causes multiple correction rounds.
2. Plan the full slide list (titles + types) based on everything you read.
3. Only then start writing slide files.

## File structure

Create files in a timestamped subdirectory under `presentation/`:

```
presentation/[yyyymmdd]-[hhmm]-[slug]/
  index.html              # Shell: all CSS, design tokens, navigation JS, slide loader
  slides/
    01-title.html         # Each slide is a fragment file
    02-agenda.html
    03-problem.html
    ...
    NN-end.html
```

Where:
- `yyyymmdd` is the current date (e.g., `20260322`)
- `hhmm` is the current time in 24h format (e.g., `1430`)
- `slug` is a short kebab-case name derived from the presentation topic (e.g., `ai-marketing`, `q1-review`)

Example: `presentation/20260322-1430-ai-marketing/`

If the user specifies a different location, use that instead.

- `index.html` : the shell that contains ALL CSS (design tokens + component styles), ALL JavaScript (navigation, slide loading, animations), and the slide container. It loads slide fragments dynamically.
- `slides/*.html` : each file is a single slide fragment. It contains ONLY the inner content of one `<section>` element. No `<html>`, `<head>`, `<body>`, `<style>`, or `<script>` tags. Just the slide markup.

### Slide file naming

Files are named `NN-slug.html` where:
- `NN` is a zero-padded two-digit number (01, 02, ... 99) controlling the order
- `slug` is a short descriptive kebab-case name
- Examples: `01-title.html`, `05-key-metrics.html`, `12-end.html`

**NEVER use letter suffixes like `03a`, `07b`.** Slide filenames must be strictly sequential integers. The user sees slides numbered by position in the browser (slide 1, slide 2, ...) and the filename number must match. If you insert a slide between 03 and 04, renumber 04 and all subsequent files upward (04→05, 05→06, etc.) and update the manifest.

The JS loader reads the manifest to determine slide order.

### Slide fragment format

Each slide file looks like this:

```html
<!-- slide-type: content -->
<h2>The Heading</h2>
<ul>
  <li>First point</li>
  <li>Second point</li>
</ul>
```

The first line is an HTML comment specifying the slide type. The loader reads this and applies the corresponding CSS class to the wrapping `<section>`.

Valid slide types: `title`, `content`, `two-col`, `image`, `quote`, `code`, `divider`, `stat`, `cards`, `end`

**Required HTML structure per slide type:**

The `two-col` type MUST use the `.columns` wrapper div. Putting `<div class="col">` directly inside the slide without the wrapper breaks the layout. Correct structure:

```html
<!-- slide-type: two-col -->
<h2 class="animate-in">Heading</h2>
<div class="columns animate-in">
  <div class="col">
    <h3>Left</h3>
    <p>Content...</p>
  </div>
  <div class="col">
    <h3>Right</h3>
    <p>Content...</p>
  </div>
</div>
```

The `cards` type MUST use the `.card-grid` wrapper:

```html
<!-- slide-type: cards -->
<h2 class="animate-in">Heading</h2>
<div class="card-grid animate-in">
  <div class="card">
    <h3>Card Title</h3>
    <p>Card content</p>
  </div>
  <!-- more cards... -->
</div>
```

The `image` type MUST use the `.image-container` wrapper:

```html
<!-- slide-type: image -->
<h2 class="animate-in">Heading</h2>
<div class="image-container animate-in">
  <img src="path/to/image.png" alt="Description" style="max-height: 55vh;">
</div>
```

When placing images inside a `two-col` slide, always add `style="max-height: 55vh; width: 100%; object-fit: contain;"` on the `<img>` to prevent overflow.

## Slide loader (in index.html)

The shell includes a `<script id="slide-manifest" type="application/json">` tag containing an array of slide filenames:

```html
<script id="slide-manifest" type="application/json">
["01-title.html","02-agenda.html","03-problem.html","04-end.html"]
</script>
```

On page load, the JavaScript:
1. Reads the manifest array
2. Fetches each file from `slides/`
3. Extracts the slide-type from the HTML comment on the first line
4. Wraps the content in `<section class="slide slide-{type}">`
5. Appends to the slide container
6. After all slides load, initializes navigation

When you add or remove a slide file, you MUST also update the manifest array in index.html.

### Generation order

When creating a new deck, write ALL slide files first, then update the manifest ONCE at the end. Do not update the manifest after each individual slide — this creates opportunities for the manifest to diverge from the actual files on disk.

## Starting the preview server

After generating the deck files, YOU must start the server. Do not ask the user to run commands. They should only need to click a URL.

### Steps

1. Check if a browser-sync process is already running for this project's presentation directory. If so, do nothing (it will auto-reload with the new files).
   ```bash
   ps aux | grep "[b]rowser-sync.*presentation/[yyyymmdd]-[hhmm]-[slug]"
   ```

2. If no server is running, find an available port starting from 3000:
   ```bash
   PORT=3000
   while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done
   echo $PORT
   ```

3. Start browser-sync in the background and capture its PID:
   ```bash
   cd presentation/[yyyymmdd]-[hhmm]-[slug] && npx browser-sync start --server --files "index.html, slides/*.html" --no-notify --no-open --port $PORT &
   ```

4. **Wait for the process output to confirm the actual port.** The port browser-sync binds may differ from `$PORT` if there is a race condition. Read the exec output and extract the actual URL (e.g., `Local: http://localhost:3008`). Report THAT URL to the user, not the predicted port.

5. Tell the user:
   > Your presentation is ready! Open this link to view it:
   >
   > http://localhost:3008
   >
   > Any changes you ask me to make will appear automatically in your browser. Let me know when you are done so I can stop the preview server.

   (Use the actual port from the browser-sync output, not the predicted port.)

### Important server rules

- NEVER ask the user to run terminal commands. You handle all of it.
- NEVER explain what browser-sync is, what ports are, or how servers work. Just give them the URL.
- If the server fails to start (e.g., npx not found, node not installed), tell the user in plain language: "I could not start the preview. Please make sure Node.js is installed on your computer." Do not show error logs.
- If the user closes the chat and comes back later, check if the server is still running before starting a new one.
- When the user says they are done, stop the server by finding and killing its specific PID. Do NOT use broad `pkill -f "browser-sync"` as this kills unrelated browser-sync instances from other projects:
  ```bash
  # Find the specific PID for this presentation's server
  ps aux | grep "[b]rowser-sync.*--port $PORT" | awk '{print $2}' | xargs kill
  ```

## index.html specification

### Design token system

ALL visual styling must flow through CSS custom properties in `:root`. This allows restyling the entire deck by editing just the variables.

```css
:root {
  /* === THEME TOKENS — edit these to restyle the entire deck === */

  /* Backgrounds */
  --bg-primary: #0f0f1a;
  --bg-secondary: #1a1a2e;
  --bg-surface: rgba(255, 255, 255, 0.04);
  --bg-surface-hover: rgba(255, 255, 255, 0.08);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b0b0c0;
  --text-muted: #6a6a80;

  /* Accent */
  --accent: #4fc3f7;
  --accent-soft: rgba(79, 195, 247, 0.15);
  --accent-glow: rgba(79, 195, 247, 0.3);

  /* Typography */
  --font-heading: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-body: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;

  --text-xs: clamp(0.75rem, 1vw, 0.875rem);
  --text-sm: clamp(0.875rem, 1.2vw, 1rem);
  --text-base: clamp(1rem, 1.5vw, 1.25rem);
  --text-lg: clamp(1.25rem, 2vw, 1.75rem);
  --text-xl: clamp(1.75rem, 2.5vw, 2.25rem);
  --text-2xl: clamp(2.25rem, 3.5vw, 3.25rem);
  --text-3xl: clamp(3rem, 5vw, 4.5rem);

  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 3rem;
  --space-xl: 5rem;

  /* Effects */
  --radius: 12px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  --border: 1px solid rgba(255, 255, 255, 0.08);
  --transition: 200ms ease;

  /* Slide */
  --slide-padding: var(--space-xl) var(--space-xl);
}
```

EVERY color, font, size, spacing, and effect in the CSS must reference these tokens. Never hardcode values in component styles.

### Restyling from a reference

When the user says "match my website at [URL]" or "use [brand] colors":

1. Analyze the reference to extract: colors, fonts, border radius, overall feel
2. Update ONLY the `:root` token block in index.html
3. If the reference uses a light theme, flip backgrounds and text
4. If the reference uses Google Fonts, add a single `@import` at the top of `<style>` (the ONE exception to the no-external-links rule, only when user explicitly asks)

Restyling is a single edit to index.html's `:root` block. Slide files never need changing for a restyle.

### Viewport and dimensions

- 16:9 aspect ratio (1920x1080 logical pixels)
- `<meta name="viewport" content="width=1920">`
- Each slide `<section>` is `100vw` x `100vh`
- Only one slide visible at a time

### Keyboard navigation

- Right arrow, Down arrow, Space, Enter, PageDown : next slide
- Left arrow, Up arrow, Backspace, PageUp : previous slide
- Home : first slide
- End : last slide
- F : toggle fullscreen
- Escape : exit fullscreen
- P : open print dialog (basic PDF fallback)
- Slide number tracked in URL hash (`#3`) to survive reload
- Subtle slide counter bottom-right: "3 / 12"

### Slide type CSS classes

1. **`.slide-title`**: large centered title, subtitle, optional author/date. Radial gradient from `--accent-glow` on background.
2. **`.slide-content`**: heading + body text or bullets. Bullets use `--accent` colored custom markers.
3. **`.slide-two-col`**: heading + two side-by-side columns with subtle divider.
4. **`.slide-image`**: heading + large centered image with `--radius` and `--shadow`.
5. **`.slide-quote`**: large centered quote with oversized `--accent` quotation mark, attribution below.
6. **`.slide-code`**: heading + code block with `--bg-surface` background, `--accent` left border, `--font-mono`.
7. **`.slide-divider`**: big bold centered text with `--accent` underline.
8. **`.slide-stat`**: large number in `--accent`, label below.
9. **`.slide-cards`**: heading + 2-4 cards in a grid with `--bg-surface`, `--border`, `--radius`, `--shadow`.
10. **`.slide-end`**: closing slide with contact info.

### Visual polish (built into default CSS)

- Subtle dot pattern overlay on backgrounds using CSS radial-gradient
- Cards and surfaces use `--bg-surface` with `--border` and `--shadow`
- Accent left border on blockquotes and code blocks
- Progress bar at top (3px, `--accent`, width = current/total percentage)
- Headings: `letter-spacing: -0.02em`, `font-weight: 700`
- Custom `--accent` bullet markers
- Subtle `text-shadow` on headings for depth

### Animations

- Slide transition: 200ms fade
- `.animate-in` on elements: fade in (opacity 0 to 1) on slide entry, staggered 80ms per element
- Professional only. No bouncing, spinning, or distracting effects.

### PDF export

This skill includes a Puppeteer-based export script at `${CLAUDE_SKILL_DIR}/scripts/export-pdf.mjs` with two modes:

| Mode | Command flag | Shadows/gradients | Text selectable |
|------|-------------|-------------------|-----------------|
| **Default** | (none) | Yes | No |
| **Text** | `--text` | No (stripped cleanly) | Yes |

Use the default mode unless the user specifically asks for selectable/searchable text.

When the user asks to export as PDF, YOU run the script. Do not ask the user to do it.

#### Steps

1. Make sure the preview server is running (you need the URL and port).

2. Install puppeteer if not already available in the skill scripts directory:
   ```bash
   cd ${CLAUDE_SKILL_DIR}/scripts && npm ls puppeteer 2>/dev/null || npm install puppeteer
   ```

3. Run the export script, pointing at the live server URL:
   ```bash
   # Default: pixel-perfect with shadows
   cd ${CLAUDE_SKILL_DIR}/scripts && node export-pdf.mjs http://localhost:$PORT "<output.pdf>"

   # Text mode: selectable text, shadows stripped cleanly
   cd ${CLAUDE_SKILL_DIR}/scripts && node export-pdf.mjs http://localhost:$PORT "<output.pdf>" --text
   ```
   Save the PDF in the presentation directory with a descriptive name.

4. Tell the user:
   > Your PDF has been exported to: <path>

#### Important PDF rules

- ALWAYS use the live server URL (http://localhost:PORT), never a file:// path. The slides load via fetch() and need a server.
- If puppeteer fails to install, tell the user: "I need to install a tool to export PDFs. Please make sure you have Node.js installed."
- The P keyboard shortcut in the browser is a basic fallback (browser print). The Puppeteer export is the primary method and produces much better results.

## How to edit slides

When the user asks to change a specific slide:
1. Read ONLY that slide's fragment file (e.g., `slides/05-key-metrics.html`)
2. Make the changes
3. Write the file back
4. Browser auto-reloads

When the user asks to add a slide:
1. Renumber all subsequent slide files upward (e.g., if inserting after 03: rename 04→05, 05→06, etc.)
2. Create the new fragment file with the now-available number
3. Update the manifest in index.html
4. **Confirm to the user** (see below)

When the user asks to remove a slide:
1. Delete the fragment file
2. Renumber all subsequent slide files downward to close the gap
3. Remove it from the manifest in index.html
4. **Confirm to the user** (see below)

When the user asks to replace a slide:
1. Delete the old fragment file and create the new one in the SAME step
2. Update the manifest if the filename changed
3. Never leave orphaned files on disk

When the user asks to reorder slides:
1. Rename the number prefixes of affected files
2. Update the manifest in index.html
3. **Confirm to the user** (see below)

When the user asks to restyle/rebrand:
1. Read ONLY index.html
2. Update the `:root` token block
3. No slide files need to change

### Confirm after structural changes

After ANY add, remove, reorder, or rename operation, print the full slide list so the user can verify:

> Your deck now has 12 slides:
> 1. Title — 01-title.html
> 2. Agenda — 02-agenda.html
> 3. Problem — 03-problem.html
> ...
> 12. End — 12-end.html

This prevents the user from discovering missing or misordered slides only after navigating the browser.

## Important rules

- NEVER put `<style>` or `<script>` in slide fragment files. All CSS and JS lives in index.html only.
- NEVER use external CDN links (except Google Fonts `@import` when user explicitly asks to match a reference).
- Keep slide fragments small and readable.
- ALWAYS update the manifest when adding, removing, or reordering slides.
- Slide counter must reflect actual slide count.
- ALL styling must use CSS custom properties from `:root`. No hardcoded values.
- When editing, read the minimum files needed. Do not read the entire deck to change one slide.
