/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем ESLint при сборке для продакшена
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорируем ошибки TypeScript при сборке для продакшена
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 's3.twcstorage.ru',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: 'standalone',
};

module.exports = nextConfig;
