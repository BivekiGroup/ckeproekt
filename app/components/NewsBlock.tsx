'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NEWS_CATEGORIES } from '@/lib/types';

interface NewsBlockProps {
  maxNews?: number;
  showFeatured?: boolean;
  title?: string;
  subtitle?: string;
}

export default function NewsBlock({ 
  maxNews = 4, 
  showFeatured = true,
  title = "Последние новости",
  subtitle = "Следите за нашими новостями, акциями и обновлениями"
}: NewsBlockProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalNews, setTotalNews] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', maxNews.toString());
        params.append('published', 'true');
        
        if (showFeatured) {
          params.append('sortBy', 'featured');
          params.append('sortOrder', 'desc');
        } else {
          params.append('sortBy', 'publishedAt');
          params.append('sortOrder', 'desc');
        }
        
        const response = await fetch(`/api/news?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setNews(data.data.news);
          setTotalNews(data.data.pagination.total);
        } else {
          console.error('Error loading news:', data.error);
        }
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [maxNews, showFeatured]);

  const displayNews = news;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId: string) => {
    return NEWS_CATEGORIES.find(cat => cat.id === categoryId);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка новостей...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayNews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Главная новость (если есть важная) */}
        {showFeatured && displayNews[0]?.featured && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
              <div className="lg:flex">
                <div className="lg:w-1/2 relative h-64 lg:h-80">
                  <Image
                    src={displayNews[0].imageUrl || '/images/office.jpg'}
                    alt={displayNews[0].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {getCategoryInfo(displayNews[0].category) && (
                    <div className={`absolute top-6 left-6 px-4 py-2 rounded-full text-white text-sm font-semibold ${getCategoryInfo(displayNews[0].category)?.color} shadow-lg`}>
                      {getCategoryInfo(displayNews[0].category)?.name}
                    </div>
                  )}
                  <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    Важное
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <div className="text-sm text-blue-600 font-semibold mb-4 uppercase tracking-wide">
                    {formatDate(displayNews[0].publishedAt)}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {displayNews[0].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {displayNews[0].summary}
                  </p>
                  <Link
                    href={`/news/${displayNews[0].slug}`}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Читать полностью
                    <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Сетка новостей */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mb-16">
          {displayNews
            .filter((news, index) => !(showFeatured && index === 0 && news.featured))
            .map((news, index) => {
              const categoryInfo = getCategoryInfo(news.category);
              
              return (
                <article 
                  key={news.id} 
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={news.imageUrl || '/images/office.jpg'}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    {categoryInfo && (
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${categoryInfo.color} shadow-lg`}>
                        {categoryInfo.name}
                      </div>
                    )}
                    {news.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        Важное
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <div className="text-sm text-blue-600 font-semibold mb-3 uppercase tracking-wide">
                      {formatDate(news.publishedAt)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {news.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-lg">
                      {news.summary}
                    </p>
                    
                    <Link
                      href={`/news/${news.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 group-hover:translate-x-1 text-lg"
                    >
                      Читать далее
                      <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
        </div>

        {/* Кнопка "Все новости" */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          >
            Все новости
            <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Статистика */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-gray-700 font-medium">
              Показано {displayNews.length} из {totalNews} новостей
            </span>
          </div>
        </div>
      </div>
    </section>
  );
} 