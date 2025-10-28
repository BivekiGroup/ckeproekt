'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { reachGoal } from '@/app/components/YandexMetrika';

const ContactForm = () => {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

    // Отслеживаем клик по кнопке консультации
    reachGoal('consultation_click');

    setIsLoading(true);

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          source: 'Форма контактов',
        }),
      });

      if (response.ok) {
        // Отслеживаем успешную отправку формы
        reachGoal('contact_form_success', { form_type: 'consultation' });

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

  const listItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section ref={ref} className="py-20 bg-white" id="contact-form">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          >
            {/* Фоновый паттерн */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  backgroundSize: '30px 30px',
                }}
              />
            </motion.div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Левая часть с текстом */}
              <motion.div variants={itemVariants} className="flex-1 text-white">
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  whileHover={{ x: 10 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HelpCircle className="h-10 w-10" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Нужна консультация?
                  </h2>
                </motion.div>
                <p className="text-xl text-blue-100 mb-6">
                  Оставьте свой номер телефона, и наш специалист
                  проконсультирует вас по всем вопросам
                </p>
                <motion.ul
                  variants={containerVariants}
                  className="space-y-3 text-blue-100"
                >
                  <motion.li
                    variants={listItemVariants}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>Бесплатная консультация</span>
                  </motion.li>
                  <motion.li
                    variants={listItemVariants}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>Ответим в течение 15 минут</span>
                  </motion.li>
                  <motion.li
                    variants={listItemVariants}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <span>Подберём оптимальное решение</span>
                  </motion.li>
                </motion.ul>
              </motion.div>

              {/* Правая часть с формой */}
              <motion.div variants={itemVariants} className="w-full md:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-lg w-full md:w-80"
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+7 (999) 999-99-99"
                        value={phone}
                        onChange={handlePhoneChange}
                        className={cn('pl-10', error && 'border-red-500')}
                        required
                        disabled={isLoading || isSubmitted}
                      />
                      {error && (
                        <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                        disabled={isLoading || isSubmitted}
                      >
                        {isSubmitted ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                            <span>Заявка отправлена</span>
                          </motion.span>
                        ) : isLoading ? (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2"
                          >
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                            <span>Отправка...</span>
                          </motion.span>
                        ) : (
                          'Получить консультацию'
                        )}
                      </Button>
                    </motion.div>
                    <p className="text-xs text-gray-500 text-center">
                      Нажимая кнопку, вы соглашаетесь с{' '}
                      <a
                        href="/privacy-policy"
                        className="text-blue-700 hover:text-blue-800"
                      >
                        политикой конфиденциальности
                      </a>
                    </p>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
