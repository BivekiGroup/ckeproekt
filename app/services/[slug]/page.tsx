'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ContactModal from '@/app/components/ContactModal';
import { services } from '@/app/components/Services';
import { use } from 'react';
import { serviceFAQ } from '@/lib/faq-data';
import FAQ from '@/app/components/FAQ';
import Breadcrumbs from '@/app/components/Breadcrumbs';

// Импортируем данные о городах, чтобы использовать телефоны
const cityData = {
  Москва: {
    phone: '+7 (916) 830-58-58',
  },
} as const;

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ServicePage({ params }: ServicePageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { slug } = use(params);
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return <div>Услуга не найдена</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumbs />
      <div className="container mx-auto px-4 pb-20 pt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          {/* Навигация */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              href="/#services"
              className="inline-flex items-center text-blue-700 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Вернуться к услугам</span>
            </Link>
          </motion.div>

          {/* Заголовок */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-8 shadow-lg mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                <service.icon className="h-8 w-8 text-blue-700" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {service.title}
              </h1>
            </div>
            <p className="text-xl text-gray-600">{service.description}</p>

            {service.slug === 'mold-inspection' && (
              <div className="mt-6 p-5 bg-blue-50 rounded-lg text-gray-700">
                Плесень в помещении — не просто неприятный налёт на стенах, а
                тревожный сигнал о серьёзных нарушениях в микроклимате,
                вентиляции или конструкции здания. Наша команда проводит
                профессиональное обследование с целью выявления и устранения
                причин появления плесени, чтобы вы могли вернуть безопасность и
                комфорт в своё пространство.
              </div>
            )}
          </motion.div>

          {/* Основные моменты */}
          <motion.div variants={itemVariants} className="grid gap-8 mb-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                На что обращаем внимание
              </h2>
              <div className="grid gap-4">
                {service.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-gray-600"
                  >
                    <CheckCircle2 className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {service.slug === 'mold-inspection' && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Что входит в услугу:
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Визуальный осмотр стен, потолков, углов, пола, оконных
                        откосов
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Измерение влажности воздуха и строительных конструкций
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Проверка вентиляции (естественной и/или принудительной)
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Анализ температурных мостов (с применением тепловизора)
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Локализация источников протечек или конденсата
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Оценка герметичности окон и дверей
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Заключение эксперта с рекомендациями по устранению
                        причин
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                    Дополнительно:
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Возможность взять пробу плесени на лабораторный анализ
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Составление официального акта или технического отчёта
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                    Где применимо:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Частные квартиры и дома
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Новостройки и вторичный рынок
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Офисы, коммерческая недвижимость
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-700 flex-shrink-0 mt-1" />
                      <span className="text-gray-600">
                        Детские учреждения, школы, сады, медучреждения
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Процесс работы */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Процесс работы
              </h2>
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-700">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Первичная консультация
                    </h3>
                    <p className="text-gray-600">
                      Обсуждаем вашу ситуацию, определяем объем работ и сроки
                      выполнения
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-700">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Выезд на объект
                    </h3>
                    <p className="text-gray-600">
                      Проводим тщательное обследование объекта с использованием
                      специального оборудования
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-700">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Подготовка документации
                    </h3>
                    <p className="text-gray-600">
                      Составляем подробное экспертное заключение с фотофиксацией
                      и необходимыми расчетами
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Результат работы */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Что вы получите
              </h2>
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <FileText className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Экспертное заключение
                    </h3>
                    <p className="text-gray-600">
                      Официальный документ, содержащий результаты обследования,
                      выводы и рекомендации
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Фотоматериалы
                    </h3>
                    <p className="text-gray-600">
                      Подробная фотофиксация всех выявленных дефектов и
                      нарушений
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-6 w-6 text-blue-700 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Рекомендации
                    </h3>
                    <p className="text-gray-600">
                      Четкие указания по устранению выявленных проблем и
                      предотвращению их появления в будущем
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ секция */}
          {serviceFAQ[slug] && (
            <motion.div variants={itemVariants}>
              <FAQ items={serviceFAQ[slug]} />
            </motion.div>
          )}

          {/* Призыв к действию */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Получите профессиональную консультацию
            </h2>
            <p className="text-blue-100 mb-6">
              Наши специалисты ответят на все ваши вопросы и помогут решить вашу
              задачу
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <a
                href={`tel:${cityData.Москва.phone}`}
                className="flex items-center text-white hover:text-blue-100"
              >
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-xl">{cityData.Москва.phone}</span>
              </a>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              Оставить заявку
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
