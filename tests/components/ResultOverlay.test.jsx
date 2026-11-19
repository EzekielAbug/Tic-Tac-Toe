import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultOverlay from '@/components/game/ResultOverlay';
import { GAME_STATUS } from '@/constants/game';

describe('ResultOverlay Component', () => {
  it('renders nothing when game is in progress (PLAYING)', () => {
    const { container } = render(
      <ResultOverlay
        gameStatus={GAME_STATUS.PLAYING}
        onPlayAgain={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders victory message for Plants with play again action', () => {
    const handlePlayAgain = vi.fn();
    render(
      <ResultOverlay
        gameStatus={GAME_STATUS.PLANT_WINS}
        onPlayAgain={handlePlayAgain}
      />
    );

    expect(screen.getByText(/VICTORY!/i)).toBeDefined();
    expect(screen.getByText(/The garden lawn is defended!/i)).toBeDefined();

    const playAgainBtn = screen.getByRole('button', { name: /Play Again/i });
    fireEvent.click(playAgainBtn);
    expect(handlePlayAgain).toHaveBeenCalledTimes(1);
  });

  it('renders victory message for Zombies', () => {
    render(
      <ResultOverlay
        gameStatus={GAME_STATUS.ZOMBIE_WINS}
        onPlayAgain={() => {}}
      />
    );

    expect(screen.getByText(/DEFEAT!/i)).toBeDefined();
    expect(screen.getByText(/The zombies invaded the lawn!/i)).toBeDefined();
  });

  it('renders stalemate message on Draw', () => {
    render(
      <ResultOverlay
        gameStatus={GAME_STATUS.DRAW}
        onPlayAgain={() => {}}
      />
    );

    expect(screen.getByText(/STALEMATE!/i)).toBeDefined();
  });

  it('dismisses overlay when Review Lawn is clicked', () => {
    render(
      <ResultOverlay
        gameStatus={GAME_STATUS.PLANT_WINS}
        onPlayAgain={() => {}}
      />
    );

    const reviewBtn = screen.getByRole('button', { name: /Review Lawn/i });
    fireEvent.click(reviewBtn);

    expect(screen.queryByText(/VICTORY!/i)).toBeNull();
  });
});
