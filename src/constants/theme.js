/**
 * Theme constants and design tokens for Garden Clash.
 *
 * Color palettes are inspired by classic pixel-art garden games.
 * All values are CSS-compatible color strings.
 */

/** @enum {string} Theme identifiers */
export const THEMES = {
  DAY: 'day',
  NIGHT: 'night',
};

/**
 * Design tokens for the daytime theme.
 * Warm, cheerful garden colors.
 */
export const DAY_PALETTE = {
  // Sky
  skyTop: '#87CEEB',
  skyBottom: '#B0E0FF',

  // Grass
  grassLight: '#7EC850',
  grassDark: '#5DA038',
  grassAccent: '#4A8A2C',

  // Grid / board
  gridBorder: '#5D4037',
  gridBorderLight: '#795548',
  cellBg: '#8FD060',
  cellHover: '#A0E070',

  // UI
  textPrimary: '#2D1B0E',
  textSecondary: '#5D4037',
  panelBg: '#FFF8E7',
  panelBorder: '#D4A574',

  // Factions
  plantAccent: '#4CAF50',
  zombieAccent: '#9C27B0',

  // Sun
  sunColor: '#FFD93D',
  sunGlow: '#FFF176',
};

/**
 * Design tokens for the nighttime theme.
 * Dark, atmospheric garden under moonlight.
 */
export const NIGHT_PALETTE = {
  // Sky
  skyTop: '#0D1B2A',
  skyBottom: '#1B2838',

  // Grass
  grassLight: '#2D5A27',
  grassDark: '#1E3D1A',
  grassAccent: '#163014',

  // Grid / board
  gridBorder: '#3E2723',
  gridBorderLight: '#4E342E',
  cellBg: '#2D6A30',
  cellHover: '#3D7A40',

  // UI
  textPrimary: '#E8D5B7',
  textSecondary: '#B8A08A',
  panelBg: '#1A1A2E',
  panelBorder: '#3A3A5E',

  // Factions
  plantAccent: '#66BB6A',
  zombieAccent: '#CE93D8',

  // Moon and stars
  moonColor: '#E8E8D0',
  moonGlow: '#D4D4B8',
  starColor: '#FFE082',
};

/**
 * Shared design tokens (theme-independent).
 */
export const DESIGN_TOKENS = {
  // Pixel-art border width
  borderWidth: '4px',
  borderWidthLg: '6px',

  // Border radius (chunky pixel-art style)
  borderRadius: '2px',

  // Shadows (subtle pixel-art shadows)
  shadowSm: '2px 2px 0px',
  shadowMd: '4px 4px 0px',

  // Font family (retro pixel style — set via CSS)
  fontFamily: "'Press Start 2P', 'Courier New', monospace",

  // Transition duration
  transitionFast: '150ms',
  transitionNormal: '300ms',

  // Grid dimensions
  cellSize: '100px',
  cellSizeMobile: '80px',
  gridGap: '6px',
};
