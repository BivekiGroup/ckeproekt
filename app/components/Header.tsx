'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MapPin, Phone, Building, Menu, X } from 'lucide-react';
import ContactModal from './ContactModal';

const cityData = {
  Москва: {
    phone: '+7 (916) 830-58-58',
  },
  Чебоксары: {
    phone: '+7 (916) 830-58-58',
  },
} as const;

const navigation = [
  { name: 'О компании', href: '#about' },
  { name: 'Преимущества', href: '#why-us' },
  { name: 'Как мы работаем', href: '#workflow' },
  { name: 'Сертификаты', href: '#certificates' },
  { name: 'Услуги', href: '#services' },
  { name: 'Новости', href: '/news' },
  { name: 'Контакты', href: '#contacts' },
];

type CityKey = keyof typeof cityData;

interface HeaderProps {
  selectedCity: CityKey;
  onCityChange: (city: CityKey) => void;
}

const Header = ({ selectedCity, onCityChange }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Закрываем меню при клике на ссылку
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 w-full border-b bg-white/95 backdrop-blur-sm z-50 shadow-sm transition-all duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Логотип */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-blue-700"
            >
              <Building className="h-6 w-6" />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold">ЦКЭ</span>
                <span className="block text-xs sm:text-sm font-normal text-gray-600">
                  Центр комплексных экспертиз
                </span>
              </div>
            </Link>

            {/* Мобильный номер телефона и кнопка меню */}
            <div className="flex items-center space-x-4 lg:hidden">
              <a
                href={`tel:${cityData[selectedCity].phone}`}
                className="flex items-center text-gray-600 hover:text-blue-700 whitespace-nowrap"
              >
                <Phone className="h-4 w-4 text-blue-700 mr-1" />
                <span className="text-xs font-medium">
                  {cityData[selectedCity].phone}
                </span>
              </a>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Десктопная навигация */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-700 transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Десктопные контакты и кнопки */}
            <div className="hidden lg:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <MapPin className="h-4 w-4 text-blue-700" />
                    <span>{selectedCity}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onCityChange('Москва')}
                    className="cursor-pointer"
                  >
                    Москва
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onCityChange('Чебоксары')}
                    className="cursor-pointer"
                  >
                    Чебоксары
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a
                href={`tel:${cityData[selectedCity].phone}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-700"
              >
                <Phone className="h-4 w-4" />
                <span>{cityData[selectedCity].phone}</span>
              </a>

              <Button
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                Оставить заявку
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Выпадающее мобильное меню */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: '100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
        style={{ top: '56px' }}
      >
        <div className="flex flex-col h-full py-8 px-6">
          <nav className="flex flex-col space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-800 hover:text-blue-700 transition-colors text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-4">Выберите город:</p>
            <div className="space-y-3 mb-8">
              <button
                onClick={() => onCityChange('Москва')}
                className={`w-full py-2 px-4 rounded-lg text-left ${
                  selectedCity === 'Москва'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                Москва
              </button>
              <button
                onClick={() => onCityChange('Чебоксары')}
                className={`w-full py-2 px-4 rounded-lg text-left ${
                  selectedCity === 'Чебоксары'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                Чебоксары
              </button>
            </div>

            <Button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6 text-lg"
              onClick={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Оставить заявку
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Темный оверлей при открытом меню */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 lg:hidden"
          style={{ top: '56px' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="h-[56px]" />

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;
