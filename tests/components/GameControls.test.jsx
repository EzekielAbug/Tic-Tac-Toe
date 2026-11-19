import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GameControls from '@/components/game/GameControls';
import { GAME_MODES, AI_DIFFICULTY, FACTIONS } from '@/constants/game';

describe('GameControls Component', () => {
  it('triggers onNewGame and onToggleTheme on click', () => {
    const handleNewGame = vi.fn();
    const handleToggleTheme = vi.fn();

    render(
      <GameControls
        gameMode={GAME_MODES.PVP}
        aiDifficulty={AI_DIFFICULTY.EASY}
        humanFaction={FACTIONS.PLANT}
        canUndo={true}
        isAiThinking={false}
        onSetGameMode={() => {}}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={handleNewGame}
        onUndo={() => {}}
        isNight={false}
        onToggleTheme={handleToggleTheme}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /New Game/i }));
    expect(handleNewGame).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Night/i }));
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('triggers onUndo when canUndo is true, disables it when false', () => {
    const handleUndo = vi.fn();

    const { rerender } = render(
      <GameControls
        gameMode={GAME_MODES.PVP}
        aiDifficulty={AI_DIFFICULTY.EASY}
        humanFaction={FACTIONS.PLANT}
        canUndo={true}
        isAiThinking={false}
        onSetGameMode={() => {}}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={() => {}}
        onUndo={handleUndo}
        isNight={false}
        onToggleTheme={() => {}}
      />
    );

    const undoButton = screen.getByRole('button', { name: /Undo/i });
    expect(undoButton.disabled).toBe(false);
    fireEvent.click(undoButton);
    expect(handleUndo).toHaveBeenCalledTimes(1);

    rerender(
      <GameControls
        gameMode={GAME_MODES.PVP}
        aiDifficulty={AI_DIFFICULTY.EASY}
        humanFaction={FACTIONS.PLANT}
        canUndo={false}
        isAiThinking={false}
        onSetGameMode={() => {}}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={() => {}}
        onUndo={handleUndo}
        isNight={false}
        onToggleTheme={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: /Undo/i }).disabled).toBe(true);
  });

  it('switches game mode when clicking mode pills', () => {
    const handleSetMode = vi.fn();

    render(
      <GameControls
        gameMode={GAME_MODES.PVP}
        aiDifficulty={AI_DIFFICULTY.EASY}
        humanFaction={FACTIONS.PLANT}
        canUndo={false}
        isAiThinking={false}
        onSetGameMode={handleSetMode}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={() => {}}
        onUndo={() => {}}
        isNight={false}
        onToggleTheme={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /vs AI/i }));
    expect(handleSetMode).toHaveBeenCalledWith(GAME_MODES.PVE);
  });

  it('renders AI level and faction selectors only in PvE mode', () => {
    const { rerender } = render(
      <GameControls
        gameMode={GAME_MODES.PVP}
        aiDifficulty={AI_DIFFICULTY.EASY}
        humanFaction={FACTIONS.PLANT}
        canUndo={false}
        isAiThinking={false}
        onSetGameMode={() => {}}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={() => {}}
        onUndo={() => {}}
        isNight={false}
        onToggleTheme={() => {}}
      />
    );

    expect(screen.queryByText(/AI LEVEL:/i)).toBeNull();

    rerender(
      <GameControls
        gameMode={GAME_MODES.PVE}
        aiDifficulty={AI_DIFFICULTY.HARD}
        humanFaction={FACTIONS.ZOMBIE}
        canUndo={false}
        isAiThinking={false}
        onSetGameMode={() => {}}
        onSetAiDifficulty={() => {}}
        onSetHumanFaction={() => {}}
        onNewGame={() => {}}
        onUndo={() => {}}
        isNight={false}
        onToggleTheme={() => {}}
      />
    );

    expect(screen.getByText(/AI LEVEL:/i)).toBeDefined();
    expect(screen.getByText(/PLAY AS:/i)).toBeDefined();
  });
});
