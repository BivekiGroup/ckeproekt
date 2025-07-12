import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const news = await prisma.news.findUnique({
      where: { id: resolvedParams.id },
      include: { author: true }
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await prisma.news.update({
      where: { id: resolvedParams.id },
      data: { views: { increment: 1 } }
    });

    // Преобразуем теги из строки в массив для фронтенда
    const newsWithTags = {
      ...news,
      tags: news.tags ? news.tags.split(',').filter(tag => tag.trim()) : []
    };

    return NextResponse.json({
      success: true,
      data: newsWithTags
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Здесь должна быть проверка авторизации
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const updateData: any = { ...body };
    if (body.publishedAt) {
      updateData.publishedAt = new Date(body.publishedAt);
    }
    
    // Преобразуем теги из массива в строку для сохранения в БД
    if (body.tags && Array.isArray(body.tags)) {
      updateData.tags = body.tags.join(',');
    }
    
    // Генерируем slug если передан title
    if (body.title && !body.slug) {
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9а-я]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const news = await prisma.news.update({
      where: { id: resolvedParams.id },
      data: updateData,
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
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    // Здесь должна быть проверка авторизации
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    await prisma.news.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    );
  }
} 