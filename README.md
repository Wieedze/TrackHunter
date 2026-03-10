# TrackHunter

Search for tracks across multiple music platforms at once. Paste a playlist link or a list of tracks, and TrackHunter finds them on Bandcamp, Beatport, Discogs, MusicBrainz, and more.

**Live:** [track-hunter.com](https://track-hunter.com)

## Features

- **Multi-platform search** — Bandcamp, Beatport, Discogs, MusicBrainz, Deezer, with confidence scoring
- **Playlist import** — Spotify, YouTube, SoundCloud playlists
- **Text & file import** — Paste `Artist - Title` lines or upload CSV/TXT
- **Parallel search** — 3 tracks searched simultaneously
- **Wishlist** — Save tracks for later
- **Preview** — Listen to 30s previews when available (Deezer)

## Supported Platforms

| Platform | Search | Import |
|----------|--------|--------|
| Spotify | — | Playlist |
| YouTube | Link | Playlist |
| SoundCloud | — | Set/Playlist |
| MusicBrainz | API | — |
| Deezer | API | — |
| Discogs | API | — |
| Bandcamp | Scraper | — |
| Beatport | Manual link | — |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, React Query
- **Backend:** Cloudflare Worker (CORS proxy + scraper + Spotify API)
- **Hosting:** GitHub Pages (frontend) + Cloudflare Workers (backend)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Setup

```bash
# Install dependencies
pnpm install
cd worker && pnpm install && cd ..

# Configure environment
cp .env.example .env
# Fill in: VITE_YOUTUBE_API_KEY, VITE_DISCOGS_TOKEN

# Configure worker secrets (for Spotify)
cat > worker/.dev.vars << EOF
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
EOF
```

### Run locally

```bash
# Terminal 1 — Frontend
pnpm dev

# Terminal 2 — Worker
cd worker && pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Deploy

**Frontend** deploys automatically to GitHub Pages on push to `main`.

**Worker:**

```bash
cd worker
npx wrangler deploy
npx wrangler secret put SPOTIFY_CLIENT_ID
npx wrangler secret put SPOTIFY_CLIENT_SECRET
```

## Project Structure

```
src/
  components/     UI components
  pages/          Home, Results, Wishlist, Settings
  services/
    providers/    Search providers (MusicBrainz, Bandcamp, Discogs, etc.)
    search/       Search orchestrator & result aggregator
    import/       Playlist fetchers & text parser
  stores/         Zustand state
  hooks/          React hooks
  types/          TypeScript types

worker/
  src/
    api/          Spotify API integration
    scrapers/     Bandcamp, Beatport, SoundCloud scrapers
    index.ts      Worker entry point
```

## License

MIT
