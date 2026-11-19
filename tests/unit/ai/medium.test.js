import { describe, it, expect } from 'vitest';
import { getMediumMove } from '@/lib/game/ai/medium';
import { createBoard } from '@/lib/game/gameEngine';
import { FACTIONS } from '@/constants/game';

describe('Medium AI', () => {
  it('returns null on a full board', () => {
    const fullBoard = Array(9).fill(FACTIONS.PLANT);
    expect(getMediumMove(fullBoard, FACTIONS.ZOMBIE)).toBeNull();
  });

  it('takes an immediate winning move when one exists', () => {
    // Zombie can win by taking cell 2: [Z, Z, null, ...]
    const board = createBoard();
    board[0] = FACTIONS.ZOMBIE;
    board[1] = FACTIONS.ZOMBIE;
    board[3] = FACTIONS.PLANT;
    board[4] = FACTIONS.PLANT;

    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(2);
  });

  it('blocks opponent from immediate win when opponent has 2 in a row', () => {
    // Plant threatens to win on cell 8: [P, null, null, null, P, null, null, null, null]
    const board = createBoard();
    board[0] = FACTIONS.PLANT;
    board[4] = FACTIONS.PLANT;
    board[1] = FACTIONS.ZOMBIE;

    // Zombie must block at cell 8
    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(8);
  });

  it('prioritizes winning over blocking if both opportunities exist', () => {
    // Zombie has winning line on row 0 [0, 1, 2]
    // Plant has winning line on col 0 [0, 3, 6]
    const board = createBoard();
    board[0] = FACTIONS.ZOMBIE;
    board[1] = FACTIONS.ZOMBIE;
    board[3] = FACTIONS.PLANT;
    board[6] = FACTIONS.PLANT;

    // AI as Zombie should complete its win at cell 2 rather than blocking at 6 or whatever
    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(2);
  });

  it('prefers the center cell (4) when no win or block is available', () => {
    const board = createBoard();
    board[0] = FACTIONS.PLANT; // Plant takes corner

    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(4);
  });

  it('prefers available corners when center is occupied', () => {
    const board = createBoard();
    board[4] = FACTIONS.PLANT; // Center is taken

    const corners = [0, 2, 6, 8];
    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(corners).toContain(move);
  });

  it('falls back to remaining edges when center and corners are taken', () => {
    const board = createBoard();
    // Fill center (4) and all corners (0, 2, 6, 8)
    board[4] = FACTIONS.PLANT;
    board[0] = FACTIONS.ZOMBIE;
    board[2] = FACTIONS.PLANT;
    board[6] = FACTIONS.ZOMBIE;
    board[8] = FACTIONS.PLANT;

    const edges = [1, 3, 5, 7];
    const move = getMediumMove(board, FACTIONS.ZOMBIE);
    expect(edges).toContain(move);
  });
});
