# create-image-cloudflare

An [OpenClaw](https://github.com/boonkgim/openclaw-installer) skill that generates images using Cloudflare Workers AI (Flux Schnell).

Free tier: 10,000 neurons/day (~2,000 images at default settings).

## Setup

1. Sign up at https://dash.cloudflare.com/ (free)
2. Go to **Workers & Pages > Workers AI > Use REST API**
3. Create an API token with **Workers AI Read + Edit** permissions
4. Copy your **Account ID** from the same page
5. Set environment variables:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_API_TOKEN=your_api_token
   ```

## Usage

```bash
node scripts/generate_image.mjs --prompt "a cyberpunk lobster in neon city" --filename "output.png"
```

### Options

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--prompt` | `-p` | *(required)* | Image description (max 2048 chars) |
| `--filename` | `-f` | *(required)* | Output file path |
| `--steps` | `-s` | `4` | Quality steps (1-8, higher = better) |
| `--count` | `-c` | `1` | Number of images to generate |
| `--model` | `-m` | `flux-schnell` | Model to use (see below) |
| `--account-id` | | env var | Cloudflare Account ID |
| `--api-token` | | env var | Cloudflare API Token |

### Examples

```bash
# Higher quality
node scripts/generate_image.mjs --prompt "sunset over mountains" --filename "sunset.png" --steps 8

# Batch generate
node scripts/generate_image.mjs --prompt "abstract art" --filename "art.png" --count 4

# Different model
node scripts/generate_image.mjs --prompt "portrait" --filename "portrait.png" --model flux-2-klein-4b
```

## Available Models

| Model | Description |
|-------|-------------|
| `flux-schnell` | Fastest, cheapest (~4.80 neurons per 512x512) |
| `flux-2-dev` | Higher quality, variable pricing |
| `flux-2-klein-4b` | Balanced quality/cost |
| `lucid-origin` | Leonardo model (636 neurons per tile) |
| `phoenix-1.0` | Leonardo model (530 neurons per tile) |

## Requirements

- Node.js 18+
- Cloudflare account (free tier works)

## License

MIT
