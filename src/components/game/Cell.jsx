"use client";

import PlantSprite from "@/components/game/PlantSprite";
import ZombieSprite from "@/components/game/ZombieSprite";
import { FACTIONS } from "@/constants/game";

/**
 * Cell component
 * Represents a single position on the 3×3 garden grid.
 *
 * @param {Object} props
 * @param {number} props.index - Cell index (0-8)
 * @param {string|null} props.value - 'PLANT' | 'ZOMBIE' | null
 * @param {boolean} props.isWinningCell - True if part of the winning 3-in-a-row
 * @param {boolean} props.disabled - True if interaction is prohibited
 * @param {Function} props.onClick - Move handler
 */
export default function Cell({
  index,
  value,
  isWinningCell = false,
  disabled = false,
  onClick,
}) {
  const isOccupied = value !== null;
  const isDisabled = disabled || isOccupied;

  return (
    <button
      type="button"
      className={`cell ${isOccupied ? "cell--occupied" : ""} ${
        isWinningCell ? "cell--winning" : ""
      } ${isDisabled ? "cell--disabled" : ""}`}
      onClick={() => onClick(index)}
      disabled={isDisabled}
      aria-label={`Cell ${index + 1}: ${value || "empty"}`}
      data-testid={`cell-${index}`}
    >
      {value === FACTIONS.PLANT && <PlantSprite size={84} />}
      {value === FACTIONS.ZOMBIE && <ZombieSprite size={84} />}
    </button>
  );
}
