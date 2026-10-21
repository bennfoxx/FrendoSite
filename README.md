# Christopher Frendo — Custom Portfolio (`christopherfrendo.com`)

A zero-bloat, static **Astro + Tailwind CSS** rebuild of [www.christopherfrendo.com](https://www.christopherfrendo.com), engineered for near-instant page loads and zero-egress HD commercial streaming via **Cloudflare R2** and **Cloudflare Pages**.

## Project Structure

```text
├── functions/
│   └── api/
│       └── contact.js          # Cloudflare Pages Function (Resend email handler)
├── scripts/
│   └── transcode-videos.sh     # FFmpeg batch transcoder (1080p +faststart, 4s loop, WebP poster)
├── src/
│   ├── components/
│   │   ├── Header.astro        # Sticky nav + mobile slide-over menu drawer
│   │   ├── ProjectRow.astro    # Reusable 12-col project row with preload="none" & hover loop
│   │   ├── VideoModal.astro    # Theater lightbox player (Cloudflare R2 MP4 or Vimeo ID)
│   │   └── ContactForm.astro   # 4-field contact form at bottom of homepage
│   ├── data/
│   │   ├── projects.json       # All 29 Producing commercial spots, credits, & subpage deliverables
│   │   ├── directing.json      # All 4 Directing spots (Wixom Ranch, Surreal Glass Flowers, etc.)
│   │   ├── testimonials.json   # All 25 verbatim client & colleague testimonials
│   │   ├── hobbies.json        # Outdoor hiking, astrophotography, & portrait gallery data
│   │   └── site.json           # Global site metadata, navigation, and R2 media domain
│   ├── layouts/
│   │   └── BaseLayout.astro    # Global HTML5 shell, typography, and footer
│   └── pages/
│       ├── index.astro         # "Producing" homepage with client filter bar + ContactForm
│       ├── directing.astro     # Directing reel & spots
│       ├── testimonials.astro  # Client/colleague quotes masonry grid
│       ├── hobbies.astro       # Masonry photo gallery
│       ├── [legacySlug].astro  # Preserves legacy Wix URLs (/bluntmarketing, /gosmokeless, /valottery)
│       └── work/
│           └── [id].astro      # Dynamic multi-deliverable campaign pages
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start local dev server:**
   ```bash
   npm run dev
   ```

3. **Build static site for production:**
   ```bash
   npm run build
   ```

## Video Transcoding & Cloudflare R2 Setup

1. Place your source `.mov` or `.mp4` masters into `./raw_masters/` named after each project's filename slug (e.g., `solostove-blunt.mov`), then run:
   ```bash
   npm run transcode
   ```
2. This outputs three optimized folders under `./r2_upload_ready/`:
   - `masters/*-1080p.mp4` (`libx264 -crf 20 -preset slow -movflags +faststart`)
   - `loops/*-loop.mp4` (4-second muted 720p hover preview loops)
   - `thumbs/*.webp` (high-res poster frames)
3. Upload the contents of `./r2_upload_ready/` to your Cloudflare R2 bucket and attach custom domain `media.christopherfrendo.com`.
# FrendoSite
