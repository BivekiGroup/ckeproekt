import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// категории будем подтягивать с API

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getBaseUrl() {
  const explicit =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXTAUTH_URL;
  
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const port = process.env.PORT || '3000';
  return `http://127.0.0.1:${port}`;
}

function buildApiUrl(path: string, searchParams?: Record<string, string | undefined>) {
  const url = new URL(path, `${getBaseUrl()}/`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

// Функция для получения новости по slug из API
async function getNewsFromApi(slug: string) {
  try {
    const response = await fetch(buildApiUrl('/api/news', { slug }), {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    if (data.success && data.data.news.length > 0) {
      const [news] = data.data.news;
      if (!news.published) {
        return null;
      }
      return news;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

// Функция для получения связанных новостей
async function getRelatedNews(category: string, currentSlug: string) {
  try {
    const response = await fetch(buildApiUrl('/api/news', { category, limit: '4' }), {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    if (data.success) {
      return data.data.news.filter((item: { slug: string }) => item.slug !== currentSlug);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
}

async function getCategoryInfo(categoryId: string) {
  try {
    const response = await fetch(buildApiUrl('/api/categories'), { cache: 'no-store' });
    const data = await response.json();
    if (response.ok && data?.data?.length) {
      return data.data.find((c: any) => c.slug === categoryId) ?? null;
    }
  } catch (error) {
    console.error('Error fetching category info:', error);
  }
  return null;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const news = await getNewsFromApi(decodedSlug);

  if (!news) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryInfo = await getCategoryInfo(news.category);

  // Получаем связанные новости (из той же категории, исключая текущую)
  const relatedNews = await getRelatedNews(news.category, news.slug);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/news"
              className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Все новости</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {categoryInfo && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryInfo.color?.startsWith('#') ? '' : categoryInfo.color || 'bg-blue-500'
                  }`}
                  style={
                    categoryInfo.color?.startsWith('#')
                      ? { backgroundColor: categoryInfo.color, color: '#fff' }
                      : undefined
                  }
                >
                  {categoryInfo.name}
                </span>
              )}
              <div className="text-sm text-gray-400">
                {formatDate(news.publishedAt)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={news.imageUrl || '/images/office.jpg'}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex items-center justify-center gap-4">
              {news.featured && (
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full">
                  ВАЖНОЕ
                </span>
              )}
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                5 МИН ЧТЕНИЯ
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              {news.title}
            </h1>

            {/* Summary */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {news.summary}
            </p>

            {/* Scroll Indicator */}
            <div className="pt-16">
              <div className="flex flex-col items-center space-y-2 text-white/60">
                <span className="text-sm uppercase tracking-wide">Прокрутите вниз</span>
                <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative bg-white text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Article Content */}
          <div className="prose prose-xl max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>

          {/* Share Section */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Поделиться статьей
              </h3>
              <p className="text-gray-600 mb-8">
                Расскажите об этой новости в социальных сетях
              </p>
              <div className="flex justify-center space-x-4">
                <button className="group flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  <span>Twitter</span>
                </button>
                <button className="group flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                <button className="group flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Поделиться</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related News - Full Width */}
      {relatedNews.length > 0 && (
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Похожие новости
              </h2>
              <p className="text-xl text-gray-400">
                Другие материалы из категории &quot;{categoryInfo?.name}&quot;
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedNews.map((relatedNewsItem: any) => (
                <Link
                  key={relatedNewsItem.id}
                  href={`/news/${relatedNewsItem.slug}`}
                  className="group block"
                >
                  <article className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-700 transition-all duration-500 transform hover:scale-105">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedNewsItem.imageUrl || '/images/office.jpg'}
                        alt={relatedNewsItem.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-sm text-blue-400 font-semibold mb-2 uppercase tracking-wide">
                        {formatDate(relatedNewsItem.publishedAt)}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                        {relatedNewsItem.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                        {relatedNewsItem.summary}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Width CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Не пропустите важные новости
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Подписывайтесь на обновления и будьте в курсе всех событий и достижений нашей компании
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/news"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Все новости
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Главная страница
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}

// Генерация статических параметров для всех новостей
export async function generateStaticParams() {
  // Для динамического рендеринга возвращаем пустой массив
  return [];
}

// Метаданные для SEO
export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsFromApi(decodeURIComponent(slug));
  
  if (!news) {
    return {
      title: 'Новость не найдена',
    };
  }

  return {
    title: `${news.title} | CKE Project`,
    description: news.summary,
    openGraph: {
      title: news.title,
      description: news.summary,
      images: news.imageUrl ? [news.imageUrl] : [],
    },
  };
} 
