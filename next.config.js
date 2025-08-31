/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Use the new ESLint flat config
    dirs: ['src'],
  },
  experimental: {
    // Enable modern features
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Enable SWC minification
  swcMinify: true,
};

module.exports = nextConfig;
