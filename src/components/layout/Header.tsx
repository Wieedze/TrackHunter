import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Settings, Info, BookOpen, FileText, BarChart3, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore.ts';

const NAV_ITEMS = [
  { path: '/', label: 'Search', icon: Search },
  { path: '/guide', label: 'Guide', icon: BookOpen },
  { path: '/blog', label: 'Blog', icon: FileText },
  { path: '/about', label: 'About', icon: Info },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/stats', label: 'Stats', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();

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
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 px-2 py-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150 rounded-sm"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
          </button>

          <span className="h-4 w-px bg-border" />

          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path || (path === '/blog' && location.pathname.startsWith('/blog'));
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
