'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Eye, Calendar, TrendingUp, Plus, Users, Database, Activity } from 'lucide-react';

interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  featuredNews: number;
  recentNews: number;
  totalUsers: number;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  views: number;
  likes: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Загружаем статистику
      const healthResponse = await fetch('/api/health');
      const healthData = await healthResponse.json();
      
      // Загружаем все новости для статистики
      const newsResponse = await fetch('/api/news?limit=100&published=all');
      const newsData = await newsResponse.json();
      
      if (newsData.success) {
        const allNews = newsData.data.news;
        const publishedNews = allNews.filter((news: NewsItem) => news.published);
        const featuredNews = allNews.filter((news: NewsItem) => news.featured);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentNews = allNews.filter((news: NewsItem) => {
          const publishDate = new Date(news.publishedAt);
          return publishDate >= weekAgo;
        });

        setStats({
          totalNews: allNews.length,
          publishedNews: publishedNews.length,
          featuredNews: featuredNews.length,
          recentNews: recentNews.length,
          totalUsers: healthData.data?.userCount || 0
        });

        // Берем последние 5 новостей
        setLatestNews(allNews.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats ? [
    {
      name: 'Всего новостей',
      value: stats.totalNews,
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Опубликовано',
      value: stats.publishedNews,
      icon: Eye,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Рекомендуемые',
      value: stats.featuredNews,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'За неделю',
      value: stats.recentNews,
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'Пользователи',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Панель управления
          </h1>
          <p className="text-gray-600 mt-2">Обзор системы управления новостями</p>
        </div>
        <Link
          href="/admin/news/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать новость
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.name} className={`${stat.bgColor} rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} shadow-sm`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Последние новости</h2>
            <Link
              href="/admin/news"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
            >
              Показать все
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {latestNews.map((news) => (
            <div key={news.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate max-w-md">
                      {news.title}
                    </h3>
                    {news.featured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                        ★ Рекомендуемое
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      news.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {news.published ? '✓ Опубликовано' : '📝 Черновик'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-sm text-gray-500">
                      📅 {new Date(news.publishedAt).toLocaleDateString('ru-RU')}
                    </p>
                    <p className="text-sm text-gray-500">
                      👁 {news.views} просмотров
                    </p>
                    <p className="text-sm text-gray-500">
                      ❤️ {news.likes} лайков
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/news/${news.id}/edit`}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Редактировать
                  </Link>
                  <Link
                    href={`/news/${news.slug}`}
                    target="_blank"
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Просмотр
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {latestNews.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Новости не найдены</p>
              <Link
                href="/admin/news/create"
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
              >
                Создать первую новость
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Quick Actions & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-600" />
            Быстрые действия
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/news/create"
              className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Plus className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 ml-3">Создать новость</span>
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors group"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 ml-3">Управление новостями</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors group"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Database className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 ml-3">Настройки</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика по категориям</h3>
          <div className="space-y-4">
            {[
              { id: 'Общие новости', name: 'Общие новости', color: 'bg-blue-500' },
              { id: 'Обследование канализации', name: 'Канализация', color: 'bg-green-500' },
              { id: 'Тепловизионная экспертиза', name: 'Тепловизор', color: 'bg-purple-500' },
              { id: 'Экспертиза при заливе', name: 'Залив', color: 'bg-red-500' },
              { id: 'Строительная экспертиза', name: 'Строительство', color: 'bg-yellow-500' }
            ].map((category) => {
              const count = latestNews.filter(news => news.category === category.id).length;
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Система</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">База данных</span>
              <span className="text-sm font-medium text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Подключена
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">S3 хранилище</span>
              <span className="text-sm font-medium text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Активно
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Версия</span>
              <span className="text-sm font-medium text-gray-900">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 