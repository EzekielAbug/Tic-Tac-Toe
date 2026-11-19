"use client";

import { useState } from "react";
import { FACTIONS, GAME_MODES } from "@/constants/game";

/**
 * MatchHistory component
 * Displays a persistent log of completed matches with outcome, mode, and timestamp.
 *
 * @param {Object} props
 * @param {Array<Object>} props.history - List of completed match objects
 * @param {Function} props.onClearHistory - Callback to wipe history
 */
export default function MatchHistory({ history = [], onClearHistory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function formatDate(isoString) {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  return (
    <div className="history-panel pixel-panel">
      <div className="history-header">
        <button
          type="button"
          className="history-toggle-btn font-pixel"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          📜 MATCH LOG ({history.length}) {isOpen ? "▲" : "▼"}
        </button>

        {isOpen && history.length > 0 && (
          <div>
            {!showConfirm ? (
              <button
                type="button"
                className="pixel-btn pixel-btn--small"
                onClick={() => setShowConfirm(true)}
              >
                Clear
              </button>
            ) : (
              <div className="scoreboard-confirm-actions">
                <span className="scoreboard-confirm-text font-pixel">Clear?</span>
                <button
                  type="button"
                  className="pixel-btn pixel-btn--small pixel-btn--confirm-yes"
                  onClick={() => {
                    onClearHistory();
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
        )}
      </div>

      {isOpen && (
        <div className="history-body">
          {history.length === 0 ? (
            <div className="history-empty font-pixel">
              No completed matches yet.<br />Defend the lawn!
            </div>
          ) : (
            <div className="history-list">
              {history.slice(0, 15).map((match, idx) => {
                let badgeClass = "history-badge--draw";
                let badgeIcon = "🤝";
                let badgeText = "DRAW";

                if (match.winner === FACTIONS.PLANT) {
                  badgeClass = "history-badge--plant";
                  badgeIcon = "🌻";
                  badgeText = "PLANTS";
                } else if (match.winner === FACTIONS.ZOMBIE) {
                  badgeClass = "history-badge--zombie";
                  badgeIcon = "🧟";
                  badgeText = "ZOMBIES";
                }

                const modeLabel =
                  match.mode === GAME_MODES.PVE
                    ? `AI (${match.difficulty || "EASY"})`
                    : "2P LOCAL";

                return (
                  <div key={match.id || idx} className="history-item">
                    <span className={`history-badge font-pixel ${badgeClass}`}>
                      {badgeIcon} {badgeText}
                    </span>
                    <span className="history-mode font-pixel">{modeLabel}</span>
                    <span className="history-time font-pixel">
                      {formatDate(match.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
