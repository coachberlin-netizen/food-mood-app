import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  customWorkerSrc: "worker",
});

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cuoycqwtzorjbzmyclqo.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com https://generativelanguage.googleapis.com",
      "media-src 'self' blob: https://cuoycqwtzorjbzmyclqo.supabase.co",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

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
    ],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin',      value: 'https://www.food-mood.app' },
          { key: 'Access-Control-Allow-Methods',     value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers',     value: 'Content-Type, Authorization, x-telegram-bot-api-secret-token' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age',           value: '86400' },
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
        destination: '/paleta',
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
    ]
  },
};

export default withPWA(nextConfig);
