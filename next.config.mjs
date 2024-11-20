/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io', 'localhost', 'localhost:5000'],
  },
  transpilePackages: ['@mui/material'],
};

export default nextConfig;