import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Board from '@/components/game/Board';
import { FACTIONS } from '@/constants/game';

describe('Board Component', () => {
  it('renders all 9 cells in a grid structure', () => {
    const board = Array(9).fill(null);
    render(
      <Board
        board={board}
        winningLine={null}
        isGameOver={false}
        isAiThinking={false}
        onCellClick={() => {}}
      />
    );

    const grid = screen.getByRole('grid', { name: /Garden Clash 3x3 Board/i });
    expect(grid).toBeDefined();

    for (let i = 0; i < 9; i++) {
      expect(screen.getByTestId(`cell-${i}`)).toBeDefined();
    }
  });

  it('forwards cell clicks to onCellClick handler', () => {
    const board = Array(9).fill(null);
    const handleClick = vi.fn();

    render(
      <Board
        board={board}
        winningLine={null}
        isGameOver={false}
        isAiThinking={false}
        onCellClick={handleClick}
      />
    );

    fireEvent.click(screen.getByTestId('cell-3'));
    expect(handleClick).toHaveBeenCalledWith(3);
  });

  it('marks winning cells when a winningLine is provided', () => {
    const board = [
      FACTIONS.PLANT, FACTIONS.PLANT, FACTIONS.PLANT,
      null, null, null,
      null, null, null,
    ];

    render(
      <Board
        board={board}
        winningLine={[0, 1, 2]}
        isGameOver={true}
        isAiThinking={false}
        onCellClick={() => {}}
      />
    );

    expect(screen.getByTestId('cell-0').className).toContain('cell--winning');
    expect(screen.getByTestId('cell-1').className).toContain('cell--winning');
    expect(screen.getByTestId('cell-2').className).toContain('cell--winning');
    expect(screen.getByTestId('cell-3').className).not.toContain('cell--winning');
  });

  it('disables all cells when isAiThinking is true', () => {
    const board = Array(9).fill(null);
    render(
      <Board
        board={board}
        winningLine={null}
        isGameOver={false}
        isAiThinking={true}
        onCellClick={() => {}}
      />
    );

    for (let i = 0; i < 9; i++) {
      expect(screen.getByTestId(`cell-${i}`).disabled).toBe(true);
    }
  });
});
