'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import WhyUs from './components/WhyUs';
import WorkFlow from './components/WorkFlow';
import Certificates from './components/Certificates';
import Services from './components/Services';
import NewsBlock from './components/NewsBlock';
import Contacts from './components/Contacts';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Loader from './components/Loader';
import CitySelectModal from './components/CitySelectModal';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<'Москва' | 'Чебоксары'>(
    'Москва'
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  useEffect(() => {
    // Проверяем, выбирал ли пользователь город ранее
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity as 'Москва' | 'Чебоксары');
    } else {
      // Если город не выбран, показываем модальное окно после загрузки
      // Устанавливаем таймер, чтобы сначала загрузка прошла, а потом показалось модальное окно
      const timer = setTimeout(() => {
        setIsCityModalOpen(true);
      }, 2300); // Чуть больше времени, чем таймер загрузки
      return () => clearTimeout(timer);
    }
  }, []);

  // Сохраняем выбор города в localStorage
  const handleCityChange = (city: 'Москва' | 'Чебоксары') => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
  };

  useEffect(() => {
    // Имитация загрузки ресурсов
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white flex flex-col"
          >
            <Header
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
            />
            <main className="flex-1">
              <Hero selectedCity={selectedCity} />
              <Services />
              <About />
              <WhyUs />
              <WorkFlow />
              <Certificates />
              <NewsBlock 
                maxNews={4} 
                showFeatured={true}
                title="Последние новости"
                subtitle="Следите за важными событиями, достижениями и обновлениями нашей компании"
              />
              <Contacts selectedCity={selectedCity} />
              <ContactForm />
            </main>
            <Footer selectedCity={selectedCity} />
          </motion.div>
        )}
      </AnimatePresence>

      <CitySelectModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        onSelectCity={handleCityChange}
        currentCity={selectedCity}
      />
    </>
  );
}
