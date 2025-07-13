import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function GET() {
  const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'ru-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });

  const bucketName = process.env.S3_BUCKET_NAME!;
  const testKey = `test/health-check-${Date.now()}.txt`;

  try {
    // Шаг 1: Проверяем переменные окружения
    if (!process.env.S3_ENDPOINT) {
      throw new Error('S3_ENDPOINT не настроен');
    }
    if (!process.env.S3_BUCKET_NAME) {
      throw new Error('S3_BUCKET_NAME не настроен');
    }
    if (!process.env.S3_ACCESS_KEY_ID) {
      throw new Error('S3_ACCESS_KEY_ID не настроен');
    }
    if (!process.env.S3_SECRET_ACCESS_KEY) {
      throw new Error('S3_SECRET_ACCESS_KEY не настроен');
    }

    // Шаг 2: Пробуем загрузить тестовый файл
    const testData = Buffer.from('S3 health check test');
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: testData,
      ContentType: 'text/plain',
    });

    const uploadResult = await s3Client.send(putCommand);
    
    // Шаг 3: Пробуем удалить тестовый файл
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: testKey,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: 'S3 подключение работает нормально',
      details: {
        endpoint: process.env.S3_ENDPOINT,
        bucket: bucketName,
        region: process.env.S3_REGION,
        uploadResult: {
          httpStatusCode: uploadResult.$metadata.httpStatusCode,
          etag: uploadResult.ETag,
        }
      }
    });

  } catch (error) {
    console.error('S3 Health Check Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      details: {
        endpoint: process.env.S3_ENDPOINT,
        bucket: bucketName,
        region: process.env.S3_REGION,
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorCode: (error as any)?.code,
        errorStatusCode: (error as any)?.$metadata?.httpStatusCode,
      }
    }, { status: 500 });
  }
} 