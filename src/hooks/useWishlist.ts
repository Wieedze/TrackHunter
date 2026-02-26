import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { LocalStore } from '../services/storage/LocalStore.ts';
import type { WishlistItem } from '../types/track.ts';
import type { TrackInput } from '../types/track.ts';
import type { Platform } from '../types/platform.ts';

/**
 * Hook for managing the wishlist (persisted to IndexedDB).
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    LocalStore.getWishlist().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loading) {
      LocalStore.saveWishlist(items);
    }
  }, [items, loading]);

  const addToWishlist = useCallback(
    (track: TrackInput, targetPlatforms: Platform[] = []) => {
      const item: WishlistItem = {
        id: nanoid(),
        track,
        targetPlatforms,
        addedAt: new Date().toISOString(),
      };
      setItems((prev) => [item, ...prev]);
    },
    [],
  );

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isInWishlist = useCallback(
    (trackId: string) => items.some((item) => item.track.id === trackId),
    [items],
  );

  return { items, loading, addToWishlist, removeFromWishlist, isInWishlist };
}
