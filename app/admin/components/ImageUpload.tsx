'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Проверка типа файла
    if (!acceptedTypes.includes(file.type)) {
      return `Неподдерживаемый тип файла. Разрешены: ${acceptedTypes.join(', ')}`;
    }

    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      return `Файл слишком большой. Максимальный размер: ${maxSize} MB`;
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // В реальном приложении здесь будет загрузка на сервер
      // Для демонстрации используем FileReader для создания data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Ошибка при загрузке файла');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Ошибка при загрузке файла');
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleRemove = () => {
    onRemove();
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        // Предварительный просмотр изображения
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border border-gray-200"
          />
          
          {/* Overlay с действиями */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={openFileDialog}
                className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                title="Заменить изображение"
              >
                <Upload className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Удалить изображение"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Область загрузки
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={!isUploading ? openFileDialog : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Загрузка...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Нажмите для выбора</span> или перетащите файл сюда
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WEBP до {maxSize} MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Скрытый input для выбора файла */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Сообщение об ошибке */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Информация о файле */}
      {value && !error && (
        <div className="text-xs text-gray-500">
          <p>Изображение загружено успешно</p>
        </div>
      )}
    </div>
  );
} 