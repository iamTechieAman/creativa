import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function PresentationModal({
  isOpen,
  onClose,
  pages,
  renderPagePreview
}) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentPageIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentPageIndex(prev => Math.min(prev + 1, pages.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentPageIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, onClose]);

  if (!isOpen || !pages || pages.length === 0) return null;

  const currentPage = pages[currentPageIndex];

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 select-none animate-in fade-in duration-200">
      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white backdrop-blur-md shadow-lg transition-colors"
          title="Exit Presentation (Esc)"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Previous Button */}
        {currentPageIndex > 0 && (
          <button
            onClick={() => setCurrentPageIndex(prev => prev - 1)}
            className="absolute left-6 p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-white backdrop-blur-md transition-all z-10"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Slide Frame */}
        <div 
          className="max-h-[88vh] max-w-[88vw] aspect-square rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-slate-800"
          style={{ background: currentPage.backgroundColor || '#ffffff' }}
        >
          {currentPage.previewUrl ? (
            <img 
              src={currentPage.previewUrl} 
              alt={`Page ${currentPageIndex + 1}`} 
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-slate-400 font-medium">Page {currentPageIndex + 1}</div>
          )}
        </div>

        {/* Next Button */}
        {currentPageIndex < pages.length - 1 && (
          <button
            onClick={() => setCurrentPageIndex(prev => prev + 1)}
            className="absolute right-6 p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-white backdrop-blur-md transition-all z-10"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="h-14 bg-slate-900/90 border-t border-slate-800/80 px-6 flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">
          Slide {currentPageIndex + 1} of {pages.length}
        </span>

        {/* Slide dots */}
        <div className="flex items-center space-x-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPageIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentPageIndex ? 'w-6 bg-purple-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        <span className="text-[11px] text-slate-500">
          Use Left / Right arrow keys to navigate
        </span>
      </div>
    </div>
  );
}
