/**
 * @file gameEngine.js
 * Pure game logic functions for Garden Clash (Tic-Tac-Toe).
 *
 * Rules:
 * - 100% pure functions (no side effects, no mutation of inputs).
 * - Zero React, UI, DOM, or browser API dependencies.
 * - Framework agnostic: runnable in Node, browser, and test runners.
 */

import { FACTIONS, GAME_STATUS, BOARD_SIZE, WIN_LINES } from '@/constants/game';

/**
 * Creates an empty 3×3 game board.
 * @returns {Array<null>} An array of 9 nulls representing empty cells.
 */
export function createBoard() {
  return Array(BOARD_SIZE).fill(null);
}

/**
 * Switches the active faction to the opposing faction.
 * @param {string} faction - Current faction ('PLANT' | 'ZOMBIE')
 * @returns {string} Opposing faction
 */
export function switchFaction(faction) {
  return faction === FACTIONS.PLANT ? FACTIONS.ZOMBIE : FACTIONS.PLANT;
}

/**
 * Determines whether a given move is valid on the provided board.
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {number} index - Targeted cell index (0-8)
 * @returns {boolean} True if the move is allowed, false otherwise
 */
export function isValidMove(board, index) {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
    return false;
  }
  if (typeof index !== 'number' || !Number.isInteger(index)) {
    return false;
  }
  if (index < 0 || index >= BOARD_SIZE) {
    return false;
  }
  return board[index] === null;
}

/**
 * Applies a move to the board immutably, returning a new board array.
 * @param {Array<string|null>} board - Current 9-cell board
 * @param {number} index - Targeted cell index (0-8)
 * @param {string} faction - Faction making the move ('PLANT' | 'ZOMBIE')
 * @returns {Array<string|null>} New board with move applied
 * @throws {Error} If move is invalid or faction is unsupported
 */
export function applyMove(board, index, faction) {
  if (faction !== FACTIONS.PLANT && faction !== FACTIONS.ZOMBIE) {
    throw new Error(`Invalid faction: ${faction}`);
  }
  if (!isValidMove(board, index)) {
    throw new Error(`Invalid move at index ${index}`);
  }

  const nextBoard = [...board];
  nextBoard[index] = faction;
  return nextBoard;
}

/**
 * Checks if a player has aligned three matching characters.
 * @param {Array<string|null>} board - Current 9-cell board
 * @returns {{ faction: string, line: number[] } | null} Winner details or null if no winner
 */
export function getWinner(board) {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
    return null;
  }

  for (let i = 0; i < WIN_LINES.length; i++) {
    const [a, b, c] = WIN_LINES[i];
    const cellA = board[a];
    if (cellA !== null && cellA === board[b] && cellA === board[c]) {
      return {
        faction: cellA,
        line: [a, b, c],
      };
    }
  }

  return null;
}

/**
 * Checks if the board is in a draw state (all cells filled and no winner).
 * @param {Array<string|null>} board - Current 9-cell board
 * @returns {boolean} True if draw, false otherwise
 */
export function isDraw(board) {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
    return false;
  }
  const hasWinner = getWinner(board) !== null;
  const isFull = board.every((cell) => cell !== null);
  return !hasWinner && isFull;
}

/**
 * Computes the overall game status given the current board state.
 * @param {Array<string|null>} board - Current 9-cell board
 * @returns {string} Status enum value from GAME_STATUS
 */
export function getGameStatus(board) {
  const winner = getWinner(board);
  if (winner) {
    return winner.faction === FACTIONS.PLANT
      ? GAME_STATUS.PLANT_WINS
      : GAME_STATUS.ZOMBIE_WINS;
  }

  if (isDraw(board)) {
    return GAME_STATUS.DRAW;
  }

  const hasMoves = board.some((cell) => cell !== null);
  return hasMoves ? GAME_STATUS.PLAYING : GAME_STATUS.IDLE;
}

/**
 * Returns all cell indices that are currently empty.
 * @param {Array<string|null>} board - Current 9-cell board
 * @returns {number[]} Array of available indices (0-8)
 */
export function getAvailableMoves(board) {
  if (!Array.isArray(board) || board.length !== BOARD_SIZE) {
    return [];
  }
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Reconstructs a board state from a sequence of moves.
 * @param {Array<{ cellIndex: number, faction: string }>} moveHistory - Array of moves
 * @returns {Array<string|null>} Board resulting from applying all moves
 */
export function reconstructBoard(moveHistory) {
  let board = createBoard();
  if (!Array.isArray(moveHistory)) {
    return board;
  }
  for (const move of moveHistory) {
    if (isValidMove(board, move.cellIndex)) {
      board = applyMove(board, move.cellIndex, move.faction);
    }
  }
  return board;
}
