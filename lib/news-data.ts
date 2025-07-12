import { NewsItem } from './types';

export const NEWS_DATA: NewsItem[] = [
  {
    id: '1',
    title: 'Новые возможности экспертизы недвижимости',
    summary: 'Мы расширили спектр услуг по экспертизе недвижимости, добавив новые методы оценки и анализа.',
    content: `
      <p>Компания CKE Project рада объявить о значительном расширении наших услуг по экспертизе недвижимости. Мы внедрили новейшие технологии и методики оценки, которые позволяют нам предоставлять еще более точные и детальные отчеты.</p>
      
      <h3>Что нового:</h3>
      <ul>
        <li>Тепловизионная диагностика зданий</li>
        <li>3D-сканирование помещений</li>
        <li>Анализ влажности и микроклимата</li>
        <li>Оценка энергоэффективности</li>
      </ul>
      
      <p>Эти нововведения позволяют нам выявлять скрытые дефекты и проблемы, которые могут повлиять на стоимость и безопасность недвижимости.</p>
    `,
    category: 'company',
    publishedAt: '2024-01-15T10:00:00Z',
    imageUrl: '/images/office.jpg',
    slug: 'novye-vozmozhnosti-ekspertizy-nedvizhimosti',
    featured: true,
    published: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    title: 'Скидка 20% на строительный контроль',
    summary: 'Специальное предложение для новых клиентов - скидка 20% на услуги строительного контроля.',
    content: `
      <p>До конца месяца действует специальное предложение для новых клиентов - скидка 20% на все услуги строительного контроля!</p>
      
      <h3>Условия акции:</h3>
      <ul>
        <li>Скидка действует только для новых клиентов</li>
        <li>Минимальная сумма заказа - 50 000 рублей</li>
        <li>Акция действует до 31 января 2024 года</li>
        <li>Скидка не суммируется с другими предложениями</li>
      </ul>
      
      <p>Не упустите возможность получить качественные услуги строительного контроля по выгодной цене!</p>
    `,
    category: 'promotions',
    publishedAt: '2024-01-10T14:30:00Z',
    imageUrl: '/images/placeholders/services/construction-control.jpg',
    slug: 'skidka-20-na-stroitelnyj-kontrol',
    featured: true,
    published: true,
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z'
  },
  {
    id: '3',
    title: 'Получена лицензия СРО',
    summary: 'Наша компания успешно получила лицензию СРО, что подтверждает высокое качество наших услуг.',
    content: `
      <p>CKE Project гордится сообщить о получении лицензии СРО (Саморегулируемая организация), что является важным этапом в развитии нашей компании.</p>
      
      <p>Получение лицензии СРО подтверждает:</p>
      <ul>
        <li>Соответствие всем требованиям и стандартам отрасли</li>
        <li>Высокую квалификацию наших специалистов</li>
        <li>Надежность и профессионализм компании</li>
        <li>Возможность выполнения работ любой сложности</li>
      </ul>
      
      <p>Теперь мы можем предоставлять еще более широкий спектр услуг с официальными гарантиями качества.</p>
    `,
    category: 'company',
    publishedAt: '2024-01-05T09:00:00Z',
    imageUrl: '/images/certificates/sro.jpg',
    slug: 'poluchena-licenziya-sro',
    featured: false,
    published: true,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z'
  },
  {
    id: '4',
    title: 'Новый офис в центре города',
    summary: 'Открытие нового офиса в центре города для удобства наших клиентов.',
    content: `
      <p>Мы рады объявить об открытии нового офиса в центре города по адресу: ул. Центральная, 123.</p>
      
      <h3>Преимущества нового офиса:</h3>
      <ul>
        <li>Удобное расположение в центре города</li>
        <li>Современное оборудование и технологии</li>
        <li>Комфортные условия для консультаций</li>
        <li>Парковка для клиентов</li>
      </ul>
      
      <p>Часы работы: пн-пт с 9:00 до 18:00, сб с 10:00 до 16:00.</p>
    `,
    category: 'company',
    publishedAt: '2024-01-01T12:00:00Z',
    imageUrl: '/images/office.jpg',
    slug: 'novyj-ofis-v-centre-goroda',
    featured: false,
    published: false,
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z'
  },
  {
    id: '5',
    title: 'Праздничные скидки на все услуги',
    summary: 'Новогодние скидки до 30% на все виды экспертизы и консультаций.',
    content: `
      <p>В честь новогодних праздников мы предлагаем скидки до 30% на все наши услуги!</p>
      
      <h3>Размер скидок:</h3>
      <ul>
        <li>Экспертиза недвижимости - 25%</li>
        <li>Строительный контроль - 20%</li>
        <li>Техническое обследование - 30%</li>
        <li>Консультации - 15%</li>
      </ul>
      
      <p>Акция действует с 25 декабря 2023 по 15 января 2024 года.</p>
    `,
    category: 'promotions',
    publishedAt: '2023-12-25T10:00:00Z',
    imageUrl: '/images/placeholders/services/house-recognition.jpg',
    slug: 'prazdnichnye-skidki-na-vse-uslugi',
    featured: false,
    published: true,
    createdAt: '2023-12-25T09:00:00Z',
    updatedAt: '2023-12-25T09:00:00Z'
  },
  {
    id: '6',
    title: 'Обновление программного обеспечения',
    summary: 'Внедрение нового ПО для повышения качества и скорости выполнения работ.',
    content: `
      <p>Мы постоянно совершенствуем наши технологии и рады сообщить о внедрении нового программного обеспечения для анализа и обработки данных.</p>
      
      <h3>Новые возможности:</h3>
      <ul>
        <li>Автоматизированная обработка измерений</li>
        <li>Создание 3D-моделей объектов</li>
        <li>Быстрое формирование отчетов</li>
        <li>Интеграция с государственными базами данных</li>
      </ul>
      
      <p>Это позволит нам выполнять работы быстрее и с еще большей точностью.</p>
    `,
    category: 'other',
    publishedAt: '2023-12-20T16:00:00Z',
    slug: 'obnovlenie-programmnogo-obespecheniya',
    featured: false,
    published: true,
    createdAt: '2023-12-20T15:00:00Z',
    updatedAt: '2023-12-20T15:00:00Z'
  }
];

export function getNewsById(id: string): NewsItem | undefined {
  return NEWS_DATA.find(news => news.id === id);
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_DATA.find(news => news.slug === slug);
}

export function getNewsByCategory(category: string): NewsItem[] {
  const publishedNews = NEWS_DATA.filter(news => news.published !== false);
  if (category === 'all') return publishedNews;
  return publishedNews.filter(news => news.category === category);
}

export function getFeaturedNews(): NewsItem[] {
  return NEWS_DATA.filter(news => news.featured && news.published !== false);
}

export function getLatestNews(limit: number = 3): NewsItem[] {
  return NEWS_DATA
    .filter(news => news.published !== false)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
} 