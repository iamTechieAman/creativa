import React from 'react';
import { X, Plus, Copy, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function GridViewModal({
  isOpen,
  onClose,
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between p-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Grid View
          </h2>
          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">
            {pages.length} {pages.length === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onAddPage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg canva-btn-primary text-xs font-semibold"
          >
            <Plus size={14} />
            <span>Add page</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {pages.map((p, idx) => {
            const isActive = idx === activePageIndex;
            return (
              <div
                key={p.id || idx}
                onClick={() => {
                  onSelectPage(idx);
                  onClose();
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-slate-900 flex flex-col relative ${
                  isActive 
                    ? 'border-purple-500 shadow-xl shadow-purple-500/20 ring-2 ring-purple-500/50 scale-102' 
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
                }`}
              >
                {/* Active checkmark badge */}
                {isActive && (
                  <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Check size={14} />
                  </div>
                )}

                {/* Preview stage */}
                <div 
                  className="aspect-square w-full flex items-center justify-center p-3 relative overflow-hidden"
                  style={{ backgroundColor: p.backgroundColor || '#ffffff' }}
                >
                  {p.previewUrl ? (
                    <img 
                      src={p.previewUrl} 
                      alt={p.title || `Page ${idx + 1}`} 
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                    />
                  ) : (
                    <span className="text-slate-400 font-semibold text-xs drop-shadow">
                      {p.title || `Page ${idx + 1}`}
                    </span>
                  )}
                </div>

                {/* Card footer with actions */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-purple-300">
                      {idx + 1}. {p.title || `Page ${idx + 1}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMovePage(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                      title="Move left"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      onClick={() => onMovePage(idx, 'right')}
                      disabled={idx === pages.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800"
                      title="Move right"
                    >
                      <ArrowRight size={13} />
                    </button>
                    <button
                      onClick={() => onDuplicatePage(idx)}
                      className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                      title="Duplicate"
                    >
                      <Copy size={13} />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={() => onDeletePage(idx)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Page Card */}
          <div
            onClick={onAddPage}
            className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 hover:border-purple-500/60 bg-slate-900/40 hover:bg-slate-900 cursor-pointer flex flex-col items-center justify-center p-6 text-slate-400 hover:text-purple-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-800 group-hover:bg-purple-600/20 group-hover:text-purple-400 flex items-center justify-center mb-2 transition-all">
              <Plus size={24} />
            </div>
            <span className="text-xs font-semibold">Add page</span>
          </div>
        </div>
      </div>

      {/* Bottom Info bar */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Click on any card to navigate to that page.</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
