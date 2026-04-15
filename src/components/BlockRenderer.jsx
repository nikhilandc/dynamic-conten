import { renderMarkdown } from '../utils/markdown';
import { BLOCK_TYPES } from '../blocks/blockTypes';

// ── Header Block ─────────────────────────────────────────────────────────────
const HeaderBlock = ({ block }) => {
  const Tag = block.level || 'h1';
  const sizes = {
    h1: 'text-4xl md:text-5xl font-black tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-semibold',
  };
  const aligns = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <Tag className={`font-display leading-tight text-white
                     ${sizes[Tag] || sizes.h1}
                     ${aligns[block.align] || 'text-left'}`}>
      {block.text || 'Untitled'}
    </Tag>
  );
};

// ── Text Block ────────────────────────────────────────────────────────────────
const TextBlock = ({ block }) => {
  const aligns = { left: 'text-left', center: 'text-center', right: 'text-right' };
  return (
    <p className={`text-slate-300 text-base leading-relaxed font-body
                   ${aligns[block.align] || 'text-left'}`}>
      {block.text || 'Empty paragraph'}
    </p>
  );
};

// ── Image Block ───────────────────────────────────────────────────────────────
const ImageBlock = ({ block }) => {
  return (
    <figure className="w-full">
      <img
        src={block.url}
        alt={block.alt || ''}
        className={`w-full object-cover max-h-96 ${block.rounded ? 'rounded-xl' : ''}`}
        onError={e => { e.target.src = 'https://placehold.co/800x400/1a1a2e/6366f1?text=Image+not+found'; }}
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 italic font-serif">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

// ── Markdown Block ────────────────────────────────────────────────────────────
const MarkdownBlock = ({ block }) => {
  const html = renderMarkdown(block.source || '');
  return (
    <div
      className="markdown-body prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// ── Divider Block ─────────────────────────────────────────────────────────────
const DividerBlock = ({ block }) => {
  if (block.style === 'gradient') {
    return (
      <div className="w-full h-px bg-gradient-to-r from-transparent via-ink-500/60 to-transparent" />
    );
  }
  if (block.style === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-500/50" />)}
      </div>
    );
  }
  return <hr className="border-white/10" />;
};

// ── Quote Block ───────────────────────────────────────────────────────────────
const QuoteBlock = ({ block }) => (
  <blockquote className="relative pl-5 border-l-2 border-ink-400">
    <svg className="absolute -top-1 -left-1 w-5 h-5 text-ink-400/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.956.76-3.022.66-1.065 1.515-1.867 2.558-2.403L9.373 5c-.8.396-1.56.898-2.26 1.505-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69-.346 2.04-.217 3.1c.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368zm9.124 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.692-1.327-.817-.56-.124-1.074-.13-1.54-.022-.16-.94.09-1.95.75-3.02.66-1.06 1.514-1.86 2.557-2.4L18.49 5c-.8.396-1.555.898-2.26 1.505-.708.607-1.34 1.305-1.894 2.094-.556.79-.97 1.68-1.24 2.69-.273 1-.345 2.04-.217 3.1.168 1.4.62 2.52 1.356 3.35.735.84 1.652 1.26 2.748 1.26.965 0 1.766-.29 2.4-.878.628-.576.94-1.365.94-2.368z"/>
    </svg>
    <p className="text-slate-200 text-lg font-serif italic leading-relaxed">
      {block.text || 'Add your quote here'}
    </p>
    {(block.author || block.role) && (
      <footer className="mt-3">
        {block.author && <cite className="text-ink-400 font-semibold not-italic text-sm font-body">— {block.author}</cite>}
        {block.role   && <span className="text-slate-500 text-sm font-body">, {block.role}</span>}
      </footer>
    )}
  </blockquote>
);

// ── Callout Block ─────────────────────────────────────────────────────────────
const CALLOUT_STYLES = {
  info:    { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',    text: 'text-sky-200'    },
  warning: { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',  text: 'text-amber-200'  },
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30',text: 'text-emerald-200'},
  danger:  { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',   text: 'text-rose-200'   },
};

const CalloutBlock = ({ block }) => {
  const style = CALLOUT_STYLES[block.variant] || CALLOUT_STYLES.info;
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${style.bg} ${style.border}`}>
      <span className="text-2xl flex-shrink-0 leading-none mt-0.5">{block.icon || '💡'}</span>
      <p className={`text-sm leading-relaxed ${style.text} font-body`}>
        {block.text || 'Add your callout message here'}
      </p>
    </div>
  );
};

// ── Main Renderer ─────────────────────────────────────────────────────────────
const BlockRenderer = ({ block }) => {
  switch (block.type) {
    case BLOCK_TYPES.HEADER:   return <HeaderBlock block={block} />;
    case BLOCK_TYPES.TEXT:     return <TextBlock block={block} />;
    case BLOCK_TYPES.IMAGE:    return <ImageBlock block={block} />;
    case BLOCK_TYPES.MARKDOWN: return <MarkdownBlock block={block} />;
    case BLOCK_TYPES.DIVIDER:  return <DividerBlock block={block} />;
    case BLOCK_TYPES.QUOTE:    return <QuoteBlock block={block} />;
    case BLOCK_TYPES.CALLOUT:  return <CalloutBlock block={block} />;
    default: return <p className="text-slate-500 text-sm">Unknown block type</p>;
  }
};

export default BlockRenderer;
