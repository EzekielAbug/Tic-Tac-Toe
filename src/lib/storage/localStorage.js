/**
 * @file localStorage.js
 * Safe LocalStorage abstraction with SSR guard, schema versioning, and JSON recovery.
 */

const STORAGE_PREFIX = 'garden_clash';
const CURRENT_VERSION = 1;

/** Storage keys used across the game */
export const STORAGE_KEYS = {
  SCORES: `${STORAGE_PREFIX}_scores_v${CURRENT_VERSION}`,
  HISTORY: `${STORAGE_PREFIX}_history_v${CURRENT_VERSION}`,
  THEME: `${STORAGE_PREFIX}_theme_v${CURRENT_VERSION}`,
  SOUND: `${STORAGE_PREFIX}_sound_v${CURRENT_VERSION}`,
  VERSION: `${STORAGE_PREFIX}_schema_version`,
};

/** Default scoreboard values */
export const DEFAULT_SCORES = {
  plantWins: 0,
  zombieWins: 0,
  draws: 0,
};

/**
 * Safely reads a value from LocalStorage.
 * @param {string} key - Storage key
 * @param {*} defaultValue - Fallback value if missing, corrupt, or during SSR
 * @returns {*} Stored value or default
 */
export function safeGetStorage(key, defaultValue) {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[GardenClash Storage] Failed to read key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Safely writes a value to LocalStorage.
 * @param {string} key - Storage key
 * @param {*} value - Value to persist
 */
export function safeSetStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[GardenClash Storage] Failed to write key "${key}":`, err);
  }
}

/**
 * Safely removes a key from LocalStorage.
 * @param {string} key - Storage key to remove
 */
export function safeRemoveStorage(key) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[GardenClash Storage] Failed to remove key "${key}":`, err);
  }
}
