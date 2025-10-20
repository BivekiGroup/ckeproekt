import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Phone } from 'lucide-react';
// категории будем подтягивать с API
import ShareButtons from './ShareButtons';

interface NewsDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getBaseUrl() {
  const explicit =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXTAUTH_URL;
  
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const port = process.env.PORT || '3000';
  return `http://127.0.0.1:${port}`;
}

function buildApiUrl(path: string, searchParams?: Record<string, string | undefined>) {
  const url = new URL(path, `${getBaseUrl()}/`);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

// Функция для получения новости по slug из API
async function getNewsFromApi(slug: string) {
  try {
    const response = await fetch(buildApiUrl('/api/news', { slug }), {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    if (data.success && data.data.news.length > 0) {
      const [news] = data.data.news;
      if (!news.published) {
        return null;
      }
      return news;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

// Функция для получения связанных новостей
async function getRelatedNews(category: string, currentSlug: string) {
  try {
    const response = await fetch(buildApiUrl('/api/news', { category, limit: '4' }), {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    if (data.success) {
      return data.data.news.filter((item: { slug: string }) => item.slug !== currentSlug);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
}

async function getCategoryInfo(categoryId: string) {
  try {
    const response = await fetch(buildApiUrl('/api/categories'), { cache: 'no-store' });
    const data = await response.json();
    if (response.ok && data?.data?.length) {
      return data.data.find((c: any) => c.slug === categoryId) ?? null;
    }
  } catch (error) {
    console.error('Error fetching category info:', error);
  }
  return null;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const news = await getNewsFromApi(decodedSlug);

  if (!news) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryInfo = await getCategoryInfo(news.category);

  // Получаем связанные новости (из той же категории, исключая текущую)
  const relatedNews = await getRelatedNews(news.category, news.slug);
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'https://ckeproekt.ru';
  const normalizedOrigin = siteOrigin.replace(/\/$/, '');
  const encodedSlug = encodeURIComponent(news.slug);
  const newsUrl = `${normalizedOrigin}/news/${encodedSlug}`;
  const phoneNumber = '+7 (916) 830-58-58';
  const phoneHref = '+79168305858';

  const formatInline = (input: string) =>
    input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>');

  const formatLegacyContent = (raw: string) => {
    const lines = raw.split(/\r?\n/);
    const htmlParts: string[] = [];
    let listItems: string[] = [];
    let ordered = false;

    const flushList = () => {
      if (!listItems.length) return;
      const tag = ordered ? 'ol' : 'ul';
      htmlParts.push(
        `<${tag} class="list-outside ${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2">${listItems.join('')}</${tag}>`
      );
      listItems = [];
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      const unorderedMatch = trimmed.match(/^[-\u2022]\s+(.*)/);
      const orderedMatch = trimmed.match(/^\d+[\).]\s+(.*)/);

      if (unorderedMatch) {
        if (ordered) flushList();
        ordered = false;
        listItems.push(`<li>${formatInline(unorderedMatch[1])}</li>`);
        return;
      }

      if (orderedMatch) {
        if (!ordered) flushList();
        ordered = true;
        listItems.push(`<li>${formatInline(orderedMatch[1])}</li>`);
        return;
      }

      flushList();

      const normalizedSpacing = trimmed.replace(/([.!?])(?=[^\s])/g, '$1 ');
      const sentenceMatches =
        normalizedSpacing.match(/[^.!?]+[.!?]?/g)?.map(segment => segment.trim()).filter(Boolean) ?? [];

      if (sentenceMatches.length >= 3) {
        const [headingCandidateRaw, ...restSentencesRaw] = sentenceMatches;
        const headingCandidate = headingCandidateRaw.replace(/[.!?]$/, '').replace(/^[—-]\s*/, '').trim();
        const stepCandidates = restSentencesRaw
          .map(sentence => sentence.replace(/[.!?]$/, '').replace(/^[—-]\s*/, '').trim())
          .filter(Boolean)
          .filter((sentence, index, array) => array.indexOf(sentence) === index);

        const isQuestionHeading = /^(Как|Что|Почему|Когда|Где|Зачем)\b/i.test(headingCandidate);

        if (isQuestionHeading && stepCandidates.length >= 3) {
          const stepsHtml = stepCandidates
            .map((sentence, index) => {
              const stepNumber = (index + 1).toString().padStart(2, '0');
              return `
                <li class="group flex items-start gap-4 rounded-2xl bg-white/5 p-5 border border-white/10 hover:bg-white/10 transition-colors">
                  <span class="mt-1 text-sm font-semibold text-white/60 leading-none">${stepNumber}</span>
                  <p class="text-base text-white/90 leading-relaxed">${formatInline(sentence)}</p>
                </li>
              `;
            })
            .join('');

          htmlParts.push(
            `<section class="mt-16 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white px-6 py-8 sm:px-8 sm:py-10 border border-white/10 shadow-xl">
              <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3">
                  <span class="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
                    шаги
                  </span>
                  <h3 class="text-2xl md:text-3xl font-bold leading-tight">${formatInline(headingCandidate)}</h3>
                </div>
                <ol class="list-none grid gap-4 md:grid-cols-2">
                  ${stepsHtml}
                </ol>
              </div>
            </section>`
          );
          return;
        }
      }

      htmlParts.push(
        `<p class="text-lg leading-relaxed text-gray-700">${formatInline(trimmed)}</p>`
      );
    });

    flushList();
    return htmlParts.join('\n');
  };

  const enhanceCmsCtaBlocks = (html: string | undefined) => {
    if (!html) return html;

    return html.replace(
      /<section\b[^>]*data-block="cta"[^>]*>[\s\S]*?<\/section>/gi,
      section => {
        const titleMatch = section.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        const descriptionMatch = section.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
        const buttonMatch = section.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

        const titleHtml = titleMatch?.[1]?.trim() ?? '';
        const descriptionHtml = descriptionMatch?.[1]?.trim() ?? '';
        const buttonHref = buttonMatch?.[1]?.trim() ?? '';
        const buttonLabel = buttonMatch?.[2]?.trim() ?? '';

        const titleBlock = titleHtml
          ? `<h3 class="text-2xl sm:text-3xl font-bold leading-tight text-white">${titleHtml}</h3>`
          : '';

        const descriptionBlock = descriptionHtml
          ? `<p class="text-base text-white/70 leading-relaxed">${descriptionHtml}</p>`
          : '';

        const buttonBlock =
          buttonHref && buttonLabel
            ? `<a href="${buttonHref}" class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25">
                ${buttonLabel}
                <svg class="h-4 w-4 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </a>`
            : '';

        const buttonWrapper = buttonBlock
          ? `<div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">${buttonBlock}</div>`
          : '';

        return `<section data-block="cta" class="not-prose relative my-12 rounded-2xl bg-white/[0.04] ring-1 ring-white/5 hover:bg-white/[0.06] hover:ring-white/10 transition-all duration-300">
  <div class="px-6 py-8 sm:px-8 sm:py-10 space-y-4">
    ${titleBlock}
    ${descriptionBlock}
    ${buttonWrapper}
  </div>
</section>`;
      }
    );
  };

  const articleHtml = enhanceCmsCtaBlocks(
    news.content?.includes('data-block=')
    ? news.content
    : formatLegacyContent(news.content || '')
  ) ?? '';

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-white">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Все новости</span>
              </Link>

              <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true"></span>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/25 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>CKE Project</span>
              </Link>
            </div>

            <div className="flex flex-col gap-2 text-xs text-white/70 sm:flex-row sm:items-center sm:gap-4">
              {categoryInfo && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    categoryInfo.color?.startsWith('#') ? '' : categoryInfo.color || 'bg-blue-500'
                  }`}
                  style={
                    categoryInfo.color?.startsWith('#')
                      ? { backgroundColor: categoryInfo.color, color: '#fff' }
                      : undefined
                  }
                >
                  {categoryInfo.name}
                </span>
              )}

              <span className="tracking-wide text-white/60">
                {formatDate(news.publishedAt)}
              </span>

              <a
                href={`tel:${phoneHref}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-medium text-white hover:bg-white/15 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-44 sm:pt-40 md:pt-36 lg:pt-40"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={news.imageUrl || '/images/office.jpg'}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 sm:pt-0">
          <div className="space-y-8">
            {/* Badges */}
            <div className="flex items-center justify-center gap-4">
              {news.featured && (
                <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold rounded-full">
                  ВАЖНОЕ
                </span>
              )}
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/30">
                5 МИН ЧТЕНИЯ
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              {news.title}
            </h1>

            {/* Summary */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {news.summary}
            </p>

            {/* Scroll Indicator */}
            <div className="pt-16">
              <div className="flex flex-col items-center space-y-2 text-white/60">
                <span className="text-sm uppercase tracking-wide">Прокрутите вниз</span>
                <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative bg-white text-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Article Content */}
          <div className="prose prose-xl max-w-none">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            />
          </div>

          {/* Share Section */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Поделиться статьей
              </h3>
              <p className="text-gray-600 mb-8">
                Расскажите об этой новости в социальных сетях
              </p>
              <ShareButtons title={news.title} url={newsUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* Related News - Full Width */}
      {relatedNews.length > 0 && (
        <section className="bg-[#0f1017] text-white py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">
                Похожие новости
              </h2>
              <p className="text-base md:text-lg text-white/60">
                Другие материалы из категории &quot;{categoryInfo?.name}&quot;
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNews.map((relatedNewsItem: any) => (
                <Link
                  key={relatedNewsItem.id}
                  href={`/news/${relatedNewsItem.slug}`}
                  className="group block"
                >
                  <article className="bg-white/[0.04] rounded-2xl overflow-hidden ring-1 ring-white/5 hover:bg-white/[0.08] hover:ring-white/10 transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedNewsItem.imageUrl || '/images/office.jpg'}
                        alt={relatedNewsItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    
                    <div className="p-6">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 mb-3">
                        {formatDate(relatedNewsItem.publishedAt)}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-white transition-colors duration-300">
                        {relatedNewsItem.title}
                      </h3>
                      
                      <p className="text-white/60 text-sm line-clamp-3 leading-relaxed">
                        {relatedNewsItem.summary}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Full Width CTA */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Не пропустите важные новости
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Подписывайтесь на обновления и будьте в курсе всех событий и достижений нашей компании
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/news"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7В8z" />
              </svg>
              Все новости
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0л7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Главная страница
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// Генерация статических параметров для всех новостей
export async function generateStaticParams() {
  // Для динамического рендеринга возвращаем пустой массив
  return [];
}

// Метаданные для SEO
export async function generateMetadata({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsFromApi(decodeURIComponent(slug));
  
  if (!news) {
    return {
      title: 'Новость не найдена',
    };
  }

  return {
    title: `${news.title} | CKE Project`,
    description: news.summary,
    openGraph: {
      title: news.title,
      description: news.summary,
      images: news.imageUrl ? [news.imageUrl] : [],
    },
  };
} 
