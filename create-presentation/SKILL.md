---
name: create-presentation
description: Create and live-edit presentation slide decks as multi-file HTML with keyboard navigation, served with hot reload via browser-sync. Use when the user wants to create a presentation or slide deck.
---

# Presentation Slide Builder

Create presentations as HTML slide decks with live preview.

## When triggered

Ask:
1. What is the topic?
2. Who is the audience?
3. How many slides?
4. Any brand colors, fonts, or style reference?

If the user provides arguments (e.g., `/create-presentation AI Marketing`), use those as the topic and skip question 1.

## Pre-generation checklist

Before writing any slides:
1. **Read ALL source material first.** If the user references files or URLs, read every one before writing slides.
2. Plan the full slide list (titles + types).
3. Then write slides.

## Step 1: Scaffold

Run the scaffold script to create the project directory:

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/scaffold.sh "<slug>"
```

Where `<slug>` is a short kebab-case name (e.g., `ai-marketing`, `q1-review`).

This creates `presentation/YYYYMMDD-HHMM-slug/` with:
- `index.html` — the shell with all CSS, JS, and navigation (DO NOT recreate this)
- `slides/` — template slide files for every type (use as reference)

The script outputs `SCAFFOLD_DIR`. Save this path — you need it for steps 2-4.

**Do NOT start the server yet.** Finish writing all slides first.

## Step 2: Write slides

Each slide is a small HTML fragment file in `slides/`. The scaffold copies template examples for every slide type — use them as reference.

**File naming:** `NN-slug.html` (e.g., `01-title.html`, `05-key-metrics.html`)

**Every slide file starts with a type comment on line 1.** Valid types: `title`, `content`, `two-col`, `image`, `quote`, `code`, `divider`, `stat`, `cards`, `end`

### Quick reference (all types)

**title** — opening slide:
```html
<!-- slide-type: title -->
<h1 class="animate-in">Title Here</h1>
<p class="subtitle animate-in">Subtitle here</p>
<p class="author animate-in">Author &middot; Date</p>
```

**content** — bullet points (the workhorse):
```html
<!-- slide-type: content -->
<h2 class="animate-in">Heading</h2>
<ul>
  <li class="animate-in">Point one</li>
  <li class="animate-in">Point two</li>
  <li class="animate-in">Point three</li>
</ul>
```

**two-col** — side-by-side (MUST use `.columns` wrapper):
```html
<!-- slide-type: two-col -->
<h2 class="animate-in">Heading</h2>
<div class="columns animate-in">
  <div class="col"><h3>Left</h3><p>Content</p></div>
  <div class="col"><h3>Right</h3><p>Content</p></div>
</div>
```

**quote**:
```html
<!-- slide-type: quote -->
<div class="quote-mark animate-in">&ldquo;</div>
<blockquote class="animate-in">Quote text here.<cite>Author Name</cite></blockquote>
```

**stat** — one big number:
```html
<!-- slide-type: stat -->
<h2 class="animate-in">Heading</h2>
<div class="stat-number animate-in">73%</div>
<div class="stat-label animate-in">Label</div>
<p class="stat-description animate-in">Description</p>
```

**cards** — 2-4 items in grid (MUST use `.card-grid` wrapper):
```html
<!-- slide-type: cards -->
<h2 class="animate-in">Heading</h2>
<div class="card-grid animate-in">
  <div class="card"><h3>Card 1</h3><p>Text</p></div>
  <div class="card"><h3>Card 2</h3><p>Text</p></div>
  <div class="card"><h3>Card 3</h3><p>Text</p></div>
</div>
```

**image**:
```html
<!-- slide-type: image -->
<h2 class="animate-in">Heading</h2>
<div class="image-container animate-in">
  <img src="path/to/image.png" alt="Description">
</div>
```

**code**:
```html
<!-- slide-type: code -->
<h2 class="animate-in">Heading</h2>
<pre class="animate-in"><code>your code here</code></pre>
```

**divider** — section break:
```html
<!-- slide-type: divider -->
<h1 class="animate-in">Section Name</h1>
<p class="animate-in">Brief teaser</p>
```

**end** — closing slide:
```html
<!-- slide-type: end -->
<h1 class="animate-in">Thank You</h1>
<p class="subtitle animate-in">Questions?</p>
<div class="contact animate-in"><p>email@example.com</p></div>
```

### Tips for choosing types

- 5+ bullet points? Split into two `content` slides or use `cards`.
- Comparing two things? Use `two-col`.
- One big number? Use `stat`.
- Section break? Use `divider`.

## Step 3: Update the manifest

After writing all slide files, update the manifest array in `index.html`. It is a JSON array inside `<script id="slide-manifest">`:

```html
<script id="slide-manifest" type="application/json">
["01-title.html","02-agenda.html","03-problem.html","04-end.html"]
</script>
```

The array controls slide order. **Every slide file must be listed, and only listed files will show.**

Remove the template example slides from the manifest if you replaced them.

## Step 4: Start the server

Only after ALL slides are written and the manifest is updated, start the preview server:

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/serve.sh "<SCAFFOLD_DIR>"
```

The script outputs `SERVER_PID` and `SERVER_URL`. Now tell the user:

> Your presentation is ready! Open this link to view it:
>
> http://localhost:PORT
>
> Any changes will appear automatically. Let me know when you're done so I can stop the server.

## Editing slides

- **Change a slide:** Edit just that file in `slides/`. Browser auto-reloads.
- **Add a slide:** Create the file, add it to the manifest.
- **Remove a slide:** Delete the file, remove from manifest.
- **Restyle/rebrand:** Edit ONLY the `:root` CSS variables block at the top of `index.html`. Change colors, fonts, sizes there. Slide files never need changing for a restyle.

After any add/remove, print the full slide list for the user to verify.

## Customizing brand colors and fonts

All visual styling is controlled by CSS variables in `index.html`'s `:root` block. To match a brand:

1. Open `index.html`
2. Edit the `:root` variables — change `--bg-primary`, `--accent`, `--font-heading`, etc.
3. If using Google Fonts, add `@import` at the top of `<style>`

No slide files need editing — everything flows through the variables.

## PDF export

When the user asks to export as PDF:

```bash
cd ${CLAUDE_SKILL_DIR}/scripts && npm ls puppeteer 2>/dev/null || npm install puppeteer
cd ${CLAUDE_SKILL_DIR}/scripts && node export-pdf.mjs <SERVER_URL> "<output.pdf>"
```

For selectable text mode, add `--text` flag.

## Stopping the server

When the user is done, kill the server by its PID (from `serve.sh` output):

```bash
kill <SERVER_PID>
```

## Rules

- NEVER put `<style>` or `<script>` in slide files. All CSS/JS is in `index.html` only.
- NEVER use external CDN links (except Google Fonts when user asks).
- ALWAYS update the manifest when adding or removing slides.
- When editing, read only the files you need to change.
