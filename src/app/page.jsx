"use client";

import { useState } from "react";

/**
 * Garden Clash — Main Page
 *
 * Phase 1: Displays the garden scene layout shell with:
 * - Sky gradient (day/night)
 * - Celestial body (sun/moon)
 * - Stars (visible at night)
 * - Game title
 * - 3×3 board with CSS placeholder sprites
 * - Theme toggle button
 *
 * Game logic will be connected in Phase 4.
 */
export default function Home() {
  const [isNight, setIsNight] = useState(false);

  /** Toggle the theme class on the <html> element */
  function handleThemeToggle() {
    setIsNight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("night", next);
      return next;
    });
  }

  // Demo board: show some placeholder sprites to verify styling
  const demoBoard = [
    "PLANT",
    null,
    "ZOMBIE",
    null,
    "PLANT",
    null,
    "ZOMBIE",
    null,
    null,
  ];

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

      {/* Game content */}
      <div className="game-content">
        {/* Title */}
        <h1 className="game-title">
          <span className="title-plant">Garden</span>{" "}
          <span className="title-zombie">Clash</span>
        </h1>
        <p className="game-subtitle">🌱 Plants vs Zombies 🧟</p>

        {/* Turn indicator placeholder */}
        <div className="turn-indicator">
          🌻 Plants&apos; Turn
        </div>

        {/* Board */}
        <div className="board-wrapper">
          {demoBoard.map((cell, index) => (
            <div
              key={index}
              className={`cell ${cell ? "cell--occupied" : ""}`}
            >
              {cell === "PLANT" && <div className="sprite-plant" />}
              {cell === "ZOMBIE" && <div className="sprite-zombie" />}
            </div>
          ))}
        </div>

        {/* Controls placeholder */}
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
            className="pixel-btn"
            onClick={handleThemeToggle}
          >
            {isNight ? "☀️ Day" : "🌙 Night"}
          </button>
          <button className="pixel-btn pixel-btn--plant">New Game</button>
          <button className="pixel-btn pixel-btn--small">↩ Undo</button>
          <button className="pixel-btn pixel-btn--small">🔊 Sound</button>
        </div>

        {/* Score panel placeholder */}
        <div className="pixel-panel" style={{ marginTop: "20px", width: "100%", maxWidth: "348px" }}>
          <div className="font-pixel" style={{ fontSize: "0.55rem", textAlign: "center", marginBottom: "8px" }}>
            Scoreboard
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Press Start 2P', monospace", fontSize: "0.5rem" }}>
            <span style={{ color: "var(--plant-accent)" }}>🌻 Plants: 0</span>
            <span>Draws: 0</span>
            <span style={{ color: "var(--zombie-accent)" }}>🧟 Zombies: 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
