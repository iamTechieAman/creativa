import React, { useState } from 'react';
import { X, Save, CheckCircle2, FolderHeart } from 'lucide-react';

export default function SaveModal({
  isOpen,
  onClose,
  currentTitle,
  onSaveConfirm
}) {
  const [title, setTitle] = useState(currentTitle || 'My Design');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaveConfirm(title.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FolderHeart size={16} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Save Design</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">
              Design Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Promo 2026"
              autoFocus
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Your design will be saved directly in your browser's local library so you can reopen, edit, or duplicate it anytime.
          </p>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="canva-btn-primary flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={14} className="text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Design</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
