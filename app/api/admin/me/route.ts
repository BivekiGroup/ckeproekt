import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const context = await getAuthContext(request);
  if (!context.user || context.user.role !== 'ADMIN') {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: context.user });
}

