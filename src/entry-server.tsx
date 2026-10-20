/* eslint-disable react-refresh/only-export-components -- server-only entry, never hot-reloaded */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppProviders, AppRoutes } from './App.tsx';

export { ROUTES, SITE_URL, SITE_NAME, OG_IMAGE } from './seo.ts';

/** Render one route to HTML for scripts/prerender.mjs. */
export function render(url: string): string {
  return renderToString(
    <AppProviders>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
}
