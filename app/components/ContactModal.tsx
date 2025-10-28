'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          source: 'Модальное окно',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setError('');
        setTimeout(() => {
          setIsSubmitted(false);
          setPhone('');
          onClose();
        }, 2000);
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Оставить заявку
              </h3>
              <p className="text-gray-600">
                Оставьте свой номер телефона, и мы свяжемся с вами в ближайшее
                время
              </p>
            </div>

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

              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                disabled={isLoading || isSubmitted}
              >
                {isSubmitted ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Заявка отправлена</span>
                  </motion.span>
                ) : isLoading ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Отправка...</span>
                  </motion.span>
                ) : (
                  'Отправить заявку'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a
                  href="/privacy-policy"
                  className="text-blue-700 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
