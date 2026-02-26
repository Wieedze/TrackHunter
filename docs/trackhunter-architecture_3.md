# TrackHunter — Architecture & Plan de Développement

## 1. Vision Produit

**TrackHunter** est une application web qui permet aux DJs, collectionneurs et passionnés de musique de coller une playlist ou une liste de tracks, puis de rechercher automatiquement chaque morceau sur toutes les plateformes de vente et de streaming.

**Workflow principal :**
```
Input (playlist/tracks) → Parsing → Matching multi-source → Résultats agrégés → Achat/écoute
```

**Principe fondamental : zéro friction.** L'utilisateur peut utiliser l'app sans créer de compte. Le login et l'OAuth sont des bonus pour les power users.

---

## 2. Système d'Import — Niveaux d'Accès

### Niveau 1 — CORE (sans compte, zéro friction)
C'est le cœur du produit. Aucun login requis.

| Méthode | Exemple d'input | Parsing |
|---------|----------------|---------|
| **Texte libre** | `Kerri Chandler - Rain (DJ Deep Remix)` un par ligne | TextParser (détection auto du format) |
| **Lien playlist publique** | `https://open.spotify.com/playlist/37i9dQ...` | API serveur (nos clés) → extraction des tracks |
| **Lien playlist YouTube** | `https://youtube.com/playlist?list=PL...` | YouTube Data API (notre clé) → parsing titres |
| **Lien SoundCloud** | `https://soundcloud.com/user/sets/my-set` | SoundCloud resolve → tracks |
| **Upload fichier** | CSV, TSV, TXT | CSVParser avec mapping colonnes |

> **Important :** les liens de playlists publiques sont résolus côté serveur avec nos propres API keys. L'utilisateur n'a rien à connecter.

### Niveau 2 — COMPTE (email/password)
Fonctionnalités de persistence.

| Feature | Détail |
|---------|--------|
| Sauvegarder ses recherches | Historique des playlists importées |
| Wishlist | Tracks à surveiller |
| Alertes | Notification quand un track devient disponible |
| Export enrichi | CSV/JSON avec tous les liens trouvés |

### Niveau 3 — OAUTH (connexion plateforme)
Power features pour les utilisateurs investis. Accès aux contenus **privés**.

| Plateforme | Ce que ça débloque | Scopes OAuth |
|------------|-------------------|--------------|
| **Spotify** | Playlists privées, Liked Songs, Top Tracks, Recently Played + **ISRC** pour matching précis | `playlist-read-private`, `user-library-read`, `user-top-read`, `user-read-recently-played` |
| **YouTube** | Playlists privées, Liked Videos, Watch Later | `youtube.readonly` |
| **SoundCloud** | Likes privés, Reposts, Following | `non_expiring` (API dépréciée — fallback scraping) |
| **Deezer** | Playlists privées, Favoris + ISRC | `basic_access`, `listening_history` |

### Flow UI d'import

```
┌─────────────────────────────────────────────────────────┐
│                    IMPORTER DES TRACKS                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Collez votre playlist ici...                    │    │
│  │  (texte, lien Spotify, YouTube, SoundCloud...)   │    │
│  │                                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  [📎 Upload CSV]                                        │
│                                                         │
│  ─── ou importez depuis vos comptes ───                 │
│                                                         │
│  [🟢 Spotify]  [🔴 YouTube]  [🟠 SoundCloud]  [🟣 Deezer] │
│                                                         │
│  [🔍 RECHERCHER]                                        │
└─────────────────────────────────────────────────────────┘
```

### Parser YouTube — Nettoyage des titres

Les titres YouTube sont souvent sales. Le parser applique ces règles :

```typescript
class YouTubeTitleParser {
  // Patterns à supprimer
  private static NOISE = [
    /\b(official\s*(music\s*)?video|lyric\s*video|audio|visualizer)\b/i,
    /\b(hq|hd|4k|1080p|720p)\b/i,
    /\b(full\s*album|ep|lp)\b/i,
    /\[.*?(official|premiere|exclusive|free\s*dl).*?\]/i,
    /\|.*$/,  // Tout après un pipe
  ];

  // Patterns pour détecter les sets (à exclure)
  private static SET_PATTERNS = [
    /\b(b2b|boiler\s*room|dj\s*set|live\s*at|mix|podcast)\b/i,
    /\d+\s*(hr|hour|min).*mix/i,
  ];

  static parse(title: string): { artist: string; title: string } | null {
    // Rejeter les sets
    if (this.SET_PATTERNS.some(p => p.test(title))) return null;
    
    // Nettoyer le bruit
    let clean = title;
    for (const pattern of this.NOISE) {
      clean = clean.replace(pattern, '');
    }
    
    // Extraire artiste - titre
    const separators = [' - ', ' – ', ' — ', ' // '];
    for (const sep of separators) {
      if (clean.includes(sep)) {
        const [artist, track] = clean.split(sep, 2);
        return { artist: artist.trim(), title: track.trim() };
      }
    }
    
    return null; // Impossible à parser → demander à l'user
  }
}
```

