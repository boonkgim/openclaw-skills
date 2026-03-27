---
name: create-presentation
description: Create a marketing plan presentation as a single HTML file. Use when the user wants to create a presentation or slide deck.
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

The template contains 12 slides:

| Slide | Content |
|-------|---------|
| 1 | Title — presentation name, subtitle, author |
| 2 | Company Overview — what the business does, products, differentiator |
| 3 | Marketing Objectives — 3 numbered goals |
| 4 | Target Audience — ICP profile + pain points (two columns) |
| 5 | Marketing Strategy — growth engine + channels (two columns) |
| 6 | Content Pillars — 4 pillars in 2x2 grid |
| 7 | Content Pipeline — upcoming content items |
| 8a | Creative Sample: AIDA — ad image + copy |
| 8b | Creative Sample: BAB — ad image + copy |
| 8c | Creative Sample: PAS — ad image + copy |
| 9 | 90-Day Roadmap — 3 months phased plan (two columns) |
| 10 | KPIs & Measurement — key metrics |
| 11 | Execution Model — AI tasks vs human review (two columns) |
| 12 | Closing — thank you, contact |

## Step 3: Replace placeholders

For each slide, find the relevant source material, then replace the `{{PLACEHOLDER}}` text with real content.

**Rules:**
- Keep each bullet under 15 words.
- If a slide has more `<li>` items than needed, delete the extra `<li>` lines.
- To duplicate a slide (e.g., one per ad creative), copy the entire `<section>...</section>` block.
- To remove a slide, delete the entire `<section>...</section>` block.
- Do NOT change HTML tags, CSS classes, or the `<style>`/`<script>` sections.

## Done

Tell the user to open the HTML file in their browser. Keyboard shortcuts:
- Arrow keys / Space — navigate slides
- F — fullscreen
- P — print to PDF
