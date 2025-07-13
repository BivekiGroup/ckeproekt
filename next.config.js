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
  },
};

module.exports = nextConfig;
