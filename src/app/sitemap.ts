import { MetadataRoute } from 'next';
import { recipesData } from '@/data/recipes';
import { SYMPTOMS } from '@/data/symptoms';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.food-mood.app';

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

  // Recipes
  const recipePages = recipesData.map((recipe) => ({
    url: `${baseUrl}/recetas/${recipe.id}`,
    lastModified: new Date(),
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
