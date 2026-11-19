import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cell from '@/components/game/Cell';
import { FACTIONS } from '@/constants/game';

describe('Cell Component', () => {
  it('renders an empty button with accessible label', () => {
    render(
      <Cell
        index={0}
        value={null}
        isWinningCell={false}
        disabled={false}
        onClick={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: /Cell 1: empty/i });
    expect(button).toBeDefined();
    expect(button.disabled).toBe(false);
  });

  it('triggers onClick with cell index when clicked', () => {
    const handleClick = vi.fn();
    render(
      <Cell
        index={4}
        value={null}
        isWinningCell={false}
        disabled={false}
        onClick={handleClick}
      />
    );

    const button = screen.getByTestId('cell-4');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(4);
  });

  it('renders Plant character when occupied by PLANT', () => {
    render(
      <Cell
        index={2}
        value={FACTIONS.PLANT}
        isWinningCell={false}
        disabled={false}
        onClick={() => {}}
      />
    );

    const plantImg = screen.getByRole('img', { name: /Plant character/i });
    expect(plantImg).toBeDefined();
    expect(screen.getByTestId('cell-2').disabled).toBe(true);
  });

  it('renders Zombie character when occupied by ZOMBIE', () => {
    render(
      <Cell
        index={6}
        value={FACTIONS.ZOMBIE}
        isWinningCell={false}
        disabled={false}
        onClick={() => {}}
      />
    );

    const zombieImg = screen.getByRole('img', { name: /Zombie character/i });
    expect(zombieImg).toBeDefined();
    expect(screen.getByTestId('cell-6').disabled).toBe(true);
  });

  it('applies winning class when isWinningCell is true', () => {
    render(
      <Cell
        index={1}
        value={FACTIONS.PLANT}
        isWinningCell={true}
        disabled={true}
        onClick={() => {}}
      />
    );

    const button = screen.getByTestId('cell-1');
    expect(button.className).toContain('cell--winning');
  });
});
