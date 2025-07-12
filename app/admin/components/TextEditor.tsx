'use client';

import React, { useState, useRef } from 'react';
import { Bold, Italic, List, Link, Eye, EyeOff, Type, Quote } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextEditor({ 
  value, 
  onChange, 
  placeholder = 'Введите текст...',
  rows = 12,
  className = ''
}: TextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = value.substring(0, start) + text + value.substring(end);
    onChange(newText);

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc list-inside mb-4 text-gray-700">$1</ul>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank">$1</a>');
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Жирный',
      action: () => insertText('**', '**'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: 'Курсив',
      action: () => insertText('*', '*'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Type,
      label: 'Заголовок',
      action: () => insertAtCursor('## '),
      shortcut: 'Ctrl+H'
    },
    {
      icon: Quote,
      label: 'Цитата',
      action: () => insertAtCursor('> '),
      shortcut: 'Ctrl+Q'
    },
    {
      icon: List,
      label: 'Список',
      action: () => insertAtCursor('- '),
      shortcut: 'Ctrl+L'
    },
    {
      icon: Link,
      label: 'Ссылка',
      action: () => insertText('[', '](url)'),
      shortcut: 'Ctrl+K'
    }
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'h':
          e.preventDefault();
          insertAtCursor('## ');
          break;
        case 'q':
          e.preventDefault();
          insertAtCursor('> ');
          break;
        case 'l':
          e.preventDefault();
          insertAtCursor('- ');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
      }
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={`${button.label} (${button.shortcut})`}
              >
                <button.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showPreview ? 'Редактор' : 'Превью'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {showPreview ? (
          /* Preview Mode */
          <div className="p-4 min-h-[300px] bg-white">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(value || 'Содержимое будет отображено здесь...') }}
            />
          </div>
        ) : (
          /* Editor Mode */
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={rows}
              className="w-full p-4 border-none resize-none focus:outline-none focus:ring-0"
              style={{ minHeight: '300px' }}
            />
            
            {/* Character count */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {value.length} символов
            </div>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span><strong>**жирный**</strong></span>
          <span><em>*курсив*</em></span>
          <span>## заголовок</span>
          <span>&gt; цитата</span>
          <span>- список</span>
          <span>[ссылка](url)</span>
        </div>
      </div>
    </div>
  );
} 