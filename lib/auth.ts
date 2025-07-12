import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN' | 'EDITOR';
  name?: string;
  avatar?: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
}

export const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar: true
      }
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext> {
  const token = extractTokenFromRequest(request);
  
  if (!token) {
    return { user: null, isAuthenticated: false };
  }

  const user = await getUserFromToken(token);
  
  return {
    user,
    isAuthenticated: !!user
  };
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  // Проверяем заголовок Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Проверяем cookie
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }

  return null;
}

export function requireAuth(context: AuthContext): User {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
}

export function requireRole(context: AuthContext, allowedRoles: string[]): User {
  const user = requireAuth(context);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

export function requireAdmin(context: AuthContext): User {
  return requireRole(context, ['ADMIN']);
}

export function requireEditorOrAdmin(context: AuthContext): User {
  return requireRole(context, ['EDITOR', 'ADMIN']);
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar: true,
        password: true
      }
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = generateToken(user.id);
    
    // Убираем пароль из возвращаемых данных
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  email: string;
  username: string;
  password: string;
  name?: string;
  role?: 'USER' | 'ADMIN' | 'EDITOR';
}): Promise<{ user: User; token: string } | null> {
  try {
    // Проверяем, что пользователь с таким email или username не существует
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        name: userData.name,
        role: userData.role || 'USER'
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar: true
      }
    });

    const token = generateToken(user.id);

    return {
      user,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Middleware для проверки аутентификации в API routes
export async function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<Response>
) {
  return async (request: NextRequest) => {
    const context = await getAuthContext(request);
    return handler(request, context);
  };
}

// Middleware для проверки роли в API routes
export async function withRole(
  handler: (request: NextRequest, context: AuthContext) => Promise<Response>,
  allowedRoles: string[]
) {
  return withAuth(async (request: NextRequest, context: AuthContext) => {
    try {
      requireRole(context, allowedRoles);
      return handler(request, context);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  });
}

// Middleware для проверки админских прав
export async function withAdmin(
  handler: (request: NextRequest, context: AuthContext) => Promise<Response>
) {
  return withRole(handler, ['ADMIN']);
} 