#!/usr/bin/env node
/**
 * Export presentation slides to PDF via Puppeteer.
 *
 * Two modes:
 *   Default:  Screenshot each slide, then combine into PDF.
 *             Perfect visual fidelity (shadows, gradients). Text is not selectable.
 *
 *   --text:   Use page.pdf() for selectable/searchable text.
 *             Strips CSS effects that can't render in PDF (box-shadow, text-shadow).
 *
 * Usage:
 *   node export-pdf.mjs <server-url> [output.pdf]
 *   node export-pdf.mjs <server-url> [output.pdf] --text
 *
 * Example:
 *   node export-pdf.mjs http://localhost:3004 deck.pdf
 *   node export-pdf.mjs http://localhost:3004 deck.pdf --text
 */
import puppeteer from "puppeteer";
import path from "path";

const args = process.argv.slice(2);
const textMode = args.includes("--text");
const positional = args.filter((a) => !a.startsWith("--"));

const serverUrl = positional[0];
const outputPath = positional[1] || "presentation.pdf";

if (!serverUrl) {
  console.error("Usage: node export-pdf.mjs <server-url> [output.pdf] [--text]");
  process.exit(1);
}

const resolved = path.resolve(outputPath);
const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto(serverUrl, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2000));

const slideCount = await page.evaluate(
  () => document.querySelectorAll(".slide").length
);

if (slideCount === 0) {
  console.error("No slides found. Is the server running?");
  await browser.close();
  process.exit(1);
}

if (textMode) {
  /* ── TEXT MODE: page.pdf() with selectable text ── */
  await page.emulateMediaType("screen");

  await page.addStyleTag({
    content: `
      /* Preserve colors and backgrounds */
      * {
        print-color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
      }

      /* Strip effects that PDF cannot render */
      * {
        box-shadow: none !important;
        text-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
      }

      /* Replace card shadows with a slightly stronger border */
      .card {
        border: 1px solid rgba(0, 0, 0, 0.12) !important;
      }

      /* Stack all slides */
      html, body {
        width: 1920px;
        height: auto;
        overflow: visible !important;
      }
      #slide-container {
        position: static !important;
        width: 1920px;
        height: auto !important;
      }
      .slide {
        position: relative !important;
        display: flex !important;
        opacity: 1 !important;
        width: 1920px !important;
        height: 1080px !important;
        page-break-after: always;
        page-break-inside: avoid;
        break-after: page;
        break-inside: avoid;
      }
      .slide:last-child {
        page-break-after: auto;
        break-after: auto;
      }

      /* Hide UI */
      .progress-bar, .slide-counter { display: none !important; }

      /* Disable animations */
      .animate-in {
        opacity: 1 !important;
        transform: none !important;
        animation: none !important;
      }

      /* Remove dot pattern overlay (renders poorly in PDF) */
      .slide::before {
        display: none !important;
      }
    `,
  });

  await page.pdf({
    path: resolved,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`${slideCount} slides exported to ${resolved} (text selectable)`);
} else {
  /* ── SCREENSHOT MODE: pixel-perfect visual fidelity ── */

  // Hide UI elements
  await page.evaluate(() => {
    const bar = document.querySelector(".progress-bar");
    const counter = document.querySelector(".slide-counter");
    if (bar) bar.style.display = "none";
    if (counter) counter.style.display = "none";
  });

  // Screenshot each slide
  const screenshots = [];
  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll(".slide").forEach((s) => s.classList.remove("active"));
      const slide = document.querySelectorAll(".slide")[idx];
      slide.classList.add("active");
      slide.querySelectorAll(".animate-in").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.animation = "none";
      });
    }, i);

    await new Promise((r) => setTimeout(r, 300));

    const screenshot = await page.screenshot({
      encoding: "base64",
      type: "png",
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    screenshots.push(screenshot);
  }

  // Combine screenshots into a PDF
  const imagesHtml = screenshots
    .map(
      (b64) =>
        `<div class="page"><img src="data:image/png;base64,${b64}"></div>`
    )
    .join("\n");

  const tempHtml = `<!DOCTYPE html>
<html><head><style>
  * { margin: 0; padding: 0; }
  .page {
    width: 1920px;
    height: 1080px;
    page-break-after: always;
    overflow: hidden;
  }
  .page:last-child { page-break-after: auto; }
  img { width: 1920px; height: 1080px; display: block; }
</style></head><body>${imagesHtml}</body></html>`;

  const pdfPage = await browser.newPage();
  await pdfPage.setContent(tempHtml, { waitUntil: "networkidle0" });

  await pdfPage.pdf({
    path: resolved,
    width: "1920px",
    height: "1080px",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`${slideCount} slides exported to ${resolved} (pixel-perfect)`);
}

await browser.close();
