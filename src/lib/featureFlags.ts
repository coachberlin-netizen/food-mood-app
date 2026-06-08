/**
 * Feature flags — features en validación, pendientes de corte definitivo.
 * Para re-activar: cambiar el valor a true.
 * Para eliminar definitivamente: buscar FEATURES.xxx y borrar el bloque.
 */
export const FEATURES = {
  /** FM Index — puntuación numérica del estado Food·Mood */
  fmIndex: false,

  /** Racha — contador de días consecutivos (dentro de FoodMoodIndex) */
  racha: false,

  /** Paleta emocional / Semana en colores (WeekMosaic en dashboard) */
  paletaEmocional: false,

  /** Journey 90 días — card y página de seguimiento */
  journey90d: false,

  /** Biomarcadores — wearables, HRV, sueño, FC reposo */
  biomarcadores: false,

  /** Herramientas conductuales — PracticasCard en dashboard (acceso autónomo del paciente) */
  herramientasConducuales: false,
} as const
