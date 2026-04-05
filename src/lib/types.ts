export type MoodId = 
  | "activacion"
  | "calma"
  | "focus"
  | "social"
  | "reset"
  | "familia";

export interface MoodState {
  id: MoodId;
  nombre: string;
  nombre_en?: string;
  emoji?: string;
  color: string;
  fondo: string;
  descripcion_corta: string;
  descripcion?: string;
  ingredientes: string[];
  mecanismo: string;
  momento: string;
  ritualSugerido?: string;
}
