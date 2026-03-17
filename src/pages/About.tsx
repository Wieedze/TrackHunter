import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          About <span className="text-accent">Track</span>Hunter
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          The free music search engine built for DJs, collectors and music lovers.
        </p>
      </div>

      {/* Why TrackHunter exists */}
      <section className="max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Why TrackHunter exists
        </h2>
        <div className="mt-4 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Music is more accessible than ever, but buying it has become fragmented. A track you
            discover on Spotify might be available on Bandcamp, Beatport, Discogs or none of them.
            Searching each platform manually is tedious and time-consuming, especially when you have
            an entire playlist worth of tracks to find.
          </p>
          <p>
            TrackHunter was created to solve this problem. Instead of opening four browser tabs and
            searching each store one by one, you paste your playlist once and get results from every
            platform instantly. Whether you want to buy a high-quality digital download, find a vinyl
            pressing, or support an artist directly on Bandcamp, TrackHunter shows you all your
            options in one place.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Who it's for
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">DJs</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Building a collection for your sets? Import tracklists from mixes you love, Spotify
              playlists from fellow DJs, or SoundCloud sets and find every track on Beatport and
              Bandcamp. No more hunting through multiple stores — get direct purchase links for
              your entire tracklist in seconds.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Vinyl collectors</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Looking for physical releases? TrackHunter searches Discogs and MusicBrainz to help
              you find vinyl pressings, catalog numbers and release information. Discover rare
              editions and track down that specific pressing you've been looking for.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Music fans who want to support artists</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Streaming pays artists fractions of a cent per play. If you want to support the
              musicians you love, buying their music directly is the best way. TrackHunter makes
              it easy to find tracks on Bandcamp, where artists receive the largest share of
              revenue from every sale.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Crate diggers</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Heard something in a mix, a radio show, or a friend's playlist? Paste the tracklist
              and instantly find where each track is available. Cross-reference across Bandcamp,
              Beatport, Discogs and MusicBrainz to find the best version and format for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Platforms we search
        </h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          TrackHunter searches across the most popular music purchase and catalog platforms to give
          you comprehensive results for every track.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-platform-bandcamp">Bandcamp</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              The artist-friendly platform where musicians sell directly to fans. Buy digital
              downloads in high-quality formats (FLAC, WAV, MP3) and know that the largest share
              goes to the artist. Ideal for independent and underground music.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-platform-beatport">Beatport</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              The world's leading electronic music store for DJs. Buy tracks in high-quality
              formats optimized for DJ software. Beatport specializes in house, techno, drum &
              bass, trance and all electronic genres.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-platform-musicbrainz">MusicBrainz</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              The open music encyclopedia. MusicBrainz provides detailed metadata, release
              information and catalog data for millions of tracks. Find release dates, labels,
              catalog numbers and links to other platforms.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-secondary">Discogs</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              The largest music database and marketplace in the world. Find vinyl records, CDs and
              cassettes from sellers worldwide. Browse detailed discographies, track credits and
              discover related releases.
            </p>
          </div>
        </div>
      </section>

      {/* Import sources */}
      <section className="max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Import from anywhere
        </h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          TrackHunter accepts playlists and track lists from multiple sources. Paste a URL from
          Spotify, YouTube or SoundCloud and we'll extract every track automatically. You can also
          type or paste track names manually in <strong className="text-text-primary">Artist - Title</strong> format,
          one per line, or upload a CSV/TXT file.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-sm border border-platform-spotify/30 bg-platform-spotify/10 px-3 py-1.5 text-xs text-platform-spotify">
            Spotify playlists, albums & tracks
          </span>
          <span className="rounded-sm border border-platform-youtube/30 bg-platform-youtube/10 px-3 py-1.5 text-xs text-platform-youtube">
            YouTube playlists
          </span>
          <span className="rounded-sm border border-platform-soundcloud/30 bg-platform-soundcloud/10 px-3 py-1.5 text-xs text-platform-soundcloud">
            SoundCloud sets
          </span>
          <span className="rounded-sm border border-platform-deezer/30 bg-platform-deezer/10 px-3 py-1.5 text-xs text-platform-deezer">
            Deezer playlists
          </span>
          <span className="rounded-sm border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary">
            Manual text input
          </span>
          <span className="rounded-sm border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary">
            CSV / TXT upload
          </span>
        </div>
      </section>

      {/* Free & open */}
      <section className="max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Free to use, always
        </h2>
        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
          TrackHunter is a free tool. There's no account to create, no subscription, and no
          limitations on how many tracks you can search. We believe music discovery should be
          accessible to everyone — whether you're a professional DJ building a library or a
          casual listener looking to support your favourite artists.
        </p>
      </section>

      {/* CTA */}
      <section className="max-w-2xl text-center">
        <div className="rounded-sm border border-border bg-bg-secondary p-6">
          <h2 className="font-display text-lg font-semibold text-text-primary">
            Ready to find your music?
          </h2>
          <p className="mt-2 text-sm text-text-tertiary">
            Paste a playlist and start searching across all platforms.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-inverse no-underline transition-colors hover:bg-accent-hover"
          >
            Start searching
          </Link>
        </div>
      </section>
    </div>
  );
}
