---
name: create-presentation
description: Create and live-edit presentation slide decks as multi-file HTML with keyboard navigation, served with hot reload via browser-sync. Use when the user wants to create a presentation or slide deck.
---

# Presentation Slide Builder

Follow the steps below **in order**. Do not skip any step.

## Step 1: Gather info

Ask the user (skip any already provided in their message):
1. What is the topic?
2. Who is the audience?
3. How many slides?
4. Any brand colors, fonts, or style reference?

## Step 2: Read source material

If the user references any files or URLs, read **every one** before proceeding.

## Step 3: Plan slides

Write out a numbered list of slides with their title and type. Example:

```
1. title — "Company Strategy 2026"
2. content — "Executive Summary"
3. cards — "Three Pillars"
4. stat — "Key Metric"
5. end — "Thank You"
```

Show this to the user. Wait for confirmation or edits before writing files.

## Step 4: Scaffold the project

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/scaffold.sh "<slug>"
```

Where `<slug>` is a short kebab-case name (e.g., `ai-marketing`).

Save the `SCAFFOLD_DIR` path from the output. You need it for all later steps.

**Do NOT start the server yet.**

## Step 5: Read the slide types reference

```bash
cat ${CLAUDE_SKILL_DIR}/instructions/slide-types.md
```

Read this file now. It contains the HTML templates for every slide type. Use it as your reference for writing slides.

## Step 6: Write slides

For each slide in your plan from Step 3:
1. Create the file in `${SCAFFOLD_DIR}/slides/` named `NN-slug.html`
2. Copy the matching template from the reference, then fill in the real content

Write **all** slides before proceeding.

## Step 7: Clean up template files

The scaffold copied example template files. Delete every template file that is NOT part of your slide plan:

```bash
rm ${SCAFFOLD_DIR}/slides/01-title.html ${SCAFFOLD_DIR}/slides/02-content.html ...
```

List only the files that are NOT in your plan. If your plan reuses a template filename (e.g., `01-title.html`), you already overwrote it in Step 6 — do not delete it.

After cleanup, run `ls ${SCAFFOLD_DIR}/slides/` and verify only your planned slides remain.

## Step 8: Update the manifest

Open `${SCAFFOLD_DIR}/index.html` and find the `<script id="slide-manifest">` block. Replace its contents with a JSON array listing **only your slide filenames, in order**:

```html
<script id="slide-manifest" type="application/json">
["01-title.html","02-summary.html","03-pillars.html","04-metric.html","05-end.html"]
</script>
```

**Every slide file must be listed. Only listed files will show. Template files you deleted must NOT be listed.**

## Step 9: Start the preview server

```bash
cat ${CLAUDE_SKILL_DIR}/instructions/serve-and-edit.md
```

Read this file, then follow its instructions to start the server.

Tell the user the URL and that changes auto-reload.

## Later: Editing, restyling, PDF export

When the user asks to edit slides, restyle, or export PDF, read `${CLAUDE_SKILL_DIR}/instructions/serve-and-edit.md` for instructions.
