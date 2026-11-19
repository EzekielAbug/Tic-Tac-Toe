import Image from "next/image";

/**
 * ZombieSprite component
 * Renders the original pixel-art Zombie character:
 * - Decayed green skin with prominent brow
 * - Bulging mismatched goofy eyes
 * - Gaping mouth with crooked yellow teeth
 * - Tattered suit coat, frayed collar, and crimson tie
 */
export default function ZombieSprite({ size = 64, className = "" }) {
  return (
    <div
      className={`sprite-container sprite-zombie-wrapper ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/sprites/zombies/zombie.svg"
        alt="Zombie character"
        width={size}
        height={size}
        priority
        className="pixel-sprite"
      />
    </div>
  );
}