---

## 3. Stack Technique

### Architecture : Frontend-First SPA + Micro-Proxy

L'app est une **SPA React** qui appelle les APIs directement depuis le browser. Seul un micro-proxy serverless (Cloudflare Worker) est nécessaire pour les plateformes sans API (Bandcamp, Beatport, Traxsource).

```
┌──────────────────┐     ┌─────────────────────┐
│   React SPA      │────▶│  APIs directes       │
│                  │     │  (Spotify, Discogs,  │
│  - Parsing       │     │   MusicBrainz, etc.) │
│  - Matching      │     └─────────────────────┘
│  - UI            │
│  - localStorage  │     ┌─────────────────────┐
│                  │────▶│  Cloudflare Worker   │
└──────────────────┘     │  (proxy CORS)        │
                         │  → Bandcamp          │
                         │  → Beatport          │
                         │  → Traxsource        │
                         └─────────────────────┘
```

### Frontend
| Choix | Justification |
|-------|---------------|
| **React 18+** (Vite) | Maîtrisé, écosystème riche, SPA performante |
| **TypeScript** | Sécurité du typage, indispensable pour les structures de données complexes |
| **TanStack Query (React Query)** | Cache, états de chargement, retry auto — parfait pour les requêtes multi-API en parallèle |
| **Zustand** | State management léger pour playlists, résultats, préférences |
| **Tailwind CSS** | Styling rapide, responsive, cohérent |
| **React Router v6** | Navigation SPA |
| **localStorage** | Persistence : playlists sauvées, wishlist, tokens OAuth, préférences |

### Micro-Proxy (Cloudflare Worker)
| Choix | Justification |
|-------|---------------|
| **Cloudflare Workers** | Gratuit (100K req/jour), zéro maintenance, edge computing rapide |
| **Cheerio** (dans le Worker) | Parsing HTML des pages Bandcamp/Beatport côté proxy |

### Pas de backend traditionnel
| Ce qu'on élimine | Pourquoi c'est possible |
|-------------------|------------------------|
| ~~Node.js + Express~~ | Les APIs sont appelées directement depuis le browser |
| ~~PostgreSQL~~ | localStorage / IndexedDB pour la persistence |
| ~~Redis~~ | TanStack Query gère le cache côté client |
| ~~Prisma~~ | Pas de DB serveur |
| ~~BullMQ~~ | Pas de jobs serveur, tout est client-side |

### Infrastructure
| Choix | Justification |
|-------|---------------|
| **Vercel** ou **Netlify** | Hébergement SPA statique, gratuit |
| **Cloudflare Workers** | Proxy CORS pour scraping |

---

## 4. Architecture du Projet

