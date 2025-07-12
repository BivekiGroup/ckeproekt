'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Eye, Calendar, TrendingUp, Plus } from 'lucide-react';
import { NEWS_DATA } from '@/lib/news-data';

export default function AdminDashboard() {
  // Подсчет статистики
  const totalNews = NEWS_DATA.length;
  const publishedNews = NEWS_DATA.filter(news => news.published !== false).length;
  const featuredNews = NEWS_DATA.filter(news => news.featured).length;
  const recentNews = NEWS_DATA.filter(news => {
    const publishDate = new Date(news.publishedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return publishDate >= weekAgo;
  }).length;

  const stats = [
    {
      name: 'Всего новостей',
      value: totalNews,
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Опубликовано',
      value: publishedNews,
      icon: Eye,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Рекомендуемые',
      value: featuredNews,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      name: 'За неделю',
      value: recentNews,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  const latestNews = NEWS_DATA
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
          <p className="text-gray-600 mt-2">Обзор системы управления новостями</p>
        </div>
        <Link
          href="/admin/news/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать новость
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Последние новости</h2>
            <Link
              href="/admin/news"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Показать все
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {latestNews.map((news) => (
            <div key={news.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {news.title}
                    </h3>
                    {news.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Рекомендуемое
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      news.published !== false 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {news.published !== false ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(news.publishedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/news/${news.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Редактировать
                  </Link>
                  <Link
                    href={`/news/${news.slug}`}
                    target="_blank"
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Просмотр
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="space-y-3">
            <Link
              href="/admin/news/create"
              className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Создать новость</span>
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">Управление новостями</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика по категориям</h3>
          <div className="space-y-3">
            {['company', 'promotions', 'other'].map((category) => {
              const count = NEWS_DATA.filter(news => news.category === category).length;
              const categoryName = category === 'company' ? 'Новости компании' : 
                                 category === 'promotions' ? 'Акции' : 'Другое';
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{categoryName}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 