import {
  TbCircleNumber0Filled,
  TbCircleNumber1Filled,
  TbCircleNumber2Filled,
  TbCircleNumber3Filled,
  TbCircleNumber4Filled,
  TbCircleNumber5Filled,
  TbCircleNumber6Filled,
  TbCircleNumber7Filled,
  TbCircleNumber8Filled,
  TbCircleNumber9Filled,
} from "react-icons/tb";

const numberIcons = {
  0: TbCircleNumber0Filled,
  1: TbCircleNumber1Filled,
  2: TbCircleNumber2Filled,
  3: TbCircleNumber3Filled,
  4: TbCircleNumber4Filled,
  5: TbCircleNumber5Filled,
  6: TbCircleNumber6Filled,
  7: TbCircleNumber7Filled,
  8: TbCircleNumber8Filled,
  9: TbCircleNumber9Filled,
};

export default function NumberBadgeIcon({
  value,
  size = 22,
  className = "",
}) {
  if (!value || value <= 0) return null;

  // 1–9 → use official icon
  if (value < 10) {
    const Icon = numberIcons[value];
    return <Icon size={size} className={className} />;
  }

  // 9+ badge → single circle with "9+"
  const badgeSize = size + 3; // slightly larger so text fits
  const fontSize = size * 0.45;

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-red-600 text-white font-semibold ${className}`}
      style={{
        width: badgeSize,
        height: badgeSize,
        fontSize,
      }}
    >
      9+
    </div>
  );
}
