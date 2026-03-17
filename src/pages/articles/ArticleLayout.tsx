import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ARTICLES } from './index.ts';
import { SupportArtists2026 } from './SupportArtists2026.tsx';
import { BestPlatforms } from './BestPlatforms.tsx';
import { SpotifyToDJSet } from './SpotifyToDJSet.tsx';

const ARTICLE_COMPONENTS: Record<string, React.FC> = {
  'how-to-support-artists-in-2026': SupportArtists2026,
  'best-platforms-to-buy-music-online': BestPlatforms,
  'spotify-playlist-to-dj-set': SpotifyToDJSet,
};

export function ArticleLayout() {
  const { slug } = useParams<{ slug: string }>();
  const meta = ARTICLES.find((a) => a.slug === slug);
  const Content = slug ? ARTICLE_COMPONENTS[slug] : undefined;

  if (!meta || !Content) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="flex flex-col items-center gap-6 pt-12 pb-12">
      {/* Back link */}
      <div className="w-full max-w-2xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors no-underline"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to blog
        </Link>
      </div>

      {/* Article header */}
      <header className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-text-tertiary">{meta.date}</span>
          <span className="text-xs text-text-tertiary">{meta.readingTime}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary leading-tight">
          {meta.title}
        </h1>
        <p className="mt-3 text-text-secondary leading-relaxed">
          {meta.description}
        </p>
      </header>

      {/* Article body */}
      <article className="w-full max-w-2xl space-y-6">
        <Content />
      </article>

      {/* CTA */}
      <div className="w-full max-w-2xl">
        <div className="rounded-sm border border-border bg-bg-secondary p-6 text-center">
          <h3 className="font-display text-lg font-semibold text-text-primary">
            Find where to buy any track
          </h3>
          <p className="mt-2 text-sm text-text-tertiary">
            Paste a playlist and search across Bandcamp, Beatport, Discogs and MusicBrainz.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 text-sm font-medium text-text-inverse no-underline transition-colors hover:bg-accent-hover"
          >
            Start searching
          </Link>
        </div>
      </div>
    </div>
  );
}
