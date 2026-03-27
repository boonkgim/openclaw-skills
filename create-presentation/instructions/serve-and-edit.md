# Serving, Editing & Exporting

## Start the preview server

Run from the skill directory (the directory containing SKILL.md):

```
node scripts/serve.mjs "<SCAFFOLD_DIR>"
```

The script outputs `SERVER_PID` and `SERVER_URL`. Tell the user the URL.

To stop: `kill <SERVER_PID>` (Mac/Linux) or close the process (Windows).

## Editing slides

- **Change a slide:** Edit just that file in `slides/`. Refresh browser to see changes.
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

Press `P` in the browser or use File > Print. The slides are print-ready (one slide per page, 16:9).
