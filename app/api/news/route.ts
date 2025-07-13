import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured') === 'true';
    const publishedParam = searchParams.get('published');
    const published = publishedParam === 'all' ? undefined : publishedParam !== 'false';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

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
    
    if (slug) {
      where.slug = slug;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { content: { contains: search } }
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
        include: { author: true }
      }),
      prisma.news.count({ where })
    ]);

    // Преобразуем теги из строки в массив для фронтенда
    const newsWithTags = news.map(item => ({
      ...item,
      tags: item.tags ? item.tags.split(',').filter(tag => tag.trim()) : []
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        news: newsWithTags,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Здесь должна быть проверка авторизации
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Преобразуем теги из массива в строку
    const tagsString = Array.isArray(body.tags) ? body.tags.join(',') : (body.tags || '');
    
    // Генерируем slug если не передан
    let slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9а-я]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Проверяем уникальность slug
    const existingNews = await prisma.news.findUnique({ where: { slug } });
    if (existingNews) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: {
        ...body,
        slug,
        tags: tagsString,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date()
      },
      include: { author: true }
    });

    // Преобразуем теги обратно в массив для ответа
    const newsWithTags = {
      ...news,
      tags: news.tags ? news.tags.split(',').filter(tag => tag.trim()) : []
    };

    return NextResponse.json({
      success: true,
      data: newsWithTags
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
} 