'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Не показываем на главной
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', href: '/' },
  ];

  // Маппинг путей на читаемые названия
  const pathMapping: Record<string, string> = {
    services: 'Услуги',
    'flood-expertise': 'Экспертиза при заливе',
    'sewerage-inspection': 'Обследование канализации',
    'house-recognition': 'Признание дома жилым',
    'renovation-expertise': 'Экспертиза ремонтных работ',
    'thermal-inspection': 'Тепловизионная экспертиза',
    'mold-inspection': 'Определение причины возникновения плесени',
    'room-measurement': 'Обмер помещений',
    news: 'Новости',
    admin: 'Администрирование',
    'privacy-policy': 'Политика конфиденциальности',
    terms: 'Пользовательское соглашение',
    'personal-data': 'Обработка персональных данных',
  };

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = pathMapping[segment] || segment;
    breadcrumbs.push({ label, href: currentPath });
  });

  // Структурированные данные для поисковиков
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `https://ckeproekt.ru${crumb.href}`,
    })),
  };

  return (
    <>
      {/* Структурированные данные */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Визуальные хлебные крошки */}
      <nav
        className="container mx-auto px-4 py-4"
        aria-label="Хлебные крошки"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                )}
                {isLast ? (
                  <span className="text-gray-900 font-medium" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-700 transition-colors flex items-center"
                  >
                    {index === 0 && <Home className="h-4 w-4 mr-1" />}
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
