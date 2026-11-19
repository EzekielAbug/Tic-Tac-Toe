/**
 * @file medium.js
 * Medium AI Strategy for Garden Clash.
 *
 * Tactical heuristics priority:
 * 1. Win immediately if a winning move exists.
 * 2. Block the opponent's immediate winning move.
 * 3. Prefer the center (cell 4).
 * 4. Prefer available corners (0, 2, 6, 8).
 * 5. Otherwise, select any remaining available position (edges 1, 3, 5, 7).
 */

import {
  getAvailableMoves,
  switchFaction,
  applyMove,
  getWinner,
} from '../gameEngine';

const CORNERS = [0, 2, 6, 8];
const CENTER = 4;

/**
 * Finds an immediate winning move for the specified faction, if one exists.
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {string} faction - Faction to check for winning move
 * @param {number[]} availableMoves - List of open cell indices
 * @returns {number|null} Winning cell index or null
 */
function findWinningMove(board, faction, availableMoves) {
  for (const move of availableMoves) {
    const candidateBoard = applyMove(board, move, faction);
    const winner = getWinner(candidateBoard);
    if (winner && winner.faction === faction) {
      return move;
    }
  }
  return null;
}

/**
 * Computes a tactically sound move based on heuristic rules.
 *
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {string} aiFaction - Faction the AI is playing ('PLANT' | 'ZOMBIE')
 * @param {Function} [randomFn=Math.random] - RNG function for choosing among equal options
 * @returns {number|null} Chosen cell index (0-8) or null if board is full
 */
export function getMediumMove(board, aiFaction, randomFn = Math.random) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return null;
  }

  const opponentFaction = switchFaction(aiFaction);

  // 1. Take immediate win
  const winningMove = findWinningMove(board, aiFaction, availableMoves);
  if (winningMove !== null) {
    return winningMove;
  }

  // 2. Block opponent's immediate win
  const blockingMove = findWinningMove(board, opponentFaction, availableMoves);
  if (blockingMove !== null) {
    return blockingMove;
  }

  // 3. Prefer center
  if (board[CENTER] === null) {
    return CENTER;
  }

  // 4. Prefer available corners
  const availableCorners = CORNERS.filter((idx) => board[idx] === null);
  if (availableCorners.length > 0) {
    const cornerIndex = Math.floor(randomFn() * availableCorners.length);
    return availableCorners[cornerIndex];
  }

  // 5. Otherwise, pick any available position (edges)
  const remainingIndex = Math.floor(randomFn() * availableMoves.length);
  return availableMoves[remainingIndex];
}
