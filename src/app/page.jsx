"use client";

import { useState, useEffect } from "react";
import Board from "@/components/game/Board";
import TurnIndicator from "@/components/game/TurnIndicator";
import ResultOverlay from "@/components/game/ResultOverlay";
import GameControls from "@/components/game/GameControls";
import Scoreboard from "@/components/scoreboard/Scoreboard";
import { useGameReducer } from "@/hooks/useGameReducer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getAiMove } from "@/lib/game/ai";
import { GAME_STATUS, GAME_MODES } from "@/constants/game";
import { STORAGE_KEYS, DEFAULT_SCORES } from "@/lib/storage/localStorage";

/**
 * Garden Clash — Main Application Page
 * Composes the game components cleanly: Board, TurnIndicator, ResultOverlay, Controls, Scoreboard.
 */
export default function Home() {
  const [isNight, setIsNight] = useState(false);
  const { state, actions } = useGameReducer();
  const [scores, setScores] = useLocalStorage(STORAGE_KEYS.SCORES, DEFAULT_SCORES);

  const isGameOver =
    state.gameStatus === GAME_STATUS.PLANT_WINS ||
    state.gameStatus === GAME_STATUS.ZOMBIE_WINS ||
    state.gameStatus === GAME_STATUS.DRAW;

  const isAiTurn =
    state.gameMode === GAME_MODES.PVE &&
    !isGameOver &&
    state.currentFaction !== state.humanFaction;

  /** Toggle the theme class on the <html> element */
  function handleThemeToggle() {
    setIsNight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("night", next);
      return next;
    });
  }

  /**
   * PvE AI Response Effect
   * Schedules the computer's move after a natural thinking delay.
   */
  useEffect(() => {
    if (!isAiTurn) return;

    const timer = setTimeout(() => {
      const move = getAiMove(
        state.board,
        state.aiDifficulty,
        state.currentFaction
      );
      if (move !== null) {
        actions.makeMove(move);
      }
    }, 420);

    return () => clearTimeout(timer);
  }, [isAiTurn, state.board, state.aiDifficulty, state.currentFaction, actions]);

  /**
   * Listen for terminal game conditions and record scores.
   * Guarded by state.matchRecorded to prevent duplicate counting.
   */
  useEffect(() => {
    if (state.matchRecorded) return;

    if (state.gameStatus === GAME_STATUS.PLANT_WINS) {
      setScores((prev) => ({ ...prev, plantWins: prev.plantWins + 1 }));
      actions.recordMatch();
    } else if (state.gameStatus === GAME_STATUS.ZOMBIE_WINS) {
      setScores((prev) => ({ ...prev, zombieWins: prev.zombieWins + 1 }));
      actions.recordMatch();
    } else if (state.gameStatus === GAME_STATUS.DRAW) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      actions.recordMatch();
    }
  }, [state.gameStatus, state.matchRecorded, setScores, actions]);

  /** Reset all scores */
  function handleResetScores() {
    setScores(DEFAULT_SCORES);
  }

  return (
    <div className="garden-scene">
      {/* Sky background */}
      <div className="garden-sky" />

      {/* Sun or Moon */}
      <div className="celestial-body" />

      {/* Stars (only visible at night) */}
      <div className="stars">
        <div className="star" style={{ top: "10%", left: "20%" }} />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
        <div className="star" />
      </div>

      {/* Main Game Container */}
      <div className="game-content">
        {/* Title */}
        <h1 className="game-title">
          <span className="title-plant">Garden</span>{" "}
          <span className="title-zombie">Clash</span>
        </h1>
        <p className="game-subtitle">🌱 Plants vs Zombies 🧟</p>

        {/* Turn Indicator & Status Banner */}
        <TurnIndicator
          gameStatus={state.gameStatus}
          currentFaction={state.currentFaction}
          isAiTurn={isAiTurn}
        />

        {/* 3×3 Board */}
        <Board
          board={state.board}
          winningLine={state.winningLine}
          isGameOver={isGameOver}
          isAiThinking={isAiTurn}
          onCellClick={actions.makeMove}
        />

        {/* Interactive Controls & Mode Selector */}
        <GameControls
          gameMode={state.gameMode}
          aiDifficulty={state.aiDifficulty}
          humanFaction={state.humanFaction}
          canUndo={state.moveHistory.length > 0}
          isAiThinking={isAiTurn}
          onSetGameMode={actions.setGameMode}
          onSetAiDifficulty={actions.setAiDifficulty}
          onSetHumanFaction={actions.setHumanFaction}
          onNewGame={() => actions.startNewGame()}
          onUndo={actions.undoMove}
          isNight={isNight}
          onToggleTheme={handleThemeToggle}
        />

        {/* Scoreboard */}
        <Scoreboard
          scores={scores}
          onResetScores={handleResetScores}
        />

        {/* Result Overlay Celebration Modal */}
        <ResultOverlay
          key={state.matchId}
          gameStatus={state.gameStatus}
          onPlayAgain={() => actions.startNewGame()}
        />
      </div>
    </div>
  );
}
