import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import YandexMetrika from './components/YandexMetrika';
import GoogleAnalytics from './components/GoogleAnalytics';
import StructuredData from './components/StructuredData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Строительная экспертиза в Москве - независимая оценка | ЦКЭ Проект',
  description:
    'Независимая строительно-техническая экспертиза в Москве: залив квартиры, тепловизионное обследование, качество ремонта. Официальное заключение. Выезд в день обращения. ☎ +7 (916) 830-58-58',
  keywords:
    'строительная экспертиза, строительная экспертиза москва, независимая строительная экспертиза, экспертиза залива квартиры, тепловизионная экспертиза, экспертиза ремонта, обследование канализации, экспертиза плесени, строительно техническая экспертиза, оценка ущерба при заливе',
  authors: [{ name: 'ЦКЭ Проект' }],
  creator: 'ЦКЭ Проект',
  publisher: 'ЦКЭ Проект',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ckeproekt.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Строительная экспертиза в Москве - независимая оценка | ЦКЭ Проект',
    description:
      'Независимая строительно-техническая экспертиза в Москве: залив квартиры, тепловизионное обследование, качество ремонта. Официальное заключение. Выезд в день обращения. ☎ +7 (916) 830-58-58',
    url: 'https://ckeproekt.ru',
    siteName: 'ЦКЭ Проект',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/images/office.jpg',
        width: 1200,
        height: 630,
        alt: 'Строительная экспертиза в Москве - ЦКЭ Проект',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Строительная экспертиза в Москве - независимая оценка | ЦКЭ Проект',
    description:
      'Независимая строительно-техническая экспертиза в Москве: залив квартиры, тепловизионное обследование, качество ремонта. Официальное заключение.',
    images: ['/images/office.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification
    // google: 'your-google-verification-code',
    // Яндекс.Вебмастер verification
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <YandexMetrika />
        <GoogleAnalytics />
        <StructuredData type="organization" />
        <StructuredData type="website" />
      </body>
    </html>
  );
}
