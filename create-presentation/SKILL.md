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

If the user references any files or URLs, read **every one** before proceeding. Save the key content — you will pass it to a subagent later.

## Step 3: Plan slides

Write out a numbered list of slides with their filename, type, and title. Example:

```
01-title.html        title    "Company Strategy 2026"
02-summary.html      content  "Executive Summary"
03-pillars.html      cards    "Three Pillars"
04-metric.html       stat     "Key Metric"
05-thankyou.html     end      "Thank You"
```

Show this to the user. Wait for confirmation or edits before proceeding.

## Step 4: Scaffold the project

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/scaffold.sh "<slug>"
```

Where `<slug>` is a short kebab-case name (e.g., `ai-marketing`).

Save the `SCAFFOLD_DIR` path from the output (it will be an absolute path like `./presentation/YYYYMMDD-HHMM-slug`).

**Do NOT start the server yet.**

## Step 5: Write the instruction file for the subagent

Read the slide types reference:

```bash
cat ${CLAUDE_SKILL_DIR}/instructions/slide-types.md
```

Then write a temporary instruction file at `${SCAFFOLD_DIR}/.task.md`. This file must contain **everything** the subagent needs — it will be the subagent's only input. Use this exact structure:

```markdown
# Task: Write presentation slides

## Output directory
Write all slide files to: <absolute path to ${SCAFFOLD_DIR}/slides/>

## Slide plan
<paste your slide plan from Step 3 here — filename, type, title, and content notes for each slide>

## Source material
<paste the key content from Step 2 here — the subagent cannot read the original files>

## Slide types reference
<paste the full contents of slide-types.md here>
```

**Important:** The subagent cannot read any other files. Everything it needs must be in `.task.md`.

## Step 6: Spawn the subagent

Call `sessions_spawn` to delegate slide writing:

```json
{
  "task": "Read the instruction file at <absolute path to ${SCAFFOLD_DIR}/.task.md> and follow it exactly. Write every slide file listed in the slide plan. Do not skip any slides. Do not create extra files. When done, list all files you wrote.",
  "label": "write-slides",
  "cleanup": "delete"
}
```

**After spawning, wait for the subagent to complete.** Do NOT poll or call sessions_list. The completion event will arrive automatically.

## Step 7: Verify and clean up

Once the subagent completes:

1. **Verify slides exist:** Run `ls ${SCAFFOLD_DIR}/slides/` and check that every file from your plan is present.

2. **Delete template files:** The scaffold copied example templates. Delete every file that is NOT in your slide plan:
   ```bash
   rm ${SCAFFOLD_DIR}/slides/02-content.html ${SCAFFOLD_DIR}/slides/03-two-col.html ...
   ```
   If your plan reuses a template filename (e.g., `01-title.html`), the subagent already overwrote it — do not delete it.

3. **Delete the instruction file:**
   ```bash
   rm ${SCAFFOLD_DIR}/.task.md
   ```

4. **Verify only your planned slides remain:** Run `ls ${SCAFFOLD_DIR}/slides/` again.

## Step 8: Update the manifest

Open `${SCAFFOLD_DIR}/index.html` and find the `<script id="slide-manifest">` block. Replace its contents with a JSON array listing **only your slide filenames, in order**:

```html
<script id="slide-manifest" type="application/json">
["01-title.html","02-summary.html","03-pillars.html","04-metric.html","05-thankyou.html"]
</script>
```

**Every slide file must be listed. Only listed files will show. Template files you deleted must NOT be listed.**

## Step 9: Start the preview server

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/serve.sh "${SCAFFOLD_DIR}"
```

The script outputs `SERVER_PID` and `SERVER_URL`. Tell the user:

> Your presentation is ready! Open this link to view it:
>
> http://localhost:PORT
>
> Any changes will appear automatically. Let me know when you're done so I can stop the server.

## Later: Editing, restyling, PDF export

When the user asks to edit slides, restyle, or export PDF, read `${CLAUDE_SKILL_DIR}/instructions/serve-and-edit.md` for instructions.

## Stopping the server

When the user is done, kill the server by its PID:

```bash
kill <SERVER_PID>
```
