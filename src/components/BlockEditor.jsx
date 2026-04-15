import { useState } from 'react';
import { BLOCK_TYPES, BLOCK_META } from '../blocks/blockTypes';
import { renderMarkdown } from '../utils/markdown';

// Shared input styles
const inp = `w-full px-3 py-2 rounded-xl text-sm font-body outline-none
  bg-white/5 border border-white/10 focus:border-ink-500/60 focus:bg-ink-500/5
  text-slate-200 placeholder-slate-600 transition-all`;

const lbl = `block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 mb-1.5`;

const Row = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className={lbl}>{label}</label>
    {children}
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className={inp + ' cursor-pointer'}>
    {options.map(o => (
      <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>
    ))}
  </select>
);

const AlignButtons = ({ value, onChange }) => (
  <div className="flex gap-2">
    {['left', 'center', 'right'].map(a => (
      <button key={a} onClick={() => onChange(a)}
        className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all capitalize
          ${value === a
            ? 'bg-ink-600 border-ink-500 text-white'
            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
        {a}
      </button>
    ))}
  </div>
);

// ── Per-type editors ──────────────────────────────────────────────────────────
const HeaderEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Heading Text">
      <input className={inp} value={block.text || ''} onChange={e => update({ text: e.target.value })} placeholder="Your heading…" />
    </Row>
    <Row label="Level">
      <Select value={block.level || 'h1'} onChange={v => update({ level: v })}
        options={[
          { value: 'h1', label: 'H1 — Page Title' },
          { value: 'h2', label: 'H2 — Section' },
          { value: 'h3', label: 'H3 — Sub-section' },
          { value: 'h4', label: 'H4 — Minor heading' },
        ]} />
    </Row>
    <Row label="Alignment">
      <AlignButtons value={block.align || 'left'} onChange={v => update({ align: v })} />
    </Row>
  </div>
);

const TextEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Content">
      <textarea
        className={inp + ' min-h-[120px] resize-y leading-relaxed'}
        value={block.text || ''}
        onChange={e => update({ text: e.target.value })}
        placeholder="Write your paragraph here…"
      />
    </Row>
    <Row label="Alignment">
      <AlignButtons value={block.align || 'left'} onChange={v => update({ align: v })} />
    </Row>
  </div>
);

const ImageEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Image URL">
      <input className={inp} value={block.url || ''} onChange={e => update({ url: e.target.value })} placeholder="https://example.com/image.jpg" />
    </Row>
    {block.url && (
      <div className="rounded-xl overflow-hidden border border-white/8">
        <img
          src={block.url}
          alt="preview"
          className="w-full h-28 object-cover"
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
    )}
    <Row label="Alt Text">
      <input className={inp} value={block.alt || ''} onChange={e => update({ alt: e.target.value })} placeholder="Describe the image" />
    </Row>
    <Row label="Caption">
      <input className={inp} value={block.caption || ''} onChange={e => update({ caption: e.target.value })} placeholder="Optional caption…" />
    </Row>
    <Row label="Rounded Corners">
      <button
        onClick={() => update({ rounded: !block.rounded })}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${block.rounded ? 'bg-ink-600' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${block.rounded ? 'left-6' : 'left-1'}`} />
      </button>
    </Row>
  </div>
);

const MarkdownEditor = ({ block, update }) => {
  const [tab, setTab] = useState('write');
  return (
    <div className="space-y-3">
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
        {['write', 'preview'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono capitalize transition-all
              ${tab === t ? 'bg-ink-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'write' ? (
        <textarea
          className={inp + ' min-h-[200px] resize-y font-mono text-xs leading-relaxed'}
          value={block.source || ''}
          onChange={e => update({ source: e.target.value })}
          placeholder={'# Hello\n\nWrite **bold**, _italic_, `code`\n\n- List item\n- Another item'}
        />
      ) : (
        <div className="p-3 rounded-xl bg-white/5 border border-white/8 min-h-[120px] max-h-72 overflow-y-auto">
          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(block.source || '') }}
          />
        </div>
      )}
      <p className="text-[10px] text-slate-600 font-mono leading-relaxed">
        Supports **bold**, _italic_, # headings, - lists, `code`, [links](url)
      </p>
    </div>
  );
};

const DividerEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Style">
      <Select value={block.style || 'solid'} onChange={v => update({ style: v })}
        options={[
          { value: 'solid',    label: '— Solid Line' },
          { value: 'gradient', label: '◈ Gradient Fade' },
          { value: 'dots',     label: '··· Dots' },
        ]} />
    </Row>
    {/* Live preview */}
    <div className="py-4 px-2">
      {block.style === 'gradient' && (
        <div className="h-px bg-gradient-to-r from-transparent via-ink-500/60 to-transparent" />
      )}
      {block.style === 'dots' && (
        <div className="flex items-center justify-center gap-2">
          {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-500/50" />)}
        </div>
      )}
      {(block.style === 'solid' || !block.style) && (
        <hr className="border-white/10" />
      )}
    </div>
  </div>
);

const QuoteEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Quote Text">
      <textarea
        className={inp + ' min-h-[100px] resize-y font-serif italic'}
        value={block.text || ''}
        onChange={e => update({ text: e.target.value })}
        placeholder="The quote goes here…"
      />
    </Row>
    <Row label="Author">
      <input className={inp} value={block.author || ''} onChange={e => update({ author: e.target.value })} placeholder="Jane Doe" />
    </Row>
    <Row label="Role / Source">
      <input className={inp} value={block.role || ''} onChange={e => update({ role: e.target.value })} placeholder="CEO of Company" />
    </Row>
  </div>
);

const CalloutEditor = ({ block, update }) => (
  <div className="space-y-4">
    <Row label="Message">
      <textarea
        className={inp + ' min-h-[100px] resize-y'}
        value={block.text || ''}
        onChange={e => update({ text: e.target.value })}
        placeholder="Important message for your readers…"
      />
    </Row>
    <Row label="Icon (emoji)">
      <input
        className={inp + ' text-center text-2xl'}
        value={block.icon || '💡'}
        onChange={e => update({ icon: e.target.value })}
        placeholder="💡"
        maxLength={4}
      />
    </Row>
    <Row label="Variant">
      <Select value={block.variant || 'info'} onChange={v => update({ variant: v })}
        options={[
          { value: 'info',    label: 'ℹ️  Info (Blue)' },
          { value: 'warning', label: '⚠️  Warning (Amber)' },
          { value: 'success', label: '✅  Success (Green)' },
          { value: 'danger',  label: '🚨  Danger (Red)' },
        ]} />
    </Row>
  </div>
);

// ── Main BlockEditor shell ────────────────────────────────────────────────────
const BlockEditor = ({ block, onUpdate, onClose }) => {
  if (!block) return null;

  const meta   = BLOCK_META[block.type] || {};
  const update = (updates) => onUpdate(block.id, updates);

  const editors = {
    [BLOCK_TYPES.HEADER]:   <HeaderEditor   block={block} update={update} />,
    [BLOCK_TYPES.TEXT]:     <TextEditor     block={block} update={update} />,
    [BLOCK_TYPES.IMAGE]:    <ImageEditor    block={block} update={update} />,
    [BLOCK_TYPES.MARKDOWN]: <MarkdownEditor block={block} update={update} />,
    [BLOCK_TYPES.DIVIDER]:  <DividerEditor  block={block} update={update} />,
    [BLOCK_TYPES.QUOTE]:    <QuoteEditor    block={block} update={update} />,
    [BLOCK_TYPES.CALLOUT]:  <CalloutEditor  block={block} update={update} />,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-white font-body">{meta.label}</p>
            <p className="text-[10px] text-slate-500 font-mono">Edit Block</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {editors[block.type] || (
          <p className="text-slate-500 text-sm">No editor for this block type.</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex-shrink-0 text-center">
        <p className="text-[10px] text-slate-600 font-mono">Changes apply instantly ⚡</p>
      </div>
    </div>
  );
};

export default BlockEditor;
