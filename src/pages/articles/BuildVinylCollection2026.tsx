import { Link } from 'react-router-dom';

export function BuildVinylCollection2026() {
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Why vinyl is making a massive comeback
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Vinyl sales hit a 30-year high in 2025, and the trend shows no signs of slowing down.
            For DJs, vinyl isn't just nostalgia — it's a statement. The tactile experience of
            browsing crates, the warm analog sound, and the commitment of buying a physical record
            all contribute to a deeper connection with music. Whether you're a bedroom selector or
            a club DJ, building a vinyl collection is one of the most rewarding parts of the craft.
          </p>
          <p>
            But finding vinyl in 2026 isn't as simple as walking into a record shop. Many releases
            are limited pressings that sell out in hours. Others are only available from specific
            distributors or directly from labels. Knowing where to look — and having the right
            tools — makes all the difference.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Discogs: the vinyl marketplace
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            <a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Discogs</a> is
            the largest online marketplace for vinyl records. With over 15 million releases catalogued
            and millions of sellers worldwide, it's the go-to platform for finding both new pressings
            and rare second-hand records. The marketplace shows condition ratings (Mint, Near Mint,
            Very Good+, etc.), seller ratings, and price history — so you always know what you're paying.
          </p>
          <p>
            The Discogs database is community-driven, which means even the most obscure white labels
            and promo-only pressings are often catalogued. If a record exists, chances are it's on Discogs.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Bandcamp: buy direct from artists
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Many independent labels and artists sell vinyl directly through
            <a href="https://bandcamp.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"> Bandcamp</a>.
            The advantage? You're buying directly from the source, and the artist gets the largest
            possible cut. Bandcamp vinyl releases often include a digital download, so you get both
            the physical record and high-quality audio files (FLAC, WAV, or MP3).
          </p>
          <p>
            Keep an eye on <strong>Bandcamp Friday</strong> — on the first Friday of each month,
            Bandcamp waives its revenue share, meaning 100% of your purchase goes directly to the
            artist or label. It's the best day to stock up on vinyl.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Beatport: DJ-focused digital + vinyl
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            While <a href="https://www.beatport.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Beatport</a> is
            primarily known for digital downloads, many labels also list vinyl releases on the platform.
            Beatport's strength is its DJ-centric metadata: every track comes with BPM, key, and genre
            tags — essential info when you're building a vinyl collection for mixing.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          The workflow: from streaming to vinyl crate
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Here's a practical workflow for building your vinyl collection in 2026:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li><strong>Discover</strong> — Use Spotify, SoundCloud, or YouTube to find tracks you love</li>
            <li><strong>Search</strong> — Paste your playlist into <Link to="/" className="text-accent hover:underline">TrackHunter</Link> to find where each track is available on vinyl</li>
            <li><strong>Compare</strong> — Check Discogs for used copies, Bandcamp for direct-from-artist, Beatport for DJ-ready metadata</li>
            <li><strong>Buy smart</strong> — Use Bandcamp Fridays for maximum artist support, Discogs for rare finds, and local record shops for the joy of digging</li>
            <li><strong>Organize</strong> — Use TrackHunter's wishlist to keep track of records you want but haven't bought yet</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Tips for smart vinyl buying
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Check pressing quality</strong> — Not all vinyl is equal. Look for 180g pressings and reputable pressing plants</li>
            <li><strong>Factor in shipping</strong> — Vinyl is heavy. Buying multiple records from the same seller saves on shipping</li>
            <li><strong>Pre-order limited runs</strong> — If a label announces a pressing of 300 copies, don't wait</li>
            <li><strong>Join label mailing lists</strong> — Many underground labels sell out before the record even hits Discogs</li>
            <li><strong>Inspect condition carefully</strong> — On Discogs, always read the seller's condition notes, not just the grade</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          The bottom line
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Building a vinyl collection in 2026 is easier than ever thanks to online marketplaces,
            but it still requires patience and strategy. The key is knowing where to look — and tools
            like <Link to="/" className="text-accent hover:underline">TrackHunter</Link> make it
            simple to search across all platforms at once. Whether you're after a rare 90s techno
            white label or a brand new pressing from your favorite underground label, the vinyl
            world is alive and thriving.
          </p>
        </div>
      </section>
    </>
  );
}
