'use client';

import dynamic from 'next/dynamic';

const NewsPageDynamic = dynamic(() => import('./NewsPageComponent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Загрузка новостей...</p>
        </div>
      </div>
    </div>
  )
});

export default function NewsPage() {
  return <NewsPageDynamic />;
}