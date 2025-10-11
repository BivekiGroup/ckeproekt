'use client';

import React, { useMemo } from 'react';
import {
  Plus,
  Text,
  Heading as HeadingIcon,
  Quote as QuoteIcon,
  List as ListIcon,
  Image as ImageIcon,
  Megaphone,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import ImageUpload from '@/app/admin/components/ImageUpload';
import {
  ContentBlock,
  ContentBlockType,
  HeadingLevel,
  ListStyle,
  createEmptyBlock,
  renderBlocksToHtml
} from '@/lib/content-blocks';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (next: ContentBlock[]) => void;
}

const blockTypeOptions: Array<{
  type: ContentBlockType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { type: 'paragraph', label: 'Абзац', description: 'Обычный текстовый блок', icon: Text },
  { type: 'heading', label: 'Заголовок', description: 'Подзаголовок секции', icon: HeadingIcon },
  { type: 'quote', label: 'Цитата', description: 'Выделенный цитатный блок', icon: QuoteIcon },
  { type: 'list', label: 'Список', description: 'Маркированный или нумерованный список', icon: ListIcon },
  { type: 'image', label: 'Изображение', description: 'Вставка изображения с подписью', icon: ImageIcon },
  { type: 'cta', label: 'CTA блок', description: 'Призыв к действию с кнопкой', icon: Megaphone }
];

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: ContentBlockType) => {
    onChange([...blocks, createEmptyBlock(type)]);
  };

  const updateBlock = (id: string, updated: ContentBlock) => {
    onChange(blocks.map(block => (block.id === id ? updated : block)));
  };

  const updateBlockPartial = (id: string, patch: Partial<ContentBlock>) => {
    const block = blocks.find(b => b.id === id);
    if (!block) {
      return;
    }
    updateBlock(id, { ...block, ...patch } as ContentBlock);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) {
      return;
    }

    const next = [...blocks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  };

  const previewHtml = useMemo(() => renderBlocksToHtml(blocks), [blocks]);

  const handleListItemChange = (id: string, itemIndex: number, value: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block || block.type !== 'list') {
      return;
    }

    const items = [...block.items];
    items[itemIndex] = value;

    updateBlock(id, { ...block, items });
  };

  const addListItem = (id: string) => {
    const block = blocks.find(b => b.id === id);
    if (!block || block.type !== 'list') {
      return;
    }
    updateBlock(id, { ...block, items: [...block.items, ''] });
  };

  const removeListItem = (id: string, itemIndex: number) => {
    const block = blocks.find(b => b.id === id);
    if (!block || block.type !== 'list') {
      return;
    }
    const nextItems = block.items.filter((_, idx) => idx !== itemIndex);
    updateBlock(id, { ...block, items: nextItems.length ? nextItems : [''] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Добавить блок</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {blockTypeOptions.map(option => (
            <button
              key={option.type}
              type="button"
              onClick={() => addBlock(option.type)}
              className="flex items-start space-x-3 rounded-lg border border-gray-200 px-3 py-3 text-left hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="mt-1 rounded-md bg-blue-100 p-2 text-blue-600">
                <option.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </div>
              <Plus className="ml-auto h-4 w-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {blocks.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Блоки пока не добавлены. Выберите тип блока выше, чтобы начать.
          </div>
        )}

        {blocks.map((block, index) => (
          <div key={block.id} className="relative rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-3 text-sm font-semibold text-gray-700">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span>
                  {blockTypeOptions.find(option => option.type === block.type)?.label ??
                    'Контентный блок'}{' '}
                  #{index + 1}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'up')}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  disabled={index === 0}
                  title="Переместить вверх"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'down')}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  disabled={index === blocks.length - 1}
                  title="Переместить вниз"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="rounded-md p-1 text-red-500 hover:text-red-600"
                  title="Удалить блок"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-4">
              {block.type === 'paragraph' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Текст блока
                  </label>
                  <textarea
                    value={block.text}
                    onChange={e =>
                      updateBlockPartial(block.id, { text: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Введите текст абзаца"
                  />
                </div>
              )}

              {block.type === 'heading' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Уровень заголовка
                      </label>
                      <select
                        value={block.level}
                        onChange={e =>
                          updateBlockPartial(block.id, {
                            level: e.target.value as HeadingLevel
                          })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="h2">H2 — крупный заголовок</option>
                        <option value="h3">H3 — средний заголовок</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Текст заголовка
                      </label>
                      <input
                        type="text"
                        value={block.text}
                        onChange={e =>
                          updateBlockPartial(block.id, { text: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Введите текст заголовка"
                      />
                    </div>
                  </div>
                </>
              )}

              {block.type === 'quote' && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Текст цитаты
                    </label>
                    <textarea
                      value={block.text}
                      onChange={e =>
                        updateBlockPartial(block.id, { text: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Введите цитату"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Автор (необязательно)
                    </label>
                    <input
                      type="text"
                      value={block.author ?? ''}
                      onChange={e =>
                        updateBlockPartial(block.id, { author: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Имя автора"
                    />
                  </div>
                </>
              )}

              {block.type === 'list' && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Тип списка
                      </label>
                      <select
                        value={block.style}
                        onChange={e =>
                          updateBlockPartial(block.id, {
                            style: e.target.value as ListStyle
                          })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="unordered">Маркированный</option>
                        <option value="ordered">Нумерованный</option>
                      </select>
                    </div>
                    <div className="self-end text-right">
                      <button
                        type="button"
                        onClick={() => addListItem(block.id)}
                        className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить пункт
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {block.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-2">
                        <span className="mt-2 text-sm font-medium text-gray-500">
                          {block.style === 'ordered' ? `${itemIndex + 1}.` : '•'}
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={e =>
                            handleListItemChange(block.id, itemIndex, e.target.value)
                          }
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Текст пункта"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(block.id, itemIndex)}
                          className="mt-1 rounded-md p-2 text-gray-400 hover:text-red-500"
                          title="Удалить пункт"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {block.type === 'image' && (
                <>
                  <ImageUpload
                    value={block.url}
                    onChange={url =>
                      updateBlockPartial(block.id, { url })
                    }
                    onRemove={() =>
                      updateBlockPartial(block.id, { url: '', caption: '', alt: '' })
                    }
                    className="max-w-2xl"
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Подпись (необязательно)
                      </label>
                      <input
                        type="text"
                        value={block.caption ?? ''}
                        onChange={e =>
                          updateBlockPartial(block.id, { caption: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Подпись под изображением"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Alt-текст (описание изображения)
                      </label>
                      <input
                        type="text"
                        value={block.alt ?? ''}
                        onChange={e =>
                          updateBlockPartial(block.id, { alt: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Альтернативный текст"
                      />
                    </div>
                  </div>
                </>
              )}

              {block.type === 'cta' && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Заголовок блока
                    </label>
                    <input
                      type="text"
                      value={block.title}
                      onChange={e =>
                        updateBlockPartial(block.id, { title: e.target.value })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Например: Нужна помощь экспертов?"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Описание
                    </label>
                    <textarea
                      value={block.description}
                      onChange={e =>
                        updateBlockPartial(block.id, { description: e.target.value })
                      }
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Опишите предложение или призыв к действию"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Текст кнопки
                      </label>
                      <input
                        type="text"
                        value={block.buttonLabel ?? ''}
                        onChange={e =>
                          updateBlockPartial(block.id, { buttonLabel: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Например: Заказать экспертизу"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Ссылка кнопки
                      </label>
                      <input
                        type="url"
                        value={block.buttonUrl ?? ''}
                        onChange={e =>
                          updateBlockPartial(block.id, { buttonUrl: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Предпросмотр</h3>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          {previewHtml ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="text-sm text-gray-500">
              Добавьте блоки, чтобы увидеть, как будет выглядеть новость.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
