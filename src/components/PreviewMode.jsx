import BlockRenderer from './BlockRenderer';

const PreviewMode = ({ blocks, pageTitle }) => (
  <div className="min-h-full" style={{ background: 'linear-gradient(180deg, #0f0f17 0%, #131320 100%)' }}>
    {/* Preview banner */}
    <div className="sticky top-0 z-10 flex items-center justify-center gap-2 px-4 py-2
                     bg-ink-600/20 backdrop-blur-xl border-b border-ink-500/20">
      <span className="w-2 h-2 rounded-full bg-ink-400 animate-pulse" />
      <p className="text-xs text-ink-300 font-mono">Preview Mode — This is how your page looks to visitors</p>
    </div>

    {/* Page content */}
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Page title */}
      <header className="mb-12 pb-8 border-b border-white/8">
        <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
          {pageTitle || 'Untitled Page'}
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 rounded-full bg-ink-600 flex items-center justify-center text-[10px]">✨</div>
          <p className="text-sm text-slate-500 font-body">Personal Page · Built with PageCraft</p>
        </div>
      </header>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-600 text-base">No content yet. Go back to the editor and add some blocks!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {blocks.map(block => (
            <section key={block.id}>
              <BlockRenderer block={block} />
            </section>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/5 text-center">
        <p className="text-xs text-slate-700 font-mono">Made with 🧱 PageCraft</p>
      </footer>
    </article>
  </div>
);

export default PreviewMode;
