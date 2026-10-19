import React, { useState, useEffect } from 'react';
import { 
  X, Pipette, Plus, Sparkles, Shuffle, 
  Palette, Sliders, Check, Search 
} from 'lucide-react';
import { SOLID_COLORS, GRADIENT_PRESETS } from '../data/backgrounds';
import { BRAND_PALETTES } from '../data/brand';

export default function CanvaColorPickerModal({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
  canvas
}) {
  const [activeTab, setActiveTab] = useState('solid'); // 'solid' or 'gradient'
  const [customHex, setCustomHex] = useState(currentColor || '#7D2AE8');
  const [searchQuery, setSearchQuery] = useState('');
  const [documentColors, setDocumentColors] = useState([]);
  const [photoColors, setPhotoColors] = useState([]);
  const [customAngle, setCustomAngle] = useState(135);
  const [gradStop1, setGradStop1] = useState('#7D2AE8');
  const [gradStop2, setGradStop2] = useState('#00C4CC');

  // Extract Document Colors & Photo Colors dynamically from canvas
  useEffect(() => {
    if (!isOpen || !canvas) return;

    const docCols = new Set();
    const photoList = [];

    // Add canvas background color
    if (canvas.backgroundColor && typeof canvas.backgroundColor === 'string' && canvas.backgroundColor.startsWith('#')) {
      docCols.add(canvas.backgroundColor);
    }

    const objects = canvas.getObjects();
    objects.forEach(obj => {
      if (obj.fill && typeof obj.fill === 'string' && obj.fill.startsWith('#')) {
        docCols.add(obj.fill);
      }
      if (obj.stroke && typeof obj.stroke === 'string' && obj.stroke.startsWith('#')) {
        docCols.add(obj.stroke);
      }
      if (obj.textBackgroundColor && typeof obj.textBackgroundColor === 'string' && obj.textBackgroundColor.startsWith('#')) {
        docCols.add(obj.textBackgroundColor);
      }

      // Check for images to extract photo colors
      if (obj.type === 'image') {
        const src = obj.getSrc?.() || obj._element?.src;
        if (src) {
          // Predefined photo palettes matching common themes
          photoList.push({
            name: obj.name || 'Photo on page',
            src,
            palette: ['#1e293b', '#3b82f6', '#93c5fd', '#f1f5f9', '#f59e0b']
          });
        }
      }
    });

    setDocumentColors(Array.from(docCols));
    setPhotoColors(photoList);
    setCustomHex(currentColor || '#7D2AE8');
  }, [isOpen, canvas, currentColor]);

  if (!isOpen) return null;

  // Eyedropper API
  const handleOpenEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          setCustomHex(result.sRGBHex);
          onSelectColor(result.sRGBHex);
        }
      } catch (e) {
        console.log('Eyedropper cancelled');
      }
    } else {
      alert('Screen Eyedropper is supported on Chrome & Edge for Mac.');
    }
  };

  const handleHexChange = (hex) => {
    setCustomHex(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
      onSelectColor(hex);
    }
  };

  const handleApplyCustomGradient = () => {
    const gradString = `linear-gradient(${customAngle}deg, ${gradStop1} 0%, ${gradStop2} 100%)`;
    onSelectColor(gradString);
  };

  const filteredSolidColors = SOLID_COLORS.filter(c => 
    !searchQuery || c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg canva-gradient flex items-center justify-center text-white shadow-xs">
              <Palette size={14} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Creativa Color Palette</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switch: Solid vs Gradient */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('solid')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'solid' ? 'border-purple-600 text-purple-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Solid Colors
          </button>
          <button
            onClick={() => setActiveTab('gradient')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'gradient' ? 'border-purple-600 text-purple-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Gradients
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Custom Hex & Eyedropper Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2">
              {/* Native Eyedropper Button */}
              <button
                onClick={handleOpenEyeDropper}
                className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-purple-50 hover:border-purple-400 text-slate-700 hover:text-purple-700 transition-colors shadow-xs"
                title="Eyedropper: Pick any color from screen"
              >
                <Pipette size={15} />
              </button>

              {/* Color swatch input */}
              <div className="relative flex-1 flex items-center border border-slate-300 rounded-xl bg-white px-2 py-1 shadow-xs">
                <input
                  type="color"
                  value={customHex.startsWith('#') ? customHex : '#7D2AE8'}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-6 h-6 rounded-md cursor-pointer border-0 bg-transparent p-0 mr-2"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#7D2AE8"
                  className="w-full text-xs font-mono font-bold text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Current Preview swatch */}
              <div 
                className="w-8 h-8 rounded-xl border border-black/10 shadow-sm shrink-0" 
                style={{ background: currentColor || '#ffffff' }}
                title="Active color"
              />
            </div>
          </div>

          {/* TAB 1: SOLID COLORS */}
          {activeTab === 'solid' && (
            <>
              {/* SECTION: DOCUMENT COLORS */}
              {documentColors.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Document Colors
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {documentColors.length} in use
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {documentColors.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCustomHex(c);
                          onSelectColor(c);
                        }}
                        className={`w-7 h-7 rounded-xl border shadow-xs transition-transform hover:scale-110 relative flex items-center justify-center ${
                          currentColor === c ? 'ring-2 ring-purple-600 ring-offset-1 scale-105 border-transparent' : 'border-slate-300'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      >
                        {currentColor === c && <Check size={12} className={c === '#ffffff' ? 'text-black' : 'text-white'} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION: PHOTO COLORS */}
              {photoColors.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Photo Colors
                  </span>
                  {photoColors.slice(0, 2).map((pc, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <img 
                        src={pc.src} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-300" 
                      />
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {pc.palette.map(col => (
                          <button
                            key={col}
                            onClick={() => {
                              setCustomHex(col);
                              onSelectColor(col);
                            }}
                            className="w-6 h-6 rounded-lg border border-slate-300 shadow-xs hover:scale-110 transition-transform"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION: BRAND KIT PALETTES */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Brand Kit Colors
                    </span>
                  </div>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {BRAND_PALETTES.map(bp => (
                    <div key={bp.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[110px]">
                          {bp.name}
                        </span>
                        {bp.category && (
                          <span className="text-[9px] text-purple-600 font-medium">{bp.category}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {bp.colors.map(col => (
                          <button
                            key={col}
                            onClick={() => {
                              setCustomHex(col);
                              onSelectColor(col);
                            }}
                            className="w-6 h-6 rounded-lg border border-slate-300 shadow-xs hover:scale-110 transition-transform"
                            style={{ backgroundColor: col }}
                            title={col}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: DEFAULT CANVA COLORS */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Default Palette Colors
                </span>
                <div className="grid grid-cols-6 gap-2">
                  {filteredSolidColors.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setCustomHex(c);
                        onSelectColor(c);
                      }}
                      className={`w-8 h-8 rounded-xl border shadow-xs transition-transform hover:scale-110 relative flex items-center justify-center ${
                        currentColor === c ? 'ring-2 ring-purple-600 ring-offset-1 scale-105 border-transparent' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    >
                      {currentColor === c && <Check size={13} className={c === '#ffffff' ? 'text-black' : 'text-white'} />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: GRADIENTS */}
          {activeTab === 'gradient' && (
            <div className="space-y-4">
              {/* Custom Gradient Builder */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Custom 2-Stop Gradient
                </span>

                <div className="flex items-center space-x-3">
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">Color 1:</span>
                    <input
                      type="color"
                      value={gradStop1}
                      onChange={(e) => setGradStop1(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">Color 2:</span>
                    <input
                      type="color"
                      value={gradStop2}
                      onChange={(e) => setGradStop2(e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Gradient Angle:</span>
                    <span className="font-bold text-purple-700">{customAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customAngle}
                    onChange={(e) => setCustomAngle(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Gradient Preview Pill */}
                <div 
                  className="w-full h-10 rounded-xl border border-black/10 shadow-inner" 
                  style={{ background: `linear-gradient(${customAngle}deg, ${gradStop1} 0%, ${gradStop2} 100%)` }}
                />

                <button
                  onClick={handleApplyCustomGradient}
                  className="canva-btn-primary w-full py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  Apply Custom Gradient
                </button>
              </div>

              {/* Curated Canva Gradients */}
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Creativa Gradient Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map(g => (
                    <button
                      key={g.name}
                      onClick={() => onSelectColor(g.gradient)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 transition-all text-left group shadow-xs hover:shadow-md flex flex-col justify-between h-20"
                      style={{ background: g.gradient }}
                    >
                      <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs w-fit">
                        {g.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Creativa Unified Color Engine</span>
          <button
            onClick={onClose}
            className="canva-btn-primary px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
