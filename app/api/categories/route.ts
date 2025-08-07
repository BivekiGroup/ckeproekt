import { NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true, color: true }
    });
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: false, error: 'Не удалось получить категории' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name: string = body.name;
    const description: string | undefined = body.description;
    const color: string | undefined = body.color;
    let slug: string | undefined = body.slug;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Название обязательно' }, { status: 400 });
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const created = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description,
        color: color || 'bg-blue-500'
      },
      select: { id: true, name: true, slug: true, description: true, color: true }
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (e: unknown) {
    const code = typeof e === 'object' && e !== null && 'code' in e ? (e as { code?: string }).code : undefined;
    if (code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Категория с таким именем или слагом уже существует' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Не удалось создать категорию' }, { status: 500 });
  }
}

