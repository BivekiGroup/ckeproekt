'use client';

import { useEffect, useRef } from 'react';
import { History, GraduationCap, Brain, Users, Coins } from 'lucide-react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5,
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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const featureVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section ref={ref} id="about" className="py-20 bg-gray-50">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            О нашей компании
          </h2>
          <p className="text-xl text-gray-600">
            Мы предоставляем профессиональные услуги экспертизы с неизменно
            высоким качеством
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <motion.div
              className="flex items-start space-x-4"
              variants={featureVariants}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <History className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Более 11 лет на рынке
                </h3>
                <p className="text-gray-600">
                  Многолетний опыт работы позволяет нам решать задачи любой
                  сложности и гарантировать высокое качество услуг.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4"
              variants={featureVariants}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Квалифицированные специалисты
                </h3>
                <p className="text-gray-600">
                  В нашей организации работают дипломированные специалисты,
                  кандидат технических наук, инженеры с большим стажем работы и
                  квалифицированный сметчик.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start space-x-4"
              variants={featureVariants}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Огромный опыт
                </h3>
                <p className="text-gray-600">
                  Наработан огромный опыт, позволяющий провести экспертизу даже
                  в самых сложных ситуациях.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            variants={imageVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent z-10" />
            <Image
              src="/images/office.jpg"
              alt="Наш офис"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Работаем со всеми
                </h3>
                <p className="text-gray-600">
                  Работаем как с юридическими, так и с физическими лицами.
                  Индивидуальный подход к каждому клиенту.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-8 shadow-lg"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Coins className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Честные цены
                </h3>
                <p className="text-gray-600">
                  Не накручиваем цены и не навязываем ненужные допуслуги.
                  Прозрачное ценообразование и понятные условия сотрудничества.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={statsVariants}>
            <div className="text-4xl font-bold text-blue-700 mb-2">11+</div>
            <div className="text-gray-600">лет опыта</div>
          </motion.div>
          <motion.div className="text-center" variants={statsVariants}>
            <div className="text-4xl font-bold text-blue-700 mb-2">1500+</div>
            <div className="text-gray-600">проектов</div>
          </motion.div>
          <motion.div className="text-center" variants={statsVariants}>
            <div className="text-4xl font-bold text-blue-700 mb-2">100%</div>
            <div className="text-gray-600">бесплатная юр. консультация</div>
          </motion.div>
          <motion.div className="text-center" variants={statsVariants}>
            <div className="text-4xl font-bold text-blue-700 mb-2">0</div>
            <div className="text-gray-600">скрытых услуг и доплат</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
