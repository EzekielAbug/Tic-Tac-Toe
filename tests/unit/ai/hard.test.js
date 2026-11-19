import { describe, it, expect } from 'vitest';
import { getHardMove } from '@/lib/game/ai/hard';
import { getEasyMove } from '@/lib/game/ai/easy';
import {
  createBoard,
  applyMove,
  getWinner,
  isDraw,
  switchFaction,
} from '@/lib/game/gameEngine';
import { FACTIONS } from '@/constants/game';

describe('Hard AI (Minimax)', () => {
  it('returns null on a full board', () => {
    const fullBoard = Array(9).fill(FACTIONS.PLANT);
    expect(getHardMove(fullBoard, FACTIONS.ZOMBIE)).toBeNull();
  });

  it('takes an immediate win', () => {
    // Zombie can win at cell 2: [Z, Z, null, ...]
    const board = createBoard();
    board[0] = FACTIONS.ZOMBIE;
    board[1] = FACTIONS.ZOMBIE;
    board[4] = FACTIONS.PLANT;
    board[5] = FACTIONS.PLANT;

    const move = getHardMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(2);
  });

  it('blocks an immediate opponent win', () => {
    // Plant threatens win at cell 8
    const board = createBoard();
    board[0] = FACTIONS.PLANT;
    board[4] = FACTIONS.PLANT;
    board[1] = FACTIONS.ZOMBIE;

    const move = getHardMove(board, FACTIONS.ZOMBIE);
    expect(move).toBe(8);
  });

  it('prevents a classic corner fork trap', () => {
    // Human plays opposite corners: 0 and 8. AI played center 4.
    // [P, null, null, null, Z, null, null, null, P]
    // If AI plays a corner (e.g. 2 or 6), Human plays an edge and forks!
    // Optimal defense: AI MUST play an edge (1, 3, 5, or 7) to force Human to block!
    const board = createBoard();
    board[0] = FACTIONS.PLANT;
    board[4] = FACTIONS.ZOMBIE;
    board[8] = FACTIONS.PLANT;

    const move = getHardMove(board, FACTIONS.ZOMBIE);
    const edges = [1, 3, 5, 7];
    expect(edges).toContain(move);
  });

  describe('Exhaustive Optimal Verification', () => {
    it('always draws when playing against another Hard AI from an empty board', () => {
      let board = createBoard();
      let currentFaction = FACTIONS.PLANT;

      while (!getWinner(board) && !isDraw(board)) {
        const move = getHardMove(board, currentFaction);
        expect(move).not.toBeNull();
        expect(board[move]).toBeNull();
        board = applyMove(board, move, currentFaction);
        currentFaction = switchFaction(currentFaction);
      }

      expect(getWinner(board)).toBeNull();
      expect(isDraw(board)).toBe(true);
    });

    it('always draws against another Hard AI for every possible first move', () => {
      // Test all 9 possible opening moves by Player 1
      for (let openingMove = 0; openingMove < 9; openingMove++) {
        let board = createBoard();
        board = applyMove(board, openingMove, FACTIONS.PLANT);
        let currentFaction = FACTIONS.ZOMBIE;

        while (!getWinner(board) && !isDraw(board)) {
          const move = getHardMove(board, currentFaction);
          expect(move).not.toBeNull();
          board = applyMove(board, move, currentFaction);
          currentFaction = switchFaction(currentFaction);
        }

        const winner = getWinner(board);
        // Player 2 (Zombie) must never lose! It can only win or draw!
        if (winner) {
          expect(winner.faction).toBe(FACTIONS.ZOMBIE);
        } else {
          expect(isDraw(board)).toBe(true);
        }
      }
    });

    it('never loses across 100 simulated matches against random play (Easy AI)', () => {
      let aiLosses = 0;
      let aiWins = 0;
      let draws = 0;

      for (let match = 0; match < 100; match++) {
        let board = createBoard();
        // Alternate who starts: even matches AI starts (PLANT), odd matches Random starts
        const aiFaction = match % 2 === 0 ? FACTIONS.PLANT : FACTIONS.ZOMBIE;
        let currentFaction = FACTIONS.PLANT;

        while (!getWinner(board) && !isDraw(board)) {
          let move;
          if (currentFaction === aiFaction) {
            move = getHardMove(board, aiFaction);
          } else {
            move = getEasyMove(board);
          }

          board = applyMove(board, move, currentFaction);
          currentFaction = switchFaction(currentFaction);
        }

        const winner = getWinner(board);
        if (winner) {
          if (winner.faction === aiFaction) {
            aiWins++;
          } else {
            aiLosses++;
          }
        } else {
          draws++;
        }
      }

      // Hard AI must NEVER lose
      expect(aiLosses).toBe(0);
      expect(aiWins + draws).toBe(100);
    });
  });
});
