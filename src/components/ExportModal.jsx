import React, { useState } from 'react';
import { X, Download, FileImage, FileCode, FileText, CheckCircle2, Layers, Crown, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportCanvasAsImage, exportCanvasAsSVG, exportCanvasAsPDF, downloadDataUrl } from '../utils/export';

export default function ExportModal({
  isOpen,
  onClose,
  canvas,
  canvasWidth,
  canvasHeight,
  projectTitle,
  pages = [],
  activePageIndex = 0
}) {
  const [format, setFormat] = useState('png');
  const [multiplier, setMultiplier] = useState(2);
  const [transparent, setTransparent] = useState(false);
  const [quality, setQuality] = useState(0.95);
  const [exportAllPages, setExportAllPages] = useState(pages.length > 1);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    const cleanTitle = (projectTitle || 'design').replace(/[^a-z0-9_-]/gi, '_');

    try {
      if (format === 'png' || format === 'jpg') {
        const dataURL = exportCanvasAsImage({
          canvas,
          format,
          quality,
          multiplier,
          transparent: format === 'png' ? transparent : false,
          canvasWidth,
          canvasHeight
        });

        if (dataURL) {
          downloadDataUrl(dataURL, `${cleanTitle}_page_${activePageIndex + 1}.${format}`);
        }
      } else if (format === 'svg') {
        exportCanvasAsSVG({
          canvas,
          canvasWidth,
          canvasHeight,
          filename: `${cleanTitle}.svg`
        });
      } else if (format === 'pdf') {
        await exportCanvasAsPDF({
          canvas,
          canvasWidth,
          canvasHeight,
          multiplier,
          filename: `${cleanTitle}.pdf`,
          pages,
          activePageIndex,
          exportAllPages
        });
      }

      // Celebrate success!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.65 }
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 600);
    } catch (e) {
      console.error('Export failed:', e);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg canva-gradient flex items-center justify-center text-white shadow-sm">
              <Download size={16} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">Export & Download</h3>
                <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-extrabold uppercase">
                  <Crown size={10} className="fill-amber-500 text-amber-500" />
                  <span>Pro Free</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">All premium high-res formats unlocked for free</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* File Format Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              File Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'png', label: 'PNG', sub: 'High-res image', icon: FileImage },
                { id: 'jpg', label: 'JPG', sub: 'Compressed image', icon: FileImage },
                { id: 'svg', label: 'SVG', sub: 'Vector graphic', icon: FileCode, isPro: true },
                { id: 'pdf', label: 'PDF', sub: 'Print document', icon: FileText }
              ].map(item => {
                const isSelected = format === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all relative ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 text-purple-700 shadow-xs ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {item.isPro && (
                      <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[8px] px-1 rounded-full shadow-xs">
                        FREE
                      </span>
                    )}
                    <Icon size={20} className={isSelected ? 'text-purple-600' : 'text-slate-400'} />
                    <span className="font-bold text-xs mt-1.5">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page Range Selection (for multi-page documents) */}
          {pages && pages.length > 1 && (
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Layers size={13} className="text-purple-600" />
                  <span>Page Selection ({pages.length} Pages)</span>
                </span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-mono font-bold">
                  Multi-page PDF Unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setExportAllPages(true)}
                  className={`py-1.5 px-3 rounded-lg border font-medium transition-colors ${
                    exportAllPages 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                      : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-100/50'
                  }`}
                >
                  All {pages.length} Pages
                </button>
                <button
                  onClick={() => setExportAllPages(false)}
                  className={`py-1.5 px-3 rounded-lg border font-medium transition-colors ${
                    !exportAllPages 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                      : 'bg-white border-purple-200 text-purple-800 hover:bg-purple-100/50'
                  }`}
                >
                  Current Page ({activePageIndex + 1})
                </button>
              </div>
            </div>
          )}

          {/* Format-specific Options */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            {/* Multiplier / Resolution scale */}
            {(format === 'png' || format === 'jpg' || format === 'pdf') && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-700">Resolution Scale:</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Pro Unlocked
                    </span>
                  </div>
                  <span className="font-bold text-purple-700">{multiplier}x ({canvasWidth * multiplier} × {canvasHeight * multiplier}px)</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { m: 1, label: '1x (Web)' },
                    { m: 2, label: '2x (HD)' },
                    { m: 3, label: '3x (Print)' },
                    { m: 4, label: '4x (4K UHD)' }
                  ].map(opt => (
                    <button
                      key={opt.m}
                      onClick={() => setMultiplier(opt.m)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        multiplier === opt.m
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PNG Transparent Background option */}
            {format === 'png' && (
              <label className="flex items-center justify-between cursor-pointer pt-1 bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800">Transparent Background</span>
                </div>
              </label>
            )}

            {/* JPG Quality slider */}
            {format === 'jpg' && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">JPEG Quality:</span>
                  <span className="font-semibold text-purple-700">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="canva-btn-primary flex items-center space-x-2 px-5 py-2 rounded-lg font-bold text-xs shadow-md"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating File...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
