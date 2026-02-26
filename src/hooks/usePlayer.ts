import { useRef, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../stores/playerStore.ts';

/**
 * Hook for controlling the audio preview player.
 * Manages an HTML5 Audio element for 30s previews.
 */
export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    isPlaying,
    currentPreviewUrl,
    volume,
    play,
    pause,
    resume,
    stop,
    setProgress,
  } = usePlayerStore();

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => stop();

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [volume, setProgress, stop]);

  // Play/pause syncing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentPreviewUrl) {
      if (audio.src !== currentPreviewUrl) {
        audio.src = currentPreviewUrl;
      }
      audio.play().catch(() => {
        // Autoplay blocked — user needs to interact first
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentPreviewUrl]);

  const playTrack = useCallback(
    (trackId: string, previewUrl: string, platform: string) => {
      play(trackId, previewUrl, platform);
    },
    [play],
  );

  return { playTrack, pause, resume, stop, isPlaying };
}
