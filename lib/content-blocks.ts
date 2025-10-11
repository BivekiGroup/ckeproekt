export type ContentBlockType = 'paragraph' | 'heading' | 'quote' | 'list' | 'image' | 'cta';

export type HeadingLevel = 'h2' | 'h3';

export type ListStyle = 'unordered' | 'ordered';

export interface ParagraphBlock {
  id: string;
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: HeadingLevel;
  text: string;
}

export interface QuoteBlock {
  id: string;
  type: 'quote';
  text: string;
  author?: string;
}

export interface ListBlock {
  id: string;
  type: 'list';
  style: ListStyle;
  items: string[];
}

export interface ImageBlock {
  id: string;
  type: 'image';
  url: string;
  caption?: string;
  alt?: string;
}

export interface CtaBlock {
  id: string;
  type: 'cta';
  title: string;
  description: string;
  buttonLabel?: string;
  buttonUrl?: string;
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | QuoteBlock
  | ListBlock
  | ImageBlock
  | CtaBlock;

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `block-${Math.random().toString(36).slice(2, 11)}`;
};

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const unescapeHtml = (input: string) =>
  input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&amp;/g, '&');

const applyInlineFormatting = (text: string) =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');

const formatWithLineBreaks = (text: string) =>
  applyInlineFormatting(text).replace(/\r?\n/g, '<br />');

export const createEmptyBlock = (type: ContentBlockType): ContentBlock => {
  switch (type) {
    case 'heading':
      return {
        id: generateId(),
        type: 'heading',
        level: 'h2',
        text: ''
      };
    case 'quote':
      return {
        id: generateId(),
        type: 'quote',
        text: '',
        author: ''
      };
    case 'list':
      return {
        id: generateId(),
        type: 'list',
        style: 'unordered',
        items: ['']
      };
    case 'image':
      return {
        id: generateId(),
        type: 'image',
        url: '',
        caption: '',
        alt: ''
      };
    case 'cta':
      return {
        id: generateId(),
        type: 'cta',
        title: '',
        description: '',
        buttonLabel: '',
        buttonUrl: ''
      };
    case 'paragraph':
    default:
      return {
        id: generateId(),
        type: 'paragraph',
        text: ''
      };
  }
};

export const renderBlocksToHtml = (blocks: ContentBlock[]): string => {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'heading': {
          const heading = block as HeadingBlock;
          const text = heading.text.trim();
          if (!text) {
            return '';
          }
          const tag = heading.level;
          const headingClass = heading.level === 'h2' ? 'text-3xl' : 'text-2xl';
          return `<${tag} data-block="heading" data-level="${heading.level}" class="${headingClass} font-bold text-gray-900 mt-10 mb-4">${applyInlineFormatting(text)}</${tag}>`;
        }
        case 'quote': {
          const quote = block as QuoteBlock;
          const text = quote.text.trim();
          if (!text) {
            return '';
          }
          const author = quote.author?.trim()
            ? `<footer class="mt-4 text-sm text-gray-500">${applyInlineFormatting(quote.author.trim())}</footer>`
            : '';
          return `<blockquote data-block="quote" class="border-l-4 border-blue-500 pl-6 italic text-gray-700 bg-blue-50/60 py-4 px-6 rounded-r-xl my-8"><p class="text-lg leading-relaxed">${formatWithLineBreaks(text)}</p>${author}</blockquote>`;
        }
        case 'list': {
          const list = block as ListBlock;
          const items = list.items
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .map(item => `<li class="mb-2">${formatWithLineBreaks(item)}</li>`)
            .join('');
          if (!items) {
            return '';
          }
          const listClass = list.style === 'ordered' ? 'list-decimal' : 'list-disc';
          const tag = list.style === 'ordered' ? 'ol' : 'ul';
          return `<${tag} data-block="list" data-style="${list.style}" class="${listClass} list-outside pl-6 text-gray-700 leading-relaxed my-6">${items}</${tag}>`;
        }
        case 'image': {
          const image = block as ImageBlock;
          const url = image.url.trim();
          if (!url) {
            return '';
          }
          const caption = image.caption?.trim()
            ? `<figcaption class="mt-3 text-sm text-gray-500 text-center">${applyInlineFormatting(image.caption.trim())}</figcaption>`
            : '';
          const altText = image.alt?.trim() || image.caption?.trim() || 'image';
          return `<figure data-block="image" class="my-10 flex flex-col items-center"><div class="w-full rounded-3xl overflow-hidden shadow-lg bg-gray-100"><img src="${escapeHtml(url)}" alt="${escapeHtml(altText)}" class="w-full object-cover" /></div>${caption}</figure>`;
        }
        case 'cta': {
          const cta = block as CtaBlock;
          const title = cta.title.trim();
          const description = cta.description.trim();
          const buttonLabel = cta.buttonLabel?.trim();
          const buttonUrl = cta.buttonUrl?.trim();
          if (!title && !description && !buttonLabel) {
            return '';
          }
          const button = buttonLabel && buttonUrl
            ? `<a href="${escapeHtml(buttonUrl)}" class="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200">${escapeHtml(buttonLabel)}</a>`
            : '';
          const titleHtml = title ? `<h3 class="text-2xl font-bold">${applyInlineFormatting(title)}</h3>` : '';
          const descriptionHtml = description
            ? `<p class="text-lg text-blue-100 leading-relaxed">${formatWithLineBreaks(description)}</p>`
            : '';
          return `<section data-block="cta" class="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl p-10 my-12 text-center space-y-4">${titleHtml}${descriptionHtml}${button}</section>`;
        }
        case 'paragraph':
        default: {
          const paragraph = block as ParagraphBlock;
          if (!paragraph.text.trim()) {
            return '';
          }
          return `<p data-block="paragraph" class="text-lg text-gray-700 leading-relaxed mb-6">${formatWithLineBreaks(paragraph.text)}</p>`;
        }
      }
    })
    .filter(Boolean)
    .join('\n')
    .trim();
};

