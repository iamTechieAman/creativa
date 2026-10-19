import React from 'react';
import { X, History, RotateCcw, Clock, Check, Eye } from 'lucide-react';

export default function VersionHistoryModal({
  isOpen,
  onClose,
  historySnapshots = [],
  currentIndex = 0,
  onRestoreSnapshot
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl canva-gradient flex items-center justify-center text-white shadow-xs">
              <History size={16} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 text-sm">Version History</h3>
              </div>
              <p className="text-[11px] text-slate-500">Restore any previous design checkpoint with 1-click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Snapshots List */}
        <div className="p-5 overflow-y-auto space-y-2.5 text-xs text-slate-700 flex-1">
          {historySnapshots.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p>No previous checkpoints recorded yet.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Modifying elements creates autosave snapshots automatically.</p>
            </div>
          ) : (
            historySnapshots.map((item, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent 
                      ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500 shadow-xs' 
                      : 'border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <Clock size={15} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">
                          Version #{idx + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600 text-white">
                            Current Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Auto-saved'}
                      </span>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        onRestoreSnapshot(idx);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-600 hover:text-white border border-slate-300 font-semibold text-xs transition-all flex items-center space-x-1"
                    >
                      <RotateCcw size={12} />
                      <span>Restore</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Continuous Cloud Autosave Active</span>
          <button
            onClick={onClose}
            className="canva-btn-primary px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
