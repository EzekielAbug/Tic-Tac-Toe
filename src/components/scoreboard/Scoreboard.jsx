"use client";

import { useState } from "react";

/**
 * Scoreboard component
 * Displays Plant victories, Zombie victories, and Draws.
 * Includes score reset with explicit confirmation.
 *
 * @param {Object} props
 * @param {{ plantWins: number, zombieWins: number, draws: number }} props.scores
 * @param {Function} props.onResetScores
 */
export default function Scoreboard({ scores, onResetScores }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="scoreboard-panel pixel-panel">
      <div className="scoreboard-header">
        <h2 className="scoreboard-title font-pixel">🏆 SCOREBOARD</h2>
        {!showConfirm ? (
          <button
            type="button"
            className="pixel-btn pixel-btn--small scoreboard-reset-btn"
            onClick={() => setShowConfirm(true)}
            title="Reset Scoreboard"
          >
            Reset
          </button>
        ) : (
          <div className="scoreboard-confirm-actions">
            <span className="scoreboard-confirm-text font-pixel">Reset all?</span>
            <button
              type="button"
              className="pixel-btn pixel-btn--small pixel-btn--confirm-yes"
              onClick={() => {
                onResetScores();
                setShowConfirm(false);
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="pixel-btn pixel-btn--small"
              onClick={() => setShowConfirm(false)}
            >
              No
            </button>
          </div>
        )}
      </div>

      <div className="scoreboard-grid">
        {/* Plants Card */}
        <div className="score-card score-card--plant">
          <div className="score-faction-name font-pixel">🌻 PLANTS</div>
          <div className="score-number font-pixel">{scores.plantWins}</div>
          <div className="score-label font-pixel">WINS</div>
        </div>

        {/* Draws Card */}
        <div className="score-card score-card--draw">
          <div className="score-faction-name font-pixel">🤝 TIES</div>
          <div className="score-number font-pixel">{scores.draws}</div>
          <div className="score-label font-pixel">DRAWS</div>
        </div>

        {/* Zombies Card */}
        <div className="score-card score-card--zombie">
          <div className="score-faction-name font-pixel">🧟 ZOMBIES</div>
          <div className="score-number font-pixel">{scores.zombieWins}</div>
          <div className="score-label font-pixel">WINS</div>
        </div>
      </div>
    </div>
  );
}
