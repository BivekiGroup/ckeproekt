'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/utils';
import ContactModal from './ContactModal';
import { cn } from '@/lib/utils';

interface HeroProps {
  selectedCity: 'Москва' | 'Чебоксары';
}

const Hero = ({ selectedCity }: HeroProps) => {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(phone)) {
      setError('Пожалуйста, введите корректный российский номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          source: 'Главный экран',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setError('');
        setTimeout(() => {
          setIsSubmitted(false);
          setPhone('');
        }, 3000);
      } else {
        setError(
          'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
        );
      }
    } catch {
      setError(
        'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800">
      {/* Фоновый паттерн */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-blue-900/40"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-400/10 to-transparent"></div>

      <motion.div
        className="container mx-auto px-4 py-16 sm:py-20 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center text-white space-y-8">
          {/* Заголовок */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            variants={itemVariants}
          >
            Независимая строительно-техническая экспертиза в{' '}
            {selectedCity === 'Москва' ? 'Москве' : 'Чебоксарах'}
          </motion.h1>

          {/* Описание */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-blue-100"
            variants={itemVariants}
          >
            Проводим профессиональную экспертизу при заливах, обследование
            инженерных систем, оценку качества строительных работ и
            тепловизионное обследование. Гарантируем точность заключений и
            юридическую поддержку.
          </motion.p>

          {/* Форма */}
          <motion.div
            className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
            variants={itemVariants}
          >
            <h3 className="text-lg font-medium">
              Получите бесплатную консультацию эксперта
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-200" />
                <Input
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={cn(
                    'pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white',
                    error && 'border-red-300'
                  )}
                  required
                  disabled={isLoading || isSubmitted}
                />
                {error && (
                  <div className="flex items-center gap-1 mt-1 text-red-300 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-blue-700 hover:bg-blue-50"
                disabled={isLoading || isSubmitted}
              >
                {isSubmitted ? (
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Заявка отправлена</span>
                  </span>
                ) : isLoading ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700" />
                    <span>Отправка...</span>
                  </span>
                ) : (
                  'Получить консультацию'
                )}
              </Button>
              <p className="text-sm text-blue-200">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a
                  href="/privacy-policy"
                  className="text-white hover:text-blue-100 underline"
                >
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </motion.div>

          {/* Преимущества */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12"
            variants={itemVariants}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-bold text-xl sm:text-2xl mb-2">11+ лет</p>
              <p className="text-blue-100">опыта в экспертизе</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-bold text-xl sm:text-2xl mb-2">1500+</p>
              <p className="text-blue-100">выполненных проектов</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="font-bold text-xl sm:text-2xl mb-2">100%</p>
              <p className="text-blue-100">фиксированная цена без доплат</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Hero;
