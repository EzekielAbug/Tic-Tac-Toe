/**
 * Game constants for Garden Clash.
 *
 * These values are used by the game engine, reducer, AI, and UI.
 * Keep faction identifiers abstract — never tie them to sprite filenames.
 */

/** @enum {string} Faction identifiers */
export const FACTIONS = {
  PLANT: 'PLANT',
  ZOMBIE: 'ZOMBIE',
};

/** @enum {string} Game lifecycle statuses */
export const GAME_STATUS = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  PLANT_WINS: 'PLANT_WINS',
  ZOMBIE_WINS: 'ZOMBIE_WINS',
  DRAW: 'DRAW',
};

/** @enum {string} Game modes */
export const GAME_MODES = {
  PVP: 'PVP',
  PVE: 'PVE',
};

/** @enum {string} AI difficulty levels */
export const AI_DIFFICULTY = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

/** Board size */
export const BOARD_SIZE = 9;

/**
 * All winning lines on a 3×3 board.
 * Each sub-array contains the three cell indices that form a line.
 *
 *   0 | 1 | 2
 *   ---------
 *   3 | 4 | 5
 *   ---------
 *   6 | 7 | 8
 */
export const WIN_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // center column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];
