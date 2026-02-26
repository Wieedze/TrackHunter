import type { PlatformResult } from '../../types/platform.ts';

/**
 * Deduplicates, sorts, and merges results from multiple providers.
 */
export class ResultAggregator {
  /**
   * Sort results by confidence score (descending).
   */
  static sortByConfidence(results: PlatformResult[]): PlatformResult[] {
    return [...results].sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get the best match (highest confidence). Excludes manual search links.
   */
  static getBestMatch(results: PlatformResult[]): PlatformResult | undefined {
    const automatic = results.filter((r) => !r.manualSearch);
    if (automatic.length === 0) return undefined;
    return automatic.reduce((best, r) => (r.confidence > best.confidence ? r : best));
  }

  /**
   * Filter results above a minimum confidence threshold.
   * Manual search links are always kept regardless of confidence.
   */
  static filterByConfidence(results: PlatformResult[], minConfidence = 0.4): PlatformResult[] {
    return results.filter((r) => r.manualSearch || r.confidence >= minConfidence);
  }

  /**
   * Get the cheapest available result.
   */
  static getCheapest(results: PlatformResult[]): PlatformResult | undefined {
    const withPrice = results.filter((r) => r.price != null && r.available);
    if (withPrice.length === 0) return undefined;
    return withPrice.reduce((cheapest, r) => (r.price! < cheapest.price! ? r : cheapest));
  }
}
