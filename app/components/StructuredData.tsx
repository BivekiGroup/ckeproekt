'use client';

import Script from 'next/script';

interface StructuredDataProps {
  type?: 'organization' | 'website' | 'article' | 'service';
  data?: any;
}

export default function StructuredData({
  type = 'organization',
  data,
}: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ЦКЭ Проект',
          legalName: 'Центр комплексных экспертиз Проект',
          url: 'https://ckeproekt.ru',
          logo: 'https://ckeproekt.ru/images/office.jpg',
          description:
            'Независимая строительно-техническая экспертиза',
          address: [
            {
              '@type': 'PostalAddress',
              addressLocality: 'Москва',
              addressCountry: 'RU',
            },
            {
              '@type': 'PostalAddress',
              addressLocality: 'Чебоксары',
              addressCountry: 'RU',
            },
          ],
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+7-926-712-95-95',
              contactType: 'customer service',
              areaServed: 'RU',
              availableLanguage: 'Russian',
            },
          ],
          sameAs: [
            // Добавьте ссылки на социальные сети
            // 'https://vk.com/ckeproekt',
            // 'https://t.me/ckeproekt',
          ],
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ЦКЭ Проект',
          url: 'https://ckeproekt.ru',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://ckeproekt.ru/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        };

      case 'service':
        return {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: data?.name || 'Строительно-техническая экспертиза',
          description:
            data?.description ||
            'Профессиональная строительно-техническая экспертиза',
          provider: {
            '@type': 'Organization',
            name: 'ЦКЭ Проект',
            url: 'https://ckeproekt.ru',
          },
          areaServed: {
            '@type': 'Country',
            name: 'Russia',
          },
          serviceType: 'Building Expertise',
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data?.title,
          description: data?.description,
          image: data?.image,
          datePublished: data?.publishedAt,
          dateModified: data?.updatedAt,
          author: {
            '@type': 'Organization',
            name: 'ЦКЭ Проект',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ЦКЭ Проект',
            logo: {
              '@type': 'ImageObject',
              url: 'https://ckeproekt.ru/images/office.jpg',
            },
          },
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
