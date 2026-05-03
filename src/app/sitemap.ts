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
  const staticRoutes: { route: string; priority: number; freq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' }[] = [
    { route: '',                    priority: 1.0, freq: 'weekly'  },
    { route: '/paleta',             priority: 0.9, freq: 'weekly'  },
    { route: '/paleta/ansiedad',   priority: 0.8, freq: 'monthly' },
    { route: '/paleta/melancolia', priority: 0.8, freq: 'monthly' },
    { route: '/paleta/estres',     priority: 0.8, freq: 'monthly' },
    { route: '/paleta/agotamiento', priority: 0.8, freq: 'monthly' },
    { route: '/pricing',            priority: 0.9, freq: 'weekly'  },
    { route: '/retos',              priority: 0.8, freq: 'weekly'  },
    { route: '/test',               priority: 0.8, freq: 'weekly'  },
    { route: '/como-funciona',      priority: 0.8, freq: 'monthly' },
    { route: '/recetas',            priority: 0.8, freq: 'weekly'  },
    { route: '/blog',               priority: 0.7, freq: 'weekly'  },
    { route: '/sintomas',           priority: 0.7, freq: 'monthly' },
    { route: '/glosario',           priority: 0.7, freq: 'monthly' },
    { route: '/fermentos-del-mundo', priority: 0.7, freq: 'monthly' },
    { route: '/quienes-somos',      priority: 0.6, freq: 'monthly' },
    { route: '/saber-mas',          priority: 0.6, freq: 'monthly' },
    { route: '/corporate-wellness', priority: 0.8, freq: 'monthly' },
  ];

  const staticPages = staticRoutes.map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Fetch published blog posts
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  const blogPages = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
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

  // Reto landing pages
  const { data: challenges } = await supabase
    .from('challenges')
    .select('slug, updated_at')
    .eq('is_active', true)

  const retoPages = (challenges || []).map((ch) => ({
    url: `${baseUrl}/retos/${ch.slug}`,
    lastModified: ch.updated_at ? new Date(ch.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Editorial newsletter pages
  const newsletterEditorialPages = [
    { slug: 'slow-food-mood',             date: '2026-04-27' },
    { slug: 'pan-de-masa-madre',          date: '2026-05-04' },
    { slug: 'salsa-de-tomate-fermentada', date: '2026-05-11' },
    { slug: 'recupera-tu-energia',        date: '2026-05-18' },
    { slug: 'microhabitos',               date: '2026-05-25' },
    { slug: 'estrobioma',                 date: '2026-05-03' },
    { slug: 'legumbres-menopausia',         date: '2026-05-11' },
    { slug: 'proteina-musculo-menopausia',  date: '2026-05-18' },
    { slug: 'colageno-huesos-menopausia',   date: '2026-05-25' },
    { slug: 'emociones-menopausia',          date: '2026-06-01' },
    { slug: 'fermentos-del-mundo',            date: '2026-06-08' },
    { slug: 'mosaico-emocional',               date: '2026-06-15' },
  ].map(nl => ({
    url:             `${baseUrl}/newsletter/${nl.slug}`,
    lastModified:    new Date(nl.date),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  const newsletterIndexPage = {
    url:             `${baseUrl}/newsletter`,
    lastModified:    new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.75,
  }

  return [...staticPages, ...blogPages, ...recipePages, ...symptomPages, ...retoPages, newsletterIndexPage, ...newsletterEditorialPages];
}
