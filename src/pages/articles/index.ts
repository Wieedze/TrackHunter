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
    slug: 'bpm-key-guide-for-djs',
    title: 'BPM & Key Mixing Guide: How DJs Create Seamless Transitions',
    description: 'Learn how to use BPM and musical key to create harmonically perfect mixes. Includes Camelot wheel explained, genre BPM ranges and practical workflow.',
    date: '2026-04-16',
    readingTime: '7 min read',
    tags: ['DJ', 'BPM', 'key', 'harmonic mixing'],
  },
  {
    slug: 'underground-labels-to-follow-2026',
    title: '10 Underground Labels Every DJ Should Follow in 2026',
    description: 'From Lobster Theremin to Hyperdub — discover the independent labels pushing electronic music forward and how to find their releases.',
    date: '2026-04-10',
    readingTime: '8 min read',
    tags: ['labels', 'underground', 'vinyl', 'discovery'],
  },
  {
    slug: 'build-vinyl-collection-2026',
    title: 'How to Build a Vinyl Collection in 2026: The Complete Guide',
    description: 'Vinyl sales are at a 30-year high. Here\'s how to find, buy and organize records using Discogs, Bandcamp and TrackHunter.',
    date: '2026-04-05',
    readingTime: '6 min read',
    tags: ['vinyl', 'discogs', 'bandcamp', 'collection'],
  },
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
