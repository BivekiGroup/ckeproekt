import { useState, useCallback } from 'react';

export interface UploadOptions {
  folder?: string;
  maxSize?: number; // в MB
  allowedTypes?: string[];
}

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
}

export interface UseFileUploadReturn {
  uploadFile: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  deleteFile: (url: string) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadFile = useCallback(async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    const {
      folder = 'uploads',
      maxSize = 10,
      allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
    } = options;

    setIsUploading(true);
    setError(null);

    try {
      // Валидация размера файла
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`Файл слишком большой. Максимальный размер: ${maxSize} MB`);
      }

      // Валидация типа файла
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при загрузке файла');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке файла';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (url: string): Promise<void> => {
    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при удалении файла');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении файла';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    uploadFile,
    deleteFile,
    isUploading,
    error,
    clearError,
  };
} 