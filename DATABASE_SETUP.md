# Настройка базы данных и системы управления новостями

## Обзор системы

Система управления новостями для ckeproekt.ru включает:

- **База данных**: PostgreSQL с Prisma ORM
- **API**: REST API и GraphQL endpoints
- **Админ-панель**: Полнофункциональная панель управления
- **Безопасность**: JWT аутентификация и авторизация
- **Функциональность**: CRUD операции, пагинация, поиск, фильтрация

## Требования

- Node.js 18+
- PostgreSQL 12+
- npm или yarn

## Установка и настройка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

1. Создайте PostgreSQL базу данных:
```sql
CREATE DATABASE ckeproject;
```

2. Обновите файл `.env` с вашими данными:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ckeproject?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Инициализация Prisma

```bash
# Генерация Prisma Client
npm run db:generate

# Применение схемы к базе данных
npm run db:push

# Заполнение базы данных начальными данными
npm run db:seed
```

### 4. Запуск приложения

```bash
npm run dev
```

## Структура базы данных

### Таблица `users`
- `id` - Уникальный идентификатор
- `email` - Email (уникальный)
- `username` - Имя пользователя (уникальное)
- `password` - Хешированный пароль
- `role` - Роль (USER, ADMIN, EDITOR)
- `name` - Полное имя
- `avatar` - URL аватара
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Таблица `news`
- `id` - Уникальный идентификатор
- `title` - Заголовок новости
- `slug` - URL-слаг (уникальный)
- `summary` - Краткое описание
- `content` - Полное содержание
- `category` - Категория новости
- `imageUrl` - URL изображения
- `featured` - Рекомендуемая новость
- `published` - Статус публикации
- `publishedAt` - Дата публикации
- `authorId` - ID автора
- `views` - Количество просмотров
- `likes` - Количество лайков
- `tags` - Массив тегов
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

### Таблица `categories`
- `id` - Уникальный идентификатор
- `name` - Название категории
- `slug` - URL-слаг (уникальный)
- `description` - Описание
- `color` - Цвет категории
- `createdAt` - Дата создания
- `updatedAt` - Дата обновления

## API Endpoints

### REST API

#### Новости
- `GET /api/news` - Получить список новостей
- `POST /api/news` - Создать новость
- `GET /api/news/[id]` - Получить новость по ID
- `PUT /api/news/[id]` - Обновить новость
- `DELETE /api/news/[id]` - Удалить новость

#### Категории
- `GET /api/categories` - Получить список категорий
- `POST /api/categories` - Создать категорию
- `PUT /api/categories/[id]` - Обновить категорию
- `DELETE /api/categories/[id]` - Удалить категорию

#### Аутентификация
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/logout` - Выход из системы

### GraphQL API

GraphQL endpoint доступен по адресу `/api/graphql`

#### Примеры запросов

```graphql
# Получить список новостей
query {
  newsList(page: 1, limit: 10, category: "company") {
    news {
      id
      title
      summary
      publishedAt
      author {
        name
      }
    }
    total
    totalPages
  }
}

# Создать новость
mutation {
  createNews(input: {
    title: "Новая новость"
    slug: "novaya-novost"
    summary: "Краткое описание"
    content: "Полное содержание"
    category: "company"
    featured: true
  }) {
    id
    title
    slug
  }
}
```

## Админ-панель

Админ-панель доступна по адресу `/admin`

### Пользователи по умолчанию

После выполнения `npm run db:seed` будут созданы:

1. **Администратор**
   - Email: `admin@ckeproekt.ru`
   - Пароль: `admin123`
   - Роль: ADMIN

2. **Редактор**
   - Email: `editor@ckeproekt.ru`
   - Пароль: `editor123`
   - Роль: EDITOR

### Функциональность админ-панели

- ✅ Создание, редактирование и удаление новостей
- ✅ Управление категориями
- ✅ Загрузка изображений
- ✅ Визуальный редактор содержимого
- ✅ Система тегов
- ✅ Управление публикацией
- ✅ Поиск и фильтрация
- ✅ Пагинация
- ✅ Статистика

## Безопасность

### Аутентификация
- JWT токены для авторизации
- Хеширование паролей с bcrypt
- Защищенные API endpoints

### Авторизация
- Роли пользователей (USER, ADMIN, EDITOR)
- Проверка прав доступа на уровне API
- Middleware для защиты маршрутов

### Валидация
- Проверка входных данных
- Санитизация контента
- Защита от XSS и SQL инъекций

## Развертывание в продакшн

### 1. Настройка переменных окружения

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="strong-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### 2. Сборка приложения

```bash
npm run build
```

### 3. Миграция базы данных

```bash
npm run db:migrate
npm run db:seed
```

### 4. Запуск с PM2

```bash
npm run pm2:start
```

## Мониторинг и обслуживание

### Prisma Studio
Для просмотра и редактирования данных:
```bash
npm run db:studio
```

### Логи
Логи доступны через PM2:
```bash
pm2 logs
```

### Резервное копирование
Регулярно создавайте резервные копии базы данных:
```bash
pg_dump ckeproject > backup.sql
```

## Миграция с существующей системы

Скрипт `scripts/init-database.ts` автоматически мигрирует данные из `lib/news-data.ts` в базу данных.

## Поддержка

Для получения поддержки или сообщения об ошибках обращайтесь к разработчикам системы.

## Лицензия

Система разработана специально для ckeproekt.ru и является собственностью компании. 