import { describe, it, expect } from 'vitest';
import {
  createBoard,
  switchFaction,
  isValidMove,
  applyMove,
  getWinner,
  isDraw,
  getGameStatus,
  getAvailableMoves,
  reconstructBoard,
} from '@/lib/game/gameEngine';
import { FACTIONS, GAME_STATUS, WIN_LINES } from '@/constants/game';

describe('Game Engine — Pure Functions', () => {
  describe('createBoard()', () => {
    it('creates an array of exactly 9 null elements', () => {
      const board = createBoard();
      expect(board).toHaveLength(9);
      expect(board.every((cell) => cell === null)).toBe(true);
    });
  });

  describe('switchFaction()', () => {
    it('switches PLANT to ZOMBIE', () => {
      expect(switchFaction(FACTIONS.PLANT)).toBe(FACTIONS.ZOMBIE);
    });

    it('switches ZOMBIE to PLANT', () => {
      expect(switchFaction(FACTIONS.ZOMBIE)).toBe(FACTIONS.PLANT);
    });
  });

  describe('isValidMove()', () => {
    it('allows move to an empty cell within bounds', () => {
      const board = createBoard();
      expect(isValidMove(board, 0)).toBe(true);
      expect(isValidMove(board, 4)).toBe(true);
      expect(isValidMove(board, 8)).toBe(true);
    });

    it('rejects move to an occupied cell', () => {
      const board = createBoard();
      board[4] = FACTIONS.PLANT;
      expect(isValidMove(board, 4)).toBe(false);
    });

    it('rejects moves outside 0-8 range', () => {
      const board = createBoard();
      expect(isValidMove(board, -1)).toBe(false);
      expect(isValidMove(board, 9)).toBe(false);
      expect(isValidMove(board, 100)).toBe(false);
    });

    it('rejects non-integer and non-number indices', () => {
      const board = createBoard();
      expect(isValidMove(board, 2.5)).toBe(false);
      expect(isValidMove(board, '4')).toBe(false);
      expect(isValidMove(board, null)).toBe(false);
      expect(isValidMove(board, undefined)).toBe(false);
    });

    it('rejects invalid board structures', () => {
      expect(isValidMove(null, 0)).toBe(false);
      expect(isValidMove([], 0)).toBe(false);
      expect(isValidMove([null, null], 0)).toBe(false);
    });
  });

  describe('applyMove()', () => {
    it('applies a move immutably without altering the original board', () => {
      const original = createBoard();
      const updated = applyMove(original, 4, FACTIONS.PLANT);

      expect(updated[4]).toBe(FACTIONS.PLANT);
      expect(original[4]).toBeNull();
      expect(original).not.toBe(updated);
    });

    it('throws when moving to an occupied cell', () => {
      const board = applyMove(createBoard(), 2, FACTIONS.PLANT);
      expect(() => applyMove(board, 2, FACTIONS.ZOMBIE)).toThrow(/Invalid move/);
    });

    it('throws when using an unsupported faction', () => {
      const board = createBoard();
      expect(() => applyMove(board, 0, 'ALIEN')).toThrow(/Invalid faction/);
    });
  });

  describe('getWinner()', () => {
    it('detects all 8 winning lines for PLANT', () => {
      WIN_LINES.forEach((line) => {
        const board = createBoard();
        line.forEach((idx) => {
          board[idx] = FACTIONS.PLANT;
        });

        const winner = getWinner(board);
        expect(winner).not.toBeNull();
        expect(winner.faction).toBe(FACTIONS.PLANT);
        expect(winner.line).toEqual(line);
      });
    });

    it('detects winning line for ZOMBIE', () => {
      const board = createBoard();
      board[0] = FACTIONS.ZOMBIE;
      board[4] = FACTIONS.ZOMBIE;
      board[8] = FACTIONS.ZOMBIE;

      const winner = getWinner(board);
      expect(winner).toEqual({
        faction: FACTIONS.ZOMBIE,
        line: [0, 4, 8],
      });
    });

    it('returns null on board with no three-in-a-row', () => {
      const board = [
        FACTIONS.PLANT, FACTIONS.ZOMBIE, FACTIONS.PLANT,
        FACTIONS.PLANT, FACTIONS.ZOMBIE, FACTIONS.ZOMBIE,
        FACTIONS.ZOMBIE, FACTIONS.PLANT, null,
      ];
      expect(getWinner(board)).toBeNull();
    });

    it('returns null on empty board', () => {
      expect(getWinner(createBoard())).toBeNull();
    });
  });

  describe('isDraw()', () => {
    it('returns false on an empty or partially filled board', () => {
      expect(isDraw(createBoard())).toBe(false);
      const partial = createBoard();
      partial[0] = FACTIONS.PLANT;
      expect(isDraw(partial)).toBe(false);
    });

    it('returns false when a full board has a winner', () => {
      // Full board where PLANT wins top row
      const board = [
        FACTIONS.PLANT, FACTIONS.PLANT, FACTIONS.PLANT,
        FACTIONS.ZOMBIE, FACTIONS.ZOMBIE, FACTIONS.PLANT,
        FACTIONS.PLANT, FACTIONS.ZOMBIE, FACTIONS.ZOMBIE,
      ];
      expect(isDraw(board)).toBe(false);
    });

    it('returns true on a full board with no winner', () => {
      // Classic cat's game (draw)
      const board = [
        FACTIONS.PLANT,  FACTIONS.ZOMBIE, FACTIONS.PLANT,
        FACTIONS.PLANT,  FACTIONS.ZOMBIE, FACTIONS.ZOMBIE,
        FACTIONS.ZOMBIE, FACTIONS.PLANT,  FACTIONS.PLANT,
      ];
      expect(isDraw(board)).toBe(true);
    });
  });

  describe('getGameStatus()', () => {
    it('returns IDLE when board is pristine empty', () => {
      expect(getGameStatus(createBoard())).toBe(GAME_STATUS.IDLE);
    });

    it('returns PLAYING when match is in progress with no winner', () => {
      const board = createBoard();
      board[0] = FACTIONS.PLANT;
      expect(getGameStatus(board)).toBe(GAME_STATUS.PLAYING);
    });

    it('returns PLANT_WINS when Plant aligns 3', () => {
      const board = createBoard();
      board[3] = FACTIONS.PLANT;
      board[4] = FACTIONS.PLANT;
      board[5] = FACTIONS.PLANT;
      expect(getGameStatus(board)).toBe(GAME_STATUS.PLANT_WINS);
    });

    it('returns ZOMBIE_WINS when Zombie aligns 3', () => {
      const board = createBoard();
      board[2] = FACTIONS.ZOMBIE;
      board[4] = FACTIONS.ZOMBIE;
      board[6] = FACTIONS.ZOMBIE;
      expect(getGameStatus(board)).toBe(GAME_STATUS.ZOMBIE_WINS);
    });

    it('returns DRAW on a tie', () => {
      const board = [
        FACTIONS.PLANT,  FACTIONS.ZOMBIE, FACTIONS.PLANT,
        FACTIONS.PLANT,  FACTIONS.ZOMBIE, FACTIONS.ZOMBIE,
        FACTIONS.ZOMBIE, FACTIONS.PLANT,  FACTIONS.PLANT,
      ];
      expect(getGameStatus(board)).toBe(GAME_STATUS.DRAW);
    });
  });

  describe('getAvailableMoves()', () => {
    it('returns all 9 indices for an empty board', () => {
      expect(getAvailableMoves(createBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('returns remaining empty cell indices', () => {
      const board = createBoard();
      board[0] = FACTIONS.PLANT;
      board[4] = FACTIONS.ZOMBIE;
      board[8] = FACTIONS.PLANT;
      expect(getAvailableMoves(board)).toEqual([1, 2, 3, 5, 6, 7]);
    });

    it('returns empty array when board is full', () => {
      const board = Array(9).fill(FACTIONS.PLANT);
      expect(getAvailableMoves(board)).toEqual([]);
    });
  });

  describe('reconstructBoard()', () => {
    it('reconstructs board correctly from move history', () => {
      const history = [
        { cellIndex: 0, faction: FACTIONS.PLANT },
        { cellIndex: 4, faction: FACTIONS.ZOMBIE },
        { cellIndex: 2, faction: FACTIONS.PLANT },
      ];
      const board = reconstructBoard(history);
      expect(board[0]).toBe(FACTIONS.PLANT);
      expect(board[4]).toBe(FACTIONS.ZOMBIE);
      expect(board[2]).toBe(FACTIONS.PLANT);
      expect(board[1]).toBeNull();
    });

    it('returns clean board for empty history', () => {
      expect(reconstructBoard([])).toEqual(createBoard());
    });
  });
});
