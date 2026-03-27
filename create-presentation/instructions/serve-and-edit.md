# Serving, Editing & Exporting

## Start the preview server

Run this command (replace `<SCAFFOLD_DIR>` with the path from scaffold.sh):

```bash
bash ${CLAUDE_SKILL_DIR}/scripts/serve.sh "<SCAFFOLD_DIR>"
```

The script outputs `SERVER_PID` and `SERVER_URL`. Tell the user:

> Your presentation is ready! Open this link to view it:
>
> http://localhost:PORT
>
> Any changes will appear automatically. Let me know when you're done so I can stop the server.

## Editing slides

- **Change a slide:** Edit just that file in `slides/`. Browser auto-reloads.
- **Add a slide:** Create the file, then add it to the manifest in `index.html`.
- **Remove a slide:** Delete the file, then remove it from the manifest.
- **Restyle/rebrand:** Edit ONLY the `:root` CSS variables block at the top of `index.html`. Change colors, fonts, sizes there. Slide files never need changing for a restyle.

After any add/remove, print the full slide list for the user to verify.

## Customizing brand colors and fonts

All visual styling is controlled by CSS variables in `index.html`'s `:root` block:

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
