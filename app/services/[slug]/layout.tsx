import { generateServiceMetadata } from '@/lib/seo-metadata';
import type { Metadata } from 'next';

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

// Генерация метаданных для SEO
export async function generateMetadata({
  params,
}: ServiceLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  return generateServiceMetadata(slug);
}

export default function ServiceLayout({ children }: ServiceLayoutProps) {
  return <>{children}</>;
}
