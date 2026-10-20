import { Link } from 'react-router-dom';
import { LANDINGS } from '../../pages/landing/landings.ts';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary py-4">
      <nav aria-label="Tools" className="mx-auto mb-3 flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4">
        {LANDINGS.map((l) => (
          <Link key={l.slug} to={`/${l.slug}`} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4">
        <span className="font-mono text-xs text-text-tertiary">
          TrackHunter v1.0.0
        </span>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link to="/about" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            About
          </Link>
          <Link to="/guide" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Guide
          </Link>
          <Link to="/blog" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Blog
          </Link>
          <Link to="/privacy" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Privacy
          </Link>
          <Link to="/terms" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            Terms
          </Link>
          <a href="https://getsongbpm.com" target="_blank" rel="noopener noreferrer" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline">
            BPM data by GetSongBPM
          </a>
        </nav>
      </div>
    </footer>
  );
}
