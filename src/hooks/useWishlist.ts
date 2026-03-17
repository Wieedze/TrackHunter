import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { LocalStore } from '../services/storage/LocalStore.ts';
import type { WishlistItem, WishlistFolder } from '../types/track.ts';
import type { TrackInput } from '../types/track.ts';
import type { Platform } from '../types/platform.ts';

/**
 * Hook for managing the wishlist with folders (persisted to IndexedDB + localStorage).
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [folders, setFolders] = useState<WishlistFolder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    Promise.all([LocalStore.getWishlist(), Promise.resolve(LocalStore.getFolders())]).then(
      ([wishlistData, folderData]) => {
        setItems(wishlistData);
        setFolders(folderData);
        setLoading(false);
      },
    );
  }, []);

  // Persist items on change
  useEffect(() => {
    if (!loading) {
      LocalStore.saveWishlist(items);
    }
  }, [items, loading]);

  // Persist folders on change
  useEffect(() => {
    if (!loading) {
      LocalStore.saveFolders(folders);
    }
  }, [folders, loading]);

  const addToWishlist = useCallback(
    (track: TrackInput, targetPlatforms: Platform[] = [], folderId?: string) => {
      const item: WishlistItem = {
        id: nanoid(),
        track,
        targetPlatforms,
        addedAt: new Date().toISOString(),
        folderId,
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

  const moveToFolder = useCallback((itemId: string, folderId: string | undefined) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, folderId } : item)),
    );
  }, []);

  // Folder CRUD
  const createFolder = useCallback((name: string) => {
    const folder: WishlistFolder = {
      id: nanoid(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Move items from deleted folder to uncategorized
    setItems((prev) => prev.map((item) => (item.folderId === id ? { ...item, folderId: undefined } : item)));
  }, []);

  return {
    items,
    folders,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToFolder,
    createFolder,
    renameFolder,
    deleteFolder,
  };
}
