'use client';

import React, { useEffect, useState } from 'react';
import { Save, Plus, Edit, Trash2, Settings as SettingsIcon, Palette, Globe, Lock, Mail } from 'lucide-react';
import { NewsCategory, NewsCategoryInfo } from '@/lib/types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('categories');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [categories, setCategories] = useState<NewsCategoryInfo[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: 'bg-blue-500'
  });

  const [generalSettings, setGeneralSettings] = useState({
    siteTitle: 'CKE Project',
    newsPerPage: 10,
    autoPublish: true,
    requireModeration: false,
    allowComments: false,
    emailNotifications: true
  });

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Синий', color: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Зеленый', color: 'bg-green-500' },
    { value: 'bg-red-500', label: 'Красный', color: 'bg-red-500' },
    { value: 'bg-yellow-500', label: 'Желтый', color: 'bg-yellow-500' },
    { value: 'bg-purple-500', label: 'Фиолетовый', color: 'bg-purple-500' },
    { value: 'bg-pink-500', label: 'Розовый', color: 'bg-pink-500' },
    { value: 'bg-indigo-500', label: 'Индиго', color: 'bg-indigo-500' },
    { value: 'bg-gray-500', label: 'Серый', color: 'bg-gray-500' }
  ];

  const tabs = [
    { id: 'categories', name: 'Категории', icon: Palette },
    { id: 'general', name: 'Общие', icon: SettingsIcon },
    { id: 'security', name: 'Безопасность', icon: Lock },
    { id: 'seo', name: 'SEO', icon: Globe }
  ];

  const [security, setSecurity] = useState({
    email: 'admin@ckeproekt.ru',
    username: 'admin',
    currentPassword: '',
    newPassword: '',
    isSaving: false,
    message: '' as string | null,
    error: '' as string | null,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setSecurity(prev => ({ ...prev, email: data.user.email, username: data.user.username }));
        }
      } catch {}
    })();
  }, []);

  // загрузка категорий из БД
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const mapped: NewsCategoryInfo[] = (data.data || []).map((c: any) => ({
          id: c.slug as NewsCategory,
          name: c.name,
          description: c.description || '',
          color: c.color || 'bg-blue-500'
        }));
        setCategories(mapped);
      } catch {}
    })();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.name, description: newCategory.description, color: newCategory.color })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка создания категории');
      // Преобразуем к локальному типу
      const created: NewsCategoryInfo = {
        id: data.data.slug as NewsCategory,
        name: data.data.name,
        description: data.data.description || '',
        color: data.data.color || 'bg-blue-500'
      };
      setCategories(prev => [...prev, created]);
      setNewCategory({ name: '', description: '', color: 'bg-blue-500' });
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    try {
      // нужно найти id категории по slug через /api/categories (у нас в списке нет db id),
      // поэтому запрашиваем полный список и ищем совпадение
      const resList = await fetch('/api/categories');
      const list = await resList.json();
      const match = (list.data || []).find((c: any) => c.slug === slug);
      if (!match) throw new Error('Категория не найдена');

      const res = await fetch(`/api/categories/${match.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления');
      setCategories(prev => prev.filter(cat => cat.id !== slug));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    try {
      // пока сохраняем только generalSettings (к примеру локально)
      console.log('Saving settings:', { generalSettings });
      await new Promise(r => setTimeout(r, 500));
      alert('Настройки сохранены');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-2">Управление настройками системы новостей</p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Управление категориями</h3>
                <p className="text-sm text-gray-500 mb-4">Категории синхронизируются с базой данных</p>
                
                {/* Add New Category */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Добавить новую категорию</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Название категории"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Описание"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <select
                        value={newCategory.color}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {colorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                 {/* Categories List */}
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <div>
                          <h5 className="font-medium text-gray-900">{category.name}</h5>
                          <p className="text-sm text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                         {/* Редактирование можно добавить при необходимости */}
                        <button
                           onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Общие настройки</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название сайта
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteTitle}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Новостей на странице
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={generalSettings.newsPerPage}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, newsPerPage: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      id="autoPublish"
                      type="checkbox"
                      checked={generalSettings.autoPublish}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoPublish: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="autoPublish" className="text-sm font-medium text-gray-700">
                      Автоматически публиковать новости
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      id="requireModeration"
                      type="checkbox"
                      checked={generalSettings.requireModeration}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, requireModeration: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requireModeration" className="text-sm font-medium text-gray-700">
                      Требовать модерацию
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      id="allowComments"
                      type="checkbox"
                      checked={generalSettings.allowComments}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowComments" className="text-sm font-medium text-gray-700">
                      Разрешить комментарии
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      checked={generalSettings.emailNotifications}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                      Email уведомления
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO настройки</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Мета-описание для страницы новостей
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Описание страницы новостей для поисковых систем"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ключевые слова
                    </label>
                    <input
                      type="text"
                      placeholder="новости, компания, акции"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Open Graph изображение
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/og-image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Card тип
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Учетные данные администратора</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={security.email}
                      onChange={(e) => setSecurity(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin@ckeproekt.ru"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Логин</label>
                    <input
                      type="text"
                      value={security.username}
                      onChange={(e) => setSecurity(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Введите текущий пароль"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Оставьте пустым, чтобы не менять"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    disabled={security.isSaving}
                    onClick={async () => {
                      setSecurity(prev => ({ ...prev, isSaving: true, message: null, error: null }));
                      try {
                        const res = await fetch('/api/admin/credentials', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: security.email,
                            username: security.username,
                            currentPassword: security.currentPassword,
                            newPassword: security.newPassword || undefined,
                          })
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || 'Ошибка сохранения');
                        setSecurity(prev => ({ ...prev, message: 'Изменения сохранены', currentPassword: '', newPassword: '' }));
                      } catch (e: any) {
                        setSecurity(prev => ({ ...prev, error: e.message || 'Ошибка' }));
                      } finally {
                        setSecurity(prev => ({ ...prev, isSaving: false }));
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {security.isSaving ? 'Сохранение...' : 'Сохранить учетные данные'}
                  </button>
                </div>
                {security.message && <p className="text-green-600 text-sm mt-2">{security.message}</p>}
                {security.error && <p className="text-red-600 text-sm mt-2">{security.error}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 