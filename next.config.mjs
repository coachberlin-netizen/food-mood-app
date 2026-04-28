import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  customWorkerSrc: "worker",
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
    ],
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
