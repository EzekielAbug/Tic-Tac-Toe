"use client";

import { useState, useEffect } from "react";
import PlantSprite from "@/components/game/PlantSprite";
import ZombieSprite from "@/components/game/ZombieSprite";
import Scoreboard from "@/components/scoreboard/Scoreboard";
import { useGameReducer } from "@/hooks/useGameReducer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FACTIONS, GAME_STATUS } from "@/constants/game";
import { STORAGE_KEYS, DEFAULT_SCORES } from "@/lib/storage/localStorage";

/**
 * Garden Clash — Main Application Page
 */
export default function Home() {
  const [isNight, setIsNight] = useState(false);
  const { state, actions } = useGameReducer();
  const [scores, setScores] = useLocalStorage(STORAGE_KEYS.SCORES, DEFAULT_SCORES);

  /** Toggle the theme class on the <html> element */
  function handleThemeToggle() {
    setIsNight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("night", next);
      return next;
    });
  }

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

            return (
              <button
                key={index}
                type="button"
                className={`cell ${cell ? "cell--occupied" : ""} ${
                  isWinningCell ? "cell--winning" : ""
                } ${isGameOver ? "cell--disabled" : ""}`}
                onClick={() => actions.makeMove(index)}
                disabled={cell !== null || isGameOver}
                aria-label={`Cell ${index + 1}: ${cell || "empty"}`}
              >
                {cell === FACTIONS.PLANT && <PlantSprite size={68} />}
                {cell === FACTIONS.ZOMBIE && <ZombieSprite size={68} />}
              </button>
            );
          })}
        </div>

        {/* Game Controls */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="pixel-btn"
            onClick={handleThemeToggle}
          >
            {isNight ? "☀️ Day" : "🌙 Night"}
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn--plant"
            onClick={() => actions.startNewGame()}
          >
            New Game
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn--small"
            onClick={() => actions.undoMove()}
            disabled={state.moveHistory.length === 0}
            style={{
              opacity: state.moveHistory.length === 0 ? 0.5 : 1,
              cursor: state.moveHistory.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            ↩ Undo
          </button>
        </div>

        {/* Scoreboard */}
        <Scoreboard
          scores={scores}
          onResetScores={handleResetScores}
        />
      </div>
    </div>
  );
}
