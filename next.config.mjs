/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: [
      'r8ufq8lxqtup42rg.public.blob.vercel-storage.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'r8ufq8lxqtup42rg.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
