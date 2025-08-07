'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, Tag, Loader2 } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  author?: {
    id: string;
    name?: string;
    username: string;
  };
}

interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const DEFAULT_CATEGORIES: NewsCategory[] = [
  { id: 'company', name: 'Новости компании', slug: 'company', color: 'bg-blue-500' },
  { id: 'promotions', name: 'Акции', slug: 'promotions', color: 'bg-green-500' },
  { id: 'other', name: 'Другое', slug: 'other', color: 'bg-purple-500' }
];

export default function AdminNewsPage() {
  const [categories, setCategories] = useState<NewsCategory[]>(DEFAULT_CATEGORIES);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadNews();
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (res.ok && data?.data?.length) {
          setCategories(data.data.map((c: any) => ({ id: c.slug, name: c.name, slug: c.slug, color: c.color || 'bg-blue-500' })));
        }
      } catch {}
    })();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '100');
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery);
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      // Для админки показываем все новости
      if (selectedStatus === 'published') {
        params.append('published', 'true');
      } else if (selectedStatus === 'draft') {
        params.append('published', 'false');
      } else if (selectedStatus === 'featured') {
        params.append('featured', 'true');
      }

      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data.news);
      } else {
        console.error('Error loading news:', data.error);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryInfo = (categoryId: string) => categories.find(cat => cat.id === categoryId);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setNews(news.filter(item => item.id !== id));
      } else {
        console.error('Error deleting news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const togglePublished = async (id: string) => {
    try {
      const newsItem = news.find(item => item.id === id);
      if (!newsItem) return;

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          published: !newsItem.published
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNews(news.map(item => 
            item.id === id ? { ...item, published: !item.published } : item
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const newsItem = news.find(item => item.id === id);
      if (!newsItem) return;

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          featured: !newsItem.featured
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNews(news.map(item => 
            item.id === id ? { ...item, featured: !item.featured } : item
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Загрузка новостей...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление новостями</h1>
          <p className="text-gray-600 mt-2">Создание, редактирование и публикация новостей</p>
        </div>
        <Link
          href="/admin/news/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать новость
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все статусы</option>
            <option value="published">Опубликовано</option>
            <option value="draft">Черновик</option>
            <option value="featured">Рекомендуемые</option>
          </select>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="publishedAt">По дате</option>
              <option value="title">По названию</option>
              <option value="views">По просмотрам</option>
              <option value="likes">По лайкам</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Новости ({news.length})
            </h2>
          </div>
        </div>

        {news.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {news.map((newsItem) => {
              const categoryInfo = getCategoryInfo(newsItem.category);
              
              return (
                <div key={newsItem.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {newsItem.title}
                        </h3>
                        {categoryInfo && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </span>
                        )}
                        {newsItem.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Рекомендуемое
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          newsItem.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {newsItem.published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mb-1">
                        {newsItem.summary}
                      </p>
                      <div className="flex items-center text-xs text-gray-400 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(newsItem.publishedAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {newsItem.views} просмотров
                        </span>
                        <span className="flex items-center">
                          ❤️ {newsItem.likes} лайков
                        </span>
                        {newsItem.author && (
                          <span>
                            Автор: {newsItem.author.name || newsItem.author.username}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(newsItem.id)}
                        className={`p-2 rounded-md transition-colors ${
                          newsItem.featured 
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title="Рекомендуемое"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => togglePublished(newsItem.id)}
                        className={`p-2 rounded-md transition-colors ${
                          newsItem.published 
                            ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title="Опубликовано"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <Link
                        href={`/admin/news/${newsItem.id}/edit`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/news/${newsItem.slug}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                        title="Просмотр"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(newsItem.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Новости не найдены
            </h3>
            <p className="text-gray-500">
              Попробуйте изменить фильтры или создать новую новость
            </p>
            <Link
              href="/admin/news/create"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать новость
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 