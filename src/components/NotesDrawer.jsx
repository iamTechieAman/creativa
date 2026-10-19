import React from 'react';
import { X, FileText, Sparkles } from 'lucide-react';

export default function NotesDrawer({
  isOpen,
  onClose,
  pageIndex,
  pageNotes,
  onUpdateNotes
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-10 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl p-4 flex flex-col text-slate-800 animate-in slide-in-from-bottom duration-200 max-h-56">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <FileText size={16} className="text-purple-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Page {pageIndex + 1} Presenter Notes
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="pt-2 flex-1 flex flex-col">
        <textarea
          value={pageNotes || ''}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Add talking points, presenter notes, or reminders for this page..."
          className="w-full h-24 p-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-purple-500 resize-none placeholder-slate-400 transition-all font-sans"
        />
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Sparkles size={12} className="text-purple-500" />
            <span>Notes will appear during presenter view</span>
          </span>
          <span>{pageNotes?.length || 0} characters</span>
        </div>
      </div>
    </div>
  );
}
