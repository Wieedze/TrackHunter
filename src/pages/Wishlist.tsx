import { Heart } from 'lucide-react';

export function Wishlist() {
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
