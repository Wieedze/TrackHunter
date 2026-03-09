/**
 * Cleans YouTube video titles to extract artist and track name.
 * YouTube titles are often noisy with tags like "(Official Video)", "HQ", etc.
 */
export class YouTubeTitleParser {
  // Genre tag prefixes added by playlist curators (e.g. "PSY-TRANCE ◉ Artist - Title")
  private static GENRE_PREFIXES = /^(?:PSY[- ]?TRANCE|PSY[- ]?TECHNO|TECHNO|TRANCE|HOUSE|DEEP\s*HOUSE|TECH\s*HOUSE|DRUM\s*(?:&|AND)\s*BASS|D&?N&?B|DUBSTEP|AMBIENT|MINIMAL|PROGRESSIVE|GOA|HARD\s*STYLE|HARD\s*CORE|BREAKS|JUNGLE|GARAGE|ELECTRO|EDM|BASS\s*MUSIC|DOWNTEMPO|CHILL(?:OUT)?)\s*[◉●◆►▸☆★\-–—:|]\s*/i;

  // Patterns to remove
  private static NOISE = [
    /\(?\s*official\s*(music\s*)?video\s*\)?/gi,
    /\(?\s*official\s*(music\s*)?clip\s*\)?/gi,
    /\(?\s*official\s*audio\s*\)?/gi,
    /\(?\s*official\s*visuali[sz]er\s*\)?/gi,
    /\(?\s*lyric\s*video\s*\)?/gi,
    /\(?\s*clip\s*officiel\s*\)?/gi,
    /\(?\s*audio\s*officiel\s*\)?/gi,
    /\(?\s*music\s*video\s*\)?/gi,
    /\(?\s*video\s*clip\s*\)?/gi,
    /\b(hq|hd|4k|1080p|720p)\b/gi,
    /\b(full\s*album|ep|lp)\b/gi,
    /\[.*?\]/g, // Remove all bracketed tags [BHM Exclusive], [Official], etc.
    /\(?\s*premiere\s*\)?/gi,
    /\(?\s*free\s*(download|dl)\s*\)?/gi,
    /\|.*$/, // Everything after a pipe
  ];

  // Patterns to detect DJ sets (should be excluded)
  private static SET_PATTERNS = [
    /\b(b2b|boiler\s*room|dj\s*set|live\s*at|mix|podcast)\b/i,
    /\d+\s*(hr|hour|min).*mix/i,
  ];

  static isDJSet(title: string): boolean {
    return this.SET_PATTERNS.some((p) => p.test(title));
  }

  static parse(title: string): { artist: string; title: string } | null {
    // Reject sets
    if (this.SET_PATTERNS.some((p) => p.test(title))) return null;

    // Strip genre tag prefixes (e.g. "PSY-TRANCE ◉ Artist - Title")
    let clean = title.replace(this.GENRE_PREFIXES, '');

    // Clean noise
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
