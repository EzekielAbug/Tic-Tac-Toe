"use client";

import { FACTIONS, GAME_STATUS } from "@/constants/game";

/**
 * TurnIndicator component
 * Displays the current turn, computer thinking status, or match outcome.
 *
 * @param {Object} props
 * @param {string} props.gameStatus - Current game status enum
 * @param {string} props.currentFaction - 'PLANT' | 'ZOMBIE'
 * @param {boolean} props.isAiTurn - True if computer is deliberating
 */
export default function TurnIndicator({
  gameStatus,
  currentFaction,
  isAiTurn = false,
}) {
  let statusText = "";
  let modifierClass = "";

  if (gameStatus === GAME_STATUS.PLANT_WINS) {
    statusText = "🌻 PLANTS WIN! 🎉";
    modifierClass = "turn-indicator-banner--plant turn-indicator-banner--win";
  } else if (gameStatus === GAME_STATUS.ZOMBIE_WINS) {
    statusText = "🧟 ZOMBIES WIN! 🧠";
    modifierClass = "turn-indicator-banner--zombie turn-indicator-banner--win";
  } else if (gameStatus === GAME_STATUS.DRAW) {
    statusText = "🤝 IT'S A DRAW!";
    modifierClass = "turn-indicator-banner--win";
  } else if (isAiTurn) {
    const aiIcon = currentFaction === FACTIONS.PLANT ? "🌻" : "🧟";
    statusText = `${aiIcon} COMPUTER IS THINKING...`;
    modifierClass =
      currentFaction === FACTIONS.PLANT
        ? "turn-indicator-banner--plant"
        : "turn-indicator-banner--zombie";
  } else {
    if (currentFaction === FACTIONS.PLANT) {
      statusText = "🌻 PLANTS' TURN";
      modifierClass = "turn-indicator-banner--plant";
    } else {
      statusText = "🧟 ZOMBIES' TURN";
      modifierClass = "turn-indicator-banner--zombie";
    }
  }

  return (
    <div
      className={`turn-indicator-banner ${modifierClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="turn-indicator-text">{statusText}</div>
    </div>
  );
}
