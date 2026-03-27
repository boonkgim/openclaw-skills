---
name: create-presentation
description: Create presentation slide decks as a single HTML file with keyboard navigation. Use when the user wants to create a presentation or slide deck.
---

# Presentation Slide Builder

The template is a single HTML file (`template.html` next to this SKILL.md) with 12 slides containing `{{PLACEHOLDER}}` text. Your job:

1. Copy the file
2. Replace placeholders with real content
3. Done — user opens it in a browser

## Step 1: Gather info

Ask the user (skip any already provided in their message):
1. What is the topic?
2. Who is the audience?
3. Any brand colors, fonts, or style reference?

## Step 2: Copy the template

Copy `template.html` (next to this SKILL.md) to the user's working directory as:

```
presentation/<YYYYMMDD>-<slug>.html
```

Where `<slug>` is a short kebab-case name (e.g., `marketing-plan`).

The template contains 12 slides:

| Slide | Layout | Use for |
|-------|--------|---------|
| 1 | Title | Opening — title, subtitle, author |
| 2 | Bullet list | Executive summary, overview |
| 3 | Numbered list | Goals, objectives |
| 4 | Two columns | Audience profile, persona |
| 5 | Two columns | Strategy, approach, channels |
| 6 | 2x2 card grid | Content pillars, features |
| 7 | Image + text | Creative samples, screenshots |
| 8 | Two columns | Roadmap, phased plan |
| 9 | Bullet list | KPIs, measurements |
| 10 | Two columns | Execution model, comparison |
| 11 | Big number | Key stat, achievement |
| 12 | Closing | Thank you, contact info |

## Step 3: Read source material and replace placeholders

For each slide, read the relevant source file(s), then replace the `{{PLACEHOLDER}}` text with real content.

**Rules:**
- Keep each bullet under 15 words.
- If a slide has more `<li>` items than needed, delete the extra `<li>` lines.
- To remove a slide, delete the entire `<section>...</section>` block.
- To duplicate a slide (e.g., multiple creative samples), copy the `<section>` block.
- Do NOT change HTML tags, CSS classes, or the `<style>`/`<script>` sections.

## Done

Tell the user to open the HTML file in their browser. Keyboard shortcuts:
- Arrow keys / Space — navigate slides
- F — fullscreen
- P — print to PDF
