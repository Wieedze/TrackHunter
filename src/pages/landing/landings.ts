/**
 * Search-intent landing pages ("spotify to bandcamp"…). Each one embeds the
 * search box and explains one concrete workflow. Rendered by LandingPage.tsx,
 * routed in App.tsx, pre-rendered + listed in the sitemap via src/seo.ts.
 *
 * Keep claims true to what the app does: Bandcamp and Discogs return matched
 * results; Beatport gets a pre-filled search link per track (its site can't be
 * queried from the proxy).
 */

export interface LandingStep {
  title: string;
  text: string;
}

export interface LandingSection {
  heading: string;
  paragraphs: string[];
}

export interface Landing {
  slug: string;
  /** Short label for link lists ("Spotify → Bandcamp"). */
  label: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  placeholder: string;
  steps: LandingStep[];
  sections: LandingSection[];
  faq: [question: string, answer: string][];
  /** Blog slugs shown under "Related guides". */
  relatedArticles: string[];
}

const SPOTIFY_PLACEHOLDER =
  'Paste a Spotify playlist, album or track link...\n\nhttps://open.spotify.com/playlist/...';

export const LANDINGS: Landing[] = [
  {
    slug: 'spotify-to-bandcamp',
    label: 'Spotify → Bandcamp',
    metaTitle: 'Spotify Playlist to Bandcamp — Find & Buy Every Track | TrackHunter',
    metaDescription:
      'Paste a Spotify playlist link and find every track on Bandcamp in one search. Free, no login. Buy the music you stream and support artists directly.',
    h1: 'Spotify playlist to Bandcamp',
    lead:
      'Paste a Spotify playlist link and TrackHunter looks up every track on Bandcamp, so you can buy the music you stream straight from the artists and labels.',
    placeholder: SPOTIFY_PLACEHOLDER,
    steps: [
      {
        title: 'Copy your Spotify link',
        text: 'In Spotify, open the playlist, album or track and use Share → Copy link. Playlists must be public.',
      },
      {
        title: 'Paste it above',
        text: 'TrackHunter reads every track title and artist from the link — no Spotify login needed.',
      },
      {
        title: 'Buy on Bandcamp',
        text: 'Each track shows its Bandcamp match with a confidence score. Click through to buy it on the artist or label page.',
      },
    ],
    sections: [
      {
        heading: 'Why move your Spotify favourites to Bandcamp',
        paragraphs: [
          'Streaming pays artists fractions of a cent per play. On Bandcamp, the artist or label receives most of what you pay — Bandcamp says around 82% of each sale on average — and on Bandcamp Fridays it waives its share entirely.',
          'Buying also means you own the files. Bandcamp downloads come in lossless formats such as FLAC, WAV and AIFF as well as MP3, so the music stays yours even if it leaves Spotify.',
        ],
      },
      {
        heading: 'How the matching works',
        paragraphs: [
          'For every track in the playlist, TrackHunter searches Bandcamp with the artist and title, compares the candidates and gives each match a confidence score, so remixes, edits and similarly named tracks are easy to tell apart.',
          'The same search also runs on Discogs, MusicBrainz and Beatport, so when a track is not on Bandcamp you can see where else it can be bought.',
        ],
      },
      {
        heading: 'Tips for better results',
        paragraphs: [
          'Major-label releases are often missing from Bandcamp — it is strongest for independent artists, underground electronic music, and small labels. If a track has no Bandcamp match, check the Beatport and Discogs columns.',
          'Long playlists are searched in parallel, and results appear as they arrive, so you can start browsing before the whole playlist is done.',
        ],
      },
    ],
    faq: [
      ['Can I transfer a Spotify playlist to Bandcamp?', 'Bandcamp has no playlist import, so there is nothing to "transfer" — but you can find each track. Paste your Spotify playlist link into TrackHunter and it searches Bandcamp for every track, with a link to buy each one.'],
      ['Do I need to log in to Spotify?', 'No. TrackHunter only reads the public track list from the link. Private playlists are not supported; make the playlist public first.'],
      ['Is it free?', 'Yes. TrackHunter is free and needs no account. You only pay Bandcamp for the music you decide to buy.'],
      ['Why is a track missing on Bandcamp?', 'Not every release is sold on Bandcamp, especially major-label music. TrackHunter also searches Beatport, Discogs and MusicBrainz so you can buy it elsewhere.'],
    ],
    relatedArticles: ['how-to-support-artists-in-2026', 'best-platforms-to-buy-music-online'],
  },
  {
    slug: 'spotify-to-beatport',
    label: 'Spotify → Beatport',
    metaTitle: 'Spotify Playlist to Beatport — Find Tracks for Your DJ Set | TrackHunter',
    metaDescription:
      'Turn a Spotify playlist into a Beatport shopping list. Paste the link and get a one-click Beatport search for every track, plus Bandcamp and Discogs matches.',
    h1: 'Spotify playlist to Beatport',
    lead:
      'Built a playlist on Spotify for your next set? Paste it here and get a ready-made Beatport search for every track, alongside Bandcamp and Discogs results.',
    placeholder: SPOTIFY_PLACEHOLDER,
    steps: [
      {
        title: 'Copy the playlist link',
        text: 'In Spotify: Share → Copy link to playlist. Albums and single tracks work too. Playlists must be public.',
      },
      {
        title: 'Paste and search',
        text: 'TrackHunter extracts every artist and title and prepares a Beatport search for each one.',
      },
      {
        title: 'Buy your DJ files',
        text: 'Open each Beatport link to pick the right version, then buy in WAV, AIFF or MP3 for Rekordbox, Traktor or Serato.',
      },
    ],
    sections: [
      {
        heading: 'From streaming playlist to DJ-ready files',
        paragraphs: [
          'You cannot DJ with Spotify tracks in most DJ software, so a Spotify playlist is a shopping list, not a crate. Beatport is the standard store for electronic DJs: tracks come with BPM, key and genre metadata, in formats that load straight into your DJ software.',
          'Searching Beatport track by track is slow. TrackHunter does the typing for you: one pasted link becomes one Beatport search per track.',
        ],
      },
      {
        heading: 'What you get for each track',
        paragraphs: [
          'Beatport does not allow its catalogue to be queried from outside its own site, so for Beatport TrackHunter gives you a pre-filled search link for each track rather than a matched result — one click and you land on the right search.',
          'Bandcamp and Discogs are searched directly and return matched releases with a confidence score. Many underground tracks are cheaper on Bandcamp, in lossless formats, with more money going to the artist.',
        ],
      },
      {
        heading: 'Pick the right version',
        paragraphs: [
          'Spotify often shows radio edits while DJs want the extended or original mix. On Beatport, check the mix name next to the title before buying.',
          'For harmonic mixing, Beatport lists the key of every track. See our BPM and key mixing guide for how to use it.',
        ],
      },
    ],
    faq: [
      ['Can I import a Spotify playlist into Beatport?', 'Beatport has no Spotify import. TrackHunter bridges the gap: paste the Spotify link and you get a Beatport search for every track, ready to open and buy.'],
      ['Does TrackHunter buy the tracks for me?', 'No. It finds where each track is sold and links you there; you buy on Beatport, Bandcamp or Discogs with your own account.'],
      ['Can I use Spotify tracks in Rekordbox or Serato?', 'Spotify streaming is not available in most DJ software, and you cannot export Spotify files. Buying the tracks on Beatport or Bandcamp gives you files you can play anywhere.'],
      ['Is it free?', 'Yes, TrackHunter is free with no account required.'],
    ],
    relatedArticles: ['spotify-playlist-to-dj-set', 'bpm-key-guide-for-djs'],
  },
  {
    slug: 'spotify-to-vinyl',
    label: 'Spotify → Discogs (vinyl)',
    metaTitle: 'Find Your Spotify Playlist on Vinyl — Discogs Search | TrackHunter',
    metaDescription:
      'Paste a Spotify playlist and find the vinyl releases of every track on Discogs. Free tool for record collectors and vinyl DJs.',
    h1: 'Find your Spotify playlist on vinyl',
    lead:
      'Paste a Spotify playlist and TrackHunter searches Discogs for every track, so you can see which songs were pressed on vinyl and where to buy them.',
    placeholder: SPOTIFY_PLACEHOLDER,
    steps: [
      {
        title: 'Copy the Spotify link',
        text: 'Share → Copy link on any public playlist, album or track.',
      },
      {
        title: 'Search Discogs',
        text: 'TrackHunter looks up each track on Discogs and lists the matching releases with their year.',
      },
      {
        title: 'Buy the record',
        text: 'Open the release on Discogs to compare pressings and buy from marketplace sellers.',
      },
    ],
    sections: [
      {
        heading: 'Why Discogs for vinyl',
        paragraphs: [
          'Discogs is the largest music database and record marketplace: it catalogues releases down to individual pressings, and thousands of sellers list records on it. If a track was ever released on vinyl, Discogs is where you will find it.',
          'TrackHunter turns a whole playlist into Discogs lookups in one go, instead of searching each record by hand.',
        ],
      },
      {
        heading: 'Reading the results',
        paragraphs: [
          'A single track can appear on several releases — the original 12", a compilation, a reissue. Open the Discogs release to check the format, label, catalogue number and the tracklist before buying.',
          'MusicBrainz results are shown too: it is a useful cross-check for release dates and catalogue information.',
        ],
      },
      {
        heading: 'When a track is digital-only',
        paragraphs: [
          'Many recent electronic releases are digital-only. If Discogs has nothing, the Bandcamp and Beatport results show where to buy the digital version — and Bandcamp sometimes sells the vinyl directly from the label.',
        ],
      },
    ],
    faq: [
      ['How do I find out if a song is on vinyl?', 'Search it on Discogs, which catalogues vinyl releases and pressings. With TrackHunter you can paste a whole Spotify playlist and check every track at once.'],
      ['Does TrackHunter sell records?', 'No. It links you to the release on Discogs, where you buy from independent sellers.'],
      ['Can I search a list of tracks instead of a Spotify link?', 'Yes. Paste one "Artist - Title" per line, or upload a CSV or TXT file.'],
    ],
    relatedArticles: ['build-vinyl-collection-2026', 'underground-labels-to-follow-2026'],
  },
  {
    slug: 'youtube-to-bandcamp',
    label: 'YouTube → Bandcamp',
    metaTitle: 'YouTube Playlist to Bandcamp — Find & Buy Every Track | TrackHunter',
    metaDescription:
      'Paste a YouTube playlist link and find every song on Bandcamp, Beatport and Discogs. Free, no login — buy the music you discovered on YouTube.',
    h1: 'YouTube playlist to Bandcamp',
    lead:
      'Discovered music through YouTube? Paste a playlist link and TrackHunter finds every track on Bandcamp, Beatport and Discogs so you can own it.',
    placeholder:
      'Paste a YouTube playlist link...\n\nhttps://www.youtube.com/playlist?list=PL...',
    steps: [
      {
        title: 'Copy the playlist link',
        text: 'Use a public YouTube playlist URL containing list=PL…. Auto-generated "Mix" playlists are not supported.',
      },
      {
        title: 'Paste it above',
        text: 'TrackHunter reads the video titles and extracts the artist and track name from each one.',
      },
      {
        title: 'Buy the tracks',
        text: 'Check the Bandcamp, Discogs and Beatport results for every track and buy from the store you prefer.',
      },
    ],
    sections: [
      {
        heading: 'From video titles to real tracks',
        paragraphs: [
          'YouTube titles are messy: "(Official Video)", "[HD]", bracketed tags, genre prefixes. TrackHunter cleans them up and parses the artist and title before searching, so the stores receive a proper "Artist - Title" query.',
          'Each result has a confidence score. When a title was ambiguous, compare the match before you buy.',
        ],
      },
      {
        heading: 'Why buy what you found on YouTube',
        paragraphs: [
          'YouTube uploads disappear, and many of the rarest tracks are fan uploads that pay the artist nothing. Buying the track on Bandcamp gives you a lossless file and supports the people who made it.',
        ],
      },
    ],
    faq: [
      ['Which YouTube playlists work?', 'Public playlists (URL with list=PL…). YouTube Mix and Radio playlists (list=RD…) are generated on the fly and cannot be imported.'],
      ['Can I paste a single YouTube video?', 'Paste the track as "Artist - Title" text instead — TrackHunter searches it the same way.'],
      ['Is it free?', 'Yes, TrackHunter is free and needs no account.'],
    ],
    relatedArticles: ['how-to-support-artists-in-2026', 'best-platforms-to-buy-music-online'],
  },
  {
    slug: 'soundcloud-to-bandcamp',
    label: 'SoundCloud → Bandcamp',
    metaTitle: 'SoundCloud Playlist to Bandcamp — Find Where to Buy Tracks | TrackHunter',
    metaDescription:
      'Paste a SoundCloud set or playlist link and find every track on Bandcamp, Beatport and Discogs. Free tool for DJs and collectors.',
    h1: 'SoundCloud playlist to Bandcamp',
    lead:
      'Paste a SoundCloud set or playlist link and TrackHunter finds each track on Bandcamp, Beatport and Discogs — the fastest way to buy what you liked on SoundCloud.',
    placeholder:
      'Paste a SoundCloud set link...\n\nhttps://soundcloud.com/artist/sets/...',
    steps: [
      {
        title: 'Copy the set link',
        text: 'Any public SoundCloud set or playlist URL (soundcloud.com/…/sets/…).',
      },
      {
        title: 'Paste it above',
        text: 'TrackHunter reads the track list of the set and prepares a search for each track.',
      },
      {
        title: 'Buy on Bandcamp or Beatport',
        text: 'See every match with a confidence score and click through to the store.',
      },
    ],
    sections: [
      {
        heading: 'SoundCloud finds, Bandcamp buys',
        paragraphs: [
          'SoundCloud is where many producers share music first, but it is not a store. The same artists very often sell their releases on Bandcamp, where downloads are lossless and most of the money goes to them.',
          'Instead of opening each track and hunting for a "Buy" link, paste the whole set and get every store result at once.',
        ],
      },
      {
        heading: 'Promos, edits and unreleased tracks',
        paragraphs: [
          'Some SoundCloud uploads are free downloads, bootleg edits or unreleased promos that are not sold anywhere. When no store has a match, check the uploader\'s profile for a free download link or a release date.',
        ],
      },
    ],
    faq: [
      ['Which SoundCloud links work?', 'Public sets and playlists (URLs containing /sets/). For a single track, paste "Artist - Title" as text.'],
      ['Can I find SoundCloud tracks on Beatport?', 'Yes. Every track also gets a Beatport search link, alongside Bandcamp and Discogs results.'],
      ['Is it free?', 'Yes, TrackHunter is free and needs no account.'],
    ],
    relatedArticles: ['underground-labels-to-follow-2026', 'how-to-support-artists-in-2026'],
  },
  {
    slug: 'dj-tracklist-finder',
    label: 'DJ set tracklist finder',
    metaTitle: 'DJ Set Tracklist to Shopping List — Find Every Track | TrackHunter',
    metaDescription:
      'Paste the tracklist of a DJ set or mix and find where to buy every track on Bandcamp, Beatport and Discogs. Free tool for DJs.',
    h1: 'Find every track from a DJ set',
    lead:
      'Got the tracklist of a mix you loved? Paste it here, one track per line, and TrackHunter finds where to buy each one on Bandcamp, Beatport and Discogs.',
    placeholder:
      'Paste the tracklist, one track per line...\n\nKerri Chandler - Rain (DJ Deep Remix)\nMoodymann - Shades of Jae\nLarry Heard - Can You Feel It',
    steps: [
      {
        title: 'Copy the tracklist',
        text: 'From the mix description, a tracklist site or the comments — one "Artist - Title" per line. Line numbers are fine; remove timestamps such as 00:12.',
      },
      {
        title: 'Paste it above',
        text: 'Or upload it as a CSV or TXT file. TrackHunter parses each line into an artist and a title.',
      },
      {
        title: 'Build your crate',
        text: 'Buy each track on Beatport or Bandcamp, or find the vinyl on Discogs, and save the rest to your wishlist.',
      },
    ],
    sections: [
      {
        heading: 'Turn a mix into your own collection',
        paragraphs: [
          'Every DJ knows the feeling: a set full of tracks you need. Searching ten tracks across four stores is forty searches. TrackHunter runs them all at once and puts the results side by side.',
          'Matches come with a confidence score, so remixes and versions are easy to check before you buy.',
        ],
      },
      {
        heading: 'Where to find tracklists',
        paragraphs: [
          'Many mixes list their tracks in the description on SoundCloud, YouTube or Mixcloud, and community sites collect tracklists for well-known sets. Tracks marked "ID" are unreleased or unidentified — they will not be found in stores until they are released.',
        ],
      },
      {
        heading: 'Keep track of what you still need',
        paragraphs: [
          'Add tracks to the wishlist to come back to them later, for example when an "ID" finally gets a release or when a record shows up on the Discogs marketplace.',
        ],
      },
    ],
    faq: [
      ['What format should the tracklist be in?', 'One track per line, ideally "Artist - Title". Line numbers are fine; remove timestamps first. You can also upload a CSV or TXT file.'],
      ['Can it identify a track from audio?', 'No. TrackHunter searches stores by artist and title. To identify an unknown track, use the mix tracklist or an audio-recognition app first, then paste the result here.'],
      ['Is it free?', 'Yes, TrackHunter is free and needs no account.'],
    ],
    relatedArticles: ['spotify-playlist-to-dj-set', 'bpm-key-guide-for-djs'],
  },
];

export function getLanding(slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.slug === slug);
}
