import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { MiniPlayer } from '../player/MiniPlayer.tsx';
import { usePlayerStore } from '../../stores/playerStore.ts';
import { getRouteMeta } from '../../seo.ts';

export function Layout() {
  const hasTrack = usePlayerStore((s) => s.isPlaying);
  const { pathname } = useLocation();

  // Keep the tab title in sync on client-side navigation (the pre-rendered
  // HTML already carries the right <head> for the first load).
  useEffect(() => {
    const meta = getRouteMeta(pathname);
    if (meta) document.title = meta.title;
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 py-6 ${hasTrack ? 'pb-56' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  );
}
