import { Link } from 'react-router-dom';
import { ARTICLES } from '../../pages/articles/index.ts';
import { LANDINGS } from '../../pages/landing/landings.ts';

interface RelatedLinksProps {
  articleSlugs?: string[];
  landingSlugs?: string[];
}

/** "Related guides" + "Tools" link cards at the bottom of articles and landing pages. */
export function RelatedLinks({ articleSlugs = [], landingSlugs = [] }: RelatedLinksProps) {
  const articles = articleSlugs
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);
  const landings = landingSlugs
    .map((slug) => LANDINGS.find((l) => l.slug === slug))
    .filter((l) => l !== undefined);

  if (articles.length === 0 && landings.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-6">
      {articles.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">Related guides</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                className="block rounded-sm border border-border bg-bg-secondary p-4 no-underline transition-colors hover:border-border-hover"
              >
                <h3 className="text-sm font-medium text-text-primary">{a.title}</h3>
                <p className="mt-1 text-xs text-text-tertiary leading-relaxed">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      {landings.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-text-primary">Find your tracks</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {landings.map((l) => (
              <Link
                key={l.slug}
                to={`/${l.slug}`}
                className="rounded-sm border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary no-underline transition-colors hover:border-border-hover hover:text-text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
