import { describe, it, expect } from 'vitest';
import { getEasyMove } from '@/lib/game/ai/easy';
import { createBoard } from '@/lib/game/gameEngine';
import { FACTIONS } from '@/constants/game';

describe('Easy AI', () => {
  it('returns null on a full board', () => {
    const fullBoard = Array(9).fill(FACTIONS.PLANT);
    expect(getEasyMove(fullBoard)).toBeNull();
  });

  it('always returns a valid available position', () => {
    const board = createBoard();
    board[0] = FACTIONS.PLANT;
    board[4] = FACTIONS.ZOMBIE;

    for (let i = 0; i < 50; i++) {
      const move = getEasyMove(board);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThanOrEqual(8);
      expect(board[move]).toBeNull();
    }
  });

  it('selects the only available position when 8 cells are occupied', () => {
    const board = Array(9).fill(FACTIONS.PLANT);
    board[7] = null; // Only index 7 is free

    const move = getEasyMove(board);
    expect(move).toBe(7);
  });

  it('respects injected randomFn for deterministic testing', () => {
    const board = createBoard();
    // With 9 available cells, randomFn returning 0 should pick index 0
    expect(getEasyMove(board, () => 0)).toBe(0);
    // randomFn returning 0.999 should pick index 8
    expect(getEasyMove(board, () => 0.999)).toBe(8);
  });
});
