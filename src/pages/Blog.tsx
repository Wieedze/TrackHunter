import { Link } from 'react-router-dom';
import { ARTICLES } from './articles/index.ts';

export function Blog() {
  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">
          <span className="text-accent">Track</span>Hunter Blog
        </h1>
        <p className="mt-3 max-w-md text-text-secondary">
          Guides, tips and insights for DJs, collectors and music lovers.
        </p>
      </div>

      {/* Article list */}
      <div className="w-full max-w-2xl space-y-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="block rounded-sm border border-border bg-bg-secondary p-5 no-underline transition-colors hover:border-border-hover"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-text-tertiary">{article.date}</span>
              <span className="text-xs text-text-tertiary">{article.readingTime}</span>
            </div>
            <h2 className="font-display text-base font-semibold text-text-primary">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {article.description}
            </p>
            <div className="mt-3 flex gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border px-2 py-0.5 text-xs text-text-tertiary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
