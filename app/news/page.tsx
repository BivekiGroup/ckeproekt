'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { NEWS_CATEGORIES } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Eye, ArrowRight, TrendingUp, Star, ArrowLeft } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const ITEMS_PER_PAGE = 6;

type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'featured';

export default function NewsPage() {
  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = 'Новости и События - ЦКЭ';
  }, []);

  const [selectedCity, setSelectedCity] = useState<'Москва' | 'Чебоксары'>('Москва');
  
  // Загружаем город из localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity as 'Москва' | 'Чебоксары');
    }
  }, []);

  const handleCityChange = (city: 'Москва' | 'Чебоксары') => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  // Обновление URL при изменении параметров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, searchQuery, sortBy, currentPage, pathname, router]);

  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalNews, setTotalNews] = useState(0);

  // Загрузка новостей с API
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', ITEMS_PER_PAGE.toString());
        params.append('published', 'true');
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery);
        }
        
        // Преобразуем сортировку в формат API
        let sortBy_api = 'publishedAt';
        let sortOrder = 'desc';
        
        switch (sortBy) {
          case 'newest':
            sortBy_api = 'publishedAt';
            sortOrder = 'desc';
            break;
          case 'oldest':
            sortBy_api = 'publishedAt';
            sortOrder = 'asc';
            break;
          case 'alphabetical':
            sortBy_api = 'title';
            sortOrder = 'asc';
            break;
          case 'featured':
            sortBy_api = 'featured';
            sortOrder = 'desc';
            break;
        }
        
        params.append('sortBy', sortBy_api);
        params.append('sortOrder', sortOrder);
        
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
  }, [selectedCategory, searchQuery, sortBy, currentPage]);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Получаем главную новость (первую в отсортированном списке)
  const featuredNews = news.find(item => item.featured) || news[0];
  const otherNews = news.filter(item => item.id !== featuredNews?.id);

  const getSortOptionName = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Сначала новые';
      case 'oldest': return 'Сначала старые';
      case 'alphabetical': return 'По алфавиту';
      case 'featured': return 'Важные первыми';
      default: return 'Сначала новые';
    }
  };

  const totalPages = Math.ceil(totalNews / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header selectedCity={selectedCity} onCityChange={handleCityChange} />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Загрузка новостей...</p>
          </div>
        </main>
        <Footer selectedCity={selectedCity} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header selectedCity={selectedCity} onCityChange={handleCityChange} />
      
      <main className="flex-1 pt-20">
        {/* Хлебные крошки */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Главная
              </Link>
              <span>/</span>
              <span className="text-gray-900">Новости</span>
            </div>
          </div>
        </div>

        {/* Заголовок страницы */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Новости и События
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Следите за последними событиями, достижениями и обновлениями нашей компании
              </p>
            </div>
          </div>
        </section>

        {/* Панель фильтров */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="space-y-6">
                {/* Поиск */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Поиск по заголовку, описанию или содержимому..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-all duration-200"
                  />
                </div>

                {/* Фильтры */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Категории */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-sm">
                      Категория
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedCategory === 'all'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Все
                      </button>
                      {NEWS_CATEGORIES.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Сортировка */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-sm">
                      Сортировка
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value as SortOption)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="newest">Сначала новые</option>
                      <option value="oldest">Сначала старые</option>
                      <option value="alphabetical">По алфавиту</option>
                      <option value="featured">Важные первыми</option>
                    </select>
                  </div>

                  {/* Статистика */}
                  <div className="flex items-center justify-center lg:justify-end">
                    <div className="bg-gray-100 rounded-xl px-6 py-4 border border-gray-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalNews}</div>
                        <div className="text-gray-600 text-sm">найдено</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Главная новость */}
        {currentPage === 1 && featuredNews && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Главная новость
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
              </div>
              
              <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
                <div className="lg:flex">
                  <div className="lg:w-1/2 relative h-64 lg:h-80">
                    <Image
                      src={featuredNews.imageUrl || '/images/office.jpg'}
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      Важное
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2 p-8 lg:p-12">
                    <div className="text-sm text-blue-600 font-semibold mb-4 uppercase tracking-wide">
                      {formatDate(featuredNews.publishedAt)}
                    </div>
                    
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {featuredNews.title}
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {featuredNews.summary}
                    </p>
                    
                    <Link
                      href={`/news/${featuredNews.slug}`}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Читать полностью
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Сетка новостей */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {news.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentPage === 1 && featuredNews ? 'Другие новости' : 'Все новости'}
                  </h2>
                  <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                  {(currentPage === 1 && featuredNews ? otherNews : news).map((newsItem, index) => {
                    const categoryInfo = getCategoryInfo(newsItem.category);
                    
                    return (
                      <article
                        key={newsItem.id}
                        className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={newsItem.imageUrl || '/images/office.jpg'}
                            alt={newsItem.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          
                          {/* Категория */}
                          {categoryInfo && (
                            <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${categoryInfo.color} shadow-lg`}>
                                {categoryInfo.name}
                              </span>
                            </div>
                          )}
                          
                          {/* Дата */}
                          <div className="absolute bottom-4 right-4">
                            <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full">
                              {formatDate(newsItem.publishedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {newsItem.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                            {newsItem.summary}
                          </p>
                          
                          <Link
                            href={`/news/${newsItem.slug}`}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300"
                          >
                            Читать далее
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Новостей не найдено
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    Попробуйте изменить фильтры или поисковый запрос
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setSortBy('newest');
                      setCurrentPage(1);
                    }}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-16">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Назад
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Вперед
                </button>
              </div>
            )}

            {/* Информация о странице */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
                <Eye className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">
                  Страница {currentPage} из {totalPages} • Всего новостей: {totalNews}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer selectedCity={selectedCity} />
    </div>
  );
}