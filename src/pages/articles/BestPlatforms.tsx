import { Link } from 'react-router-dom';

export function BestPlatforms() {
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Why buying music still matters
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Streaming is great for discovery, but owning your music gives you something streaming
            never will: permanence. Tracks disappear from streaming platforms all the time — licensing
            deals expire, labels pull catalogs, platforms shut down. When you buy a track, it's yours
            forever, in the format and quality you choose.
          </p>
          <p>
            For DJs, owning files is essential. You can't play a set from a streaming app — you need
            high-quality files with proper metadata. For collectors, physical media carries artwork,
            liner notes and the satisfaction of building a curated library. For everyone else, buying
            is simply the most direct way to support the artists you love.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bandcamp — Best for independent music
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <div className="rounded-sm border border-platform-bandcamp/30 bg-platform-bandcamp/10 px-4 py-3">
            <p className="text-xs text-platform-bandcamp">
              Artist revenue share: ~82% &bull; Formats: MP3, FLAC, WAV, AAC, Ogg &bull; Best for: indie, electronic, experimental
            </p>
          </div>
          <p>
            Bandcamp is the gold standard for independent music. Artists set their own prices,
            choose their formats, and receive the largest share of revenue of any major platform.
            The catalog is massive and spans every genre, but it's especially strong in electronic,
            indie, hip-hop, ambient and experimental music.
          </p>
          <p>
            When you buy on Bandcamp, you get the track in every available format — buy once,
            download in MP3, FLAC, WAV or any other format anytime. There's also a built-in
            streaming player, so you can listen to your purchases without downloading.
          </p>
          <p>
            <strong className="text-text-primary">Best for:</strong> Fans who want to support
            artists directly, anyone who values high-quality lossless files, and listeners exploring
            underground and independent music.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Beatport — Best for DJs
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <div className="rounded-sm border border-platform-beatport/30 bg-platform-beatport/10 px-4 py-3">
            <p className="text-xs text-platform-beatport">
              Price per track: $1.49–$2.49 &bull; Formats: MP3, WAV, AIFF &bull; Best for: house, techno, D&B, trance
            </p>
          </div>
          <p>
            Beatport is the world's leading store for electronic dance music. It's built specifically
            for DJs: every track comes with BPM, musical key, genre classification and waveform
            previews. Files integrate seamlessly with DJ software like Rekordbox, Traktor and Serato.
          </p>
          <p>
            The catalog focuses on electronic music — house, techno, drum & bass, trance, dubstep
            and everything in between. If you're a DJ buying tracks for your sets, Beatport is
            likely your primary source. The platform also offers curated charts, label pages and
            new release notifications.
          </p>
          <p>
            <strong className="text-text-primary">Best for:</strong> DJs who need properly tagged
            high-quality files, electronic music enthusiasts, and anyone building a dance music
            collection.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Discogs — Best for physical media and rare releases
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <div className="rounded-sm border border-border bg-bg-tertiary px-4 py-3">
            <p className="text-xs text-text-secondary">
              Marketplace: vinyl, CD, cassette &bull; Catalog: 16M+ releases &bull; Best for: collectors, vinyl lovers
            </p>
          </div>
          <p>
            Discogs is two things: the world's most comprehensive music database and the world's
            largest marketplace for physical music. With over 16 million releases cataloged and
            millions of items for sale from sellers worldwide, it's the definitive destination for
            vinyl collectors.
          </p>
          <p>
            Every release on Discogs has detailed information: tracklists, credits, pressing
            variations, label catalog numbers and user reviews. The marketplace lets you buy from
            sellers globally, with condition grading (Mint, Near Mint, VG+, etc.) so you know
            exactly what you're getting.
          </p>
          <p>
            <strong className="text-text-primary">Best for:</strong> Vinyl and CD collectors,
            anyone searching for rare or out-of-print releases, and music enthusiasts who value
            detailed catalog information.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          MusicBrainz — Best for metadata and discovery
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <div className="rounded-sm border border-platform-musicbrainz/30 bg-platform-musicbrainz/10 px-4 py-3">
            <p className="text-xs text-platform-musicbrainz">
              Type: open database &bull; Releases cataloged: 3M+ &bull; Best for: metadata, cross-referencing
            </p>
          </div>
          <p>
            MusicBrainz isn't a store — it's an open music encyclopedia. It catalogs millions of
            recordings with detailed metadata: release dates, labels, ISRCs, track durations,
            artist relationships and links to other platforms. It's the backbone that many music
            apps use for their data.
          </p>
          <p>
            For music buyers, MusicBrainz is invaluable as a cross-reference tool. Found a track
            but not sure which release it's from? MusicBrainz can tell you every album and
            compilation it appeared on, which labels released it, and link you to where it's
            available for purchase.
          </p>
          <p>
            <strong className="text-text-primary">Best for:</strong> Finding detailed release
            information, cross-referencing tracks across platforms, and discovering related releases.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Which platform should you choose?
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>The answer depends on what you need:</p>
          <div className="space-y-2">
            <div className="rounded-sm border border-border bg-bg-secondary p-3">
              <p className="text-sm text-text-primary">
                <strong>You want to support artists directly →</strong>{' '}
                <span className="text-platform-bandcamp">Bandcamp</span>
              </p>
            </div>
            <div className="rounded-sm border border-border bg-bg-secondary p-3">
              <p className="text-sm text-text-primary">
                <strong>You're a DJ buying tracks for sets →</strong>{' '}
                <span className="text-platform-beatport">Beatport</span>
              </p>
            </div>
            <div className="rounded-sm border border-border bg-bg-secondary p-3">
              <p className="text-sm text-text-primary">
                <strong>You collect vinyl or want physical media →</strong>{' '}
                <span className="text-text-secondary">Discogs</span>
              </p>
            </div>
            <div className="rounded-sm border border-border bg-bg-secondary p-3">
              <p className="text-sm text-text-primary">
                <strong>You need detailed metadata or release info →</strong>{' '}
                <span className="text-platform-musicbrainz">MusicBrainz</span>
              </p>
            </div>
          </div>
          <p>
            Or, use all of them. That's exactly what{' '}
            <Link to="/" className="text-accent hover:underline">TrackHunter</Link> does — search
            every platform at once and choose the one that fits your needs for each track.
          </p>
        </div>
      </section>
    </>
  );
}
