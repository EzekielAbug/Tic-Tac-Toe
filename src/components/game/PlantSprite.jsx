import Image from "next/image";

/**
 * PlantSprite component
 * Renders the pixel-art Plant character.
 */
export default function PlantSprite({ size = 64, className = "" }) {
  return (
    <div
      className={`sprite-container sprite-plant-wrapper ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Plant character"
    >
      <Image
        src="/sprites/plants/plant.svg"
        alt="Plant character"
        width={size}
        height={size}
        priority
        className="pixel-sprite"
      />
    </div>
  );
}
