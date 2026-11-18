# SPIN Media TV Philippines — Web Hub

Official Vue 3 + TypeScript + Tailwind CSS v4 digital broadcast hub for **SPIN Media TV Philippines** (*Secure the Philippines Information Network*), unifying embedded YouTube episodes/Shorts and Facebook Page feeds from editable runtime JSON files.

## Tech Stack
- **Framework**: Vue 3 (`<script setup lang="ts">`) + Vite + TypeScript
- **Routing**: Vue Router 4 (`createWebHistory`, clean URLs `/`, `/media`, `/about`, `/contact`)
- **Styling**: Tailwind CSS v4 (Dark Studio default + Light Newsroom toggle)
- **Icons**: `lucide-vue-next`
- **Data Layer**: Static runtime JSON in `public/data/*.json` via `src/services/dataService.ts` (zero database required today; drop-in swap for a backend API later)

## Getting Started

```bash
npm install
npm run dev
```

## Updating Content Without a Database

Edit any file in `public/data/` — no rebuild is required when serving static assets:

- `public/data/site.json`: Brand metadata, social links, and contact desk config (supports dropping in a `web3formsKey` or `formspreeEndpoint` to submit inquiries directly).
- `public/data/shows.json`: Weekly PHT program schedule (*Usapang Pilipino*, *Suriin at Timbangin*, *Lampornas!*, *F.O.C.U.S.*, *Usapang Mag-Asawa*).
- `public/data/media.json`: Embedded YouTube videos/Shorts and curated Facebook updates.
- `public/data/about.json`: Mission, vision, core pillars, affiliations, and leadership/anchors.

### Sync Latest YouTube Uploads Automatically

Pull the newest videos and Shorts from `@spinmediatvphilippines` into `public/data/media.json` while preserving curated Facebook posts:

```bash
npm run sync:youtube
```

## Production Build & Hosting

```bash
npm run type-check
npm run build
```

Includes `vercel.json` and `public/_redirects` for clean SPA routing on Vercel, Netlify, and Cloudflare Pages.
