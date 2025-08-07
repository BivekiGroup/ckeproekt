import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext, hashPassword, verifyPassword } from '@/lib/auth';
import prisma from '@/lib/database';

export async function PUT(request: NextRequest) {
  const context = await getAuthContext(request);
  if (!context.user || context.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, username, currentPassword, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json({ error: 'Текущий пароль обязателен' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: context.user.id } });
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверка текущего пароля
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный текущий пароль' }, { status: 400 });
    }

    const data: any = {};
    if (email && email !== user.email) data.email = email;
    if (username && username !== user.username) data.username = username;
    if (newPassword && newPassword.length >= 6) {
      data.password = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: true });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, email: true, username: true, role: true, name: true, avatar: true }
    });

    return NextResponse.json({ user: updated });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email или логин уже заняты' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

