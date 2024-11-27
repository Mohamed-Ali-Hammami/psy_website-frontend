/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'http', 
        hostname: 'localhost',
      },
      {
        protocol: 'http',  
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https', 
        hostname: 'psywebsite-frontend-production.up.railway.app',
      },
    ],
  },
  transpilePackages: ['@mui/material'],
};

export default nextConfig;
