import React from 'react';
import { Plus, Copy, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

export default function PagesBar({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage
}) {
  return (
    <div className="h-12 bg-white border-t border-slate-200 px-4 flex items-center justify-between text-xs text-slate-700 z-30 select-none shrink-0 shadow-xs">
      {/* Left: Page count & Reorder */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-800">
          Page {activePageIndex + 1} of {pages.length}
        </span>
        {pages.length > 1 && (
          <div className="flex items-center space-x-1 pl-1 border-l border-slate-200">
            <button
              onClick={() => onMovePage?.(activePageIndex, 'left')}
              disabled={activePageIndex === 0}
              className={`p-1 rounded hover:bg-slate-100 transition-colors ${activePageIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'}`}
              title="Move page left"
            >
              <ArrowLeft size={13} />
            </button>
            <button
              onClick={() => onMovePage?.(activePageIndex, 'right')}
              disabled={activePageIndex === pages.length - 1}
              className={`p-1 rounded hover:bg-slate-100 transition-colors ${activePageIndex === pages.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'}`}
              title="Move page right"
            >
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Center: Page Tabs / Thumbnails */}
      <div className="flex items-center space-x-2 overflow-x-auto max-w-xl py-1 px-2">
        {pages.map((p, idx) => {
          const isActive = idx === activePageIndex;
          return (
            <div
              key={p.id || idx}
              onClick={() => onSelectPage(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all border ${
                isActive
                  ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold shadow-xs ring-1 ring-purple-500'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
              }`}
            >
              <div 
                className="w-3.5 h-3.5 rounded border border-slate-300 shadow-xs shrink-0" 
                style={{ backgroundColor: p.backgroundColor || '#ffffff' }}
              />
              <span className="text-[11px] truncate max-w-[80px]">
                {p.title || `Page ${idx + 1}`}
              </span>
            </div>
          );
        })}

        {/* Add Page Button */}
        <button
          onClick={onAddPage}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-slate-600 font-semibold transition-colors shrink-0"
          title="Add empty page"
        >
          <Plus size={14} className="text-purple-600" />
          <span>Add page</span>
        </button>
      </div>

      {/* Right: Actions for active page */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onDuplicatePage}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 shadow-xs"
          title="Duplicate current page"
        >
          <Copy size={13} />
          <span className="hidden sm:inline">Duplicate</span>
        </button>

        {pages.length > 1 && (
          <button
            onClick={onDeletePage}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors border border-slate-200 shadow-xs"
            title="Delete current page"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
}
