import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders, RotateCcw, Crown } from 'lucide-react';
import { Shadow, Path } from 'fabric';
import { SOLID_COLORS } from '../data/backgrounds';

export default function TextEffectsPopover({
  isOpen,
  onClose,
  activeObject,
  onUpdateProp,
  onSetShadow
}) {
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [neonColor, setNeonColor] = useState('#00F0FF');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(15);
  const [shadowOffsetX, setShadowOffsetX] = useState(5);
  const [shadowOffsetY, setShadowOffsetY] = useState(5);
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [bgColor, setBgColor] = useState('#fef08a');
  
  // Shape: Curve
  const [shapeType, setShapeType] = useState('none'); // 'none' or 'curve'
  const [curvature, setCurvature] = useState(50);

  useEffect(() => {
    if (activeObject) {
      if (activeObject.path) {
        setShapeType('curve');
      } else {
        setShapeType('none');
      }
    }
  }, [activeObject]);

  if (!isOpen || !activeObject) return null;

  const applyNeon = (color, blurVal = 25) => {
    setSelectedEffect('neon');
    setNeonColor(color);
    onSetShadow(new Shadow({
      color: color,
      blur: blurVal,
      offsetX: 0,
      offsetY: 0
    }));
  };

  const applyShadow = (color, blur, ox, oy) => {
    setSelectedEffect('shadow');
    onSetShadow(new Shadow({
      color: color,
      blur: blur,
      offsetX: ox,
      offsetY: oy
    }));
  };

  const applyLift = () => {
    setSelectedEffect('lift');
    onSetShadow(new Shadow({
      color: 'rgba(0, 0, 0, 0.45)',
      blur: 20,
      offsetX: 0,
      offsetY: 8
    }));
  };

  const applyHollow = (strokeWidth = 2) => {
    setSelectedEffect('hollow');
    setOutlineWidth(strokeWidth);
    onUpdateProp('stroke', activeObject.fill && activeObject.fill !== 'transparent' ? activeObject.fill : '#1e293b');
    onUpdateProp('strokeWidth', strokeWidth);
    onUpdateProp('fill', 'transparent');
  };

  const applySplice = () => {
    setSelectedEffect('splice');
    onUpdateProp('stroke', activeObject.fill && activeObject.fill !== 'transparent' ? activeObject.fill : '#7D2AE8');
    onUpdateProp('strokeWidth', 2);
    onUpdateProp('fill', 'transparent');
    onSetShadow(new Shadow({
      color: '#1e293b',
      blur: 0,
      offsetX: 4,
      offsetY: 4
    }));
  };

  const applyOutline = (color = '#000000', width = 2) => {
    setSelectedEffect('outline');
    setOutlineColor(color);
    setOutlineWidth(width);
    onUpdateProp('stroke', color);
    onUpdateProp('strokeWidth', width);
    if (activeObject.fill === 'transparent') {
      onUpdateProp('fill', '#ffffff');
    }
  };

  const applyEcho = () => {
    setSelectedEffect('echo');
    onSetShadow(new Shadow({
      color: 'rgba(100, 116, 139, 0.7)',
      blur: 0,
      offsetX: 6,
      offsetY: 6
    }));
  };

  const applyGlitch = () => {
    setSelectedEffect('glitch');
    onSetShadow(new Shadow({
      color: '#00F0FF',
      blur: 2,
      offsetX: -4,
      offsetY: 3
    }));
  };

  const applyBackgroundBox = (color) => {
    setSelectedEffect('background');
    setBgColor(color);
    onUpdateProp('textBackgroundColor', color);
  };

  const clearEffects = () => {
    setSelectedEffect('none');
    onSetShadow(null);
    onUpdateProp('strokeWidth', 0);
    onUpdateProp('textBackgroundColor', '');
    if (activeObject.fill === 'transparent') {
      onUpdateProp('fill', activeObject.stroke || '#1e293b');
    }
  };

  // Curve generator for text on path
  const updateCurvature = (val) => {
    setCurvature(val);
    if (!activeObject) return;

    if (val === 0) {
      activeObject.set('path', null);
    } else {
      const textWidth = Math.max(activeObject.width || 200, 160);
      const sagitta = (val / 100) * (textWidth * 0.45);
      let d;
      if (sagitta > 0) {
        d = `M 0,0 Q ${textWidth / 2},${sagitta * 2} ${textWidth},0`;
      } else {
        const abs = Math.abs(sagitta);
        d = `M 0,${abs * 2} Q ${textWidth / 2},0 ${textWidth},${abs * 2}`;
      }
      const p = new Path(d, { visible: false });
      activeObject.set('path', p);
      if (activeObject.setPathInfo) activeObject.setPathInfo();
    }

    if (activeObject.initDimensions) activeObject.initDimensions();
    activeObject.setCoords();
    activeObject.canvas?.requestRenderAll();
  };

  const setShape = (type) => {
    setShapeType(type);
    if (type === 'none') {
      if (activeObject) {
        activeObject.set('path', null);
        if (activeObject.initDimensions) activeObject.initDimensions();
        activeObject.setCoords();
        activeObject.canvas?.requestRenderAll();
      }
    } else if (type === 'curve') {
      updateCurvature(curvature);
    }
  };

  return (
    <div className="fixed inset-x-3 top-16 md:absolute md:top-12 md:left-64 md:inset-x-auto w-auto md:w-88 max-w-sm mx-auto md:mx-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-40 select-none text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-1.5 font-bold text-slate-900">
          <Sparkles size={15} className="text-purple-600" />
          <span>Creativa Text Effects</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <X size={15} />
        </button>
      </div>

      <div className="py-3 space-y-4">
        {/* SECTION 1: STYLE PRESETS */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Style Presets
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={clearEffects}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'none' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-semibold mb-0.5">None</span>
              <span className="text-[9px] text-slate-400">Normal</span>
            </button>

            <button
              onClick={() => applyShadow(shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY)}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'shadow' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold drop-shadow mb-0.5">Shadow</span>
              <span className="text-[9px] text-slate-400">Offset</span>
            </button>

            <button
              onClick={applyLift}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'lift' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold mb-0.5" style={{ textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>Lift</span>
              <span className="text-[9px] text-slate-400">Floating</span>
            </button>

            <button
              onClick={() => applyHollow(2)}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'hollow' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold mb-0.5" style={{ WebkitTextStroke: '1px #7D2AE8', color: 'transparent' }}>
                Hollow
              </span>
              <span className="text-[9px] text-slate-400">Outline</span>
            </button>

            <button
              onClick={applySplice}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'splice' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold text-purple-600 mb-0.5" style={{ textShadow: '2px 2px 0px #000' }}>
                Splice
              </span>
              <span className="text-[9px] text-slate-400">Cutout</span>
            </button>

            <button
              onClick={() => applyOutline(outlineColor, 2)}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'outline' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold text-slate-900 mb-0.5" style={{ WebkitTextStroke: '1px #000' }}>
                Outline
              </span>
              <span className="text-[9px] text-slate-400">Border</span>
            </button>

            <button
              onClick={applyEcho}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'echo' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold text-slate-700 mb-0.5" style={{ textShadow: '3px 3px 0px #94a3b8' }}>
                Echo
              </span>
              <span className="text-[9px] text-slate-400">Multi</span>
            </button>

            <button
              onClick={applyGlitch}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'glitch' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold text-pink-500 mb-0.5" style={{ textShadow: '-2px 1px 0px #00F0FF' }}>
                Glitch
              </span>
              <span className="text-[9px] text-slate-400">Cyber</span>
            </button>

            <button
              onClick={() => applyNeon(neonColor)}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'neon' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-bold text-cyan-500 drop-shadow mb-0.5">Neon</span>
              <span className="text-[9px] text-slate-400">Glow</span>
            </button>

            <button
              onClick={() => applyBackgroundBox(bgColor)}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${selectedEffect === 'background' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-[11px] font-bold px-1 rounded bg-amber-200 text-amber-900 mb-0.5">
                Badge
              </span>
              <span className="text-[9px] text-slate-400">Box</span>
            </button>
          </div>
        </div>

        {/* Dynamic Controls based on selected effect */}
        {selectedEffect === 'shadow' && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Shadow Blur:</span>
                <span className="font-semibold">{shadowBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={shadowBlur}
                onChange={(e) => {
                  setShadowBlur(Number(e.target.value));
                  applyShadow(shadowColor, Number(e.target.value), shadowOffsetX, shadowOffsetY);
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Offset:</span>
                <span className="font-semibold">{shadowOffsetX}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={shadowOffsetX}
                onChange={(e) => {
                  setShadowOffsetX(Number(e.target.value));
                  setShadowOffsetY(Number(e.target.value));
                  applyShadow(shadowColor, shadowBlur, Number(e.target.value), Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Shadow Color:</span>
              <input
                type="color"
                value={shadowColor}
                onChange={(e) => {
                  setShadowColor(e.target.value);
                  applyShadow(e.target.value, shadowBlur, shadowOffsetX, shadowOffsetY);
                }}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
        )}

        {selectedEffect === 'outline' && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span>Outline Thickness:</span>
                <span className="font-semibold">{outlineWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={outlineWidth}
                onChange={(e) => {
                  setOutlineWidth(Number(e.target.value));
                  applyOutline(outlineColor, Number(e.target.value));
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-600">Outline Color:</span>
              <input
                type="color"
                value={outlineColor}
                onChange={(e) => {
                  setOutlineColor(e.target.value);
                  applyOutline(e.target.value, outlineWidth);
                }}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>
        )}

        {selectedEffect === 'neon' && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-600 block mb-1">Neon Glow Color:</span>
            <div className="flex items-center space-x-2">
              {['#00F0FF', '#FF0055', '#FFCC00', '#00FF66', '#BD00FF', '#FF7A00'].map(col => (
                <button
                  key={col}
                  onClick={() => applyNeon(col)}
                  className={`w-7 h-7 rounded-full shadow-md transition-transform ${neonColor === col ? 'scale-125 ring-2 ring-purple-600' : 'hover:scale-110'}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        )}

        {selectedEffect === 'background' && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-600 block mb-1">Highlight Box Color:</span>
            <div className="grid grid-cols-6 gap-1.5 mb-2">
              {['#fef08a', '#fed7aa', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e2e8f0', '#000000', '#7D2AE8', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'].map(col => (
                <button
                  key={col}
                  onClick={() => applyBackgroundBox(col)}
                  className={`w-6 h-6 rounded-md border shadow-xs transition-transform ${bgColor === col ? 'ring-2 ring-purple-600 scale-110' : 'border-slate-300'}`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SHAPE (NONE vs CURVE) */}
        <div className="pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Shape (Creativa Pro)
          </span>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setShape('none')}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${shapeType === 'none' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-semibold mb-0.5">None</span>
              <span className="text-[9px] text-slate-400">Straight line</span>
            </button>

            <button
              onClick={() => setShape('curve')}
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${shapeType === 'curve' ? 'border-purple-600 bg-purple-50/50 font-bold text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <span className="text-xs font-semibold mb-0.5 text-purple-700">Curve</span>
              <span className="text-[9px] text-slate-400">Circular Arc</span>
            </button>
          </div>

          {/* Curvature Slider */}
          {shapeType === 'curve' && (
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-purple-900">Curvature:</span>
                <span className="font-mono font-bold text-purple-700">{curvature}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={curvature}
                onChange={(e) => updateCurvature(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Inverted (-100)</span>
                <button
                  onClick={() => updateCurvature(0)}
                  className="text-purple-600 hover:underline flex items-center space-x-0.5"
                >
                  <RotateCcw size={10} />
                  <span>Reset (0)</span>
                </button>
                <span>Arch (+100)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
