import { categories } from "../lib/IMC";
import peopleAtlas from "../assets/bmi-people.png";

// Center the visible person, compensating for transparent margins in each atlas cell.
const imageOffsets = [
  [-7.13, -0.1],
  [0.2, 0.2],
  [7.23, -0.1],
  [-6.25, 0.78],
  [0.49, 0.78],
  [7.23, 1.07],
] as const;

export default function BMIAvatar({
  category,
  large = false,
}: {
  category: string;
  large?: boolean;
}) {
  const index = Math.max(
    0,
    categories.findIndex((item) => item.label === category),
  );
  const [offsetX, offsetY] = imageOffsets[index];
  return (
    <span
      className={`bmi-avatar${large ? " bmi-avatar-large" : ""}`}
      aria-hidden="true"
    >
      <span
        className="bmi-avatar-art"
        style={{
          backgroundImage: `url(${peopleAtlas})`,
          backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%`,
          transform: `translate(${offsetX}%, ${offsetY}%)`,
        }}
      />
    </span>
  );
}
