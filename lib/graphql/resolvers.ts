import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    // News queries
    news: async (_: any, { id }: { id: string }) => {
      return await prisma.news.findUnique({
        where: { id },
        include: { author: true }
      });
    },

    newsList: async (_: any, args: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      featured?: boolean;
      published?: boolean;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      const {
        page = 1,
        limit = 10,
        category,
        search,
        featured,
        published = true,
        sortBy = 'publishedAt',
        sortOrder = 'desc'
      } = args;

      const skip = (page - 1) * limit;
      
      const where: any = {};
      
      if (published !== undefined) {
        where.published = published;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (featured !== undefined) {
        where.featured = featured;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
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
    },

    newsCount: async (_: any, args: {
      category?: string;
      search?: string;
      published?: boolean;
    }) => {
      const { category, search, published = true } = args;
      
      const where: any = {};
      
      if (published !== undefined) {
        where.published = published;
      }
      
      if (category) {
        where.category = category;
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ];
      }

      return await prisma.news.count({ where });
    },

    // Category queries
    categories: async () => {
      return await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
    },

    category: async (_: any, { id }: { id: string }) => {
      return await prisma.category.findUnique({
        where: { id }
      });
    },

    // User queries
    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: { news: true }
      });
    },

    users: async () => {
      return await prisma.user.findMany({
        include: { news: true }
      });
    },

    me: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      return await prisma.user.findUnique({
        where: { id: context.user.id },
        include: { news: true }
      });
    }
  },

  Mutation: {
    // News mutations
    createNews: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const news = await prisma.news.create({
        data: {
          ...input,
          authorId: context.user.id,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date()
        },
        include: { author: true }
      });

      return news;
    },

    updateNews: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingNews = await prisma.news.findUnique({
        where: { id }
      });

      if (!existingNews) {
        throw new Error('News not found');
      }

      if (existingNews.authorId !== context.user.id && context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const updateData: any = { ...input };
      if (input.publishedAt) {
        updateData.publishedAt = new Date(input.publishedAt);
      }

      const news = await prisma.news.update({
        where: { id },
        data: updateData,
        include: { author: true }
      });

      return news;
    },

    deleteNews: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingNews = await prisma.news.findUnique({
        where: { id }
      });

      if (!existingNews) {
        throw new Error('News not found');
      }

      if (existingNews.authorId !== context.user.id && context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      await prisma.news.delete({
        where: { id }
      });

      return true;
    },

    toggleNewsPublished: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const existingNews = await prisma.news.findUnique({
        where: { id }
      });

      if (!existingNews) {
        throw new Error('News not found');
      }

      if (existingNews.authorId !== context.user.id && context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const news = await prisma.news.update({
        where: { id },
        data: { published: !existingNews.published },
        include: { author: true }
      });

      return news;
    },

    toggleNewsFeatured: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const existingNews = await prisma.news.findUnique({
        where: { id }
      });

      if (!existingNews) {
        throw new Error('News not found');
      }

      const news = await prisma.news.update({
        where: { id },
        data: { featured: !existingNews.featured },
        include: { author: true }
      });

      return news;
    },

    incrementNewsViews: async (_: any, { id }: { id: string }) => {
      const news = await prisma.news.update({
        where: { id },
        data: { views: { increment: 1 } },
        include: { author: true }
      });

      return news;
    },

    likeNews: async (_: any, { id }: { id: string }) => {
      const news = await prisma.news.update({
        where: { id },
        data: { likes: { increment: 1 } },
        include: { author: true }
      });

      return news;
    },

    // Category mutations
    createCategory: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const category = await prisma.category.create({
        data: input
      });

      return category;
    },

    updateCategory: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const category = await prisma.category.update({
        where: { id },
        data: input
      });

      return category;
    },

    deleteCategory: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      await prisma.category.delete({
        where: { id }
      });

      return true;
    },

    // User mutations
    createUser: async (_: any, { input }: { input: any }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword
        },
        include: { news: true }
      });

      return user;
    },

    updateUser: async (_: any, { id, input }: { id: string; input: any }, context: any) => {
      if (!context.user || (context.user.id !== id && context.user.role !== 'ADMIN')) {
        throw new Error('Not authorized');
      }

      const updateData: any = { ...input };
      if (input.password) {
        updateData.password = await bcrypt.hash(input.password, 12);
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { news: true }
      });

      return user;
    },

    deleteUser: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }

      await prisma.user.delete({
        where: { id }
      });

      return true;
    },

    // Auth mutations
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.NEXTAUTH_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return {
        token,
        user
      };
    },

    register: async (_: any, { input }: { input: any }) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: input.email },
            { username: input.username }
          ]
        }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword
        }
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.NEXTAUTH_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return {
        token,
        user
      };
    },

    logout: async () => {
      // В GraphQL logout обычно обрабатывается на клиенте
      // путем удаления токена из localStorage/cookies
      return true;
    }
  }
}; 