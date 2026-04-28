// Re-export from modular engine — use @/lib/oracle for new code
export type {
  MoodId,
  OracleInput,
  OracleScore,
  OracleRecipeQuery,
  OracleSuggestedAction,
  EmotionalMix,
} from './oracle'

export { scoreCheckin } from './oracle'
