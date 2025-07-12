import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

// Типы для работы с новостями
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId?: string;
  author?: {
    id: string;
    name?: string;
    username: string;
    email: string;
  };
  views: number;
  likes: number;
  tags: string[];
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNewsData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
  authorId?: string;
  tags?: string[];
}

export interface UpdateNewsData {
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
  tags?: string[];
}

export interface NewsFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
  authorId?: string;
  tags?: string[];
}

export interface NewsPagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface NewsListResponse {
  news: NewsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Утилиты для работы с новостями
export class NewsService {
  static async getNews(id: string): Promise<NewsItem | null> {
    return await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    }) as NewsItem | null;
  }

  static async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    return await prisma.news.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    }) as NewsItem | null;
  }

  static async getNewsList(
    filters: NewsFilters = {},
    pagination: NewsPagination = { page: 1, limit: 10 }
  ): Promise<NewsListResponse> {
    const {
      category,
      search,
      featured,
      published = true,
      authorId,
      tags
    } = filters;

    const {
      page = 1,
      limit = 10,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = pagination;

    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (published !== undefined) {
      where.published = published;
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true
            }
          }
        }
      }),
      prisma.news.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      news,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  static async createNews(data: CreateNewsData): Promise<NewsItem> {
    // Преобразуем теги из массива в строку для сохранения в БД
    const tagsString = data.tags ? data.tags.join(',') : '';
    
    const result = await prisma.news.create({
      data: {
        ...data,
        tags: tagsString,
        publishedAt: data.publishedAt || new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });

    // Преобразуем теги обратно в массив для возврата
    return {
      ...result,
      tags: result.tags ? result.tags.split(',').filter(tag => tag.trim()) : []
    };
  }

  static async updateNews(id: string, data: UpdateNewsData): Promise<NewsItem> {
    // Преобразуем теги из массива в строку для сохранения в БД
    const updateData: any = { ...data };
    if (data.tags) {
      updateData.tags = data.tags.join(',');
    }
    
    return await prisma.news.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    }) as NewsItem;
  }

  static async deleteNews(id: string): Promise<void> {
    await prisma.news.delete({
      where: { id }
    });
  }

  static async incrementViews(id: string): Promise<NewsItem> {
    return await prisma.news.update({
      where: { id },
      data: {
        views: { increment: 1 }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async incrementLikes(id: string): Promise<NewsItem> {
    return await prisma.news.update({
      where: { id },
      data: {
        likes: { increment: 1 }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async togglePublished(id: string): Promise<NewsItem> {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) throw new Error('News not found');

    return await prisma.news.update({
      where: { id },
      data: {
        published: !news.published
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async toggleFeatured(id: string): Promise<NewsItem> {
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) throw new Error('News not found');

    return await prisma.news.update({
      where: { id },
      data: {
        featured: !news.featured
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async getRelatedNews(newsId: string, category: string, limit = 3): Promise<NewsItem[]> {
    return await prisma.news.findMany({
      where: {
        AND: [
          { id: { not: newsId } },
          { category },
          { published: true }
        ]
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async getPopularNews(limit = 5): Promise<NewsItem[]> {
    return await prisma.news.findMany({
      where: { published: true },
      take: limit,
      orderBy: [
        { views: 'desc' },
        { likes: 'desc' },
        { publishedAt: 'desc' }
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async getFeaturedNews(limit = 3): Promise<NewsItem[]> {
    return await prisma.news.findMany({
      where: {
        featured: true,
        published: true
      },
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true
          }
        }
      }
    });
  }

  static async getNewsStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    featured: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const [
      total,
      published,
      draft,
      featured,
      viewsResult,
      likesResult
    ] = await Promise.all([
      prisma.news.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.news.count({ where: { published: false } }),
      prisma.news.count({ where: { featured: true } }),
      prisma.news.aggregate({
        _sum: { views: true }
      }),
      prisma.news.aggregate({
        _sum: { likes: true }
      })
    ]);

    return {
      total,
      published,
      draft,
      featured,
      totalViews: viewsResult._sum.views || 0,
      totalLikes: likesResult._sum.likes || 0
    };
  }
}

// Утилиты для работы с категориями
export class CategoryService {
  static async getCategories(): Promise<NewsCategory[]> {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  static async getCategory(id: string): Promise<NewsCategory | null> {
    return await prisma.category.findUnique({
      where: { id }
    });
  }

  static async getCategoryBySlug(slug: string): Promise<NewsCategory | null> {
    return await prisma.category.findUnique({
      where: { slug }
    });
  }

  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    color?: string;
  }): Promise<NewsCategory> {
    return await prisma.category.create({
      data
    });
  }

  static async updateCategory(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
  }): Promise<NewsCategory> {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  static async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id }
    });
  }
}

// Утилиты для миграции данных
export class MigrationService {
  static async migrateFromStaticData(staticData: any[]): Promise<void> {
    for (const item of staticData) {
      try {
        await prisma.news.upsert({
          where: { slug: item.slug },
          update: {
            title: item.title,
            summary: item.summary,
            content: item.content,
            category: item.category,
            imageUrl: item.imageUrl,
            featured: item.featured || false,
            published: item.published !== false,
            publishedAt: new Date(item.publishedAt),
            tags: item.tags || []
          },
          create: {
            title: item.title,
            slug: item.slug,
            summary: item.summary,
            content: item.content,
            category: item.category,
            imageUrl: item.imageUrl,
            featured: item.featured || false,
            published: item.published !== false,
            publishedAt: new Date(item.publishedAt),
            tags: item.tags || []
          }
        });
      } catch (error) {
        console.error(`Error migrating news item ${item.slug}:`, error);
      }
    }
  }

  static async createDefaultCategories(): Promise<void> {
    const categories = [
      { name: 'Новости компании', slug: 'company', color: 'bg-blue-500', description: 'Корпоративные новости и объявления' },
      { name: 'Акции', slug: 'promotions', color: 'bg-green-500', description: 'Специальные предложения и акции' },
      { name: 'Другое', slug: 'other', color: 'bg-purple-500', description: 'Прочие новости и события' }
    ];

    for (const category of categories) {
      try {
        await prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category
        });
      } catch (error) {
        console.error(`Error creating category ${category.slug}:`, error);
      }
    }
  }

  static async createDefaultAdmin(): Promise<void> {
    const { hashPassword } = await import('./auth');
    
    try {
      await prisma.user.upsert({
        where: { email: 'admin@ckeproekt.ru' },
        update: {},
        create: {
          email: 'admin@ckeproekt.ru',
          username: 'admin',
          password: await hashPassword('admin123'),
          role: 'ADMIN',
          name: 'Администратор'
        }
      });
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }
} 