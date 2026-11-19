/**
 * @file index.js
 * AI Dispatcher module for Garden Clash.
 *
 * Routes move selection requests to the appropriate AI engine based on difficulty.
 */

import { AI_DIFFICULTY } from '@/constants/game';
import { getEasyMove } from './easy';
import { getMediumMove } from './medium';
import { getHardMove } from './hard';

export { getEasyMove } from './easy';
export { getMediumMove } from './medium';
export { getHardMove } from './hard';

/**
 * Computes an AI move for the specified difficulty level.
 *
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {string} difficulty - 'EASY' | 'MEDIUM' | 'HARD'
 * @param {string} aiFaction - 'PLANT' | 'ZOMBIE'
 * @param {Function} [randomFn=Math.random] - Optional injected RNG
 * @returns {number|null} Chosen cell index or null
 */
export function getAiMove(board, difficulty, aiFaction, randomFn = Math.random) {
  switch (difficulty) {
    case AI_DIFFICULTY.EASY:
      return getEasyMove(board, randomFn);
    case AI_DIFFICULTY.MEDIUM:
      return getMediumMove(board, aiFaction, randomFn);
    case AI_DIFFICULTY.HARD:
      return getHardMove(board, aiFaction);
    default:
      return getEasyMove(board, randomFn);
  }
}
