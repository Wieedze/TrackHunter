import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ARTICLES } from './index.ts';
import { LANDINGS } from '../landing/landings.ts';
import { RelatedLinks } from '../../components/content/RelatedLinks.tsx';
import { SupportArtists2026 } from './SupportArtists2026.tsx';
import { BestPlatforms } from './BestPlatforms.tsx';
import { SpotifyToDJSet } from './SpotifyToDJSet.tsx';
import { BpmKeyMixing } from './BpmKeyMixing.tsx';
import { UndergroundLabels2026 } from './UndergroundLabels2026.tsx';
import { BuildVinylCollection2026 } from './BuildVinylCollection2026.tsx';

const ARTICLE_COMPONENTS: Record<string, React.FC> = {
  'how-to-support-artists-in-2026': SupportArtists2026,
  'best-platforms-to-buy-music-online': BestPlatforms,
  'spotify-playlist-to-dj-set': SpotifyToDJSet,
  'bpm-key-guide-for-djs': BpmKeyMixing,
  'underground-labels-to-follow-2026': UndergroundLabels2026,
  'build-vinyl-collection-2026': BuildVinylCollection2026,
};

export function ArticleLayout() {
  const { slug } = useParams<{ slug: string }>();
  const meta = ARTICLES.find((a) => a.slug === slug);
  const Content = slug ? ARTICLE_COMPONENTS[slug] : undefined;

  if (!meta || !Content) {
    return <Navigate to="/blog" replace />;
  }

  // Related: articles sharing the most tags, and the landing pages that cite this article.
  const relatedArticles = ARTICLES.filter((a) => a.slug !== meta.slug)
    .map((a) => ({ slug: a.slug, shared: a.tags.filter((t) => meta.tags.includes(t)).length }))
    .sort((x, y) => y.shared - x.shared)
    .slice(0, 2)
    .map((a) => a.slug);
  const relatedLandings = LANDINGS.filter((l) => l.relatedArticles.includes(meta.slug)).map((l) => l.slug);

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

      <RelatedLinks articleSlugs={relatedArticles} landingSlugs={relatedLandings} />

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
