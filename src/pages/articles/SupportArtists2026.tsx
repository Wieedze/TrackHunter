import { Link } from 'react-router-dom';

export function SupportArtists2026() {
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          The streaming reality
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            In 2026, streaming dominates how we listen to music. Spotify, Apple Music and YouTube
            Music collectively serve billions of plays every day. But behind those numbers lies a
            harsh truth: most artists earn between $0.003 and $0.005 per stream. That means an
            independent artist needs roughly 250,000 plays just to earn $1,000 — a number that
            only a fraction of musicians ever reach.
          </p>
          <p>
            For underground producers, bedroom DJs releasing tracks on small labels, and
            experimental artists pushing boundaries, streaming revenue is essentially zero. The
            artists who shape entire genres — deep house, ambient, drum & bass, experimental
            electronic — often see less from millions of streams than they would from a few hundred
            direct sales.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bandcamp: the most equitable model
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Bandcamp has built its reputation on being the most artist-friendly platform in the
            music industry. When you buy a track or album on Bandcamp, the artist receives
            approximately <strong className="text-text-primary">82% of the revenue</strong> on
            digital sales. Compare that to the fractions of a cent from streaming, and the
            difference is staggering.
          </p>
          <p>
            A single album purchase on Bandcamp — typically $7 to $12 — can equal what an artist
            earns from tens of thousands of streams. For fans, it's a small price to pay. For
            artists, it's the difference between being able to fund their next release or not.
          </p>
          <p>
            Bandcamp also lets fans pay more than the asking price, and many do. The "name your
            price" model has generated millions in additional revenue for artists who might
            otherwise struggle to sustain their craft.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bandcamp Friday and its impact
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Bandcamp Friday — the monthly event where Bandcamp waives its revenue share entirely —
            has become a cultural moment in the music community. On these days, 100% of your
            purchase goes directly to the artist and label. Since its launch, Bandcamp Fridays have
            generated over $100 million in additional artist revenue.
          </p>
          <p>
            If you're planning to buy music, timing your purchases around Bandcamp Friday is one of
            the simplest ways to maximize your impact. Use TrackHunter to build your shopping list
            throughout the month, then buy everything on Bandcamp Friday.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Beatport and the DJ world
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            For DJs, Beatport remains the go-to store for high-quality digital files. Tracks are
            available in WAV and AIFF formats, tagged with BPM, key, and genre information that
            integrates directly with DJ software like Rekordbox, Traktor and Serato.
          </p>
          <p>
            While Beatport's artist revenue share isn't as generous as Bandcamp's, buying on
            Beatport still puts significantly more money in artists' pockets than streaming. A
            single track purchase ($1.49–$2.49) generates more revenue for the artist than
            thousands of streams.
          </p>
          <p>
            If you DJ professionally or even as a hobby, buying your tracks is both an ethical
            choice and a practical one — you get higher quality files, proper metadata, and the
            peace of mind that comes with supporting the music you play.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Vinyl and physical media via Discogs
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Vinyl has experienced a remarkable resurgence. In 2025, vinyl sales reached their
            highest point in decades, driven by collectors and audiophiles who value the warmth,
            artwork and ritual of physical music. Discogs — the world's largest music marketplace —
            is where most of this buying and selling happens.
          </p>
          <p>
            Buying vinyl supports the entire chain: the artist, the label, the pressing plant, and
            the record shop or seller. Many independent labels fund their digital releases through
            vinyl sales, so buying a record can indirectly support an artist's entire catalog.
          </p>
          <p>
            Use TrackHunter to search Discogs and MusicBrainz for physical releases. You might
            discover that the track you found on Spotify was released on a limited-edition 12"
            that's still available from sellers worldwide.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          How TrackHunter helps
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            The biggest barrier to buying music isn't willingness — it's convenience. Streaming is
            effortless: you hear a track, you save it, done. Buying requires searching, comparing
            prices, finding the right format. TrackHunter removes that friction.
          </p>
          <p>
            Paste your Spotify playlist into{' '}
            <Link to="/" className="text-accent hover:underline">TrackHunter</Link>, and in
            seconds you'll see which tracks are available on Bandcamp, Beatport, Discogs and
            MusicBrainz. Click through to buy directly. No more opening four tabs and searching
            each store manually.
          </p>
          <p>
            The goal is simple: make it as easy to buy music as it is to stream it. When buying is
            convenient, more people buy. When more people buy, artists can keep making the music
            we love.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Every purchase counts
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            You don't need to buy every track you listen to. But buying even a few tracks a month
            — especially from independent artists on Bandcamp — makes a real difference. A $10
            album purchase can equal what an artist earns from 30,000+ streams.
          </p>
          <p>
            Here's a simple approach: keep streaming for discovery, but when you find something you
            truly love, buy it. Use TrackHunter to find where it's available, pick the platform
            that works best for you, and support the artist directly. It's a small action with a
            big impact.
          </p>
        </div>
      </section>
    </>
  );
}
