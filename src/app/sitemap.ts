import { MetadataRoute } from 'next';
import { SYMPTOMS } from '@/data/symptoms';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.food-mood.app';

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Static Pages
  const staticPages = [
    '',
    '/pricing',
    '/como-funciona',
    '/quienes-somos',
    '/saber-mas',
    '/sintomas',
    '/recetas',
    '/test',
    '/auth/login'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all recipes from DB
  const { data: dbRecipes } = await supabase
    .from('recetas')
    .select('id, updated_at');

  const recipePages = (dbRecipes || []).map((recipe) => ({
    url: `${baseUrl}/recetas/${recipe.id}`,
    lastModified: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Symptoms
  const symptomPages = SYMPTOMS.map((symptom) => ({
    url: `${baseUrl}/sintomas/${symptom.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...recipePages, ...symptomPages];
}
