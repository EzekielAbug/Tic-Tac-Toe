"use client";

import { useState, useEffect } from "react";
import PlantSprite from "@/components/game/PlantSprite";
import ZombieSprite from "@/components/game/ZombieSprite";
import Scoreboard from "@/components/scoreboard/Scoreboard";
import GameControls from "@/components/game/GameControls";
import { useGameReducer } from "@/hooks/useGameReducer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getAiMove } from "@/lib/game/ai";
import { FACTIONS, GAME_STATUS, GAME_MODES } from "@/constants/game";
import { STORAGE_KEYS, DEFAULT_SCORES } from "@/lib/storage/localStorage";

/**
 * Garden Clash — Main Application Page
 * Supports both PvP (2P local) and PvE (vs AI with Easy, Medium, Hard).
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
    }, 450);

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

  // Format turn indicator & status banner text
  let statusText = "";
  let statusModifierClass = "";

  if (state.gameStatus === GAME_STATUS.PLANT_WINS) {
    statusText = "🌻 PLANTS WIN! 🎉";
    statusModifierClass = "turn-indicator-banner--plant turn-indicator-banner--win";
  } else if (state.gameStatus === GAME_STATUS.ZOMBIE_WINS) {
    statusText = "🧟 ZOMBIES WIN! 🧠";
    statusModifierClass = "turn-indicator-banner--zombie turn-indicator-banner--win";
  } else if (state.gameStatus === GAME_STATUS.DRAW) {
    statusText = "🤝 IT'S A DRAW!";
    statusModifierClass = "turn-indicator-banner--win";
  } else if (isAiTurn) {
    const aiIcon = state.currentFaction === FACTIONS.PLANT ? "🌻" : "🧟";
    statusText = `${aiIcon} COMPUTER IS THINKING...`;
    statusModifierClass =
      state.currentFaction === FACTIONS.PLANT
        ? "turn-indicator-banner--plant"
        : "turn-indicator-banner--zombie";
  } else {
    if (state.currentFaction === FACTIONS.PLANT) {
      statusText = "🌻 PLANTS' TURN";
      statusModifierClass = "turn-indicator-banner--plant";
    } else {
      statusText = "🧟 ZOMBIES' TURN";
      statusModifierClass = "turn-indicator-banner--zombie";
    }
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
        <div className={`turn-indicator-banner ${statusModifierClass}`}>
          <div className="turn-indicator-text">
            {statusText}
          </div>
        </div>

        {/* 3×3 Board */}
        <div className="board-wrapper">
          {state.board.map((cell, index) => {
            const isWinningCell = state.winningLine?.includes(index);
            const isGameOver =
              state.gameStatus === GAME_STATUS.PLANT_WINS ||
              state.gameStatus === GAME_STATUS.ZOMBIE_WINS ||
              state.gameStatus === GAME_STATUS.DRAW;

            const isCellDisabled = cell !== null || isGameOver || isAiTurn;

            return (
              <button
                key={index}
                type="button"
                className={`cell ${cell ? "cell--occupied" : ""} ${
                  isWinningCell ? "cell--winning" : ""
                } ${isCellDisabled ? "cell--disabled" : ""}`}
                onClick={() => actions.makeMove(index)}
                disabled={isCellDisabled}
                aria-label={`Cell ${index + 1}: ${cell || "empty"}`}
              >
                {cell === FACTIONS.PLANT && <PlantSprite size={84} />}
                {cell === FACTIONS.ZOMBIE && <ZombieSprite size={84} />}
              </button>
            );
          })}
        </div>

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
      </div>
    </div>
  );
}
