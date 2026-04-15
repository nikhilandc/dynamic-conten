import { useState, useCallback, useRef } from 'react';
import { useBlocks }      from './hooks/useBlocks';
import { createBlock }    from './blocks/blockTypes';
import Topbar             from './components/Topbar';
import Palette            from './components/Palette';
import CanvasBlock        from './components/CanvasBlock';
import BlockEditor        from './components/BlockEditor';
import PreviewMode        from './components/PreviewMode';

// ── Drag-drop state (kept in App to share across Palette + Canvas) ────────────
let _dragType  = null; // 'new' | 'reorder'
let _dragIndex = null;
let _dragBlockType = null;

export default function App() {
  const {
    blocks, pageTitle, selectedId, preview,
    addBlock, removeBlock, updateBlock, reorderBlocks,
    moveUp, moveDown, duplicateBlock,
    selectBlock, deselect, clearCanvas, setPageTitle, togglePreview,
  } = useBlocks();

  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [canvasDragOver, setCanvasDragOver] = useState(false);
  const [confirmClear, setConfirmClear]   = useState(false);
  const canvasRef = useRef(null);

  const selectedBlock = blocks.find(b => b.id === selectedId) || null;

  // ── Palette drag start ─────────────────────────────────────────────────────
  const onPaletteDragStart = useCallback((e, type) => {
    _dragType      = 'new';
    _dragBlockType = type;
    _dragIndex     = null;
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', `new:${type}`);
  }, []);

  // ── Canvas block drag start ────────────────────────────────────────────────
  const onBlockDragStart = useCallback((e, index) => {
    _dragType      = 'reorder';
    _dragIndex     = index;
    _dragBlockType = null;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  const onBlockDragEnd = useCallback(() => {
    _dragType = null; _dragIndex = null; _dragBlockType = null;
    setDragOverIndex(null);
    setCanvasDragOver(false);
  }, []);

  // ── Drop zone handlers ─────────────────────────────────────────────────────
  const onDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = _dragType === 'new' ? 'copy' : 'move';
    setDragOverIndex(index);
    setCanvasDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const onCanvasDragOver = useCallback((e) => {
    e.preventDefault();
    setCanvasDragOver(true);
  }, []);

  const onCanvasDragLeave = useCallback((e) => {
    if (!canvasRef.current?.contains(e.relatedTarget)) {
      setCanvasDragOver(false);
      setDragOverIndex(null);
    }
  }, []);

  const onDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (_dragType === 'new' && _dragBlockType) {
      const newBlock = createBlock(_dragBlockType);
      addBlock(newBlock, dropIndex);
    } else if (_dragType === 'reorder' && _dragIndex !== null) {
      const from = _dragIndex;
      const to   = dropIndex !== undefined ? dropIndex : blocks.length - 1;
      if (from !== to) reorderBlocks(from, to);
    }

    _dragType = null; _dragIndex = null; _dragBlockType = null;
    setDragOverIndex(null);
    setCanvasDragOver(false);
  }, [addBlock, reorderBlocks, blocks.length]);

  const onCanvasDrop = useCallback((e) => {
    e.preventDefault();
    if (_dragType === 'new' && _dragBlockType) {
      addBlock(createBlock(_dragBlockType));
    } else if (_dragType === 'reorder' && _dragIndex !== null) {
      // dropped at end
      reorderBlocks(_dragIndex, blocks.length - 1);
    }
    _dragType = null; _dragIndex = null; _dragBlockType = null;
    setCanvasDragOver(false);
    setDragOverIndex(null);
  }, [addBlock, reorderBlocks, blocks.length]);

  // ── Palette click ──────────────────────────────────────────────────────────
  const onPaletteAdd = useCallback((block) => {
    addBlock(block);
  }, [addBlock]);

  // ── Clear canvas with confirm ──────────────────────────────────────────────
  const handleClear = () => {
    if (confirmClear) { clearCanvas(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-canvas">
      <Topbar
        pageTitle={pageTitle}
        setPageTitle={setPageTitle}
        preview={preview}
        togglePreview={togglePreview}
        onClear={handleClear}
        blockCount={blocks.length}
      />

      {/* Confirm clear banner */}
      {confirmClear && (
        <div className="flex items-center justify-center gap-3 px-4 py-2 bg-rose-500/15 border-b border-rose-500/25 animate-slide-in flex-shrink-0">
          <p className="text-sm text-rose-300 font-body">This will delete all {blocks.length} blocks. Are you sure?</p>
          <button onClick={() => { clearCanvas(); setConfirmClear(false); }}
            className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold transition-all font-body">
            Yes, clear all
          </button>
          <button onClick={() => setConfirmClear(false)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-all font-body">
            Cancel
          </button>
        </div>
      )}

      {preview ? (
        // ── PREVIEW MODE ────────────────────────────────────────────────────
        <div className="flex-1 overflow-y-auto">
          <PreviewMode blocks={blocks} pageTitle={pageTitle} />
        </div>
      ) : (
        // ── EDITOR MODE ─────────────────────────────────────────────────────
        <div className="flex flex-1 overflow-hidden">

          {/* Palette sidebar */}
          <div className="w-56 flex-shrink-0 border-r border-white/8 bg-panel/60 backdrop-blur-xl overflow-hidden flex flex-col">
            <Palette onAdd={onPaletteAdd} onDragStart={onPaletteDragStart} />
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className={`flex-1 overflow-y-auto transition-all duration-200
                         ${canvasDragOver ? 'drop-active' : ''}`}
            onClick={(e) => { if (e.target === e.currentTarget) deselect(); }}
            onDragOver={onCanvasDragOver}
            onDragLeave={onCanvasDragLeave}
            onDrop={onCanvasDrop}
          >
            <div className="max-w-2xl mx-auto px-6 py-10">

              {/* Canvas header */}
              <div className="mb-8 text-center">
                <p className="text-[11px] text-slate-700 font-mono uppercase tracking-widest">
                  🧱 Canvas — {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Empty state */}
              {blocks.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-32 rounded-2xl border-2 border-dashed
                                  transition-all duration-300
                                  ${canvasDragOver
                                    ? 'border-ink-400/60 bg-ink-500/10'
                                    : 'border-white/10 bg-white/[0.02]'}`}>
                  <div className="text-5xl mb-4 animate-float">🧱</div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">Your canvas is empty</h3>
                  <p className="text-slate-500 text-sm text-center max-w-xs leading-relaxed font-body">
                    Drag blocks from the left panel, or click any block type to add it here.
                  </p>
                  {canvasDragOver && (
                    <p className="mt-4 text-ink-400 text-sm font-mono animate-pulse">Drop here!</p>
                  )}
                </div>
              )}

              {/* Block list */}
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <CanvasBlock
                    key={block.id}
                    block={block}
                    index={index}
                    total={blocks.length}
                    isSelected={selectedId === block.id}
                    onSelect={selectBlock}
                    onRemove={removeBlock}
                    onDuplicate={duplicateBlock}
                    onMoveUp={moveUp}
                    onMoveDown={moveDown}
                    onDragStart={onBlockDragStart}
                    onDragEnd={onBlockDragEnd}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    isDragOver={dragOverIndex === index}
                  />
                ))}
              </div>

              {/* Bottom drop zone */}
              {blocks.length > 0 && (
                <div
                  className={`mt-4 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center
                               transition-all duration-200
                               ${canvasDragOver && dragOverIndex === null
                                 ? 'border-ink-400/50 bg-ink-500/8'
                                 : 'border-white/5'}`}
                  onDragOver={e => { e.preventDefault(); setCanvasDragOver(true); setDragOverIndex(null); }}
                  onDrop={onCanvasDrop}
                >
                  <p className="text-xs text-slate-700 font-mono">
                    {canvasDragOver ? '↓ Drop here to add at end' : '+ Drop blocks here'}
                  </p>
                </div>
              )}

              <div className="h-20" />
            </div>
          </div>

          {/* Right panel — Block Editor */}
          <div className={`border-l border-white/8 bg-panel/60 backdrop-blur-xl overflow-hidden flex flex-col
                            transition-all duration-300
                            ${selectedBlock ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}>
            {selectedBlock && (
              <BlockEditor
                block={selectedBlock}
                onUpdate={updateBlock}
                onClose={deselect}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}