import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Settings, Info, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Search', icon: Search },
  { path: '/guide', label: 'Guide', icon: BookOpen },
  { path: '/about', label: 'About', icon: Info },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-bg-secondary">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-text-primary no-underline">
          <span className="text-accent">Track</span>
          <span>Hunter</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-150 rounded-sm ${
                  isActive
                    ? 'bg-bg-tertiary text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
