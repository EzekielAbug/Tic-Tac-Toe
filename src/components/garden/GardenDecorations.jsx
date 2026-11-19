"use client";

/**
 * GardenDecorations component
 * Renders retro pixel-art environmental details:
 * - Garden wooden fence along the horizon line
 * - Animated fireflies floating in the dark at night
 * - Decorative lawn flowers along the garden base
 */
export default function GardenDecorations({ isNight = false }) {
  return (
    <div className="garden-decorations" aria-hidden="true">
      {/* Wooden Garden Fence along horizon */}
      <div className="garden-fence" />

      {/* Floating Fireflies (night mode only) */}
      {isNight && (
        <div className="fireflies-container">
          <div className="firefly" style={{ top: "45%", left: "12%", animationDelay: "0s" }} />
          <div className="firefly" style={{ top: "35%", left: "28%", animationDelay: "1.4s" }} />
          <div className="firefly" style={{ top: "52%", left: "42%", animationDelay: "0.7s" }} />
          <div className="firefly" style={{ top: "38%", left: "75%", animationDelay: "2.1s" }} />
          <div className="firefly" style={{ top: "48%", left: "88%", animationDelay: "1.1s" }} />
          <div className="firefly" style={{ top: "60%", left: "22%", animationDelay: "1.8s" }} />
          <div className="firefly" style={{ top: "55%", left: "68%", animationDelay: "0.4s" }} />
        </div>
      )}

      {/* Garden Lawn Flowers */}
      <div className="garden-lawn-flowers">
        <span className="lawn-flower lawn-flower--1">🌼</span>
        <span className="lawn-flower lawn-flower--2">🌷</span>
        <span className="lawn-flower lawn-flower--3">🌱</span>
        <span className="lawn-flower lawn-flower--4">🌼</span>
        <span className="lawn-flower lawn-flower--5">🌷</span>
      </div>
    </div>
  );
}
