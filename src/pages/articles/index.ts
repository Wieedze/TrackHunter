export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'how-to-support-artists-in-2026',
    title: 'How to Support Artists in 2026: A Music Buyer\'s Guide',
    description: 'Streaming pays artists fractions of a cent. Here\'s how buying music on Bandcamp, Beatport and Discogs puts real money in their pockets.',
    date: '2026-03-15',
    readingTime: '6 min read',
    tags: ['artists', 'bandcamp', 'buying music'],
  },
  {
    slug: 'best-platforms-to-buy-music-online',
    title: 'Best Platforms to Buy Music Online: Bandcamp vs Beatport vs Discogs',
    description: 'A detailed comparison of the top music stores for DJs, collectors and fans. Find out which platform fits your needs.',
    date: '2026-03-10',
    readingTime: '5 min read',
    tags: ['platforms', 'comparison', 'buying music'],
  },
  {
    slug: 'spotify-playlist-to-dj-set',
    title: 'DJ Guide: From Spotify Playlist to DJ Set in Minutes',
    description: 'How to turn your Spotify discoveries into a DJ-ready collection using TrackHunter, Beatport and Bandcamp.',
    date: '2026-03-05',
    readingTime: '5 min read',
    tags: ['DJ', 'spotify', 'workflow'],
  },
];
