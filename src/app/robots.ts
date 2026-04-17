import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/test/preguntas', '/perfil/', '/auth/setup'],
    },
    sitemap: 'https://www.food-mood.app/sitemap.xml',
  };
}
