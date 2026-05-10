import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  customWorkerSrc: "worker",
  workboxOptions: {
    runtimeCaching: [
      {
        // Hero images + public static assets — cache-first, 30 days
        urlPattern: /\/_next\/image\?url=.*hero/,
        handler: "CacheFirst",
        options: {
          cacheName: "hero-images",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        // Next.js optimized images (WebP/AVIF) — stale-while-revalidate
        urlPattern: /^\/_next\/image\?/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "next-images",
          expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      {
        // Google Fonts — cache-first
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
    sri: { algorithm: 'sha256' },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cuoycqwtzorjbzmyclqo.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</.well-known/api-catalog>; rel="api-catalog"',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/legal',
        destination: '/terminos',
        permanent: true,
      },
      {
        source: '/cookies',
        destination: '/privacidad',
        permanent: true,
      },
      {
        source: '/emociones',
        destination: '/eloraculo',
        permanent: true,
      },
      {
        source: '/diario',
        destination: '/paleta',
        permanent: false,
      },
      {
        source: '/retos/slow-food-mood-7d',
        destination: '/retos/slow-food-mood',
        permanent: true,
      },
      {
        source: '/planes',
        destination: '/pricing',
        permanent: true,
      },
      {
        source: '/newsletter',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/retos/reset-hedonico',
        destination: '/retos/microhabitos',
        permanent: true,
      },
    ]
  },
};

export default withPWA(nextConfig);
