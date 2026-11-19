"use client";

import { GAME_MODES, AI_DIFFICULTY, FACTIONS } from "@/constants/game";

/**
 * GameControls component
 * Provides controls for:
 * - Switching game mode (PvP vs PvE)
 * - Selecting AI difficulty (Easy, Medium, Hard)
 * - Selecting human faction (Plants vs Zombies in PvE)
 * - Restarting game and undoing moves
 *
 * @param {Object} props
 * @param {string} props.gameMode
 * @param {string} props.aiDifficulty
 * @param {string} props.humanFaction
 * @param {boolean} props.canUndo
 * @param {boolean} props.isAiThinking
 * @param {Function} props.onSetGameMode
 * @param {Function} props.onSetAiDifficulty
 * @param {Function} props.onSetHumanFaction
 * @param {Function} props.onNewGame
 * @param {Function} props.onUndo
 * @param {boolean} props.isNight
 * @param {Function} props.onToggleTheme
 */
export default function GameControls({
  gameMode,
  aiDifficulty,
  humanFaction,
  canUndo,
  isAiThinking,
  onSetGameMode,
  onSetAiDifficulty,
  onSetHumanFaction,
  onNewGame,
  onUndo,
  isNight,
  onToggleTheme,
}) {
  return (
    <div className="game-controls-container">
      {/* Primary Action Buttons */}
      <div className="controls-primary-bar">
        <button
          type="button"
          className="pixel-btn"
          onClick={onToggleTheme}
        >
          {isNight ? "☀️ Day" : "🌙 Night"}
        </button>
        <button
          type="button"
          className="pixel-btn pixel-btn--plant"
          onClick={onNewGame}
        >
          New Game
        </button>
        <button
          type="button"
          className="pixel-btn pixel-btn--small"
          onClick={onUndo}
          disabled={!canUndo || isAiThinking}
        >
          ↩ Undo
        </button>
      </div>

      {/* Mode Selector Panel */}
      <div className="settings-panel pixel-panel">
        <div className="settings-row">
          <span className="settings-label font-pixel">MODE:</span>
          <div className="settings-options">
            <button
              type="button"
              className={`pixel-pill ${
                gameMode === GAME_MODES.PVP ? "pixel-pill--active" : ""
              }`}
              onClick={() => onSetGameMode(GAME_MODES.PVP)}
            >
              👥 2P Local
            </button>
            <button
              type="button"
              className={`pixel-pill ${
                gameMode === GAME_MODES.PVE ? "pixel-pill--active" : ""
              }`}
              onClick={() => onSetGameMode(GAME_MODES.PVE)}
            >
              🤖 vs AI
            </button>
          </div>
        </div>

        {/* PvE Sub-Settings */}
        {gameMode === GAME_MODES.PVE && (
          <>
            {/* Difficulty Selector */}
            <div className="settings-row">
              <span className="settings-label font-pixel">AI LEVEL:</span>
              <div className="settings-options">
                <button
                  type="button"
                  className={`pixel-pill ${
                    aiDifficulty === AI_DIFFICULTY.EASY
                      ? "pixel-pill--active"
                      : ""
                  }`}
                  onClick={() => onSetAiDifficulty(AI_DIFFICULTY.EASY)}
                >
                  Easy
                </button>
                <button
                  type="button"
                  className={`pixel-pill ${
                    aiDifficulty === AI_DIFFICULTY.MEDIUM
                      ? "pixel-pill--active"
                      : ""
                  }`}
                  onClick={() => onSetAiDifficulty(AI_DIFFICULTY.MEDIUM)}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`pixel-pill ${
                    aiDifficulty === AI_DIFFICULTY.HARD
                      ? "pixel-pill--active pixel-pill--hard"
                      : ""
                  }`}
                  onClick={() => onSetAiDifficulty(AI_DIFFICULTY.HARD)}
                >
                  Hard (Minimax)
                </button>
              </div>
            </div>

            {/* Faction Selector */}
            <div className="settings-row">
              <span className="settings-label font-pixel">PLAY AS:</span>
              <div className="settings-options">
                <button
                  type="button"
                  className={`pixel-pill ${
                    humanFaction === FACTIONS.PLANT
                      ? "pixel-pill--active pixel-pill--plant"
                      : ""
                  }`}
                  onClick={() => onSetHumanFaction(FACTIONS.PLANT)}
                >
                  🌻 Plants
                </button>
                <button
                  type="button"
                  className={`pixel-pill ${
                    humanFaction === FACTIONS.ZOMBIE
                      ? "pixel-pill--active pixel-pill--zombie"
                      : ""
                  }`}
                  onClick={() => onSetHumanFaction(FACTIONS.ZOMBIE)}
                >
                  🧟 Zombies
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
