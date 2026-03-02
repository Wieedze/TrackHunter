import type { Platform, PlatformResult } from '../../types/platform.ts';
import type { TrackQuery } from '../../types/search.ts';

/**
 * Base class for all platform providers.
 * Each provider implements search() to find tracks on a specific platform.
 */
export abstract class BaseProvider {
  abstract platform: Platform;

  abstract search(query: TrackQuery): Promise<PlatformResult[]>;

  abstract isAvailable(): Promise<boolean>;

  /**
   * Compute confidence score between a query and a candidate result.
   * Uses normalized string comparison.
   */
  protected computeConfidence(
    query: TrackQuery,
    candidate: { title?: string; artist?: string },
  ): number {
    const normalize = (s: string): string =>
      s
        .toLowerCase()
        .replace(/[\(\)\[\]\-–—,&]/g, ' ')
        .replace(/\bvs\.?\b/g, ' ')
        .replace(/\band\b/g, ' ')
        .replace(/feat\.?|ft\.?|featuring/g, 'feat')
        .replace(/remix|rmx|rework|edit|mix/g, 'remix')
        .replace(/original\s*(mix)?/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    const qTitle = normalize(query.title);
    const qArtist = normalize(query.artist);
    const cTitle = candidate.title ? normalize(candidate.title) : '';
    const cArtist = candidate.artist ? normalize(candidate.artist) : '';

    // Combined candidate text — Bandcamp often puts the real artist name
    // in the title (e.g. "ATRIOHM VS ENCEPHALOPATICYS - Ukalen") while
    // the artist field contains the label/publisher name.
    const cCombined = `${cTitle} ${cArtist}`;

    // Title similarity (50%)
    const titleSim = cTitle ? tokenSimilarity(qTitle, cTitle) : 0;

    // Artist similarity (50%) — also check if artist appears in combined text
    const artistDirect = cArtist ? tokenSimilarity(qArtist, cArtist) : 0;
    const artistInCombined = tokenSimilarity(qArtist, cCombined);
    const artistSim = Math.max(artistDirect, artistInCombined);

    // Both title AND artist must have some match to score well.
    // Title-only match (wrong artist) or artist-only match (wrong track)
    // should score low.
    const score = titleSim * 0.5 + artistSim * 0.5;

    return Math.min(score, 1.0);
  }
}

/**
 * Token-based similarity: measures what fraction of query tokens appear
 * in the candidate. Uses recall (overlap / query size) rather than Jaccard
 * so that extra tokens in the candidate don't dilute the score.
 */
function tokenSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.split(' ').filter(Boolean));
  const tokensB = new Set(b.split(' ').filter(Boolean));

  if (tokensA.size === 0 && tokensB.size === 0) return 1;
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let overlap = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) overlap++;
  }

  return overlap / tokensA.size;
}
