import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TurnIndicator from '@/components/game/TurnIndicator';
import { FACTIONS, GAME_STATUS } from '@/constants/game';

describe('TurnIndicator Component', () => {
  it('displays Plants turn when currentFaction is PLANT', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.PLAYING}
        currentFaction={FACTIONS.PLANT}
        isAiTurn={false}
      />
    );

    expect(screen.getByText(/PLANTS' TURN/i)).toBeDefined();
  });

  it('displays Zombies turn when currentFaction is ZOMBIE', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.PLAYING}
        currentFaction={FACTIONS.ZOMBIE}
        isAiTurn={false}
      />
    );

    expect(screen.getByText(/ZOMBIES' TURN/i)).toBeDefined();
  });

  it('displays thinking notice when isAiTurn is true', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.PLAYING}
        currentFaction={FACTIONS.ZOMBIE}
        isAiTurn={true}
      />
    );

    expect(screen.getByText(/COMPUTER IS THINKING/i)).toBeDefined();
  });

  it('announces victory when Plants win', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.PLANT_WINS}
        currentFaction={FACTIONS.ZOMBIE}
        isAiTurn={false}
      />
    );

    expect(screen.getByText(/PLANTS WIN!/i)).toBeDefined();
  });

  it('announces victory when Zombies win', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.ZOMBIE_WINS}
        currentFaction={FACTIONS.PLANT}
        isAiTurn={false}
      />
    );

    expect(screen.getByText(/ZOMBIES WIN!/i)).toBeDefined();
  });

  it('announces a draw when match is tied', () => {
    render(
      <TurnIndicator
        gameStatus={GAME_STATUS.DRAW}
        currentFaction={FACTIONS.PLANT}
        isAiTurn={false}
      />
    );

    expect(screen.getByText(/IT'S A DRAW!/i)).toBeDefined();
  });
});
