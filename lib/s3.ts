import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Инициализация S3 клиента
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'ru-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Важно для совместимости с некоторыми S3-совместимыми сервисами
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export interface UploadResult {
  key: string;
  url: string;
  publicUrl: string;
}

/**
 * Загружает файл в S3 хранилище
 * @param file - Файл для загрузки
 * @param folder - Папка в S3 (например, 'images', 'documents')
 * @param fileName - Имя файла (опционально, если не указано - генерируется автоматически)
 * @returns Promise<UploadResult>
 */
export async function uploadFileToS3(
  file: Buffer | Uint8Array,
  contentType: string,
  folder: string = 'uploads',
  fileName?: string
): Promise<UploadResult> {
  try {
    // Генерируем уникальное имя файла, если не указано
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = contentType.split('/')[1];
    const finalFileName = fileName || `${timestamp}_${randomString}.${extension}`;
    
    // Формируем ключ для S3
    const key = `${folder}/${finalFileName}`;
    
    // Команда для загрузки файла
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      // Делаем файл публично доступным
      ACL: 'public-read',
    });
    
    await s3Client.send(command);
    
    // Формируем URL для доступа к файлу
    const publicUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
    
    return {
      key,
      url: publicUrl,
      publicUrl,
    };
  } catch (error) {
    console.error('Ошибка при загрузке файла в S3:', error);
    throw new Error('Не удалось загрузить файл');
  }
}

/**
 * Удаляет файл из S3 хранилища
 * @param key - Ключ файла в S3
 * @returns Promise<void>
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Ошибка при удалении файла из S3:', error);
    throw new Error('Не удалось удалить файл');
  }
}

/**
 * Получает подписанный URL для временного доступа к файлу
 * @param key - Ключ файла в S3
 * @param expiresIn - Время жизни ссылки в секундах (по умолчанию 1 час)
 * @returns Promise<string>
 */
export async function getSignedUrlFromS3(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Ошибка при получении подписанного URL:', error);
    throw new Error('Не удалось получить ссылку на файл');
  }
}

/**
 * Получает публичный URL файла
 * @param key - Ключ файла в S3
 * @returns string
 */
export function getPublicUrlFromS3(key: string): string {
  return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`;
}

/**
 * Извлекает ключ файла из публичного URL
 * @param url - Публичный URL файла
 * @returns string | null
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const baseUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/`;
    if (url.startsWith(baseUrl)) {
      return url.replace(baseUrl, '');
    }
    return null;
  } catch (error) {
    console.error('Ошибка при извлечении ключа из URL:', error);
    return null;
  }
}

/**
 * Проверяет, является ли URL ссылкой на файл в S3
 * @param url - URL для проверки
 * @returns boolean
 */
export function isS3Url(url: string): boolean {
  const baseUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/`;
  return url.startsWith(baseUrl);
}

export default s3Client; 