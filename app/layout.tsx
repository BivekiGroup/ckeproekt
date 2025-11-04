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
  title: 'Независимая строительно-техническая экспертиза | ЦКЭ Проект',
  description:
    'Профессиональная экспертиза при заливах, обследование инженерных систем, оценка качества строительных работ. Официальные заключения с юридической силой.',
  keywords:
    'строительная экспертиза, экспертиза залива, обследование канализации, тепловизионная экспертиза, оценка строительных работ',
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
    title: 'Независимая строительно-техническая экспертиза | ЦКЭ Проект',
    description:
      'Профессиональная экспертиза при заливах, обследование инженерных систем, оценка качества строительных работ. Официальные заключения с юридической силой.',
    url: 'https://ckeproekt.ru',
    siteName: 'ЦКЭ Проект',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/images/office.jpg',
        width: 1200,
        height: 630,
        alt: 'ЦКЭ Проект - Строительно-техническая экспертиза',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Независимая строительно-техническая экспертиза | ЦКЭ Проект',
    description:
      'Профессиональная экспертиза при заливах, обследование инженерных систем, оценка качества строительных работ.',
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