```
trackhunter/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── import/
│   │   │   ├── PlaylistImporter.tsx     # Textarea + détection auto (texte/lien)
│   │   │   ├── CSVUploader.tsx          # Upload fichier CSV/TXT
│   │   │   ├── OAuthBrowser.tsx         # Browse playlists après connexion OAuth
│   │   │   └── TrackPreview.tsx         # Preview des tracks parsées avant recherche
│   │   ├── results/
│   │   │   ├── TrackRow.tsx             # Une ligne par track (résumé)
│   │   │   ├── TrackDetail.tsx          # Vue expandée avec tous les résultats
│   │   │   ├── PlatformCard.tsx         # Carte par plateforme (prix, format, lien)
│   │   │   ├── ConfidenceBadge.tsx      # 🟢🟡🔴 indicateur de matching
│   │   │   ├── PriceCompare.tsx         # Comparateur de prix
│   │   │   └── BatchActions.tsx         # Actions groupées (export, copier liens)
│   │   ├── player/
│   │   │   ├── MiniPlayer.tsx           # Player preview 30s (Spotify/Deezer)
│   │   │   └── PlayerBar.tsx            # Barre fixe en bas, enchaîne les previews
│   │   ├── wishlist/
│   │   │   └── WishlistPanel.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── Toast.tsx
│   │
│   ├── services/                        # ← TOUTE LA LOGIQUE MÉTIER
│   │   ├── providers/                   # Recherche sur chaque plateforme
│   │   │   ├── BaseProvider.ts
│   │   │   ├── SpotifyProvider.ts       # API directe (CORS OK)
│   │   │   ├── MusicBrainzProvider.ts   # API directe (CORS OK)
│   │   │   ├── DiscogsProvider.ts       # API directe (CORS OK)
│   │   │   ├── DeezerProvider.ts        # API directe (CORS OK)
│   │   │   ├── YouTubeProvider.ts       # API directe (CORS OK)
│   │   │   ├── BandcampProvider.ts      # Via Cloudflare proxy
│   │   │   ├── BeatportProvider.ts      # Via Cloudflare proxy
│   │   │   └── TraxsourceProvider.ts    # Via Cloudflare proxy
│   │   ├── import/                      # Parsing des inputs
│   │   │   ├── LinkResolver.ts          # Détecte texte vs lien Spotify vs YouTube...
│   │   │   ├── TextParser.ts            # Parse "Artiste - Titre" et variantes
│   │   │   ├── YouTubeTitleParser.ts    # Nettoyage titres YouTube
│   │   │   └── CSVParser.ts             # Parse CSV/TSV
│   │   ├── oauth/                       # OAuth PKCE (pas de secret côté client)
│   │   │   ├── SpotifyAuth.ts           # Login + browse playlists privées
│   │   │   ├── YouTubeAuth.ts           # Login + browse playlists privées
│   │   │   └── DeezerAuth.ts
│   │   ├── search/
│   │   │   ├── SearchOrchestrator.ts    # Lance tous les providers en parallèle
│   │   │   ├── MatchingEngine.ts        # Fuzzy matching + scoring
│   │   │   └── ResultAggregator.ts      # Déduplique, trie, merge
│   │   ├── storage/
│   │   │   └── LocalStore.ts            # Wrapper localStorage/IndexedDB
│   │   └── proxy.ts                     # Client pour le Cloudflare Worker
│   │
│   ├── hooks/
│   │   ├── useSearch.ts                 # Orchestre la recherche multi-plateforme
│   │   ├── useImport.ts                 # Gère l'import (texte, lien, CSV)
│   │   ├── usePlayer.ts                # Mini player de previews
│   │   └── useWishlist.ts
│   │
│   ├── stores/                          # Zustand stores
│   │   ├── playlistStore.ts             # Playlists importées + résultats
│   │   ├── playerStore.ts               # État du mini player
│   │   └── settingsStore.ts             # Préférences (plateformes actives, devise, etc.)
│   │
│   ├── pages/
│   │   ├── Home.tsx                     # Landing + zone d'import
│   │   ├── Results.tsx                  # Résultats de recherche
│   │   ├── Wishlist.tsx
│   │   └── Settings.tsx
│   │
│   ├── types/
│   │   ├── track.ts                     # TrackInput, TrackResult
│   │   ├── platform.ts                  # Platform enum, PlatformResult
│   │   ├── search.ts                    # SearchState, SearchProgress
│   │   └── player.ts                    # PlayerState
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── worker/                              # ← CLOUDFLARE WORKER (micro-proxy)
│   ├── src/
│   │   ├── index.ts                     # Router principal
│   │   ├── scrapers/
│   │   │   ├── bandcamp.ts              # Scrape bandcamp.com/search
│   │   │   ├── beatport.ts              # Scrape beatport.com/search
│   │   │   └── traxsource.ts            # Scrape traxsource.com/search
│   │   └── utils/
│   │       └── htmlParser.ts            # Cheerio-like parsing (cf-htmlrewriter)
│   ├── wrangler.toml                    # Config Cloudflare
│   └── package.json
│
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. Modèle de Données (localStorage / IndexedDB)

Plus de Prisma ni PostgreSQL. Tout est stocké côté client.

```typescript
// src/types/storage.ts

// ── Tracks & Résultats ─────────────────────────────────

interface TrackInput {
  id: string;                // nanoid()
  title: string;
  artist: string;
  label?: string;
  album?: string;
  year?: number;
  genre?: string;
  bpm?: number;
  key?: string;              // Tonalité (ex: "Am", "F#")
  isrc?: string;             // Code ISRC (trouvé via Spotify/MusicBrainz)
  duration?: number;         // Durée en secondes
}

