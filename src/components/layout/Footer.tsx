import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <span className="font-mono text-xs text-text-tertiary">
          TrackHunter v1.0.0
        </span>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            About
          </Link>
          <Link to="/guide" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Guide
          </Link>
          <Link to="/blog" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Blog
          </Link>
          <a href="https://getsongbpm.com" target="_blank" rel="noopener noreferrer" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            BPM data by GetSongBPM
          </a>
          <span className="text-xs text-text-tertiary">
            Search. Compare. Collect.
          </span>
        </nav>
      </div>
    </footer>
  );
}
