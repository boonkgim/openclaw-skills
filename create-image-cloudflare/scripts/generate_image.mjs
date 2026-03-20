#!/usr/bin/env node
/**
 * Generate images using Cloudflare Workers AI (Flux Schnell).
 *
 * Free tier: 10,000 neurons/day (~2,083 images at 512x512).
 *
 * Usage:
 *   node generate_image.mjs --prompt "a cyberpunk lobster" --filename "output.png"
 *   node generate_image.mjs --prompt "sunset" --filename "sunset.png" --steps 8 --count 4
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname, basename, extname, join } from "path";
import { parseArgs } from "util";

const MODELS = {
  "flux-schnell": "@cf/black-forest-labs/flux-1-schnell",
  "flux-2-dev": "@cf/black-forest-labs/flux-2-dev",
  "flux-2-klein-4b": "@cf/black-forest-labs/flux-2-klein-4b",
  "lucid-origin": "@cf/leonardo/lucid-origin",
  "phoenix-1.0": "@cf/leonardo/phoenix-1.0",
};

function parseCliArgs() {
  const { values } = parseArgs({
    options: {
      prompt: { type: "string", short: "p" },
      filename: { type: "string", short: "f" },
      steps: { type: "string", short: "s" },
      count: { type: "string", short: "c" },
      model: { type: "string", short: "m" },
      "account-id": { type: "string" },
      "api-token": { type: "string" },
    },
    strict: true,
  });

  if (!values.prompt) {
    console.error("Error: --prompt is required.");
    process.exit(1);
  }
  if (!values.filename) {
    console.error("Error: --filename is required.");
    process.exit(1);
  }

  const steps = parseInt(values.steps || "4", 10);
  if (steps < 1 || steps > 8) {
    console.error("Error: --steps must be between 1 and 8.");
    process.exit(1);
  }

  const count = parseInt(values.count || "1", 10);
  const model = values.model || "flux-schnell";
  if (!MODELS[model]) {
    console.error(`Error: Unknown model "${model}". Available: ${Object.keys(MODELS).join(", ")}`);
    process.exit(1);
  }

  if (values.prompt.length > 2048) {
    console.error("Error: Prompt exceeds 2048 character limit.");
    process.exit(1);
  }

  return {
    prompt: values.prompt,
    filename: values.filename,
    steps,
    count,
    model,
    accountId: values["account-id"],
    apiToken: values["api-token"],
  };
}

function getCredentials(accountIdArg, tokenArg) {
  const accountId = accountIdArg || process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = tokenArg || process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId) {
    console.error("Error: No Cloudflare Account ID provided.");
    console.error("Set CLOUDFLARE_ACCOUNT_ID env var or pass --account-id.");
    process.exit(1);
  }
  if (!apiToken) {
    console.error("Error: No Cloudflare API token provided.");
    console.error("Set CLOUDFLARE_API_TOKEN env var or pass --api-token.");
    process.exit(1);
  }

  return { accountId, apiToken };
}

async function generateImage(accountId, apiToken, prompt, modelId, steps) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, steps }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.error(`Error: Cloudflare API returned ${resp.status}.`);
    try {
      const errData = JSON.parse(body);
      for (const err of errData.errors || []) {
        console.error(`  - ${err.message || body}`);
      }
    } catch {
      console.error(`  ${body.slice(0, 500)}`);
    }
    process.exit(1);
  }

  const data = await resp.json();

  if (!data.success) {
    for (const err of data.errors || []) {
      console.error(`Error: ${err.message || "Unknown error"}`);
    }
    process.exit(1);
  }

  const imageB64 = data.result?.image;
  if (!imageB64) {
    console.error("Error: No image data in API response.");
    console.error(`Response keys: ${Object.keys(data.result || {}).join(", ")}`);
    process.exit(1);
  }

  return Buffer.from(imageB64, "base64");
}

function saveImage(imageBytes, outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true });
  // Cloudflare returns JPEG data; save as-is regardless of extension
  writeFileSync(outputPath, imageBytes);
}

async function main() {
  const args = parseCliArgs();
  const { accountId, apiToken } = getCredentials(args.accountId, args.apiToken);
  const modelId = MODELS[args.model];

  const outputPath = resolve(args.filename);
  const dir = dirname(outputPath);
  const ext = extname(outputPath) || ".png";
  const stem = basename(outputPath, ext);

  console.log(`Model: ${args.model} (${modelId})`);
  console.log(`Steps: ${args.steps}`);
  console.log(`Generating ${args.count} image${args.count > 1 ? "s" : ""}...`);

  for (let i = 0; i < args.count; i++) {
    const currentPath =
      args.count > 1
        ? join(dir, `${stem}-${i + 1}${ext}`)
        : outputPath;

    console.log(`\n[${i + 1}/${args.count}] Prompt: ${args.prompt}`);

    const imageBytes = await generateImage(accountId, apiToken, args.prompt, modelId, args.steps);
    saveImage(imageBytes, currentPath);

    const fullPath = resolve(currentPath);
    console.log(`Image saved: ${fullPath}`);
    console.log(`MEDIA:${fullPath}`);
  }

  if (args.count > 1) {
    console.log(`\nDone — ${args.count} images generated.`);
  }
}

main();
