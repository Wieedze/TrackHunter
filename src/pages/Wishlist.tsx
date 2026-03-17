import { Heart, Trash2, Music } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist.ts';

export function Wishlist() {
  const { items, loading, removeFromWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <p className="text-text-secondary">Loading wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <Heart size={32} strokeWidth={1.5} className="text-text-tertiary" />
        <p className="text-text-secondary">Your wishlist is empty.</p>
        <p className="text-sm text-text-tertiary">
          Add tracks you want to keep an eye on from the search results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary">Wishlist</h2>
          <p className="text-sm text-text-secondary">{items.length} track{items.length > 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-bg-secondary">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-bg-tertiary">
                <Music size={16} strokeWidth={1.5} className="text-text-tertiary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {item.track.artist} — {item.track.title}
                </p>
                <p className="text-xs text-text-tertiary">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                  {item.track.label && ` · ${item.track.label}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFromWishlist(item.id)}
              className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 text-xs text-text-tertiary hover:border-status-error hover:text-status-error transition-colors"
            >
              <Trash2 size={12} strokeWidth={1.5} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
