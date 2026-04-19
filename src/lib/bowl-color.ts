const GROUP_COLORS: { key: string; color: string }[] = [
  { key: "protein_count",    color: "#C04060" },
  { key: "fish_count",       color: "#4A7AB5" },
  { key: "vegetables_count", color: "#5A9B8A" },
  { key: "fruits_count",     color: "#E8703A" },
  { key: "grains_count",     color: "#C8902A" },
  { key: "fermented_count",  color: "#7A5AAA" },
  { key: "nuts_count",       color: "#8B5A2B" },
  { key: "processed_count",  color: "#8B2020" },
  { key: "water_count",      color: "#4A90D0" },
]

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0"))
      .join("")
  )
}

export function getBowlColor(counts: Record<string, number>): string {
  let totalWeight = 0
  let rSum = 0, gSum = 0, bSum = 0

  for (const { key, color } of GROUP_COLORS) {
    const w = counts[key] ?? 0
    if (w > 0) {
      const [r, g, b] = hexToRgb(color)
      rSum += r * w
      gSum += g * w
      bSum += b * w
      totalWeight += w
    }
  }

  if (totalWeight === 0) return "#e8e0d0"
  return rgbToHex(rSum / totalWeight, gSum / totalWeight, bSum / totalWeight)
}
