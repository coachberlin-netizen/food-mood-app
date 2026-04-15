import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ['@anthropic-ai/sdk'],
  experimental: {},
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
    ]
  },
};

export default withPWA(nextConfig);
