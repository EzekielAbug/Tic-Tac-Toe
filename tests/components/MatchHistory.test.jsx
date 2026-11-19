import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchHistory from '@/components/history/MatchHistory';
import { FACTIONS, GAME_MODES, AI_DIFFICULTY } from '@/constants/game';

describe('MatchHistory Component', () => {
  it('renders collapsed state showing match count', () => {
    const history = [
      {
        id: '1',
        winner: FACTIONS.PLANT,
        mode: GAME_MODES.PVP,
        timestamp: new Date().toISOString(),
      },
    ];

    render(<MatchHistory history={history} onClearHistory={() => {}} />);
    expect(screen.getByText(/MATCH LOG \(1\)/i)).toBeDefined();
    // Body is collapsed by default
    expect(screen.queryByText(/2P LOCAL/i)).toBeNull();
  });

  it('expands to show history entries on toggle click', () => {
    const history = [
      {
        id: '1',
        winner: FACTIONS.PLANT,
        mode: GAME_MODES.PVP,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        winner: FACTIONS.ZOMBIE,
        mode: GAME_MODES.PVE,
        difficulty: AI_DIFFICULTY.HARD,
        timestamp: new Date().toISOString(),
      },
    ];

    render(<MatchHistory history={history} onClearHistory={() => {}} />);
    fireEvent.click(screen.getByText(/MATCH LOG \(2\)/i));

    expect(screen.getByText(/PLANTS/i)).toBeDefined();
    expect(screen.getByText(/ZOMBIES/i)).toBeDefined();
    expect(screen.getByText(/2P LOCAL/i)).toBeDefined();
    expect(screen.getByText(/AI \(HARD\)/i)).toBeDefined();
  });

  it('displays empty message when expanded with no matches', () => {
    render(<MatchHistory history={[]} onClearHistory={() => {}} />);
    fireEvent.click(screen.getByText(/MATCH LOG \(0\)/i));

    expect(screen.getByText(/No completed matches yet/i)).toBeDefined();
  });

  it('requires confirmation before clearing history', () => {
    const handleClear = vi.fn();
    const history = [
      {
        id: '1',
        winner: FACTIONS.PLANT,
        mode: GAME_MODES.PVP,
        timestamp: new Date().toISOString(),
      },
    ];

    render(<MatchHistory history={history} onClearHistory={handleClear} />);
    fireEvent.click(screen.getByText(/MATCH LOG \(1\)/i));

    // Click Clear button
    fireEvent.click(screen.getByRole('button', { name: /Clear/i }));

    // Confirmation asks "Clear? [Yes] [No]"
    expect(screen.getByText(/Clear\?/i)).toBeDefined();
    expect(handleClear).not.toHaveBeenCalled();

    // Click Yes
    fireEvent.click(screen.getByRole('button', { name: /Yes/i }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});
