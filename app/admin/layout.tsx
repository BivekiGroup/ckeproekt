'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import S3Status from './components/S3Status';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string, password: string) => {
    // Простая проверка (в реальном проекте должна быть серверная авторизация)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', JSON.stringify({ username, role: 'admin' }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  const navigation = [
    { name: 'Новости', href: '/admin/news', icon: FileText },
    { name: 'Настройки', href: '/admin/settings', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильный overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link href="/admin" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">CKE Admin</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-700 space-y-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <S3Status />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Выйти
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">Добро пожаловать, admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// Компонент формы входа
function LoginForm({ onLogin }: { onLogin: (username: string, password: string) => boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }

    const success = onLogin(username, password);
    if (!success) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            CKE Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Войдите в систему управления</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Логин
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Войти
          </button>
        </form>


      </div>
    </div>
  );
} 