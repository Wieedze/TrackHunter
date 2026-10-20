import { ARTICLES } from './pages/articles/index.ts';
import { LANDINGS } from './pages/landing/landings.ts';
import { HOME_FAQ } from './content/homeFaq.ts';

/**
 * Per-route SEO metadata. Shared by the client (document.title on navigation)
 * and scripts/prerender.mjs, which writes one static HTML file per content
 * route so crawlers and AI answer engines get real content with a 200.
 */

export const SITE_URL = 'https://track-hunter.com';
export const SITE_NAME = 'TrackHunter';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** Content pages are pre-rendered and listed in the sitemap. */
  indexable: boolean;
  changefreq?: 'weekly' | 'monthly' | 'yearly';
  priority?: number;
  lastmod?: string;
  /** Section in llms.txt. */
  group?: 'page' | 'tool' | 'article';
  jsonLd?: object[];
}

const HOME_TITLE = 'TrackHunter — Find & Buy Music Across All Platforms';
const HOME_DESCRIPTION =
  'Paste a playlist from Spotify, YouTube or SoundCloud and instantly find every track on Bandcamp, Beatport, MusicBrainz and Discogs. Buy music from the platform you prefer.';


const STATIC_PAGES: RouteMeta[] = [
  {
    path: '/',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    indexable: true,
    changefreq: 'weekly',
    priority: 1.0,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Find and buy music across Bandcamp, Beatport, MusicBrainz and Discogs. Import playlists from Spotify, YouTube and SoundCloud.',
        applicationCategory: 'MusicApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ.map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  },
  {
    path: '/guide',
    title: 'User Guide — How to Find & Buy Music with TrackHunter',
    description: 'Step-by-step guide: import a Spotify, YouTube or SoundCloud playlist, search Bandcamp, Beatport, Discogs and MusicBrainz, and build your wishlist.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/blog',
    title: 'TrackHunter Blog — Guides for DJs, Collectors & Music Lovers',
    description: 'Guides, tips and insights for DJs, vinyl collectors and music lovers: where to buy music, how to support artists, harmonic mixing and more.',
    indexable: true,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/about',
    title: 'About TrackHunter — The Free Music Search Engine for DJs',
    description: 'Why TrackHunter exists: one search across Bandcamp, Beatport, Discogs and MusicBrainz to find and buy the music you discover on streaming.',
    indexable: true,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — TrackHunter',
    description: 'How TrackHunter handles your data: no account, local browser storage, and optional analytics cookies.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.2,
  },
  {
    path: '/terms',
    title: 'Terms of Use — TrackHunter',
    description: 'Terms of use for TrackHunter, the free music search engine.',
    indexable: true,
    changefreq: 'yearly',
    priority: 0.2,
  },
  // App screens: user-specific, no content for crawlers.
  { path: '/results', title: 'Results — TrackHunter', description: HOME_DESCRIPTION, indexable: false },
  { path: '/wishlist', title: 'Wishlist — TrackHunter', description: HOME_DESCRIPTION, indexable: false },
  { path: '/stats', title: 'Stats — TrackHunter', description: HOME_DESCRIPTION, indexable: false },
  { path: '/settings', title: 'Settings — TrackHunter', description: HOME_DESCRIPTION, indexable: false },
];

const ARTICLE_PAGES: RouteMeta[] = ARTICLES.map((a) => ({
  path: `/blog/${a.slug}`,
  group: 'article',
  title: `${a.title} — TrackHunter`,
  description: a.description,
  indexable: true,
  changefreq: 'monthly',
  priority: 0.7,
  lastmod: a.date,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      datePublished: a.date,
      dateModified: a.date,
      keywords: a.tags.join(', '),
      url: `${SITE_URL}/blog/${a.slug}`,
      mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
      image: OG_IMAGE,
      author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: a.title, item: `${SITE_URL}/blog/${a.slug}` },
      ],
    },
  ],
}));

const faqJsonLd = (faq: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const LANDING_PAGES: RouteMeta[] = LANDINGS.map((l) => ({
  path: `/${l.slug}`,
  group: 'tool',
  title: l.metaTitle,
  description: l.metaDescription,
  indexable: true,
  changefreq: 'monthly',
  priority: 0.9,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: l.h1,
      description: l.metaDescription,
      url: `${SITE_URL}/${l.slug}`,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    },
    faqJsonLd(l.faq),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: l.h1, item: `${SITE_URL}/${l.slug}` },
      ],
    },
  ],
}));

export const ROUTES: RouteMeta[] = [...STATIC_PAGES, ...LANDING_PAGES, ...ARTICLE_PAGES];

export function getRouteMeta(pathname: string): RouteMeta | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return ROUTES.find((r) => r.path === path);
}