const extractTextWithLineBreaks = (element: Element) => {
  const walker = element.ownerDocument?.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  const pieces: string[] = [];

  while (walker?.nextNode()) {
    const node = walker.currentNode as Text;
    pieces.push(node.textContent || '');
  }

  const textContent = pieces.join('').replace(/\u00a0/g, ' ').trim();
  if (!textContent) {
    return '';
  }

  const html = element.innerHTML
    .replace(/<\/(p|div|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n');

  return unescapeHtml(html.replace(/<[^>]+>/g, '')).trim();
};

export const parseHtmlToBlocks = (html: string): ContentBlock[] => {
  if (!html || typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return html
      ? [
          {
            id: generateId(),
            type: 'paragraph',
            text: html.replace(/<[^>]+>/g, '').trim()
          } as ParagraphBlock
        ]
      : [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blockElements = Array.from(doc.querySelectorAll('[data-block]'));

  if (!blockElements.length) {
    const text = doc.body.textContent?.trim();
    if (!text) {
      return [];
    }

    return text
      .split(/\n{2,}/)
      .map(chunk => chunk.trim())
      .filter(Boolean)
      .map(chunk => ({
        id: generateId(),
        type: 'paragraph',
        text: chunk
      }));
  }

  return blockElements.map((element) => {
    const blockType = element.getAttribute('data-block') as ContentBlockType | null;

    switch (blockType) {
      case 'heading':
        return {
          id: generateId(),
          type: 'heading',
          level: (element.getAttribute('data-level') as HeadingLevel) || 'h2',
          text: element.textContent?.trim() || ''
        } as HeadingBlock;
      case 'quote':
        return {
          id: generateId(),
          type: 'quote',
          text: extractTextWithLineBreaks(element),
          author: (element.querySelector('footer')?.textContent || '').trim()
        } as QuoteBlock;
      case 'list': {
        const tagName = element.tagName.toLowerCase();
        const style: ListStyle =
          (element.getAttribute('data-style') as ListStyle) || (tagName === 'ol' ? 'ordered' : 'unordered');
        const items = Array.from(element.querySelectorAll('li')).map(li =>
          li.textContent?.trim() || ''
        );
        return {
          id: generateId(),
          type: 'list',
          style,
          items
        } as ListBlock;
      }
      case 'image':
        return {
          id: generateId(),
          type: 'image',
          url: (element.querySelector('img')?.getAttribute('src') || '').trim(),
          alt: element.querySelector('img')?.getAttribute('alt') || '',
          caption: (element.querySelector('figcaption')?.textContent || '').trim()
        } as ImageBlock;
      case 'cta':
        return {
          id: generateId(),
          type: 'cta',
          title: element.querySelector('h3')?.textContent?.trim() || '',
          description: element.querySelector('p')?.textContent?.trim() || '',
          buttonLabel: element.querySelector('a')?.textContent?.trim() || '',
          buttonUrl: element.querySelector('a')?.getAttribute('href') || ''
        } as CtaBlock;
      case 'paragraph':
      default:
        return {
          id: generateId(),
          type: 'paragraph',
          text: extractTextWithLineBreaks(element) || element.textContent?.trim() || ''
        } as ParagraphBlock;
    }
  });
};
