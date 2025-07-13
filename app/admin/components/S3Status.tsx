'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface S3StatusProps {
  className?: string;
}

export default function S3Status({ className = '' }: S3StatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'unknown'>('unknown');
  const [error, setError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  
  console.log('S3Status: Компонент инициализирован (версия 2.0)');

  const checkS3Connection = async () => {
    setIsChecking(true);
    setStatus('checking');
    setError('');

    try {
      console.log('S3Status: Проверяю подключение к S3...');
      console.log('S3Status: Используется API /api/test-s3');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
      
      const response = await fetch(`/api/test-s3?t=${Date.now()}`, {
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      console.log('S3Status: Запрос отправлен к /api/test-s3, статус:', response.status);
      
      clearTimeout(timeoutId);
      const result = await response.json();

      console.log('S3Status: Результат проверки:', result);

      if (result.success) {
        setStatus('connected');
        console.log('S3Status: Подключение успешно');
      } else {
        setStatus('error');
        const errorMessage = result.error || 'Ошибка подключения к S3';
        setError(errorMessage);
        console.error('S3Status: Ошибка подключения:', result);
      }
    } catch (err) {
      console.error('S3Status: Исключение при проверке:', err);
      setStatus('error');
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Таймаут подключения к S3 (более 10 секунд)');
      } else {
        setError(err instanceof Error ? err.message : 'Ошибка сети при проверке S3');
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkS3Connection();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Проверка подключения...';
      case 'connected':
        return 'S3 подключено';
      case 'error':
        return 'Ошибка S3';
      default:
        return 'Статус неизвестен';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-400';
      case 'connected':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {status === 'error' && (
        <Button
          variant="outline"
          size="sm"
          onClick={checkS3Connection}
          disabled={isChecking}
          className="ml-2"
        >
          {isChecking ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            'Повторить'
          )}
        </Button>
      )}
      
      {error && (
        <div className="ml-2 text-xs text-red-400 max-w-xs" title={error}>
          <span className="block truncate">{error}</span>
          <span className="block text-xs text-gray-500 mt-1">
            Проверьте консоль для подробностей
          </span>
        </div>
      )}
    </div>
  );
} 