# TrackHunter — Claude Code Project Instructions

## Contexte

Tu construis **TrackHunter**, une SPA React qui permet aux DJs et collectionneurs de coller une playlist (texte libre, lien Spotify/YouTube, CSV) et de rechercher automatiquement chaque track sur toutes les plateformes de vente et streaming (Bandcamp, Beatport, Discogs, Spotify, Deezer, MusicBrainz, etc.).

Architecture : **Frontend-only** (React + Vite + TypeScript) avec un micro-proxy Cloudflare Worker pour le scraping des sites sans API (Bandcamp, Beatport, Traxsource).

Le document d'architecture complet est dans `docs/ARCHITECTURE.md` — consulte-le systématiquement avant de coder une feature.

---

## Stack Technique

- **React 18+** avec Vite
- **TypeScript** strict (pas de `any`)
- **TanStack Query (React Query)** pour toutes les requêtes API et le cache
- **Zustand** pour le state management global
- **Tailwind CSS** pour le styling (config custom ci-dessous)
- **React Router v6** pour la navigation
- **localStorage / IndexedDB** (via `idb-keyval`) pour la persistence
- **Framer Motion** pour les animations

---

## Design System — Identité Visuelle

### Direction artistique

L'identité de TrackHunter est inspirée de **Beatport** et des interfaces pro audio/DJ : sombre, technique, épurée, fonctionnelle. C'est un outil, pas un jouet. Le design doit respirer la crédibilité et la précision.

**Tone : Industrial-minimal, dark-mode natif, pro-tool aesthetic.**

### Ce qu'on veut :
- Dark mode par défaut, pas de mode clair
- Densité d'information élevée mais lisible (comme un dashboard Bloomberg ou Beatport)
- Hiérarchie visuelle claire : le contenu musical est roi
- Micro-interactions subtiles (hover states, transitions fluides)
- Sensation de "studio tool" — sobre, utilitaire, pro

### Ce qu'on ne veut PAS :
- ❌ Violet, dégradés purple/blue, toute esthétique "AI/startup"
- ❌ Coins très arrondis (rounded-xl, rounded-full sur les cards)
- ❌ Ombres colorées, glassmorphism, blur excessif
- ❌ Illustrations cartoon, emojis dans l'UI, icônes trop colorées
- ❌ Animations flashy, bouncy, ou "playful"
- ❌ Fonts génériques (Inter, Roboto, Arial, system-ui)
- ❌ Blanc pur (#FFFFFF) pour les backgrounds ou textes

### Palette de couleurs

```javascript
// tailwind.config.js — couleurs custom
colors: {
  // Backgrounds (du plus sombre au plus clair)
  bg: {
    primary: '#0A0A0A',     // Fond principal (quasi noir)
    secondary: '#111111',    // Cards, panels
    tertiary: '#1A1A1A',     // Hover states, zones actives
    elevated: '#222222',     // Modals, dropdowns
  },
  // Texte
  text: {
    primary: '#E8E8E8',     // Texte principal (pas blanc pur)
    secondary: '#8A8A8A',   // Texte secondaire, labels
    tertiary: '#555555',    // Texte désactivé, placeholders
    inverse: '#0A0A0A',     // Texte sur fond clair (boutons)
  },
  // Accent — Vert Beatport-like (la seule couleur vive)
  accent: {
    DEFAULT: '#1DB954',      // Vert principal (actions, CTA, liens actifs)  
    hover: '#1ED760',        // Vert hover
    muted: '#1DB95420',      // Vert transparent (backgrounds subtils)
    dark: '#158A3E',         // Vert foncé (pressed states)
  },
  // Couleurs de plateforme (pour les badges et icônes)
  platform: {
    spotify: '#1DB954',
    bandcamp: '#1DA0C3',
    beatport: '#94D500',
    discogs: '#333333',
    youtube: '#FF0000',
    deezer: '#A238FF',
    traxsource: '#00BFFF',
    soundcloud: '#FF5500',
    musicbrainz: '#BA478F',
  },
  // Status
  status: {
    success: '#1DB954',
    warning: '#F5A623',
    error: '#E53E3E',
    info: '#4A9EFF',
  },
  // Borders
  border: {
    DEFAULT: '#1F1F1F',      // Bordure subtile
    hover: '#333333',        // Bordure au hover
    active: '#1DB954',       // Bordure élément actif
  },
}
```

### Typographie

```javascript
// tailwind.config.js — fonts
fontFamily: {
  // Display : pour les titres, noms de tracks, headers
  display: ['"DM Sans"', 'sans-serif'],
  // Body : pour le texte courant, labels, descriptions
  body: ['"IBM Plex Sans"', 'sans-serif'],
  // Mono : pour les données techniques (BPM, Key, ISRC, prix)
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

Charger depuis Google Fonts :
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Règles de spacing et layout

- **Border radius** : `rounded-sm` (2px) pour les cards et boutons, `rounded-none` pour les inputs. Jamais de `rounded-lg` ou plus.
- **Borders** : 1px solid, couleur `border-DEFAULT`. Subtiles, pas dominantes.
- **Spacing** : Utiliser la grille Tailwind de manière cohérente. Gap de 1px ou 2px entre les éléments de grille pour un look "technique".
- **Cards** : Fond `bg-secondary`, border 1px `border-DEFAULT`, pas d'ombre. Au hover : border `border-hover`.
- **Backgrounds** : Jamais de gradients. Couleurs solides uniquement.

### Composants UI — Conventions

**Boutons :**
```
Primary   : bg-accent, text-inverse, hover:bg-accent-hover, rounded-sm, font-medium
Secondary : bg-transparent, border border-border, text-primary, hover:bg-tertiary
Ghost     : bg-transparent, text-secondary, hover:text-primary
Danger    : bg-transparent, border border-error, text-error, hover:bg-error/10
```

**Inputs :**
```
bg-bg-primary, border border-border, rounded-none, text-primary
focus: border-accent, outline-none
placeholder: text-tertiary
```

**Badges de plateforme :**
```
Petit badge coloré avec la couleur de la plateforme
bg-platform-[name]/15, text-platform-[name], text-xs, font-mono, rounded-sm, px-2 py-0.5
```

**Indicateurs de confiance :**
```
🟢 High (>0.85)  : bg-status-success/15, text-status-success, text "98%"
🟡 Medium (0.6-0.85) : bg-status-warning/15, text-status-warning, text "72%"
🔴 Low (<0.6)    : bg-status-error/15, text-status-error, text "45%"
Pas d'emoji dans l'UI réelle — utiliser des dots ou des barres de couleur
```

**Tables / Listes de tracks :**
```
Rows alternées : bg-bg-primary / bg-bg-secondary (très subtil)
Hover row : bg-bg-tertiary
Active row : border-l-2 border-accent
Séparateurs : border-b border-border (1px)
```

### Animations (Framer Motion)

```typescript
// Subtiles, rapides, professionnelles
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } };
const slideUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

