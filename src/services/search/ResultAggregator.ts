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
   * Get the best match (highest confidence).
   */
  static getBestMatch(results: PlatformResult[]): PlatformResult | undefined {
    if (results.length === 0) return undefined;
    return results.reduce((best, r) => (r.confidence > best.confidence ? r : best));
  }

  /**
   * Filter results above a minimum confidence threshold.
   */
  static filterByConfidence(results: PlatformResult[], minConfidence = 0.4): PlatformResult[] {
    return results.filter((r) => r.confidence >= minConfidence);
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
