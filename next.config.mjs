/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-slick'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'api.eyarafashion.com',
        pathname: '/**',  // ← Allow all paths
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;