interface PlatformResult {
  platform: Platform;
  externalId?: string;
  url: string;               // Lien direct vers la page
  title: string;
  artist: string;
  price?: number;
  currency?: string;         // "EUR", "USD", "GBP"
  format?: string;           // "MP3", "WAV", "FLAC", "Vinyl", "Stream"
  quality?: string;          // "320kbps", "Lossless"
  available: boolean;
  previewUrl?: string;       // URL audio preview 30s
  artworkUrl?: string;       // Cover art
  confidence: number;        // Score de matching 0.0 → 1.0
  extras?: {                 // Données spécifiques par plateforme
    bpm?: number;            // Beatport
    key?: string;            // Beatport
    releaseDate?: string;    // Discogs
    condition?: string;      // Discogs (vinyl: "NM", "VG+", etc.)
    sellers?: number;        // Discogs (nombre de vendeurs)
    wantCount?: number;      // Discogs (combien de gens le veulent)
  };
}

interface TrackResult {
  input: TrackInput;
  results: PlatformResult[];
  bestMatch?: PlatformResult;  // Résultat avec le meilleur score
  searchedAt: string;          // ISO date
  status: 'pending' | 'searching' | 'done' | 'error';
}

// ── Playlists ──────────────────────────────────────────

interface Playlist {
  id: string;
  name: string;
  source: 'text' | 'csv' | 'spotify_link' | 'youtube_link' | 'spotify_oauth' | 'youtube_oauth';
  sourceUrl?: string;          // Lien original si importé depuis un lien
  tracks: TrackResult[];
  createdAt: string;
  updatedAt: string;
}

// ── Wishlist ───────────────────────────────────────────

interface WishlistItem {
  id: string;
  track: TrackInput;
  targetPlatforms: Platform[]; // "Je veux ça sur Bandcamp et Vinyl"
  addedAt: string;
  lastChecked?: string;
}

// ── OAuth ──────────────────────────────────────────────

interface OAuthToken {
  platform: OAuthPlatform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scope?: string;
}

// ── Enums ──────────────────────────────────────────────

enum Platform {
  SPOTIFY = 'spotify',
  BANDCAMP = 'bandcamp',
  BEATPORT = 'beatport',
  TRAXSOURCE = 'traxsource',
  DISCOGS = 'discogs',
  MUSICBRAINZ = 'musicbrainz',
  YOUTUBE = 'youtube',
  DEEZER = 'deezer',
  JUNO = 'juno',
  TIDAL = 'tidal',
  SOUNDCLOUD = 'soundcloud',
}

enum OAuthPlatform {
  SPOTIFY = 'spotify',
  YOUTUBE = 'youtube',
  DEEZER = 'deezer',
  SOUNDCLOUD = 'soundcloud',
}

// ── Structure localStorage ─────────────────────────────
// 
// th_playlists     → Playlist[]         (historique des recherches)
// th_wishlist      → WishlistItem[]     (tracks à surveiller)
// th_oauth_spotify → OAuthToken         (token Spotify)
// th_oauth_youtube → OAuthToken         (token YouTube)
// th_settings      → UserSettings       (préférences)
// th_cache_{hash}  → PlatformResult[]   (cache résultats, TTL 24h)
//
// Pour les gros volumes → IndexedDB via idb-keyval
```

---

## 6. Provider Pattern — Le Cœur du Système

Chaque source de données implémente la même interface. Ça permet d'ajouter de nouvelles plateformes sans toucher au reste du code.

```typescript
// packages/shared/src/types/provider.ts

interface TrackQuery {
  title: string;
  artist: string;
  label?: string;
  album?: string;
  isrc?: string;
}

interface ProviderResult {
  platform: Platform;
  externalId?: string;
  url: string;
  title: string;
  artist: string;
  price?: number;
  currency?: string;
  format?: string;
  quality?: string;
  available: boolean;
  previewUrl?: string;
  artworkUrl?: string;
  confidence: number;  // 0.0 à 1.0
}

abstract class BaseProvider {
  abstract platform: Platform;
  abstract search(query: TrackQuery): Promise<ProviderResult[]>;
  abstract isAvailable(): Promise<boolean>; // Health check
  
