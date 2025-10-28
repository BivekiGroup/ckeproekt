import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ckeproekt.ru';

  // Основные страницы
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/personal-data`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Страницы услуг
  const services = [
    'construction-control',
    'flood-expertise',
    'house-recognition',
    'renovation-expertise',
    'room-measurement',
    'thermal-inspection',
    'sewerage-inspection',
  ];

  const serviceRoutes = services.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Получаем новости из базы данных
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const news = await prisma.news.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    newsRoutes = news.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
  }

  return [...routes, ...serviceRoutes, ...newsRoutes];
}
