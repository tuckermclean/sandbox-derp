# Implementation Plan — Bosnia at the World Cup 2026 Slideshow

## Deliverable
A single self-contained `index.html` (HTML + CSS + JS inline, no build step) in
`apps/bosnia-world-cup-2026/` presenting an image slideshow themed on Bosnia and
Herzegovina at the FIFA World Cup 2026.

## Requirements (from issue #57)
- Single-shot static web app — open `index.html` directly in a browser.
- Slideshow of images sourced from online URLs.
- **All images must load.** Use stable, hotlink-friendly hosts (e.g. Wikimedia
  Commons `upload.wikimedia.org` direct file URLs). Add `onerror` fallback handling
  so a broken URL is replaced by a placeholder rather than a blank frame, and verify
  each chosen URL returns 200 before committing it.

## Slideshow features
- Auto-advance with a timer; prev/next manual controls; clickable position dots.
- Caption per slide; responsive full-viewport layout; pause on hover.

## Risks / notes
- Hotlinked images may break over time — prefer Wikimedia direct-file URLs and keep
  the `onerror` fallback. Do not rely on Google Images or search-result thumbnails.
- Keep everything in one file; no external JS/CSS dependencies.
