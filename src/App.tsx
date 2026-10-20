import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout.tsx';
import { Home } from './pages/Home.tsx';
import { Results } from './pages/Results.tsx';
import { Wishlist } from './pages/Wishlist.tsx';
import { Settings } from './pages/Settings.tsx';
import { About } from './pages/About.tsx';
import { Guide } from './pages/Guide.tsx';
import { Blog } from './pages/Blog.tsx';
import { ArticleLayout } from './pages/articles/ArticleLayout.tsx';
import { Stats } from './pages/Stats.tsx';
import { Privacy } from './pages/Privacy.tsx';
import { Terms } from './pages/Terms.tsx';
import { LandingPage } from './pages/landing/LandingPage.tsx';
import { LANDINGS } from './pages/landing/landings.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<ArticleLayout />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {LANDINGS.map((l) => (
          <Route key={l.slug} path={`/${l.slug}`} element={<LandingPage slug={l.slug} />} />
        ))}
      </Route>
    </Routes>
  );
}

/** Providers shared by the browser app and the pre-render (entry-server). */
export function AppProviders({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
