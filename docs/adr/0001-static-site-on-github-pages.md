# 0001. Static site on GitHub Pages, videos self-hosted

- **Date:** 2026-10-26
- **Status:** accepted

## Context
Shon wants a shareable portfolio link for his edits, Apple-style minimal with scroll animation, and pays for nothing.
His edits are short, 10-15 MB each.

## Decision
One static page (plain HTML/CSS/JS, no framework or build step) deployed to GitHub Pages by a GitHub Actions workflow
that publishes only `site/`. Videos are self-hosted MP4s in `site/media/`, not YouTube/Vimeo embeds, so the
player has no third-party branding or suggested videos. Grid previews play on hover (desktop only); phones
show posters and open the player on tap, so a phone visitor only downloads what they choose to watch.

## Consequences
- Free, but the repo must be public on GitHub's free plan, so the source and the video files are publicly downloadable.
- Limits: 100 MB per file, ~1 GB per site, ~100 GB/month soft bandwidth. Fine for dozens of 15 MB clips; long
  films would need YouTube/Vimeo embeds instead.
- The URL is `<github-username>.github.io/...` unless Shon buys a custom domain later (Pages supports one for free).