  // Méthode partagée de fuzzy matching
  protected computeConfidence(query: TrackQuery, result: Partial<ProviderResult>): number {
    // Levenshtein distance, normalisation, etc.
  }
}
```

### Détail par Provider

| Provider | Méthode | Rate Limit | Auth | Données obtenues |
|----------|---------|------------|------|------------------|
| **Spotify** | API REST officielle | 100 req/min | OAuth Client Credentials | Stream, preview, popularité, ISRC |
| **MusicBrainz** | API REST officielle | 1 req/sec | User-Agent | Metadata, liens externes, ISRC |
| **Discogs** | API REST officielle | 60 req/min | OAuth ou token | Prix vinyl, marketplace, label, année |
| **Bandcamp** | **Scraping HTML** | Auto-throttle ~2 req/sec | Aucune | Prix digital, formats, lien achat, artwork |
| **Beatport** | **Scraping HTML** | Auto-throttle ~1 req/sec | Aucune | Prix, BPM, tonalité, genre, waveform |
| **Traxsource** | **Scraping HTML** | Auto-throttle ~1 req/sec | Aucune | Prix, genre, label |
| **Deezer** | API REST officielle | Illimité (quasi) | Aucune | Stream, preview 30s, ISRC |
| **YouTube** | API Data v3 | 10,000 units/jour | API Key | Vidéo, lien, preview |

---

## 7. Moteur de Matching (Fuzzy Search)

Le matching est **le** défi technique principal. Même track = noms différents partout.

### Exemples de variations réelles :
```
Input:          "Kerri Chandler - Rain (DJ Deep Remix)"
Spotify:        "Rain - DJ Deep Remix"
Bandcamp:       "Rain (Dj Deep Remix)"
Beatport:       "Rain (DJ Deep Remix) - Kerri Chandler"
Discogs:        "Kerri Chandler – Rain"
```

### Stratégie de matching :

```typescript
// server/src/services/search/MatchingEngine.ts

class MatchingEngine {
  
  computeConfidence(query: TrackQuery, candidate: ProviderResult): number {
    let score = 0;
    
    // 1. ISRC match = 100% confidence
    if (query.isrc && candidate.isrc === query.isrc) return 1.0;
    
    // 2. Normalisation
    const normalize = (s: string) => s
      .toLowerCase()
      .replace(/[\(\)\[\]\-–—]/g, ' ')  // Brackets, tirets
      .replace(/feat\.?|ft\.?|featuring/g, 'feat')
      .replace(/remix|rmx|rework|edit|mix/g, 'remix')
      .replace(/original\s*(mix)?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 3. Score titre (poids: 40%)
    const titleSimilarity = jaroWinkler(normalize(query.title), normalize(candidate.title));
    score += titleSimilarity * 0.4;
    
    // 4. Score artiste (poids: 40%)
    const artistSimilarity = jaroWinkler(normalize(query.artist), normalize(candidate.artist));
    score += artistSimilarity * 0.4;
    
    // 5. Score label (poids: 10%)
    if (query.label && candidate.label) {
      score += jaroWinkler(normalize(query.label), normalize(candidate.label)) * 0.1;
    }
    
    // 6. Bonus durée proche (poids: 10%)
    if (query.duration && candidate.duration) {
      const diff = Math.abs(query.duration - candidate.duration);
      score += (diff < 5 ? 0.1 : diff < 15 ? 0.05 : 0);
    }
    
    return Math.min(score, 1.0);
  }
}
```

### Librairie recommandée : `fuse.js` ou `string-similarity` pour le MVP, puis custom.

---

## 8. Scraping Bandcamp — Détail

```typescript
// server/src/services/providers/BandcampProvider.ts

import * as cheerio from 'cheerio';

class BandcampProvider extends BaseProvider {
  platform = Platform.BANDCAMP;
  private baseUrl = 'https://bandcamp.com';
  
