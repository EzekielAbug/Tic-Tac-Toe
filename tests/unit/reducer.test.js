import { describe, it, expect } from 'vitest';
import {
  gameReducer,
  createInitialState,
  GAME_ACTIONS,
} from '@/lib/game/gameReducer';
import { FACTIONS, GAME_STATUS, GAME_MODES, AI_DIFFICULTY } from '@/constants/game';

describe('Game Reducer — State Management', () => {
  describe('createInitialState()', () => {
    it('creates pristine default initial state', () => {
      const state = createInitialState();
      expect(state.board).toHaveLength(9);
      expect(state.board.every((c) => c === null)).toBe(true);
      expect(state.currentFaction).toBe(FACTIONS.PLANT);
      expect(state.gameStatus).toBe(GAME_STATUS.IDLE);
      expect(state.gameMode).toBe(GAME_MODES.PVP);
      expect(state.aiDifficulty).toBe(AI_DIFFICULTY.EASY);
      expect(state.humanFaction).toBe(FACTIONS.PLANT);
      expect(state.moveHistory).toEqual([]);
      expect(state.matchRecorded).toBe(false);
      expect(state.winningLine).toBeNull();
    });

    it('respects configuration overrides', () => {
      const state = createInitialState({
        gameMode: GAME_MODES.PVE,
        aiDifficulty: AI_DIFFICULTY.HARD,
        humanFaction: FACTIONS.ZOMBIE,
      });
      expect(state.gameMode).toBe(GAME_MODES.PVE);
      expect(state.aiDifficulty).toBe(AI_DIFFICULTY.HARD);
      expect(state.humanFaction).toBe(FACTIONS.ZOMBIE);
    });
  });

  describe('MAKE_MOVE', () => {
    it('applies a move and switches turns', () => {
      const state = createInitialState();
      const nextState = gameReducer(state, {
        type: GAME_ACTIONS.MAKE_MOVE,
        payload: { cellIndex: 4 },
      });

      expect(nextState.board[4]).toBe(FACTIONS.PLANT);
      expect(nextState.currentFaction).toBe(FACTIONS.ZOMBIE);
      expect(nextState.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(nextState.moveHistory).toEqual([
        { cellIndex: 4, faction: FACTIONS.PLANT },
      ]);
    });

    it('ignores move on an occupied cell', () => {
      const state = createInitialState();
      const state1 = gameReducer(state, {
        type: GAME_ACTIONS.MAKE_MOVE,
        payload: { cellIndex: 4 },
      });
      const state2 = gameReducer(state1, {
        type: GAME_ACTIONS.MAKE_MOVE,
        payload: { cellIndex: 4 }, // Same cell!
      });

      expect(state2).toBe(state1); // Exact same reference
    });

    it('detects PLANT victory and stores winning line', () => {
      let state = createInitialState();
      // Plants: 0, 1, 2. Zombies: 3, 4
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } }); // P
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 3 } }); // Z
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 1 } }); // P
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } }); // Z
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 2 } }); // P wins!

      expect(state.gameStatus).toBe(GAME_STATUS.PLANT_WINS);
      expect(state.winningLine).toEqual([0, 1, 2]);
    });

    it('detects ZOMBIE victory and stores winning line', () => {
      let state = createInitialState();
      // Plants: 0, 1, 5. Zombies: 3, 4, 5...
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } }); // P
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 3 } }); // Z
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 1 } }); // P
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } }); // Z
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 8 } }); // P
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 5 } }); // Z wins [3, 4, 5]

      expect(state.gameStatus).toBe(GAME_STATUS.ZOMBIE_WINS);
      expect(state.winningLine).toEqual([3, 4, 5]);
    });

    it('detects DRAW when board fills with no winner', () => {
      let state = createInitialState();
      // Plant: 0, 2, 3, 7, 8
      // Zombie: 1, 4, 5, 6
      const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
      moves.forEach((cellIndex) => {
        state = gameReducer(state, {
          type: GAME_ACTIONS.MAKE_MOVE,
          payload: { cellIndex },
        });
      });

      expect(state.gameStatus).toBe(GAME_STATUS.DRAW);
      expect(state.winningLine).toBeNull();
    });

    it('rejects further moves when game has already completed', () => {
      let state = createInitialState();
      // Quick plant win
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 3 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 1 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 2 } });
      expect(state.gameStatus).toBe(GAME_STATUS.PLANT_WINS);

      // Attempt move after game is won
      const postWinState = gameReducer(state, {
        type: GAME_ACTIONS.MAKE_MOVE,
        payload: { cellIndex: 8 },
      });
      expect(postWinState.board[8]).toBeNull();
      expect(postWinState).toBe(state);
    });
  });

  describe('UNDO_MOVE', () => {
    it('does nothing when move history is empty', () => {
      const state = createInitialState();
      const nextState = gameReducer(state, { type: GAME_ACTIONS.UNDO_MOVE });
      expect(nextState).toBe(state);
    });

    it('undoes 1 move in PvP mode and restores previous turn and state', () => {
      let state = createInitialState({ gameMode: GAME_MODES.PVP });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });

      expect(state.board[4]).toBe(FACTIONS.PLANT);
      expect(state.board[0]).toBe(FACTIONS.ZOMBIE);
      expect(state.currentFaction).toBe(FACTIONS.PLANT);

      // Undo Zombie move
      state = gameReducer(state, { type: GAME_ACTIONS.UNDO_MOVE });

      expect(state.board[0]).toBeNull();
      expect(state.board[4]).toBe(FACTIONS.PLANT);
      expect(state.currentFaction).toBe(FACTIONS.ZOMBIE);
      expect(state.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(state.moveHistory).toHaveLength(1);
    });

    it('undoes both AI response and human move in PvE mode', () => {
      let state = createInitialState({
        gameMode: GAME_MODES.PVE,
        humanFaction: FACTIONS.PLANT,
      });

      // Human moves
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });
      // AI moves
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } });

      expect(state.moveHistory).toHaveLength(2);
      expect(state.currentFaction).toBe(FACTIONS.PLANT);

      // In PvE, pressing Undo resets back to before human move (2 moves undone)
      state = gameReducer(state, { type: GAME_ACTIONS.UNDO_MOVE });

      expect(state.board[0]).toBeNull();
      expect(state.board[4]).toBeNull();
      expect(state.moveHistory).toHaveLength(0);
      expect(state.currentFaction).toBe(FACTIONS.PLANT);
      expect(state.gameStatus).toBe(GAME_STATUS.IDLE);
    });

    it('undoes only 1 move in PvE if human moved but AI has not responded yet', () => {
      let state = createInitialState({
        gameMode: GAME_MODES.PVE,
        humanFaction: FACTIONS.PLANT,
      });

      // Human moves
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });
      expect(state.moveHistory).toHaveLength(1);

      // Undo before AI plays
      state = gameReducer(state, { type: GAME_ACTIONS.UNDO_MOVE });

      expect(state.board[0]).toBeNull();
      expect(state.moveHistory).toHaveLength(0);
      expect(state.currentFaction).toBe(FACTIONS.PLANT);
      expect(state.gameStatus).toBe(GAME_STATUS.IDLE);
    });

    it('reopens match recording if undoing from a finished game', () => {
      let state = createInitialState();
      // Plant wins
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 3 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 1 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 2 } });
      state = gameReducer(state, { type: GAME_ACTIONS.RECORD_MATCH });

      expect(state.gameStatus).toBe(GAME_STATUS.PLANT_WINS);
      expect(state.matchRecorded).toBe(true);

      state = gameReducer(state, { type: GAME_ACTIONS.UNDO_MOVE });

      expect(state.gameStatus).toBe(GAME_STATUS.PLAYING);
      expect(state.matchRecorded).toBe(false);
      expect(state.winningLine).toBeNull();
    });
  });

  describe('NEW_GAME', () => {
    it('resets match state while preserving settings', () => {
      let state = createInitialState({
        gameMode: GAME_MODES.PVE,
        aiDifficulty: AI_DIFFICULTY.HARD,
        humanFaction: FACTIONS.ZOMBIE,
      });

      // Make some moves
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 0 } });
      state = gameReducer(state, { type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex: 4 } });

      // Start new game
      const resetState = gameReducer(state, { type: GAME_ACTIONS.NEW_GAME });

      expect(resetState.board.every((c) => c === null)).toBe(true);
      expect(resetState.moveHistory).toEqual([]);
      expect(resetState.gameStatus).toBe(GAME_STATUS.IDLE);
      expect(resetState.currentFaction).toBe(FACTIONS.PLANT);
      expect(resetState.gameMode).toBe(GAME_MODES.PVE);
      expect(resetState.aiDifficulty).toBe(AI_DIFFICULTY.HARD);
      expect(resetState.humanFaction).toBe(FACTIONS.ZOMBIE);
    });
  });

  describe('Configuration actions', () => {
    it('SET_GAME_MODE updates game mode', () => {
      const state = createInitialState();
      const updated = gameReducer(state, {
        type: GAME_ACTIONS.SET_GAME_MODE,
        payload: { gameMode: GAME_MODES.PVE },
      });
      expect(updated.gameMode).toBe(GAME_MODES.PVE);
    });

    it('SET_AI_DIFFICULTY updates AI difficulty', () => {
      const state = createInitialState();
      const updated = gameReducer(state, {
        type: GAME_ACTIONS.SET_AI_DIFFICULTY,
        payload: { aiDifficulty: AI_DIFFICULTY.HARD },
      });
      expect(updated.aiDifficulty).toBe(AI_DIFFICULTY.HARD);
    });

    it('SET_HUMAN_FACTION updates human faction', () => {
      const state = createInitialState();
      const updated = gameReducer(state, {
        type: GAME_ACTIONS.SET_HUMAN_FACTION,
        payload: { humanFaction: FACTIONS.ZOMBIE },
      });
      expect(updated.humanFaction).toBe(FACTIONS.ZOMBIE);
    });
  });
});
