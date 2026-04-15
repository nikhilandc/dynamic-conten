// All supported block types with metadata and defaults
export const BLOCK_TYPES = {
  HEADER: 'header',
  TEXT:   'text',
  IMAGE:  'image',
  MARKDOWN: 'markdown',
  DIVIDER:  'divider',
  QUOTE:    'quote',
  CALLOUT:  'callout',
};

export const BLOCK_META = {
  [BLOCK_TYPES.HEADER]: {
    label: 'Header',
    emoji: '📝',
    color: 'text-violet-400',
    bg:    'bg-violet-500/10',
    border:'border-violet-500/20',
    description: 'Title or section heading',
  },
  [BLOCK_TYPES.TEXT]: {
    label: 'Rich Text',
    emoji: '✍️',
    color: 'text-sky-400',
    bg:    'bg-sky-500/10',
    border:'border-sky-500/20',
    description: 'Paragraph body text',
  },
  [BLOCK_TYPES.IMAGE]: {
    label: 'Image',
    emoji: '🖼️',
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10',
    border:'border-emerald-500/20',
    description: 'Display image from URL',
  },
  [BLOCK_TYPES.MARKDOWN]: {
    label: 'Markdown',
    emoji: '⌨️',
    color: 'text-amber-400',
    bg:    'bg-amber-500/10',
    border:'border-amber-500/20',
    description: 'Markdown with live preview',
  },
  [BLOCK_TYPES.DIVIDER]: {
    label: 'Divider',
    emoji: '➖',
    color: 'text-slate-400',
    bg:    'bg-slate-500/10',
    border:'border-slate-500/20',
    description: 'Visual separator line',
  },
  [BLOCK_TYPES.QUOTE]: {
    label: 'Quote',
    emoji: '💬',
    color: 'text-pink-400',
    bg:    'bg-pink-500/10',
    border:'border-pink-500/20',
    description: 'Blockquote with attribution',
  },
  [BLOCK_TYPES.CALLOUT]: {
    label: 'Callout',
    emoji: '📣',
    color: 'text-orange-400',
    bg:    'bg-orange-500/10',
    border:'border-orange-500/20',
    description: 'Highlighted info box',
  },
};

export const createBlock = (type) => {
  const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const defaults = {
    [BLOCK_TYPES.HEADER]: {
      text: 'Your Amazing Page Title',
      level: 'h1',
      align: 'left',
    },
    [BLOCK_TYPES.TEXT]: {
      text: 'Start writing your story here. Click to edit this paragraph and make it your own.',
      align: 'left',
    },
    [BLOCK_TYPES.IMAGE]: {
      url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&q=80',
      alt: 'Beautiful image',
      caption: 'Add a caption here',
      rounded: true,
    },
    [BLOCK_TYPES.MARKDOWN]: {
      source: `## Hello World\n\nThis is **bold**, _italic_, and \`code\`.\n\n- Item one\n- Item two\n- Item three`,
    },
    [BLOCK_TYPES.DIVIDER]: {
      style: 'solid',
      color: 'default',
    },
    [BLOCK_TYPES.QUOTE]: {
      text: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      role: 'Co-founder of Apple',
    },
    [BLOCK_TYPES.CALLOUT]: {
      text: 'This is an important piece of information you want to highlight.',
      icon: '💡',
      variant: 'info',
    },
  };

  return { id, type, ...defaults[type] };
};

// Default page to load on first visit
export const DEFAULT_BLOCKS = [
  { id: 'demo_1', type: BLOCK_TYPES.HEADER,  text: 'Welcome to PageCraft ✨', level: 'h1', align: 'left' },
  { id: 'demo_2', type: BLOCK_TYPES.TEXT,    text: 'This is your personal page builder. Drag blocks from the palette on the left, drop them here, and customise everything. Your page auto-saves to localStorage.', align: 'left' },
  { id: 'demo_3', type: BLOCK_TYPES.CALLOUT, text: 'Drag blocks from the left panel to add them here. Reorder by dragging. Click ✏️ to edit any block.', icon: '👈', variant: 'info' },
  { id: 'demo_4', type: BLOCK_TYPES.QUOTE,   text: 'Creativity is intelligence having fun.', author: 'Albert Einstein', role: 'Theoretical Physicist' },
  { id: 'demo_5', type: BLOCK_TYPES.DIVIDER, style: 'gradient', color: 'default' },
  { id: 'demo_6', type: BLOCK_TYPES.IMAGE,   url: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=800&q=80', alt: 'Featured image', caption: 'A beautiful image to get you started', rounded: true },
];
