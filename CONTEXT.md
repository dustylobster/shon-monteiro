---
type: context
description: "Static portfolio site for Shon's video edits, deployed to GitHub Pages."
---

# edit-portfolio — map

| Folder | Holds |
|---|---|
| `site/` | Everything that gets published. `content.js` = all text and the video list; `index.html`, `styles.css`, `app.js` = the page. |
| `site/media/` | Web-ready videos (`.mp4`) and posters (`.jpg`) made by the prep script; `og.jpg` is the link-preview image. `samples/` = placeholder clips, delete once real videos are in. |
| `incoming/` | Raw exports waiting to be prepared. Gitignored, never published. |
| `tools/` | `prepare_videos.py`: exports to web-ready MP4 + poster + `content.js` entry. |
| `.github/workflows/` | `pages.yml`: deploys `site/` to GitHub Pages on every push to `main`. |
| `docs/adr/` | Decisions: one file each, why and what it costs |
