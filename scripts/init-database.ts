import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';
import { NEWS_DATA } from '../lib/news-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Initializing database...');

  try {
    // Создаем категории по умолчанию
    console.log('📂 Creating default categories...');
    
    const categories = [
      { 
        name: 'Новости компании', 
        slug: 'company', 
        color: '#3B82F6',
        description: 'Корпоративные новости и объявления' 
      },
      { 
        name: 'Акции', 
        slug: 'promotions', 
        color: '#10B981',
        description: 'Специальные предложения и акции' 
      },
      { 
        name: 'Другое', 
        slug: 'other', 
        color: '#8B5CF6',
        description: 'Прочие новости и события' 
      }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      });
      console.log(`✅ Category "${category.name}" created/updated`);
    }

    // Создаем администратора по умолчанию
    console.log('👤 Creating default admin user...');
    
    const adminPassword = await hashPassword('admin123');
    
    await prisma.user.upsert({
      where: { email: 'admin@ckeproekt.ru' },
      update: {},
      create: {
        email: 'admin@ckeproekt.ru',
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
        name: 'Администратор'
      }
    });
    
    console.log('✅ Admin user created/updated');

    // Создаем редактора по умолчанию
    console.log('👤 Creating default editor user...');
    
    const editorPassword = await hashPassword('editor123');
    
    const editor = await prisma.user.upsert({
      where: { email: 'editor@ckeproekt.ru' },
      update: {},
      create: {
        email: 'editor@ckeproekt.ru',
        username: 'editor',
        password: editorPassword,
        role: 'EDITOR',
        name: 'Редактор'
      }
    });
    
    console.log('✅ Editor user created/updated');

    // Мигрируем существующие новости
    console.log('📰 Migrating existing news...');
    
    for (const newsItem of NEWS_DATA) {
      try {
        await prisma.news.upsert({
          where: { slug: newsItem.slug },
          update: {
            title: newsItem.title,
            summary: newsItem.summary,
            content: newsItem.content,
            category: newsItem.category,
            imageUrl: newsItem.imageUrl,
            featured: newsItem.featured || false,
            published: newsItem.published !== false,
            publishedAt: new Date(newsItem.publishedAt),
            tags: []
          },
          create: {
            title: newsItem.title,
            slug: newsItem.slug,
            summary: newsItem.summary,
            content: newsItem.content,
            category: newsItem.category,
            imageUrl: newsItem.imageUrl,
            featured: newsItem.featured || false,
            published: newsItem.published !== false,
            publishedAt: new Date(newsItem.publishedAt),
            authorId: editor.id,
            tags: []
          }
        });
        
        console.log(`✅ News "${newsItem.title}" migrated`);
      } catch (error) {
        console.error(`❌ Error migrating news "${newsItem.title}":`, error);
      }
    }

    // Получаем статистику
    console.log('📊 Database statistics:');
    
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.news.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.news.count({ where: { featured: true } })
    ]);
    
    console.log(`👥 Users: ${stats[0]}`);
    console.log(`📂 Categories: ${stats[1]}`);
    console.log(`📰 Total news: ${stats[2]}`);
    console.log(`📢 Published news: ${stats[3]}`);
    console.log(`⭐ Featured news: ${stats[4]}`);

    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Unexpected error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 