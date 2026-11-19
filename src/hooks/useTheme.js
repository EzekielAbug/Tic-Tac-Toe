import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage/localStorage';
import { THEMES } from '@/constants/theme';

/**
 * Custom hook to manage and persist Day/Night theme.
 * Synchronizes class="night" on the <html> element without resetting the game.
 *
 * @returns {{
 *   theme: string,
 *   isNight: boolean,
 *   toggleTheme: Function
 * }}
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage(
    STORAGE_KEYS.THEME,
    THEMES.DAY
  );

  const isNight = theme === THEMES.NIGHT;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('night', isNight);
    }
  }, [isNight]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.DAY ? THEMES.NIGHT : THEMES.DAY));
  }, [setTheme]);

  return {
    theme,
    isNight,
    toggleTheme,
  };
}
