/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable TypeScript and ESLint checking during builds for better code quality
  typescript: {
    // Only ignore build errors in development, not production
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Only ignore during builds in development, not production
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  images: {
    // Keep unoptimized for static export compatibility
    unoptimized: true,
  },
  // Modern Next.js doesn't need CSS optimization disabled
  experimental: {
    // Enable modern features
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Add output configuration for better deployment
  output: 'standalone',
}

export default nextConfig