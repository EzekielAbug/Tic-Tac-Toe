/**
 * @file gameReducer.js
 * Pure state reducer and action definitions for Garden Clash.
 *
 * Principles:
 * - Deterministic, pure function: (state, action) => newState
 * - Zero side effects: no audio, no localStorage, no AI calls, no browser APIs
 * - Handles both PvP and PvE undo semantics cleanly
 */

import { FACTIONS, GAME_STATUS, GAME_MODES, AI_DIFFICULTY } from '@/constants/game';
import {
  createBoard,
  isValidMove,
  applyMove,
  getWinner,
  isDraw,
  getGameStatus,
  switchFaction,
  reconstructBoard,
} from './gameEngine';

/** @enum {string} Action types for gameReducer */
export const GAME_ACTIONS = {
  NEW_GAME: 'NEW_GAME',
  MAKE_MOVE: 'MAKE_MOVE',
  UNDO_MOVE: 'UNDO_MOVE',
  RECORD_MATCH: 'RECORD_MATCH',
  SET_GAME_MODE: 'SET_GAME_MODE',
  SET_AI_DIFFICULTY: 'SET_AI_DIFFICULTY',
  SET_HUMAN_FACTION: 'SET_HUMAN_FACTION',
};

/**
 * Creates the initial game state.
 * @param {Object} [overrides={}] - Optional overrides for initial state
 * @returns {Object} Complete game state
 */
export function createInitialState(overrides = {}) {
  return {
    board: createBoard(),
    currentFaction: FACTIONS.PLANT,
    gameStatus: GAME_STATUS.IDLE,
    gameMode: GAME_MODES.PVP,
    aiDifficulty: AI_DIFFICULTY.EASY,
    humanFaction: FACTIONS.PLANT,
    moveHistory: [],
    matchId: overrides.matchId || 'match_initial',
    matchRecorded: false,
    winningLine: null,
    ...overrides,
  };
}

/**
 * Pure reducer managing the game state.
 * @param {Object} state - Current game state
 * @param {Object} action - Action with type and optional payload
 * @returns {Object} New game state
 */
export function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.NEW_GAME: {
      const mode = action.payload?.gameMode ?? state.gameMode;
      const difficulty = action.payload?.aiDifficulty ?? state.aiDifficulty;
      const human = action.payload?.humanFaction ?? state.humanFaction;
      const matchId = action.payload?.matchId ?? `match_${state.moveHistory.length + 1}`;

      return {
        ...state,
        board: createBoard(),
        currentFaction: FACTIONS.PLANT,
        gameStatus: GAME_STATUS.IDLE,
        gameMode: mode,
        aiDifficulty: difficulty,
        humanFaction: human,
        moveHistory: [],
        matchId,
        matchRecorded: false,
        winningLine: null,
      };
    }

    case GAME_ACTIONS.MAKE_MOVE: {
      const { cellIndex } = action.payload;

      // Disallow moves if game is already completed
      const isGameOver =
        state.gameStatus === GAME_STATUS.PLANT_WINS ||
        state.gameStatus === GAME_STATUS.ZOMBIE_WINS ||
        state.gameStatus === GAME_STATUS.DRAW;

      if (isGameOver) {
        return state;
      }

      // Disallow invalid moves (cell out of bounds or occupied)
      if (!isValidMove(state.board, cellIndex)) {
        return state;
      }

      // Apply move immutably
      const nextBoard = applyMove(state.board, cellIndex, state.currentFaction);
      const nextMoveHistory = [
        ...state.moveHistory,
        { cellIndex, faction: state.currentFaction },
      ];

      // Check terminal conditions
      const winner = getWinner(nextBoard);
      const isTie = !winner && isDraw(nextBoard);

      let nextStatus = GAME_STATUS.PLAYING;
      let winningLine = null;

      if (winner) {
        nextStatus =
          winner.faction === FACTIONS.PLANT
            ? GAME_STATUS.PLANT_WINS
            : GAME_STATUS.ZOMBIE_WINS;
        winningLine = winner.line;
      } else if (isTie) {
        nextStatus = GAME_STATUS.DRAW;
      }

      return {
        ...state,
        board: nextBoard,
        currentFaction: switchFaction(state.currentFaction),
        gameStatus: nextStatus,
        moveHistory: nextMoveHistory,
        winningLine,
      };
    }

    case GAME_ACTIONS.UNDO_MOVE: {
      if (state.moveHistory.length === 0) {
        return state;
      }

      // Calculate how many moves to undo:
      // In PvP: always 1 move
      // In PvE:
      //   - If the game is in progress and it's human's turn: the computer already responded,
      //     so undo 2 moves (computer's response + human's move) unless only 1 move was made.
      //   - If the human moved and AI has not responded yet: undo 1 move.
      //   - If game is completed: undo until before human's last action (typically 2 if AI won/draw on its turn, 1 if human won).
      let movesToUndo = 1;

      if (state.gameMode === GAME_MODES.PVE) {
        const lastMove = state.moveHistory[state.moveHistory.length - 1];
        const lastMoveWasAI = lastMove.faction !== state.humanFaction;

        if (lastMoveWasAI && state.moveHistory.length >= 2) {
          movesToUndo = 2;
        } else {
          movesToUndo = 1;
        }
      }

      const nextMoveHistory = state.moveHistory.slice(0, state.moveHistory.length - movesToUndo);
      const reconstructedBoard = reconstructBoard(nextMoveHistory);
      const nextStatus = getGameStatus(reconstructedBoard);
      const winner = getWinner(reconstructedBoard);

      // Determine next current faction:
      // Alternates based on move history count (even = PLANT, odd = ZOMBIE)
      const nextFaction =
        nextMoveHistory.length % 2 === 0 ? FACTIONS.PLANT : FACTIONS.ZOMBIE;

      return {
        ...state,
        board: reconstructedBoard,
        currentFaction: nextFaction,
        gameStatus: nextStatus,
        moveHistory: nextMoveHistory,
        matchRecorded: false, // Reopen match recording if reopened
        winningLine: winner ? winner.line : null,
      };
    }

    case GAME_ACTIONS.RECORD_MATCH: {
      return {
        ...state,
        matchRecorded: true,
      };
    }

    case GAME_ACTIONS.SET_GAME_MODE: {
      return {
        ...state,
        gameMode: action.payload.gameMode,
      };
    }

    case GAME_ACTIONS.SET_AI_DIFFICULTY: {
      return {
        ...state,
        aiDifficulty: action.payload.aiDifficulty,
      };
    }

    case GAME_ACTIONS.SET_HUMAN_FACTION: {
      return {
        ...state,
        humanFaction: action.payload.humanFaction,
      };
    }

    default:
      return state;
  }
}
