import { useSyncExternalStore, useCallback } from 'react';
import { safeGetStorage, safeSetStorage } from '@/lib/storage/localStorage';

// Memory cache so getSnapshot returns a stable reference unless storage changed
const memoryCache = new Map();

/**
 * Custom hook for reading and writing to LocalStorage safely.
 * Uses React's official `useSyncExternalStore` for flicker-free, SSR-safe hydration.
 *
 * @param {string} key - Storage key
 * @param {*} initialValue - Fallback value
 * @returns {[*, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const subscribe = useCallback((callback) => {
    if (typeof window === 'undefined') {
      return () => {};
    }
    window.addEventListener('storage', callback);
    window.addEventListener('local-storage-update', callback);
    return () => {
      window.removeEventListener('storage', callback);
      window.removeEventListener('local-storage-update', callback);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const raw = window.localStorage.getItem(key);
    const cached = memoryCache.get(key);

    if (cached && cached.raw === raw) {
      return cached.parsed;
    }

    const parsed = safeGetStorage(key, initialValue);
    memoryCache.set(key, { raw, parsed });
    return parsed;
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => {
    return initialValue;
  }, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (updater) => {
      if (typeof window === 'undefined') return;

      const current = safeGetStorage(key, initialValue);
      const next = typeof updater === 'function' ? updater(current) : updater;

      safeSetStorage(key, next);
      memoryCache.delete(key);
      window.dispatchEvent(new Event('local-storage-update'));
    },
    [key, initialValue]
  );

  return [value, setValue];
}
