// SEO метаданные для страниц услуг
// Согласно семантическому ядру из seo-block-2-semantika.md

import { Metadata } from 'next';

interface ServiceMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
}

export const servicesMetadata: Record<string, ServiceMetadata> = {
  'flood-expertise': {
    title: 'Экспертиза залива квартиры в Москве - оценка ущерба | ЦКЭ Проект',
    description:
      'Независимая экспертиза после залива квартиры в Москве. Определение причин протечки, оценка ущерба, расчет стоимости восстановления. Официальное заключение для суда. ☎ +7 (916) 830-58-58',
    keywords:
      'экспертиза залива квартиры, оценка ущерба при заливе, залив квартиры что делать, независимая экспертиза залива, экспертиза после залива, оценка ущерба от залива, экспертиза протечки, затопили соседи',
    ogImage: '/images/placeholders/services/flood-expertise.jpg',
  },
  'sewerage-inspection': {
    title:
      'Обследование канализации в Москве - видеодиагностика труб | ЦКЭ Проект',
    description:
      'Профессиональное обследование канализации с видеодиагностикой. Проверка герметичности труб, выявление засоров и дефектов. Современное оборудование. ☎ +7 (916) 830-58-58',
    keywords:
      'обследование канализации, видеодиагностика канализации, проверка канализации, диагностика канализации, инспекция труб, проверка канализации камерой, телеинспекция канализации',
    ogImage: '/images/placeholders/services/sewerage-inspection.jpg',
  },
  'house-recognition': {
    title:
      'Признание дома жилым в Москве - перевод в жилое помещение | ЦКЭ Проект',
    description:
      'Экспертиза для признания дома пригодным для проживания. Перевод нежилого помещения в жилое. Полный пакет документов для оформления. ☎ +7 (916) 830-58-58',
    keywords:
      'признание дома жилым, перевод дома в жилой, перевод нежилого в жилое, экспертиза дома для проживания, оформление дома жилым',
    ogImage: '/images/placeholders/services/house-recognition.jpg',
  },
  'renovation-expertise': {
    title:
      'Экспертиза качества ремонта квартиры в Москве - оценка работ | ЦКЭ Проект',
    description:
      'Независимая экспертиза качества ремонтных работ. Выявление дефектов отделки, проверка соответствия нормам. Экспертное заключение для суда. ☎ +7 (916) 830-58-58',
    keywords:
      'экспертиза ремонта квартиры, экспертиза качества ремонта, оценка качества ремонтных работ, дефекты ремонта, проверка качества ремонта, независимая экспертиза ремонта, экспертиза отделочных работ',
    ogImage: '/images/placeholders/services/renovation-expertise.jpg',
  },
  'thermal-inspection': {
    title:
      'Тепловизионная экспертиза дома в Москве - обследование тепловизором | ЦКЭ Проект',
    description:
      'Тепловизионное обследование дома и квартиры. Поиск утечек тепла, выявление мостиков холода. Профессиональный тепловизор. Отчет с термограммами. ☎ +7 (916) 830-58-58',
    keywords:
      'тепловизионная экспертиза, тепловизионное обследование, тепловизор для дома, проверка дома тепловизором, тепловизионная съемка, утечка тепла, теплопотери дома, мостики холода',
    ogImage: '/images/placeholders/services/thermal-inspection.jpg',
  },
  'mold-inspection': {
    title:
      'Экспертиза плесени в квартире - определение причин появления | ЦКЭ Проект',
    description:
      'Профессиональная экспертиза причин появления плесени и грибка. Измерение влажности, проверка вентиляции, анализ плесени. Рекомендации по устранению. ☎ +7 (916) 830-58-58',
    keywords:
      'экспертиза плесени, причины появления плесени, плесень в квартире что делать, анализ плесени, экспертиза грибка, влажность в квартире, черная плесень, проверка вентиляции',
    ogImage: '/images/placeholders/services/construction-control.jpg',
  },
  'room-measurement': {
    title:
      'Обмер помещений в Москве - технический план квартиры | ЦКЭ Проект',
    description:
      'Профессиональный обмер помещений и квартир. Создание технического плана, поэтажных планов, обмерочных чертежей. Точные замеры площади. ☎ +7 (916) 830-58-58',
    keywords:
      'обмер помещений, обмер квартиры, технический план помещения, замер площади квартиры, поэтажный план, обмерочный чертеж',
    ogImage: '/images/placeholders/services/room-measurement.jpg',
  },
};

// Генерация метаданных для страниц услуг
export function generateServiceMetadata(slug: string): Metadata {
  const serviceMeta = servicesMetadata[slug];

  if (!serviceMeta) {
    return {
      title: 'Услуга не найдена | ЦКЭ Проект',
      description: 'Страница услуги не найдена',
    };
  }

  return {
    title: serviceMeta.title,
    description: serviceMeta.description,
    keywords: serviceMeta.keywords,
    authors: [{ name: 'ЦКЭ Проект' }],
    creator: 'ЦКЭ Проект',
    publisher: 'ЦКЭ Проект',
    metadataBase: new URL('https://ckeproekt.ru'),
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: serviceMeta.title,
      description: serviceMeta.description,
      url: `https://ckeproekt.ru/services/${slug}`,
      siteName: 'ЦКЭ Проект',
      locale: 'ru_RU',
      type: 'website',
      images: serviceMeta.ogImage
        ? [
            {
              url: serviceMeta.ogImage,
              width: 1200,
              height: 630,
              alt: serviceMeta.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: serviceMeta.title,
      description: serviceMeta.description,
      images: serviceMeta.ogImage ? [serviceMeta.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
