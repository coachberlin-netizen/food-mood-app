export interface TestInput {
  energia: number
  animo: number
  tension: number
  conexion: number
  claridad: number
}

export interface FoodInput {
  protein_count: number
  fish_count: number
  vegetables_count: number
  fruits_count: number
  grains_count: number
  fermented_count: number
  nuts_count: number
  processed_count: number
  water_count: number
}

export function getEmotionalScore(t: TestInput): number {
  return (
    t.energia         * 0.25 +
    t.animo           * 0.30 +
    (100 - t.tension) * 0.20 +
    t.conexion        * 0.10 +
    t.claridad        * 0.15
  )
}

export function getFoodScore(f: FoodInput): number {
  const groups = [
    f.protein_count    > 0,
    f.fish_count       > 0,
    f.vegetables_count > 0,
    f.fruits_count     > 0,
    f.grains_count     > 0,
    f.fermented_count  > 0,
    f.nuts_count       > 0,
    f.water_count      >= 3,
  ].filter(Boolean).length
  return (groups / 8) * 100
}

export function calculateFoodMoodIndex(
  test: TestInput | null,
  food: FoodInput | null
): number {
  if (!test && !food) return 50

  const penalty = food ? Math.min(food.processed_count * 5, 20) : 0

  if (test && food) {
    const emotional = getEmotionalScore(test)
    const foodScore = getFoodScore(food)
    return Math.max(1, Math.min(100, Math.round(emotional * 0.6 + foodScore * 0.4 - penalty)))
  }

  if (test) {
    return Math.max(1, Math.min(100, Math.round(getEmotionalScore(test) * 0.85)))
  }

  // food only
  return Math.max(1, Math.min(100, Math.round(getFoodScore(food!) * 0.75 - penalty)))
}
