# Настройка S3 хранилища

## Обзор

В проекте настроено подключение к S3-совместимому хранилищу для загрузки и хранения файлов. Используется сервис TWC Storage.

## Конфигурация

### Переменные окружения

В файле `.env` добавлены следующие переменные:

```env
# S3 Configuration
S3_ENDPOINT="https://s3.twcstorage.ru"
S3_BUCKET_NAME="617774af-ckeproekt"
S3_ACCESS_KEY_ID="I6XD2OR7YO2ZN6L6Z629"
S3_SECRET_ACCESS_KEY="9xCOoafisG0aB9lJNvdLO1UuK73fBvMcpHMdijrJ"
S3_REGION="ru-1"

# Swift Configuration (альтернативный доступ)
SWIFT_URL="https://swift.twcstorage.ru"
SWIFT_ACCESS_KEY="wu14330:swift"
SWIFT_SECRET_ACCESS_KEY="Zh6NYPbgp4IYmzKeMAUgwZFi8uLY4VpS6SIYMDge"
```

## Использование

### API для загрузки файлов

**Эндпоинт:** `/api/upload`

**Методы:**
- `POST` - загрузка файла
- `DELETE` - удаление файла

#### Загрузка файла

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'images'); // опционально, по умолчанию 'uploads'
formData.append('oldUrl', oldFileUrl); // опционально, для замены существующего файла

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
// result.data содержит: { key, url, publicUrl }
```

#### Удаление файла

```javascript
const response = await fetch(`/api/upload?url=${encodeURIComponent(fileUrl)}`, {
  method: 'DELETE',
});
```

### Хук useFileUpload

Для упрощения работы с файлами создан хук `useFileUpload`:

```javascript
import { useFileUpload } from '@/lib/hooks/useFileUpload';

function MyComponent() {
  const { uploadFile, deleteFile, isUploading, error, clearError } = useFileUpload();

  const handleUpload = async (file) => {
    try {
      const result = await uploadFile(file, {
        folder: 'images',
        maxSize: 5, // MB
        allowedTypes: ['image/jpeg', 'image/png']
      });
      console.log('Файл загружен:', result.publicUrl);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    }
  };

  return (
    <div>
      {isUploading && <p>Загрузка...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <input type="file" onChange={e => handleUpload(e.target.files[0])} />
    </div>
  );
}
```

### Утилиты для работы с S3

В файле `lib/s3.ts` доступны следующие функции:

```javascript
import { 
  uploadFileToS3, 
  deleteFileFromS3, 
  getSignedUrlFromS3, 
  getPublicUrlFromS3,
  extractKeyFromUrl,
  isS3Url 
} from '@/lib/s3';

// Загрузка файла
const result = await uploadFileToS3(buffer, contentType, folder, fileName);

// Удаление файла
await deleteFileFromS3(key);

// Получение подписанного URL (для приватных файлов)
const signedUrl = await getSignedUrlFromS3(key, 3600); // 1 час

// Получение публичного URL
const publicUrl = getPublicUrlFromS3(key);

// Извлечение ключа из URL
const key = extractKeyFromUrl(url);

// Проверка, является ли URL ссылкой на S3
const isS3File = isS3Url(url);
```

## Компоненты

### ImageUpload

Компонент `ImageUpload` обновлен для работы с S3:

```javascript
import ImageUpload from '@/app/admin/components/ImageUpload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  onRemove={() => setImageUrl('')}
  maxSize={5} // MB
  acceptedTypes={['image/jpeg', 'image/png']}
/>
```

### S3Status

Компонент для отображения статуса подключения к S3:

```javascript
import S3Status from '@/app/admin/components/S3Status';

<S3Status className="my-custom-class" />
```

## Миграция существующих изображений

Для миграции существующих изображений в S3 используйте команду:

```bash
npm run migrate:images
```

Скрипт:
1. Найдет все изображения в папках `public/images`
2. Загрузит их в S3
3. Создаст файл `image-mapping.json` с соответствием старых и новых URL

## Ограничения

- Максимальный размер файла: 10MB
- Поддерживаемые типы файлов:
  - Изображения: JPEG, PNG, GIF, WebP, SVG
  - Документы: PDF, DOC, DOCX

## Структура папок в S3

```
bucket/
├── images/          # Изображения
├── documents/       # Документы
├── uploads/         # Общие загрузки
├── certificates/    # Сертификаты
├── placeholders/    # Плейсхолдеры
└── test/           # Тестовые файлы
```

## Мониторинг

Статус подключения к S3 отображается в админ-панели в левом сайдбаре. Компонент автоматически проверяет подключение при загрузке и позволяет повторить проверку в случае ошибки.

## Безопасность

- Все файлы загружаются как публично доступные
- Для приватных файлов используйте подписанные URL
- Валидация типов и размеров файлов происходит на клиенте и сервере
- Старые файлы автоматически удаляются при замене

## Troubleshooting

### Ошибка "Файл не найден"
- Проверьте, что файл выбран корректно
- Убедитесь, что размер файла не превышает лимит

### Ошибка подключения к S3
- Проверьте переменные окружения
- Убедитесь, что S3 сервис доступен
- Проверьте права доступа к бакету

### Ошибка "Неподдерживаемый тип файла"
- Проверьте список разрешенных типов файлов
- Убедитесь, что MIME-тип файла корректен 