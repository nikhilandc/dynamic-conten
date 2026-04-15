import { useState } from 'react';
import BlockRenderer from './BlockRenderer';
import { BLOCK_META } from '../blocks/blockTypes';

const CanvasBlock = ({
  block, index, total,
  isSelected, onSelect,
  onRemove, onDuplicate, onMoveUp, onMoveDown,
  onDragStart, onDragEnd,
  onDragOver, onDragLeave, onDrop,
  isDragOver,
}) => {
  const [hovered, setHovered] = useState(false);
  const meta = BLOCK_META[block.type] || {};

  return (
    <>
      {/* Drop zone above */}
      {isDragOver && (
        <div className="h-1 mx-4 rounded-full bg-gradient-to-r from-transparent via-ink-400 to-transparent animate-pulse" />
      )}

      <div
        draggable
        onDragStart={e => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={e => onDragOver(e, index)}
        onDragLeave={onDragLeave}
        onDrop={e => onDrop(e, index)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelect(block.id)}
        className={`canvas-block group relative transition-all duration-200
                     ${isSelected ? 'border-ink-500/60 shadow-glow-sm' : ''}
                     ${isDragOver ? 'drag-over' : ''}`}
      >
        {/* Drag handle - left side */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center
                          rounded-l-2xl cursor-grab active:cursor-grabbing
                          transition-all duration-150
                          ${hovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col gap-0.5 opacity-40 hover:opacity-80 transition-opacity">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="w-1 h-1 rounded-full bg-slate-400" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pl-8 pr-4 py-5">
          <BlockRenderer block={block} />
        </div>

        {/* Top-right toolbar */}
        <div className={`absolute top-3 right-3 flex items-center gap-1
                          transition-all duration-150
                          ${hovered || isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
          {/* Type badge */}
          <span className={`type-badge ${meta.bg} ${meta.color} border ${meta.border} hidden sm:block`}>
            {meta.emoji} {meta.label}
          </span>

          {/* Edit */}
          <button onClick={e => { e.stopPropagation(); onSelect(block.id); }}
            className="toolbar-btn" title="Edit block">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
          </button>

          {/* Move up */}
          {index > 0 && (
            <button onClick={e => { e.stopPropagation(); onMoveUp(block.id); }}
              className="toolbar-btn" title="Move up">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
              </svg>
            </button>
          )}

          {/* Move down */}
          {index < total - 1 && (
            <button onClick={e => { e.stopPropagation(); onMoveDown(block.id); }}
              className="toolbar-btn" title="Move down">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
              </svg>
            </button>
          )}

          {/* Duplicate */}
          <button onClick={e => { e.stopPropagation(); onDuplicate(block.id); }}
            className="toolbar-btn" title="Duplicate">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5"/>
            </svg>
          </button>

          {/* Delete */}
          <button onClick={e => { e.stopPropagation(); onRemove(block.id); }}
            className="toolbar-btn hover:text-rose-400 hover:bg-rose-500/10" title="Delete block">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
          </button>
        </div>

        {/* Selected ring */}
        {isSelected && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-ink-500/50 pointer-events-none" />
        )}
      </div>
    </>
  );
};

export default CanvasBlock;
