"use client";

import { useState } from "react";
import { GAME_STATUS } from "@/constants/game";

/**
 * ResultOverlay component
 * Displays a celebratory pixel-art modal banner when a match concludes.
 * Includes "Play Again" and "Inspect Board" actions.
 *
 * @param {Object} props
 * @param {string} props.gameStatus - Current game status
 * @param {Function} props.onPlayAgain - Handler to reset and start a new match
 */
export default function ResultOverlay({ gameStatus, onPlayAgain }) {
  const [isDismissed, setIsDismissed] = useState(false);

  const isGameOver =
    gameStatus === GAME_STATUS.PLANT_WINS ||
    gameStatus === GAME_STATUS.ZOMBIE_WINS ||
    gameStatus === GAME_STATUS.DRAW;

  if (!isGameOver || isDismissed) {
    return null;
  }

  let title = "";
  let message = "";
  let icon = "";
  let accentClass = "";

  if (gameStatus === GAME_STATUS.PLANT_WINS) {
    title = "VICTORY!";
    message = "The garden lawn is defended!";
    icon = "🌻";
    accentClass = "result-overlay--plant";
  } else if (gameStatus === GAME_STATUS.ZOMBIE_WINS) {
    title = "DEFEAT!";
    message = "The zombies invaded the lawn!";
    icon = "🧟";
    accentClass = "result-overlay--zombie";
  } else {
    title = "STALEMATE!";
    message = "A fierce tactical draw!";
    icon = "🤝";
    accentClass = "result-overlay--draw";
  }

  return (
    <div className="result-overlay-backdrop" role="dialog" aria-modal="true">
      <div className={`result-overlay-card pixel-panel ${accentClass}`}>
        <div className="result-icon">{icon}</div>
        <h2 className="result-title font-pixel">{title}</h2>
        <p className="result-message">{message}</p>

        <div className="result-actions">
          <button
            type="button"
            className="pixel-btn pixel-btn--plant"
            onClick={onPlayAgain}
            autoFocus
          >
            Play Again
          </button>
          <button
            type="button"
            className="pixel-btn pixel-btn--small"
            onClick={() => setIsDismissed(true)}
          >
            Review Lawn
          </button>
        </div>
      </div>
    </div>
  );
}
