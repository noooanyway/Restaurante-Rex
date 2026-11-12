import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'export',
  basePath: '/Restaurante-Rex',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
};

export default config;