import { Link } from 'react-router-dom';
import { SearchBox } from '../components/search/SearchBox.tsx';
import { LANDINGS } from './landing/landings.ts';
import { HOME_FAQ } from '../content/homeFaq.ts';

export function Home() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          <span className="text-accent">Track</span>Hunter
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Paste a playlist, find every track across all platforms.
        </p>
      </div>

      <SearchBox />

      {/* How it works */}
      <section className="mt-12 max-w-2xl text-center">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Find where to buy any track
        </h2>
        <p className="mt-3 text-sm text-text-tertiary leading-relaxed">
          TrackHunter helps DJs, collectors and music lovers find tracks across
          <strong className="text-text-secondary"> Bandcamp</strong>,
          <strong className="text-text-secondary"> Beatport</strong>,
          <strong className="text-text-secondary"> MusicBrainz</strong> and
          <strong className="text-text-secondary"> Discogs</strong>.
          Import your playlists from Spotify, YouTube or SoundCloud and instantly
          see where each track is available for purchase or download.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">1. Import</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Paste a Spotify, YouTube or SoundCloud playlist link — or type track names manually
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">2. Search</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Every track is searched across Bandcamp, Beatport, MusicBrainz and Discogs simultaneously
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">3. Buy</h3>
            <p className="mt-1 text-xs text-text-tertiary">
              Click through to buy, download or collect from your preferred music store
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-12 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary text-center">
          Built for music lovers
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">For DJs</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Found a tracklist from a set you loved? Paste it in and find every track on Beatport and Bandcamp to build your collection.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">For vinyl collectors</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Search Discogs and MusicBrainz to find physical releases, rare pressings and catalog information for any track.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Spotify to Bandcamp</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Support artists directly. Import your Spotify playlist and find the same tracks on Bandcamp where artists get a bigger share.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <h3 className="text-sm font-medium text-text-primary">Cross-platform search</h3>
            <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
              Stop searching each platform manually. TrackHunter searches Bandcamp, Beatport, Discogs and MusicBrainz all at once.
            </p>
          </div>
        </div>
      </section>

      {/* Tools — one page per import → store workflow */}
      <section className="mt-12 max-w-2xl text-center">
        <h2 className="font-display text-lg font-semibold text-text-primary">
          Popular ways to use TrackHunter
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {LANDINGS.map((l) => (
            <Link
              key={l.slug}
              to={`/${l.slug}`}
              className="rounded-sm border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary no-underline transition-colors hover:border-border-hover hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 mb-12 max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary text-center">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-4">
          {HOME_FAQ.map(([q, a]) => (
            <details key={q} className="group rounded-sm border border-border bg-bg-secondary">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">
                {q}
              </summary>
              <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
