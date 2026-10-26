"""Turn exported edits into web-ready files for the portfolio.

For each video in the input folder (default: ../incoming):
  - writes site/media/<slug>.mp4, set up to start playing before it fully downloads
    (kept as-is when it is already H.264 MP4 under the size cap, re-encoded otherwise)
  - writes site/media/<slug>.jpg, a poster frame
  - prints a ready-to-paste entry for site/content.js

Usage:  python tools/prepare_videos.py [input_folder] [--poster-at SECONDS] [--max-mb 25]
Needs ffmpeg and ffprobe on PATH.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "site" / "media"
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout
    info = json.loads(out)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    w, h = int(v["width"]), int(v["height"])
    rotation = 0
    for sd in v.get("side_data_list", []):
        rotation = int(sd.get("rotation", rotation) or 0)
    rotation = int(v.get("tags", {}).get("rotate", rotation) or 0)
    if abs(rotation) % 180 == 90:
        w, h = h, w
    return {
        "codec": v["codec_name"],
        "width": w,
        "height": h,
        "duration": float(info["format"].get("duration", 0) or 0),
        "has_audio": any(s["codec_type"] == "audio" for s in info["streams"]),
    }


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "video"


def aspect(w, h):
    from math import gcd
    g = gcd(w, h)
    a, b = w // g, h // g
    # Snap near-standard ratios so the grid lines up
    ratio = w / h
    for (x, y) in [(16, 9), (9, 16), (4, 5), (1, 1), (4, 3), (21, 9)]:
        if abs(ratio - x / y) < 0.02:
            return f"{x}/{y}"
    return f"{a}/{b}"


def run(cmd):
    subprocess.run(cmd, check=True, capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", nargs="?", default=str(ROOT / "incoming"))
    ap.add_argument("--poster-at", type=float, default=None, help="seconds into the clip for the poster frame")
    ap.add_argument("--max-mb", type=float, default=25, help="re-encode files bigger than this")
    ap.add_argument("--crf", type=int, default=23, help="re-encode quality: lower is better and bigger (18-28)")
    ap.add_argument("--out", default=str(MEDIA), help="output folder inside site/ (default: site/media)")
    args = ap.parse_args()
    out_dir = Path(args.out).resolve()
    rel = out_dir.relative_to(ROOT / "site").as_posix()

    src_dir = Path(args.input)
    files = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in VIDEO_EXT)
    if not files:
        sys.exit(f"No videos found in {src_dir}")
    out_dir.mkdir(parents=True, exist_ok=True)

    entries = []
    for src in files:
        slug = slugify(src.stem)
        info = probe(src)
        out_mp4 = out_dir / f"{slug}.mp4"
        out_jpg = out_dir / f"{slug}.jpg"
        size_mb = src.stat().st_size / 1e6

        copyable = info["codec"] == "h264" and src.suffix.lower() in {".mp4", ".m4v", ".mov"}

        def copy():
            # Same picture, just moved so the browser can start playing straight away
            run(["ffmpeg", "-y", "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?", "-c", "copy",
                 "-movflags", "+faststart", str(out_mp4)])

        if copyable and size_mb <= args.max_mb:
            copy()
            how = "copied"
        else:
            # Landscape up to 1920 wide; vertical up to 1280 tall (plenty for a phone-shaped player)
            scale = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'"
            run(["ffmpeg", "-y", "-i", str(src), "-map", "0:v:0", "-map", "0:a:0?",
                 "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", str(args.crf), "-pix_fmt", "yuv420p",
                 "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(out_mp4)])
            how = "re-encoded"
            if copyable and out_mp4.stat().st_size >= src.stat().st_size:
                copy()
                how = "copied (re-encode was not smaller)"

        at = args.poster_at if args.poster_at is not None else min(1.0, info["duration"] * 0.1)
        run(["ffmpeg", "-y", "-ss", f"{at:.2f}", "-i", str(out_mp4), "-frames:v", "1",
             "-vf", "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'",
             "-q:v", "3", str(out_jpg)])

        out_mb = out_mp4.stat().st_size / 1e6
        print(f"{src.name} -> {rel}/{slug}.mp4 ({how}, {out_mb:.1f} MB, {info['width']}x{info['height']})")
        if out_mb > 95:
            print("  WARNING: over GitHub's 100 MB file limit; trim it or use --max-mb to force a re-encode")
        entries.append({
            "file": f"{rel}/{slug}.mp4",
            "poster": f"{rel}/{slug}.jpg",
            "title": src.stem,
            "client": "",
            "category": "client",
            "year": 2026,
            "aspect": aspect(info["width"], info["height"]),
            "description": "",
        })

    print("\nPaste into the videos list in site/content.js, then fill in title, client, category and description:\n")
    for e in entries:
        body = ",\n".join(f"      {k}: {json.dumps(v)}" for k, v in e.items())
        print("    {\n" + body + ",\n    },")


if __name__ == "__main__":
    main()
