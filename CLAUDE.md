# Edit portfolio

Shon's video-editing portfolio: one scrolling page (showreel, work grid, player, about, contact) to share as a link with clients. Static HTML/CSS/JS, hosted free on GitHub Pages.

## How to run
- Preview: `python -m http.server 8765 --directory site`, then open http://localhost:8765 (or `preview_start` "portfolio" from the workspace launch.json).
- Add videos: drop exports in `incoming/`, run `python tools/prepare_videos.py`, paste the printed entries into `site/content.js`.
- Publish: push to `main`; `.github/workflows/pages.yml` deploys `site/` to GitHub Pages.

## Hard rules
- All page text and the video list live in `site/content.js`. Don't hard-code content in `index.html` or `app.js`.
- Keep each file in `site/media/` under 95 MB (GitHub's limit is 100 MB) and the whole `site/` under 1 GB.
- Only publish client work Shon has permission to show. Pushing or making the repo public needs his OK (run `/kit-core:pre-publication-repo-audit` first).
- No paid services, no build step, no framework.
- Decisions go in `docs/adr/NNNN-<slug>.md`.

## Where things are
- Status and latest handoff: `../../brain/projects/edit-portfolio.md`
