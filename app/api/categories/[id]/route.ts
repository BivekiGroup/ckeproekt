import { NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, color, slug } = body;
    const id = params.id;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(color ? { color } : {}),
        ...(slug ? { slug } : {}),
      },
      select: { id: true, name: true, slug: true, description: true, color: true }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Категория не найдена' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Имя или слаг уже используются' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Не удалось обновить категорию' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Категория не найдена' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Не удалось удалить категорию' }, { status: 500 });
  }
}

