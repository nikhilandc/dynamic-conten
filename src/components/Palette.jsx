import { BLOCK_META, BLOCK_TYPES, createBlock } from '../blocks/blockTypes';

const PaletteItem = ({ type, meta, onAdd, onDragStart }) => (
  <div
    draggable
    onDragStart={e => onDragStart(e, type)}
    onClick={() => onAdd(createBlock(type))}
    className="palette-item group"
    title={`Click or drag to add ${meta.label}`}
  >
    <span className="text-xl flex-shrink-0 leading-none">{meta.emoji}</span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-semibold ${meta.color} font-body leading-tight`}>{meta.label}</p>
      <p className="text-[10px] text-slate-600 truncate mt-0.5">{meta.description}</p>
    </div>
    <svg className="w-4 h-4 text-slate-700 group-hover:text-ink-400 flex-shrink-0 transition-colors"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
    </svg>
  </div>
);

const Palette = ({ onAdd, onDragStart }) => (
  <aside className="flex flex-col h-full">
    {/* Header */}
    <div className="px-4 pt-5 pb-3 flex-shrink-0">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ink-400 to-ink-700 flex items-center justify-center shadow-glow-sm">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
          </svg>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold text-white">Blocks</h2>
          <p className="text-[10px] text-slate-600 font-mono">Click or drag</p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="mx-4 h-px bg-white/5 flex-shrink-0" />

    {/* Block type list */}
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
      {Object.values(BLOCK_TYPES).map(type => (
        <PaletteItem
          key={type}
          type={type}
          meta={BLOCK_META[type]}
          onAdd={onAdd}
          onDragStart={onDragStart}
        />
      ))}
    </div>

    {/* Tip */}
    <div className="px-4 pb-4 flex-shrink-0">
      <div className="p-3 rounded-xl bg-ink-600/8 border border-ink-500/15 text-center">
        <p className="text-[10px] text-ink-400/70 font-mono leading-relaxed">
          🖱️ Drag to canvas<br/>or click to append
        </p>
      </div>
    </div>
  </aside>
);

export default Palette;
