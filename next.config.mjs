/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'http',  // or 'https', depending on your local setup
        hostname: 'localhost',
      },
      {
        protocol: 'http',  // or 'https', depending on your local setup
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',  // assuming your deployed site uses https
        hostname: 'psywebsite-frontend-production.up.railway.app',
      },
    ],
  },
  transpilePackages: ['@mui/material'],
};

export default nextConfig;
