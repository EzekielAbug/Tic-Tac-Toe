/**
 * @file easy.js
 * Easy AI Strategy for Garden Clash.
 *
 * Rules:
 * - Selects a random available cell.
 * - Never selects an occupied cell.
 * - Follows all game rules.
 */

import { getAvailableMoves } from '../gameEngine';

/**
 * Selects an available move at random.
 *
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {Function} [randomFn=Math.random] - RNG function (injectable for deterministic tests)
 * @returns {number|null} Chosen cell index (0-8) or null if no available moves
 */
export function getEasyMove(board, randomFn = Math.random) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(randomFn() * availableMoves.length);
  return availableMoves[randomIndex];
}
