import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import YandexMetrika from './components/YandexMetrika';

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
    'Профессиональная экспертиза при заливах, обследование инженерных систем, оценка качества строительных работ в Москве и Чебоксарах. Официальные заключения.',
  keywords:
    'строительная экспертиза, экспертиза залива, обследование канализации, тепловизионная экспертиза, оценка строительных работ',
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
      </body>
    </html>
  );
}
