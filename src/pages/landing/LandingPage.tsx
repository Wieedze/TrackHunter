import { Link } from 'react-router-dom';
import { SearchBox } from '../../components/search/SearchBox.tsx';
import { RelatedLinks } from '../../components/content/RelatedLinks.tsx';
import { LANDINGS, getLanding } from './landings.ts';

export function LandingPage({ slug }: { slug: string }) {
  const page = getLanding(slug)!;
  const otherLandings = LANDINGS.filter((l) => l.slug !== slug).map((l) => l.slug);

  return (
    <div className="flex flex-col items-center gap-8 pt-12 pb-12">
      {/* Hero */}
      <div className="max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-text-primary">{page.h1}</h1>
        <p className="mt-3 text-text-secondary leading-relaxed">{page.lead}</p>
      </div>

      <SearchBox placeholder={page.placeholder} />

      {/* Steps */}
      <section className="mt-8 w-full max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary text-center">How it works</h2>
        <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {page.steps.map((step, i) => (
            <li key={step.title} className="rounded-sm border border-border bg-bg-secondary p-4">
              <h3 className="text-sm font-medium text-text-primary">
                {i + 1}. {step.title}
              </h3>
              <p className="mt-1 text-xs text-text-tertiary leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Content */}
      <article className="w-full max-w-2xl space-y-6">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold text-text-primary">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-sm text-text-secondary leading-relaxed">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* FAQ */}
      <section className="w-full max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-text-primary">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {page.faq.map(([q, a]) => (
            <details key={q} className="rounded-sm border border-border bg-bg-secondary" open>
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-text-primary">{q}</summary>
              <p className="px-4 pb-3 text-xs text-text-tertiary leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <RelatedLinks articleSlugs={page.relatedArticles} landingSlugs={otherLandings} />

      <p className="text-xs text-text-tertiary">
        New to TrackHunter? Read the <Link to="/guide" className="text-accent hover:underline">user guide</Link>.
      </p>
    </div>
  );
}
