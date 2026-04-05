import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const MOODS = [
  'Activación & Energía',
  'Calma & Equilibrio',
  'Focus & Claridad Mental',
  'Social & Placer Compartido',
  'Reset & Ligereza',
  'familia & Calidez'
];

export interface UserContext {
  id?: string;
  tier: 'visitante' | 'registrado free' | 'premium';
}

export function shouldShowFullRecipe(user: UserContext) {
  return user.tier === 'premium';
}

export async function getRecentlySeenRecipeIds(mainSupabase: SupabaseClient, userId: string): Promise<string[]> {
  if (!userId) return [];
  const { data, error } = await mainSupabase
    .from('user_recipe_history')
    .select('recipe_id')
    .eq('user_id', userId)
    .order('shown_at', { ascending: false })
    .limit(30);

  if (error || !data) {
    if (error?.code === '42P01') {
      console.warn('Degradación segura: La tabla user_recipe_history aún no existe. Omitiendo historial.');
    } else {
      console.warn('Degradación segura: Error leyendo historial:', error?.message);
    }
    return [];
  }
  return data.map((d: any) => d.recipe_id);
}

export async function saveRecipeExposure(mainSupabase: SupabaseClient, userId: string | undefined, recipeId: string, source: string, mood: string, shownAs: string) {
  if (!userId) return; // Cannot save for anonymous visitors
  
  const { error } = await mainSupabase.from('user_recipe_history').insert({
    user_id: userId,
    recipe_id: recipeId,
    source,
    detected_mood: mood,
    shown_as: shownAs
  });
  if (error) {
    if (error.code === '42P01') {
      console.warn('Degradación segura: La tabla user_recipe_history no existe. No se guarda la exposición.');
    } else {
      console.warn('Degradación segura: Error guardando exposición:', error.message);
    }
  }
}

export async function getDailyInspiration(mainSupabase: SupabaseClient, recetasSupabase: SupabaseClient, user: UserContext) {
  // Rotación basada en día del año (0-365)
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  
  // Cambiamos de mood a diario
  const moodIndex = dayOfYear % MOODS.length;
  const targetMood = MOODS[moodIndex];

  return getRecipeRecommendationByMood(mainSupabase, recetasSupabase, user, targetMood, 'daily_dashboard', dayOfYear);
}

export async function getRecipeRecommendationByMood(
  mainSupabase: SupabaseClient, 
  recetasSupabase: SupabaseClient, 
  user: UserContext, 
  mood: string, 
  source: string = 'chat_recommendation',
  seed?: number // Opcional: Para forzar determinismo en la inspiración diaria
) {
  const recentIds = user.id ? await getRecentlySeenRecipeIds(mainSupabase, user.id) : [];

  let query = recetasSupabase
    .from('recetas')
    .select('id, nombre_es, mood_es, imagen_url, tiempo_preparacion_min, dificultad, ingredientes_es, preparacion_es')
    .ilike('mood_es', `%${mood.split(' ')[0]}%`)
    .eq('segmento', 'adulto');

  if (user.tier !== 'premium') {
    query = query.eq('premium_level', 0);
  }

  const { data: recipes, error } = await query;
  if (error || !recipes || recipes.length === 0) return null;

  // Filtrar las que ya vió recientemente
  let availableRecipes = recipes.filter((r: any) => !recentIds.includes(r.id));
  
  // Si ya vio todas, reseteamos las disponibles
  if (availableRecipes.length === 0) {
    availableRecipes = recipes; 
  }

  // Elegir una pseudo-aleatoriamente
  let selected;
  if (seed !== undefined) {
    selected = availableRecipes[seed % availableRecipes.length];
  } else {
    selected = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  }

  const isPremium = shouldShowFullRecipe(user);
  const shownAs = isPremium ? 'full_recipe' : 'inspiration';

  // Mapeamos lo que devolvemos: Los no premium pierden acceso a ingredientes/preparación
  const result = isPremium 
    ? { ...selected, isRestricted: false }
    : {
        id: selected.id,
        nombre_es: selected.nombre_es,
        mood_es: selected.mood_es,
        imagen_url: selected.imagen_url,
        tiempo_preparacion_min: selected.tiempo_preparacion_min,
        dificultad: selected.dificultad,
        isRestricted: true
      };

  // Guardamos la exposición asíncronamente
  if (user.id) {
    saveRecipeExposure(mainSupabase, user.id, selected.id, source, selected.mood_es, shownAs).catch(() => {});
  }

  return result;
}

export function buildPremiumUpsellMessage(userType: string) {
  if (userType === 'premium') return '';
  return "\n\nSi quieres acceder a la receta completa y explorar todos tus moods con más variedad, premium te abre el mapa entero de Food·Mood.";
}
