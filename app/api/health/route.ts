import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect();
    
    // Проверяем, что можем выполнить запрос
    const newsCount = await prisma.news.count();
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      data: {
        newsCount,
        userCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      success: false,
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 