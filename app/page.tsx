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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки ресурсов
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
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
          <Header />
          <main className="flex-1">
            <Hero />
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
            <Contacts />
            <ContactForm />
          </main>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
