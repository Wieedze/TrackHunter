import { Link } from 'react-router-dom';

export function BpmKeyMixing() {
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Why BPM and key matter for DJs
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Every DJ knows the basics of beatmatching — syncing two tracks so their beats align.
            But professional-sounding mixes go beyond just matching tempo. The secret to seamless,
            musical transitions lies in understanding two fundamental properties: <strong>BPM</strong> (beats
            per minute) and <strong>musical key</strong>.
          </p>
          <p>
            BPM tells you how fast a track is. Key tells you which notes dominate the melody and
            harmony. When two tracks share a compatible key, blending them creates a harmonious
            mix. When keys clash, even a perfectly beatmatched transition sounds jarring and
            dissonant — and your audience will feel it, even if they can't explain why.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Understanding the Camelot wheel
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            The <strong>Camelot wheel</strong> (also called the harmonic mixing wheel) is a simplified
            system that maps all 24 musical keys to numbers and letters. Each key gets a code like
            <strong> 8A</strong> or <strong>11B</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Numbers (1-12)</strong> represent the pitch — think of it like hours on a clock</li>
            <li><strong>A</strong> = minor key (darker, moodier feel)</li>
            <li><strong>B</strong> = major key (brighter, more uplifting feel)</li>
          </ul>
          <p>
            The rule is simple: you can mix harmonically by moving to an <strong>adjacent number</strong> (e.g.,
            8A → 7A or 9A) or by switching between <strong>A and B</strong> on the same number (e.g.,
            8A → 8B). Staying on the same number is always safe. This gives you up to 4 compatible
            keys for every track in your set.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          BPM ranges by genre
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Knowing typical BPM ranges helps you organize your collection and plan sets:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-text-primary font-medium">Genre</th>
                  <th className="py-2 text-text-primary font-medium">BPM Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="py-2 pr-4">Deep House</td><td>118 – 125</td></tr>
                <tr><td className="py-2 pr-4">Tech House</td><td>122 – 130</td></tr>
                <tr><td className="py-2 pr-4">Techno</td><td>128 – 140</td></tr>
                <tr><td className="py-2 pr-4">Hard Techno</td><td>140 – 155</td></tr>
                <tr><td className="py-2 pr-4">Drum & Bass</td><td>170 – 180</td></tr>
                <tr><td className="py-2 pr-4">Trance</td><td>130 – 145</td></tr>
                <tr><td className="py-2 pr-4">Minimal</td><td>120 – 130</td></tr>
                <tr><td className="py-2 pr-4">Breakbeat</td><td>120 – 140</td></tr>
                <tr><td className="py-2 pr-4">Ambient</td><td>60 – 100</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            When mixing between genres (e.g., deep house into tech house), aim for tracks where
            BPM ranges overlap. A 125 BPM deep house track flows naturally into a 126 BPM tech
            house track. Jumping more than 3-4 BPM between tracks requires pitch adjustment.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Practical workflow: preparing a harmonically mixed set
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li><strong>Import your tracks</strong> — Paste your Spotify or SoundCloud playlist into <Link to="/" className="text-accent hover:underline">TrackHunter</Link></li>
            <li><strong>Check BPM & Key</strong> — TrackHunter displays the BPM and root key for each track found</li>
            <li><strong>Sort by BPM</strong> — Group tracks with similar tempos together</li>
            <li><strong>Map keys on the Camelot wheel</strong> — Plan transitions that stay within compatible keys</li>
            <li><strong>Buy the tracks</strong> — Use TrackHunter's links to purchase on Bandcamp, Beatport or Discogs in lossless quality</li>
            <li><strong>Practice the transitions</strong> — Load the tracks in your DJ software and test the harmonic blends</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Advanced techniques
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong>Energy boost</strong> — Jump +2 on the Camelot wheel (e.g., 5A → 7A) for a noticeable energy lift</li>
            <li><strong>Mood shift</strong> — Switch from minor to major (A → B) on the same number for a brighter feel</li>
            <li><strong>Key lock</strong> — Use your DJ software's key lock to change BPM without shifting pitch</li>
            <li><strong>Half/double time</strong> — A 128 BPM techno track can mix with a 64 BPM ambient track if the rhythms complement</li>
            <li><strong>Trust your ears</strong> — The Camelot wheel is a guide, not a rule. Some "incompatible" mixes sound great if the melodic elements don't overlap</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Finding BPM and key for your tracks
        </h2>
        <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Not all music platforms display BPM and key information. Beatport is the best source for
            DJ-ready metadata, while Bandcamp and Discogs often don't include this data. That's why
            <Link to="/" className="text-accent hover:underline"> TrackHunter</Link> integrates
            BPM and key detection — so you can see this information directly in your search results
            regardless of which platform the track comes from.
          </p>
          <p>
            Combined with the wishlist feature, you can build a collection of tracks organized by
            BPM and key — ready to slot into your next set.
          </p>
        </div>
      </section>
    </>
  );
}