  async search(query: TrackQuery): Promise<ProviderResult[]> {
    const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(
      `${query.artist} ${query.title}`
    )}&item_type=t`; // t = tracks
    
    const html = await this.fetchWithThrottle(searchUrl);
    const $ = cheerio.load(html);
    
    const results: ProviderResult[] = [];
    
    $('.searchresult.track').each((_, el) => {
      const title = $(el).find('.heading a').text().trim();
      const artist = $(el).find('.subhead').text().split('by').pop()?.trim() || '';
      const url = $(el).find('.heading a').attr('href') || '';
      const artworkUrl = $(el).find('img').attr('src') || '';
      
      // Pour le prix, il faut visiter la page du track
      results.push({
        platform: Platform.BANDCAMP,
        url,
        title,
        artist,
        artworkUrl,
        available: true,
        confidence: this.computeConfidence(query, { title, artist }),
      });
    });
    
    return results.filter(r => r.confidence > 0.5);
  }
  
  // Throttle pour respecter Bandcamp
  private async fetchWithThrottle(url: string): Promise<string> {
    await this.rateLimiter.wait(); // 500ms minimum entre requêtes
    const response = await fetch(url, {
      headers: { 'User-Agent': 'TrackHunter/1.0 (music-search-tool)' }
    });
    return response.text();
  }
}
```

---

## 9. Interface de Résultats — Comment on affiche les données

### Anatomie d'un résultat de track

Chaque track importée affiche une ligne résumée, expandable en vue détaillée.

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎵 Kerri Chandler — Rain (DJ Deep Remix)           🟢 98%      │
│    Madhouse Records · 2003 · Deep House · 122 BPM · Am         │
│                                                                 │
│  ▶️ advancement advancement advancement ────────────────── 0:30  │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │ Spotify   │ │ Bandcamp  │ │ Beatport  │ │ Discogs   │      │
│  │ ✅ Stream  │ │ €1.29     │ │ €1.49     │ │ €8.50     │      │
│  │           │ │ FLAC/MP3  │ │ WAV/MP3   │ │ Vinyl NM  │      │
│  │  [Open]   │ │  [Buy]    │ │  [Buy]    │ │  [View]   │      │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘      │
│                                                                 │
│  ❌ Traxsource · ❌ Juno — Non trouvé                           │
│                                                                 │
│  [⭐ Wishlist]  [🔗 Copier liens]  [🔍 Chercher sur Bandcamp]  │
└─────────────────────────────────────────────────────────────────┘
```

### Types de réponses par plateforme

| Plateforme | Ce qu'on affiche | Action principale |
|------------|-----------------|-------------------|
| **Spotify** | ✅ Stream · Preview 30s · Cover art · Popularité | `[Open]` → ouvre Spotify (web/app) |
| **Bandcamp** | Prix (€/$/£) · Formats (FLAC, WAV, MP3) · Cover art | `[Buy]` → page d'achat directe |
| **Beatport** | Prix · BPM · Tonalité · Genre · Waveform | `[Buy]` → page d'achat |
| **Discogs** | Prix min/max marketplace · Condition vinyl · Nb vendeurs · Année | `[View]` → page marketplace |
| **MusicBrainz** | Label · Catalogue # · Date de sortie · ISRC | `[Info]` → page MusicBrainz |
| **Deezer** | ✅ Stream · Preview 30s · ISRC | `[Open]` → ouvre Deezer |
| **YouTube** | Thumbnail · Durée · Nb vues | `[Watch]` → ouvre YouTube |
| **Traxsource** | Prix · Genre · Label | `[Buy]` → page d'achat |

### Indicateur de confiance du matching

| Badge | Score | Signification | Action UI |
|-------|-------|---------------|-----------|
| 🟢 | > 0.85 | Match quasi certain (ISRC identique ou titre+artiste exact) | Affiché directement |
| 🟡 | 0.60 - 0.85 | Match probable (variations mineures) | Affiché avec "Vérifier ?" |
| 🔴 | 0.40 - 0.60 | Match incertain | Affiché avec alternatives possibles |
| ❌ | < 0.40 | Non trouvé | Lien de recherche manuelle sur la plateforme |

Pour les matches 🟡 et 🔴, on affiche les alternatives trouvées pour que l'user puisse choisir le bon résultat.

### Mini Player intégré

Un player audio fixé en bas de page qui enchaîne les previews :

```
┌─────────────────────────────────────────────────────────────────┐
│ ▶️  Kerri Chandler — Rain (DJ Deep Remix)                       │
│ advancement advancement advancement advancement advancement ── │
│ ◀◀  ▶  ▶▶  |  0:12 / 0:30  |  Source: Spotify  |  🔊 ────    │
└─────────────────────────────────────────────────────────────────┘
```

- Joue les previews 30s de Spotify ou Deezer (gratuit, pas d'auth requise)
- Boutons prev/next pour naviguer entre les tracks de la playlist
- Permet d'identifier rapidement les bons matches sans ouvrir d'onglets

### Actions batch (sur toute la playlist)

| Action | Détail |
|--------|--------|
| **Exporter CSV** | Fichier avec toutes les tracks + liens par plateforme + prix |
| **Copier liens Bandcamp** | Tous les liens Bandcamp trouvés → clipboard |
| **Ouvrir tout sur [plateforme]** | Ouvre chaque résultat dans un nouvel onglet |
| **Filtrer par plateforme** | Voir seulement les dispo sur Bandcamp, Vinyl, etc. |
| **Filtrer par format** | Seulement FLAC, seulement Vinyl, etc. |
| **Trier par prix** | Moins cher → plus cher, par plateforme |
| **Wishlist les introuvables** | Ajoute tous les ❌ à la wishlist en un clic |

### Recherche manuelle de secours

Pour les tracks non trouvées (❌), on génère des liens de recherche pré-remplis :

```
Non trouvé automatiquement ? Chercher manuellement :
[🔍 Bandcamp]  [🔍 Beatport]  [🔍 Discogs]  [🔍 Google]
```

Chaque bouton ouvre `bandcamp.com/search?q=artiste+titre` dans un nouvel onglet. L'user peut ensuite copier-coller le lien du résultat trouvé manuellement.

---

## 10. Plan de Développement — Phases

### Phase 1 : Fondations (Semaine 1-2)
- [ ] Init projet React + Vite + TypeScript
- [ ] Tailwind CSS + structure de base
- [ ] React Router (Home, Results, Wishlist, Settings)
- [ ] Layout principal (header, zone d'import, zone de résultats)
- [ ] Zustand stores (playlistStore, settingsStore)
- [ ] LocalStore wrapper (localStorage + IndexedDB pour gros volumes)
- [ ] Setup Cloudflare Worker (wrangler init, route de proxy basique)
- [ ] Deploy SPA sur Vercel/Netlify + Worker sur Cloudflare

### Phase 2 : Import & Parsing (Semaine 3)
- [ ] Composant `PlaylistImporter` — textarea intelligent
- [ ] `LinkResolver` — détecte automatiquement le type d'input :
  - Lien Spotify (`open.spotify.com/playlist/...`) → fetch via Spotify API
  - Lien YouTube (`youtube.com/playlist?list=...`) → fetch via YouTube API
  - Lien SoundCloud → resolve
  - Lien Deezer → resolve
  - Sinon → TextParser (texte libre)
- [ ] `TextParser` : détecte `Artiste - Titre`, `Artiste — Titre (Label)`, etc.
- [ ] `YouTubeTitleParser` — nettoyage des titres YouTube sales
- [ ] `CSVParser` — upload CSV avec mapping de colonnes
- [ ] `TrackPreview` — preview des tracks parsées, l'user peut corriger avant recherche
- [ ] Tests unitaires des parsers

### Phase 3 : Providers API directes (Semaine 4-5)
- [ ] `BaseProvider` abstract class
- [ ] `SpotifyProvider` — API directe depuis le browser (Client Credentials)
- [ ] `MusicBrainzProvider` — API directe (CORS OK, pas d'auth)
- [ ] `DiscogsProvider` — API directe (token)
- [ ] `DeezerProvider` — API directe (pas d'auth)
- [ ] `YouTubeProvider` — API directe (API key)
- [ ] `SearchOrchestrator` — lance tous les providers en parallèle (Promise.allSettled)
- [ ] `ResultAggregator` — déduplique, trie par confidence, merge
- [ ] Cache TanStack Query (staleTime 24h) + localStorage
- [ ] Tests par provider

### Phase 4 : Cloudflare Worker + Scraping (Semaine 6-7)
- [ ] Worker : route `/scrape?url=...&platform=bandcamp`
- [ ] `BandcampProvider` — scraping via Worker (recherche + page track pour prix)
- [ ] `BeatportProvider` — scraping via Worker
- [ ] `TraxsourceProvider` — scraping via Worker
- [ ] Rate limiting dans le Worker (headers + throttle)
- [ ] Retry logic avec exponential backoff côté client
- [ ] Tests d'intégration scraping

### Phase 5 : Matching Engine (Semaine 7-8)
- [ ] Normalisation avancée (remixes, features, éditions, "feat." vs "ft.")
- [ ] Jaro-Winkler + token-based matching
- [ ] ISRC matching quand dispo (Spotify/MusicBrainz → matching 100%)
- [ ] Score de confidence calibré sur des vrais cas DJ
- [ ] `ConfidenceBadge` — 🟢🟡🔴 visuel
- [ ] Gestion des ambiguïtés (alternatives affichées, user choisit)

### Phase 6 : UI Résultats + Player (Semaine 8-9)
- [ ] `TrackRow` — ligne résumée (artwork, artiste-titre, nb plateformes, confidence)
- [ ] `TrackDetail` — vue expandée avec `PlatformCard` par plateforme
- [ ] `PlatformCard` — prix, format, qualité, lien, preview
- [ ] `PriceCompare` — mise en avant du moins cher
- [ ] `MiniPlayer` + `PlayerBar` — player preview 30s fixé en bas
- [ ] Enchaînement des previews (prev/next entre tracks)
- [ ] `BatchActions` — export CSV, copier liens, ouvrir en batch
- [ ] Filtres (plateforme, format, dispo) + tri (prix, confidence)
- [ ] Liens de recherche manuelle pour les tracks non trouvées

### Phase 7 : Persistence & Wishlist (Semaine 10)
- [ ] Sauvegarde des playlists dans localStorage/IndexedDB
- [ ] Historique de recherches
- [ ] Wishlist : ajouter des tracks (trouvées ou non)
- [ ] Export enrichi (CSV/JSON avec tous les liens + prix)
- [ ] Import/Export des données locales (backup)

### Phase 8 : OAuth — Import depuis les comptes (Semaine 11)
- [ ] Spotify OAuth PKCE (pas de secret côté client)
  - Browse playlists privées, Liked Songs, Top Tracks, Recently Played
  - Récupération ISRC pour matching précis
- [ ] YouTube OAuth — playlists privées, liked videos
- [ ] Deezer OAuth — playlists privées, favoris
- [ ] `OAuthBrowser` — UI de sélection de playlists après connexion
- [ ] Stockage tokens dans localStorage (refresh auto)

### Phase 9 : Polish & Launch (Semaine 12+)
- [ ] Landing page (hero, démo, CTA)
- [ ] Responsive mobile
- [ ] PWA (installable, fonctionne offline pour les données cachées)
- [ ] Animations et micro-interactions
- [ ] Error handling élégant (provider down, rate limited, etc.)
- [ ] Monitoring du Worker Cloudflare
- [ ] Tests E2E (Playwright)
- [ ] Beta avec vrais DJs pour feedback

---

## 11. APIs & Clés Nécessaires

| Service | Type | Coût MVP | Côté | Inscription |
|---------|------|----------|------|-------------|
| Spotify | OAuth PKCE (user) + Client Credentials (liens publics) | Gratuit | Client | developer.spotify.com |
| MusicBrainz | User-Agent header | Gratuit | Client | musicbrainz.org |
| Discogs | Token personnel | Gratuit (60 req/min) | Client | discogs.com/developers |
| Deezer | Aucune auth | Gratuit | Client | developers.deezer.com |
| YouTube Data v3 | API Key | Gratuit (10K units/jour) | Client | console.cloud.google.com |
| Cloudflare Workers | Compte gratuit | Gratuit (100K req/jour) | Worker | dash.cloudflare.com |
| Bandcamp | Scraping via Worker | Gratuit | Worker | — |
| Beatport | Scraping via Worker | Gratuit | Worker | — |

> **Note :** Les API keys Spotify (Client ID) et YouTube (API Key) sont exposées côté client — c'est normal et prévu par ces APIs (restrictions par domaine). Seul le Client Secret Spotify n'est PAS nécessaire grâce au flow PKCE.

---

## 12. Risques & Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Bandcamp bloque le scraping via Worker | Perte d'une source clé | Rotation User-Agent dans le Worker, throttle agressif, fallback lien de recherche manuelle |
| Beatport full JS rendering | Scraping plus complexe | HTMLRewriter dans le Worker, ou fallback lien de recherche manuelle |
| Matching incorrect (faux positifs) | UX dégradée | Seuil confidence > 0.7, alternatives proposées, user valide |
| Rate limiting Spotify côté client | Recherches lentes | TanStack Query cache (staleTime 24h), throttle les requêtes |
| Cloudflare Worker free tier dépassé | Scraping down | 100K req/jour est large pour un MVP. Passer au plan payant ($5/mo) si besoin |
| localStorage plein (5-10MB) | Perte de données | Migrer vers IndexedDB pour les gros volumes, proposer export/backup |
| API keys exposées côté client | Abus potentiel | Restriction par domaine (Spotify, YouTube), le Worker a ses propres protections |
| CORS inattendu sur une API | Provider cassé | Fallback vers le Worker comme proxy, monitoring des erreurs |
