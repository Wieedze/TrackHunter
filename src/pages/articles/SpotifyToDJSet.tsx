import { Link } from 'react-router-dom';

export function SpotifyToDJSet() {
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          The problem: Spotify for discovery, but not for DJing
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Spotify is an incredible discovery tool. Algorithm-powered playlists like Discover
            Weekly, Release Radar and the endless rabbit hole of related artists make it easy to
            find new music. Many DJs use Spotify as their primary discovery platform — saving
            tracks to playlists throughout the week, tagging potential set material, and building
            libraries of tracks to explore.
          </p>
          <p>
            But when it's time to actually play these tracks in a set, Spotify falls short. DJ
            software requires high-quality local files — WAV, AIFF or high-bitrate MP3 — with
            accurate BPM, key and metadata tags. Streaming quality isn't sufficient, and you can't
            load Spotify tracks into Rekordbox, Traktor or Serato.
          </p>
          <p>
            The solution: use Spotify for discovery, then buy the tracks you want to play from
            stores like Beatport, Bandcamp or Discogs. TrackHunter bridges the gap between these
            two worlds.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Step 1: Build your discovery playlist on Spotify
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Create a dedicated playlist on Spotify for tracks you want to buy. Call it something
            like "To Buy", "Set Material" or "DJ Picks". Throughout the week, add any track that
            catches your ear — from Discover Weekly recommendations, mixes you hear, tracks shared
            by other DJs, or your own browsing sessions.
          </p>
          <p>
            Don't filter too aggressively at this stage. The point is to capture everything that
            interests you. You'll curate later when you see what's actually available for purchase.
          </p>
          <div className="rounded-sm border border-border bg-bg-primary p-4">
            <p className="text-xs text-text-tertiary font-mono">
              Pro tip: Make the playlist public so TrackHunter can access it.
              Private playlists can't be imported.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Step 2: Import into TrackHunter
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Once your playlist has a solid collection of tracks, it's time to find where to buy
            them. Here's how:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Open your Spotify playlist and click{' '}
              <strong className="text-text-primary">Share → Copy link to playlist</strong>.
            </li>
            <li>
              Go to{' '}
              <Link to="/" className="text-accent hover:underline">TrackHunter</Link>{' '}
              and paste the link into the search box.
            </li>
            <li>
              Click <strong className="text-text-primary">Search</strong> and wait for the results.
              TrackHunter will search Bandcamp, Beatport, Discogs and MusicBrainz simultaneously
              for every track in your playlist.
            </li>
          </ol>
          <p>
            The search runs in parallel across all platforms, so results appear progressively. You
            can start browsing results while the rest of your playlist is still being processed.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Step 3: Choose your store
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            TrackHunter shows you every platform where each track is available. As a DJ, your main
            options are:
          </p>
          <div className="space-y-3">
            <div className="rounded-sm border border-platform-beatport/30 bg-platform-beatport/10 p-4">
              <h3 className="text-sm font-medium text-platform-beatport">Beatport</h3>
              <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
                Best for DJing. Tracks come with BPM, key, genre tags and high-quality WAV/AIFF
                formats. Files integrate directly with Rekordbox, Traktor and Serato. This is
                the standard for professional DJs.
              </p>
            </div>
            <div className="rounded-sm border border-platform-bandcamp/30 bg-platform-bandcamp/10 p-4">
              <h3 className="text-sm font-medium text-platform-bandcamp">Bandcamp</h3>
              <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
                Best for artist support and underground music. You get FLAC/WAV files, but
                they won't have DJ-specific metadata like BPM and key — you'll need to analyze
                them in your DJ software. Often cheaper than Beatport, and artists get a bigger cut.
              </p>
            </div>
            <div className="rounded-sm border border-border bg-bg-secondary p-4">
              <h3 className="text-sm font-medium text-text-secondary">Discogs</h3>
              <p className="mt-1 text-xs text-text-tertiary leading-relaxed">
                Best if you want vinyl. Many DJs still play vinyl sets or collect records.
                Discogs lets you find the exact pressing and buy from sellers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Step 4: Buy and organize
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Click on the platform badge for each track to open it on the store. Buy the tracks you
            want, download the files, and import them into your DJ software. Most DJ apps can
            watch a folder for new files, so set up a "New Purchases" folder and drop everything
            there.
          </p>
          <p>
            After buying, use TrackHunter's{' '}
            <strong className="text-text-primary">Export TXT</strong> button to save your tracklist
            as a plain text file. This is useful for keeping records of what you've bought, or for
            sharing tracklists with other DJs.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bonus: The weekly workflow
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>Here's a simple weekly routine that many DJs find effective:</p>
          <div className="rounded-sm border border-border bg-bg-secondary p-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
              <li>
                <strong className="text-text-primary">Monday–Friday:</strong> Add tracks to your
                Spotify "To Buy" playlist as you discover them during the week.
              </li>
              <li>
                <strong className="text-text-primary">Saturday morning:</strong> Paste the playlist
                into TrackHunter and review results. Buy what you need on Beatport or Bandcamp.
              </li>
              <li>
                <strong className="text-text-primary">Saturday afternoon:</strong> Import new
                purchases into Rekordbox/Traktor. Analyze BPM and key. Tag and organize.
              </li>
              <li>
                <strong className="text-text-primary">Sunday:</strong> Clear your Spotify "To Buy"
                playlist and start fresh for next week.
              </li>
            </ol>
          </div>
          <p>
            This routine turns Spotify into a discovery funnel and TrackHunter into the bridge
            between streaming and your DJ library. Over time, you build a collection that's
            entirely yours — high-quality, properly tagged, and ready to play at any moment.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          From tracklist to collection
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Another powerful workflow: converting tracklists from sets you love into your own
            collection. When you hear a great DJ set on a podcast, radio show or livestream, the
            tracklist is often posted in the description.
          </p>
          <p>
            Copy the tracklist, paste it into TrackHunter (one track per line, Artist - Title
            format), and find every track across all platforms. This is the fastest way to go from
            "I love this set" to "I own every track in it."
          </p>
          <p>
            Whether you start from a Spotify playlist, a YouTube set, or a handwritten tracklist,
            TrackHunter makes the path from discovery to ownership as short as possible. Try it
            now — paste your next playlist and see what you find.
          </p>
        </div>
      </section>
    </>
  );
}
