'use client';

import React, { useCallback, useState } from 'react';
import { Share2, Copy, Check, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const whatsappShareUrl = (shareUrl: string, title: string) =>
  `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: title,
    url
  };

  const handleWebShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // пользователь мог отменить диалог — игнорируем
        console.warn('Share cancelled', error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error', error);
      alert('Не удалось скопировать ссылку. Попробуйте вручную.');
    }
  }, [shareData, url]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Clipboard error', error);
      alert('Не удалось скопировать ссылку. Попробуйте вручную.');
    }
  }, [url]);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
      <a
        href={whatsappShareUrl(url, title)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700"
      >
        <MessageCircle className="h-5 w-5" />
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={handleWebShare}
        className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-white transition-all duration-200 hover:bg-gray-800"
      >
        <Share2 className="h-5 w-5" />
        <span>Поделиться</span>
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-800 transition-all duration-200 hover:bg-gray-100"
      >
        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
        <span>{copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}</span>
      </button>
    </div>
  );
}
