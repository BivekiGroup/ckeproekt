'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

const navigation = [
  { name: 'О компании', href: '#about' },
  { name: 'Преимущества', href: '#why-us' },
  { name: 'Как мы работаем', href: '#workflow' },
  { name: 'Сертификаты', href: '#certificates' },
  { name: 'Услуги', href: '#services' },
  { name: 'Контакты', href: '#contacts' },
];

const legalLinks = [
  { name: 'Политика конфиденциальности', href: '/privacy-policy' },
  { name: 'Пользовательское соглашение', href: '/terms' },
  { name: 'Обработка персональных данных', href: '/personal-data' },
];

const contacts = {
  phone: '+7 (916) 830-58-58',
  email: 'ckeproekt@yandex.ru',
  offices: [
    'г. Москва, ул. Космонавта Волкова, д. 29к1',
    'г. Чебоксары, ул. Зои Яковлевой, д. 54',
  ],
};

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <footer ref={ref} className="bg-gray-50 border-t">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Колонка 1: О компании */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 text-blue-700"
            >
              <Link
                href="/"
                className="flex items-center space-x-2 text-blue-700"
              >
                <Building className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-bold">ЦКЭ</h2>
                  <p className="text-sm text-gray-600">
                    Центр комплексных экспертиз
                  </p>
                </div>
              </Link>
            </motion.div>
            <p className="text-gray-600 text-sm">
              Профессиональная экспертиза и обследование объектов с гарантией
              качества
            </p>
          </motion.div>

          {/* Колонка 2: Навигация */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 mb-4">Навигация</h3>
            <nav className="grid grid-cols-1 gap-2">
              {navigation.map((item) => (
                <motion.div key={item.href} whileHover={{ x: 5 }}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Колонка 3: Контакты */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="font-semibold text-gray-900">Контакты</h3>
            <div className="space-y-3">
              {contacts.offices.map((office, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <MapPin className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <span>{office}</span>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Phone className="h-4 w-4 text-blue-700 flex-shrink-0" />
                <a
                  href={`tel:${contacts.phone}`}
                  className="hover:text-blue-700"
                >
                  {contacts.phone}
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Mail className="h-4 w-4 text-blue-700 flex-shrink-0" />
                <a
                  href={`mailto:${contacts.email}`}
                  className="hover:text-blue-700"
                >
                  {contacts.email}
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Колонка 4: Документы */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 mb-4">Документы</h3>
            <div className="grid grid-cols-1 gap-2">
              {legalLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ x: 5 }}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Нижняя часть футера */}
        <motion.div
          variants={containerVariants}
          className="border-t border-gray-200 py-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
          >
            <div>
              © {new Date().getFullYear()} ЦКЭ - Центр комплексных экспертиз.
              Все права защищены
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              Разработка сайта{' '}
              <a
                href="https://biveki.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                Biveki Group
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
