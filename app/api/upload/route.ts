import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToS3, deleteFileFromS3, extractKeyFromUrl } from '@/lib/s3';

export async function POST(request: NextRequest) {
  console.log('API Upload: Получен запрос POST');
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const oldUrl = formData.get('oldUrl') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверяем размер файла (максимум 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 10MB' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', // Для тестирования S3Status
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Неподдерживаемый тип файла' },
        { status: 400 }
      );
    }

    // Если есть старый файл, удаляем его
    if (oldUrl) {
      const oldKey = extractKeyFromUrl(oldUrl);
      if (oldKey) {
        try {
          await deleteFileFromS3(oldKey);
        } catch (error) {
          console.error('Ошибка при удалении старого файла:', error);
          // Не прерываем процесс, если не удалось удалить старый файл
        }
      }
    }

    // Конвертируем файл в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Загружаем файл в S3
    const result = await uploadFileToS3(
      buffer,
      file.type,
      folder,
      file.name
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Файл успешно загружен'
    });

  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке файла' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL файла не указан' },
        { status: 400 }
      );
    }

    const key = extractKeyFromUrl(url);
    if (!key) {
      return NextResponse.json(
        { error: 'Некорректный URL файла' },
        { status: 400 }
      );
    }

    await deleteFileFromS3(key);

    return NextResponse.json({
      success: true,
      message: 'Файл успешно удален'
    });

  } catch (error) {
    console.error('Ошибка при удалении файла:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении файла' },
      { status: 500 }
    );
  }
} 