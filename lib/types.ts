export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  publishedAt: string;
  imageUrl?: string;
  slug: string;
  featured?: boolean;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsCategory = 'company' | 'promotions' | 'other';

export interface NewsCategoryInfo {
  id: NewsCategory;
  name: string;
  description: string;
  color: string;
}

export const NEWS_CATEGORIES: NewsCategoryInfo[] = [
  {
    id: 'company',
    name: 'Новости компании',
    description: 'Корпоративные новости и обновления',
    color: 'bg-blue-500'
  },
  {
    id: 'promotions',
    name: 'Акции',
    description: 'Специальные предложения и скидки',
    color: 'bg-green-500'
  },
  {
    id: 'other',
    name: 'Другое',
    description: 'Прочие новости и объявления',
    color: 'bg-gray-500'
  }
];

// Типы для административной панели
export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'editor';
}

export interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  tags: string[];
} 