// Stagger pour les listes de résultats
const staggerContainer = { animate: { transition: { staggerChildren: 0.03 } } };

// Hover sur les cards — très subtil
const cardHover = { whileHover: { y: -1 }, transition: { duration: 0.15 } };

// JAMAIS de bounce, spring exagéré, ou scale > 1.02
```

### Icônes

Utiliser **Lucide React** (`lucide-react`) exclusivement. Taille par défaut : 16px. Couleur : `text-secondary`, `text-primary` au hover. Stroke width : 1.5.

```typescript
import { Search, Play, Pause, ExternalLink, Heart, Copy, Download, ChevronDown, X, Check, AlertCircle, Music } from 'lucide-react';
```

---

## Conventions de Code

### Structure des fichiers
```
src/
├── components/        # Composants React (PascalCase.tsx)
├── services/          # Logique métier, API calls (camelCase.ts)
├── hooks/             # Custom hooks (useXxx.ts)
├── stores/            # Zustand stores (xxxStore.ts)
├── pages/             # Pages/routes (PascalCase.tsx)
├── types/             # Types TypeScript (camelCase.ts)
├── utils/             # Helpers purs (camelCase.ts)
└── constants/         # Constantes, config (UPPER_CASE.ts)
```

### Règles TypeScript
- `strict: true` dans tsconfig
- Pas de `any` — utiliser `unknown` si nécessaire puis type guard
- Interfaces pour les objets, types pour les unions/intersections
- Exporter les types depuis `types/`

### Règles React
- Functional components uniquement
- Custom hooks pour la logique réutilisable
- TanStack Query pour TOUT appel API (pas de useEffect + fetch)
- Zustand pour le state global, useState pour le state local simple
- Composants petits et focused — max ~150 lignes
- Pas de `index.tsx` barrel exports — imports explicites

### Règles CSS/Tailwind
- Tailwind uniquement — pas de CSS custom sauf cas exceptionnels
- Pas de `!important`
- Classes ordonnées : layout → sizing → spacing → typography → colors → effects
- Responsive : mobile-first (`sm:`, `md:`, `lg:`)

---

## Workflow de développement

1. **Avant de coder** : lis `docs/ARCHITECTURE.md` pour le contexte
2. **Feature par feature** : suis les phases du plan de développement
3. **Tests** : écris des tests pour les parsers et le matching engine (Vitest)
4. **Pas d'over-engineering** : commence simple, itère
5. **Commits** : messages conventionnels (`feat:`, `fix:`, `refactor:`, `style:`)

---

## Rappels importants

- L'app est **100% frontend** — pas de backend Node.js
- Les tokens OAuth sont stockés dans **localStorage**
- Les appels Bandcamp/Beatport/Traxsource passent par le **Cloudflare Worker** (proxy CORS)
- Le cache API passe par **TanStack Query** (staleTime: 24h pour les résultats de recherche)
- Le **matching engine** est le cœur du produit — investis du temps sur la normalisation et le scoring
- L'**ISRC** (quand disponible via Spotify/MusicBrainz) donne un match à 100% — c'est le fast path
- Les previews audio viennent de **Spotify** (30s) et **Deezer** (30s) — gratuit, pas d'auth requise pour les previews Deezer
