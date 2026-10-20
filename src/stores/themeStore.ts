import { create } from 'zustand';

type Theme = 'dark' | 'light' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const isBrowser = typeof window !== 'undefined';

function getInitialTheme(): Theme {
  if (!isBrowser) return 'dark';
  const saved = localStorage.getItem('th_theme');
  if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
  return 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.remove('light');
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

// Apply on load (browser only — the pre-render runs in Node)
if (isBrowser) applyTheme(getInitialTheme());

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('th_theme', theme);
    applyTheme(theme);
    set({ theme });
  },
}));
