import { Outlet } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { MiniPlayer } from '../player/MiniPlayer.tsx';
import { usePlayerStore } from '../../stores/playerStore.ts';

export function Layout() {
  const hasTrack = usePlayerStore((s) => !!s.currentTrackId);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header />
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 py-6 ${hasTrack ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  );
}
