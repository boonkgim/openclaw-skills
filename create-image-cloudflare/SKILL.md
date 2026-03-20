---
name: create-image-cloudflare
description: Generate images via Cloudflare Workers AI (Flux Schnell). Free tier — ~2,000 images/day.
homepage: https://developers.cloudflare.com/workers-ai/
metadata:
  {
    "openclaw":
      {
        "emoji": "☁️",
        "requires": { "bins": ["node"], "env": ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"] },
        "primaryEnv": "CLOUDFLARE_API_TOKEN",
      },
  }
---

# Cloudflare Image Gen (Flux Schnell)

Generate images using Cloudflare Workers AI's free tier (10,000 neurons/day).

## Setup

1. Sign up at https://dash.cloudflare.com/ (free)
2. Go to **Workers & Pages > Workers AI > Use REST API**
3. Create an API token with **Workers AI Read + Edit** permissions
4. Copy your **Account ID** from the same page
5. Add to `~/.openclaw/.env`:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_API_TOKEN=your_api_token
   ```

## Generate

```bash
node {baseDir}/scripts/generate_image.mjs --prompt "a cyberpunk lobster in neon city" --filename "output.png"
```

## Options

```bash
# Custom steps (1-8, default 4 — higher = better quality, more neurons)
node {baseDir}/scripts/generate_image.mjs --prompt "sunset over mountains" --filename "sunset.png" --steps 8

# Batch generate multiple images
node {baseDir}/scripts/generate_image.mjs --prompt "abstract art" --filename "art.png" --count 4

# Use a different Flux model
node {baseDir}/scripts/generate_image.mjs --prompt "portrait" --filename "portrait.png" --model flux-2-klein-4b
```

## Available models

- `flux-schnell` (default) — fastest, cheapest (~4.80 neurons per 512x512)
- `flux-2-dev` — higher quality, variable pricing
- `flux-2-klein-4b` — balanced quality/cost
- `lucid-origin` — Leonardo model (636 neurons per tile)
- `phoenix-1.0` — Leonardo model (530 neurons per tile)

## Notes

- Free tier: 10,000 neurons/day (resets at 00:00 UTC)
- Default model (flux-schnell) generates ~2,083 images/day for free
- Output is JPEG (converted to PNG by the script)
- Use timestamps in filenames: `yyyy-mm-dd-hh-mm-ss-name.png`
- The script prints a `MEDIA:` line for OpenClaw to auto-attach on supported chat providers
