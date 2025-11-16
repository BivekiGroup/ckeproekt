'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const SEOContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Строительная экспертиза в Москве: профессиональные услуги ЦКЭ Проект
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                <strong>Независимая строительная экспертиза</strong> — это комплекс
                мероприятий по оценке технического состояния объектов недвижимости,
                качества выполненных работ и соответствия нормативным требованиям.
                Компания ЦКЭ Проект предоставляет полный спектр услуг по
                строительно-технической экспертизе в Москве и Московской области.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Link href="/services/flood-expertise" className="hover:text-blue-600 transition-colors">
                  Экспертиза залива квартиры
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">
                Если <strong>затопили соседи</strong>, необходима независимая
                экспертиза для определения причин протечки и оценки ущерба. Наши
                специалисты проводят{' '}
                <Link href="/services/flood-expertise" className="text-blue-600 hover:underline">
                  <strong>экспертизу после залива</strong>
                </Link>{' '}
                с составлением официального заключения, которое имеет юридическую силу
                в суде.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Определение источника протечки</li>
                <li>• Оценка ущерба от залива</li>
                <li>• Расчет стоимости восстановительного ремонта</li>
                <li>• Экспертное заключение для суда</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Link href="/services/thermal-inspection" className="hover:text-blue-600 transition-colors">
                  Тепловизионное обследование
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">
                <Link href="/services/thermal-inspection" className="text-blue-600 hover:underline">
                  <strong>Тепловизионная экспертиза дома</strong>
                </Link>{' '}
                позволяет выявить утечки тепла, мостики холода и проблемы с теплоизоляцией.
                Используем профессиональный <strong>тепловизор</strong> для точной диагностики
                теплопотерь в квартирах и частных домах.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Поиск утечек тепла</li>
                <li>• Выявление мостиков холода</li>
                <li>• Проверка качества утепления</li>
                <li>• Термограммы и подробный отчет</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Link href="/services/sewerage-inspection" className="hover:text-blue-600 transition-colors">
                  Видеодиагностика канализации
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">
                <Link href="/services/sewerage-inspection" className="text-blue-600 hover:underline">
                  <strong>Обследование канализации</strong>
                </Link>{' '}
                с помощью видеокамеры — современный метод выявления засоров, трещин и дефектов труб.
                <strong> Видеодиагностика канализации</strong> позволяет точно
                определить проблемные участки без вскрытия полов и стен.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Проверка канализации камерой</li>
                <li>• Выявление засоров и дефектов</li>
                <li>• Оценка состояния труб</li>
                <li>• Видеозапись обследования</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Link href="/services/renovation-expertise" className="hover:text-blue-600 transition-colors">
                  Экспертиза качества ремонта
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">
                <Link href="/services/renovation-expertise" className="text-blue-600 hover:underline">
                  <strong>Экспертиза ремонта квартиры</strong>
                </Link>{' '}
                необходима при обнаружении дефектов отделки или некачественно выполненных работ.
                Проводим проверку <strong>качества ремонтных работ</strong> с
                выявлением всех недостатков и нарушений технологии.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Проверка качества отделки</li>
                <li>• Выявление дефектов ремонта</li>
                <li>• Оценка соответствия договору</li>
                <li>• Заключение для претензий подрядчику</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-sm mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Другие виды экспертиз
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  <Link href="/services/mold-inspection" className="hover:text-blue-600 transition-colors">
                    Экспертиза плесени в квартире
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm">
                  Определение{' '}
                  <Link href="/services/mold-inspection" className="text-blue-600 hover:underline">
                    <strong>причин появления плесени</strong>
                  </Link>
                  , измерение влажности, проверка вентиляции. Помогаем избавиться от черной
                  плесени навсегда.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  <Link href="/services/house-recognition" className="hover:text-blue-600 transition-colors">
                    Перевод дома в жилой фонд
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm">
                  Экспертиза для{' '}
                  <Link href="/services/house-recognition" className="text-blue-600 hover:underline">
                    <strong>признания дома жилым</strong>
                  </Link>
                  . Проверка соответствия всем нормам для круглогодичного проживания.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  <Link href="/services/room-measurement" className="hover:text-blue-600 transition-colors">
                    Обмер помещений
                  </Link>
                </h4>
                <p className="text-gray-600 text-sm">
                  Профессиональный{' '}
                  <Link href="/services/room-measurement" className="text-blue-600 hover:underline">
                    <strong>обмер квартиры</strong>
                  </Link>{' '}
                  для технического плана. Точные замеры площади всех помещений.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Судебная экспертиза
                </h4>
                <p className="text-gray-600 text-sm">
                  Подготовка экспертного заключения для суда. Участие эксперта в
                  судебных заседаниях по строительным спорам.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Почему выбирают ЦКЭ Проект
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-gray-600">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Опыт и квалификация</p>
                <p className="text-sm">
                  Более 11 лет работы в сфере строительной экспертизы. Аттестованные
                  эксперты с профильным образованием.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  Современное оборудование
                </p>
                <p className="text-sm">
                  Используем профессиональные тепловизоры, видеокамеры для инспекции
                  труб, измерительные приборы.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Юридическая сила</p>
                <p className="text-sm">
                  Наши заключения принимаются судами. Поможем отстоять ваши права в
                  спорах с подрядчиками и соседями.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOContent;
