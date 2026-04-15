import { useState, useEffect } from 'react';

const Topbar = ({ pageTitle, setPageTitle, preview, togglePreview, onClear, blockCount }) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);

  // Flash "Saved" indicator whenever title changes
  useEffect(() => {
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [pageTitle, blockCount]);

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/8 flex-shrink-0 bg-panel/80 backdrop-blur-xl">

      {/* Left — Logo + Page title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Logo mark */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ink-400 to-ink-700 flex items-center justify-center shadow-glow-sm animate-glow-pulse">
            <span className="text-base">🧱</span>
          </div>
          <span className="hidden sm:block font-display text-base font-bold text-white">
            Page<span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#a78bfa,#10b981)'}}>Craft</span>
          </span>
        </div>

        <div className="w-px h-5 bg-white/10 flex-shrink-0" />

        {/* Editable title */}
        {editing ? (
          <input
            autoFocus
            className="bg-transparent border-b border-ink-500/60 text-white text-sm font-semibold
                        outline-none px-0 py-0.5 font-body min-w-0 w-48"
            value={pageTitle}
            onChange={e => setPageTitle(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
          />
        ) : (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 group min-w-0">
            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate font-body">
              {pageTitle || 'Untitled Page'}
            </span>
            <svg className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Auto-save indicator */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono
                          transition-all duration-500
                          ${saved
                            ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400'
                            : 'bg-white/5 border border-white/8 text-slate-600'}`}>
          {saved ? (
            <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75"/></svg>Saved</>
          ) : (
            <><span className="w-1.5 h-1.5 rounded-full bg-slate-600 animate-pulse" />{blockCount} block{blockCount !== 1 ? 's' : ''}</>
          )}
        </div>

        {/* Clear canvas */}
        <button onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border
                      bg-white/5 border-white/8 text-slate-500 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400
                      transition-all duration-150 font-body">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Preview toggle */}
        <button onClick={togglePreview}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border
                       transition-all duration-200 font-body
                       ${preview
                         ? 'bg-ink-600 border-ink-500 text-white shadow-glow-sm'
                         : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'}`}>
          {preview ? (
            <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/></svg>Edit</>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Preview</>
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
