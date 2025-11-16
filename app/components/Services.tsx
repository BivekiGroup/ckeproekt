'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Home,
  Droplets,
  Waves,
  CheckSquare,
  Thermometer,
  FlaskConical,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactModal from './ContactModal';
import Link from 'next/link';
import Image from 'next/image';

export const services = [
  {
    icon: Droplets,
    title: 'Экспертиза при заливе',
    slug: 'flood-expertise',
    description:
      'Строительно-техническая экспертиза для определения причины залития помещений, оценка ущерба и рекомендации по устранению последствий.',
    details: [
      'Определение источника протечки',
      'Оценка нанесенного ущерба',
      'Расчет стоимости восстановительных работ',
      'Составление экспертного заключения',
    ],
    image: '/images/placeholders/services/flood-expertise.jpg',
    imageAlt: 'Экспертиза залива квартиры - оценка ущерба от протечки',
  },
  {
    icon: Waves,
    title: 'Обследование канализации',
    slug: 'sewerage-inspection',
    description:
      'Профессиональное обследование канализационных систем с использованием современного диагностического оборудования.',
    details: [
      'Видеодиагностика труб',
      'Проверка герметичности',
      'Оценка состояния коммуникаций',
      'Рекомендации по ремонту',
    ],
    image: '/images/placeholders/services/sewerage-inspection.jpg',
    imageAlt: 'Видеодиагностика канализации - обследование труб камерой',
  },
  {
    icon: Home,
    title: 'Признание дома жилым',
    slug: 'house-recognition',
    description:
      'Экспертиза для признания дома пригодным для круглогодичного проживания, оценка соответствия всем необходимым нормам.',
    details: [
      'Оценка конструкций',
      'Проверка инженерных систем',
      'Анализ микроклимата',
      'Подготовка документации',
    ],
    image: '/images/placeholders/services/house-recognition.jpg',
    imageAlt: 'Экспертиза дома для признания жилым - перевод в жилое помещение',
  },
  {
    icon: CheckSquare,
    title: 'Экспертиза ремонтных работ',
    slug: 'renovation-expertise',
    description:
      'Определение качества выполненных ремонтных работ по отделке помещений, выявление дефектов и нарушений.',
    details: [
      'Проверка качества материалов',
      'Оценка технологии работ',
      'Выявление дефектов',
      'Рекомендации по устранению',
    ],
    image: '/images/placeholders/services/renovation-expertise.jpg',
    imageAlt: 'Экспертиза качества ремонта квартиры - проверка отделочных работ',
  },
  {
    icon: Thermometer,
    title: 'Тепловизионная экспертиза',
    slug: 'thermal-inspection',
    description:
      'Определение утечек тепла с помощью современного тепловизионного оборудования, выявление проблемных зон.',
    details: [
      'Тепловизионная съемка',
      'Анализ теплопотерь',
      'Выявление мостиков холода',
      'Рекомендации по утеплению',
    ],
    image: '/images/placeholders/services/thermal-inspection.jpg',
    imageAlt: 'Тепловизионное обследование дома - поиск утечек тепла тепловизором',
  },
  {
    icon: Thermometer,
    title: 'Определение причины возникновения плесени',
    slug: 'mold-inspection',
    description:
      'Профессиональное обследование с целью выявления и устранения причин появления плесени.',
    details: [
      'Измерение влажности воздуха и конструкций',
      'Проверка вентиляции',
      'Взятие соскобов плесени для анализа',
      'Рекомендации по устранению',
    ],
    image: '/images/placeholders/services/construction-control.jpg',
    imageAlt: 'Экспертиза плесени в квартире - определение причин появления грибка',
  },
  {
    icon: FlaskConical,
    title: 'Обмер помещений',
    slug: 'room-measurement',
    description:
      'Профессиональные обмеры помещений с использованием современного оборудования и составлением точных планов.',
    details: [
      'Замеры всех помещений',
      'Создание поэтажных планов',
      'Расчет площадей',
      'Составление технического паспорта',
    ],
    image: '/images/placeholders/services/room-measurement.jpg',
    imageAlt: 'Обмер квартиры для технического плана - замер площади помещений',
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.3,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-white" id="services">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Наши услуги
            </h2>
            <p className="text-xl text-gray-600">
              Предоставляем полный спектр услуг по экспертизе и обследованию
              объектов
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link href={`/services/${service.slug}`} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className="group bg-gray-50 rounded-xl p-6 hover:bg-blue-700 transition-all duration-300 h-full flex flex-col"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors"
                      >
                        <service.icon className="h-6 w-6 text-blue-700 group-hover:text-white" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white mb-2 line-clamp-2 h-14">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-blue-100 mb-4 line-clamp-3 h-18">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {service.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-gray-600 group-hover:text-blue-100"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0 mt-1" />
                        <span className="line-clamp-1">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="relative h-48 mt-auto rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                    <Image
                      src={service.image}
                      alt={service.imageAlt || service.title}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-blue-900/30 flex items-center justify-center z-20"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FileText className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Подберем оптимальное решение под ваши задачи.
              <br />
              Все консультации бесплатны.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white px-8"
                onClick={() => setIsModalOpen(true)}
              >
                Получить консультацию
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Services;
