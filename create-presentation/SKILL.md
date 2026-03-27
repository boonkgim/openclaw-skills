---
name: create-presentation
description: Create and live-edit presentation slide decks as multi-file HTML with keyboard navigation, served with hot reload via browser-sync. Use when the user wants to create a presentation or slide deck.
---

# Presentation Slide Builder

This skill uses pre-built HTML slide templates with `{{PLACEHOLDER}}` markers.
Your job is simple: copy the template, read source material, replace placeholders, start the server.

## Step 1: Gather info

Ask the user (skip any already provided in their message):
1. What is the topic?
2. Who is the audience?
3. How many slides? (default: use all 12 templates)
4. Any brand colors, fonts, or style reference?

## Step 2: Copy the template

Copy the `templates/` folder (next to this SKILL.md) to a new presentation folder:

```
presentation/<YYYYMMDD>-<slug>/
├── index.html          (copied from templates/index.html)
└── slides/             (copied from templates/slides/)
    ├── 01-title.html
    ├── 02-overview.html
    ├── ...
    └── 12-end.html
```

Where `<slug>` is a short kebab-case name (e.g., `marketing-plan`).

The 12 template slides are:

| File | Layout | Use for |
|------|--------|---------|
| `01-title.html` | Title slide | Opening — title, subtitle, author |
| `02-overview.html` | Bullet list | Executive summary, overview |
| `03-objectives.html` | Numbered list | Goals, objectives |
| `04-profile.html` | Two columns | Audience profile, persona |
| `05-strategy.html` | Two columns | Strategy, approach, channels |
| `06-grid.html` | 2x2 card grid | Content pillars, features, categories |
| `07-creative.html` | Image + text | Creative samples, demos, screenshots |
| `08-timeline.html` | Two columns | Roadmap, phased plan |
| `09-metrics.html` | Bullet list | KPIs, measurements, targets |
| `10-model.html` | Two columns | Execution model, comparison |
| `11-highlight.html` | Big number | Key stat, achievement |
| `12-end.html` | Closing slide | Thank you, contact info |

## Step 3: Read source material and replace placeholders

For each slide, read the relevant source file(s), then immediately replace the `{{PLACEHOLDER}}` text in that slide with real content. Work through slides one at a time — read the source, edit the slide, move to the next.

**Rules:**
- Replace `{{PLACEHOLDER}}` text with real content. Keep it concise — each bullet under 15 words.
- If a slide has more `<li>` items than you need, delete the extra `<li>` lines.
- If you need to **duplicate a slide** (e.g., multiple creative samples), copy the file with a new number and add it to the manifest.
- Do NOT change any HTML tags, CSS classes, or `<!-- slide-type -->` comments.
- Do NOT add `<style>` or `<script>` to slide files.

## Step 4: Remove unused slides

If any template slides don't apply to this presentation:

1. Delete those slide files from `slides/`
2. Open `index.html` and find the `<script id="slide-manifest">` block
3. Remove the deleted filenames from the JSON array

Example — if you deleted `11-highlight.html`:
```html
<script id="slide-manifest" type="application/json">
["01-title.html","02-overview.html","03-objectives.html","04-profile.html","05-strategy.html","06-grid.html","07-creative.html","08-timeline.html","09-metrics.html","10-model.html","12-end.html"]
</script>
```

## Step 5: Start the preview server

Run from the skill directory (the directory containing this SKILL.md):

```
node scripts/serve.mjs "<presentation-folder>"
```

This starts a local HTTP server (no dependencies needed). Tell the user the URL from the output.

To stop: `kill <SERVER_PID>` (Mac/Linux) or close the process (Windows).

## Later: Editing and restyling

- **Change a slide:** Edit the file in `slides/`. Refresh the browser to see changes.
- **Add a slide:** Create the file, add it to the manifest array in `index.html`.
- **Remove a slide:** Delete the file, remove from the manifest.
- **Restyle/rebrand:** Edit the `:root` CSS variables in `index.html`. No slide files need changing.

## PDF export

Press `P` in the browser or use File > Print. The slides are print-ready (one slide per page, 16:9).
