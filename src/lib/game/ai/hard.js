/**
 * @file hard.js
 * Hard AI Strategy for Garden Clash (Unbeatable Minimax Algorithm).
 *
 * Requirements:
 * - Plays mathematically optimal Tic-Tac-Toe.
 * - Never loses against any opponent (guaranteed win or draw).
 * - Depth-penalized evaluation: prefers faster wins and delays losses.
 * - 100% pure function, no mutation.
 */

import {
  getAvailableMoves,
  switchFaction,
  applyMove,
  getWinner,
  isDraw,
} from '../gameEngine';

const WIN_SCORE = 10;
const DRAW_SCORE = 0;

/**
 * Minimax recursive evaluation function.
 *
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {number} depth - Recursion depth
 * @param {boolean} isMaximizing - True if evaluating for AI, false for opponent
 * @param {string} aiFaction - AI faction
 * @param {string} opponentFaction - Opponent faction
 * @returns {number} Score of the state
 */
function minimax(board, depth, isMaximizing, aiFaction, opponentFaction) {
  const winner = getWinner(board);
  if (winner) {
    return winner.faction === aiFaction
      ? WIN_SCORE - depth
      : depth - WIN_SCORE;
  }

  if (isDraw(board)) {
    return DRAW_SCORE;
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return DRAW_SCORE;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      const nextBoard = applyMove(board, move, aiFaction);
      const score = minimax(nextBoard, depth + 1, false, aiFaction, opponentFaction);
      maxEval = Math.max(maxEval, score);
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      const nextBoard = applyMove(board, move, opponentFaction);
      const score = minimax(nextBoard, depth + 1, true, aiFaction, opponentFaction);
      minEval = Math.min(minEval, score);
    }
    return minEval;
  }
}

/**
 * Computes the optimal move using the Minimax algorithm.
 *
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {string} aiFaction - AI faction ('PLANT' | 'ZOMBIE')
 * @returns {number|null} Best cell index or null if board is full
 */
export function getHardMove(board, aiFaction) {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return null;
  }

  // Opening optimization: center cell is universally optimal when starting or responding
  if (availableMoves.length === 9) {
    return 4; // Take center on empty board
  }

  const opponentFaction = switchFaction(aiFaction);
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    const nextBoard = applyMove(board, move, aiFaction);
    const score = minimax(nextBoard, 0, false, aiFaction, opponentFaction);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
