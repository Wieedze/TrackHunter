/**
 * Cleans YouTube video titles to extract artist and track name.
 * YouTube titles are often noisy with tags like "(Official Video)", "HQ", etc.
 */
export class YouTubeTitleParser {
  // Patterns to remove
  private static NOISE = [
    /\b(official\s*(music\s*)?video|lyric\s*video|audio|visualizer)\b/i,
    /\b(hq|hd|4k|1080p|720p)\b/i,
    /\b(full\s*album|ep|lp)\b/i,
    /\[.*?(official|premiere|exclusive|free\s*dl).*?\]/i,
    /\|.*$/, // Everything after a pipe
  ];

  // Patterns to detect DJ sets (should be excluded)
  private static SET_PATTERNS = [
    /\b(b2b|boiler\s*room|dj\s*set|live\s*at|mix|podcast)\b/i,
    /\d+\s*(hr|hour|min).*mix/i,
  ];

  static parse(title: string): { artist: string; title: string } | null {
    // Reject sets
    if (this.SET_PATTERNS.some((p) => p.test(title))) return null;

    // Clean noise
    let clean = title;
    for (const pattern of this.NOISE) {
      clean = clean.replace(pattern, '');
    }

    // Remove extra whitespace and trailing punctuation
    clean = clean.replace(/\s+/g, ' ').replace(/[\s\-–—]+$/, '').trim();

    // Extract artist - title using common separators
    const separators = [' - ', ' – ', ' — ', ' // '];
    for (const sep of separators) {
      if (clean.includes(sep)) {
        const [artist, track] = clean.split(sep, 2);
        if (artist?.trim() && track?.trim()) {
          return { artist: artist.trim(), title: track.trim() };
        }
      }
    }

    return null; // Cannot parse — ask user
  }
}
