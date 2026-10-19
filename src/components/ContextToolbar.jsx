import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, 
  AlignCenter, AlignRight, Copy, Trash2, Lock, Unlock, 
  FlipHorizontal, FlipVertical, Sliders, ArrowUp, ArrowDown, 
  ChevronsUp, ChevronsDown, Palette, ChevronDown, Sparkles,
  Wand2, Move, Group as GroupIcon, Ungroup as UngroupIcon,
  AlignJustify, SlidersHorizontal, Clock, FileText, X,
  Paintbrush, List, Crop, Search
} from 'lucide-react';
import { AVAILABLE_FONTS } from '../data/fonts';
import { SOLID_COLORS, GRADIENT_PRESETS } from '../data/backgrounds';
import TextEffectsPopover from './TextEffectsPopover';
import PositionPanel from './PositionPanel';
import CanvaColorPickerModal from './CanvaColorPickerModal';
import { loadGoogleFont } from '../utils/fontLoader';

export default function ContextToolbar({
  canvas,
  activeObject,
  onUpdateProp,
  onDuplicate,
  onDelete,
  onMoveLayer,
  onToggleLock,
  onAlign,
  onOpenEditImage,
  onOpenMagicWrite,
  onGroup,
  onUngroup,
  isMultipleSelected,
  isGroupSelected,
  backgroundColor,
  onSetBackground,
  onOpenNotes,
  pageDuration,
  setPageDuration
}) {
  const toolbarRef = useRef(null);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [fontSearchQuery, setFontSearchQuery] = useState('');
  const [fontCategoryFilter, setFontCategoryFilter] = useState('All');
  const [colorPickerTarget, setColorPickerTarget] = useState(null); // 'page' | 'fill' | 'stroke' | 'text' | null
  const [isEffectsOpen, setIsEffectsOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isSpacingOpen, setIsSpacingOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isAnimateOpen, setIsAnimateOpen] = useState(false);

  const closeAllPopovers = () => {
    setIsFontMenuOpen(false);
    setIsEffectsOpen(false);
    setIsPositionOpen(false);
    setIsSpacingOpen(false);
    setIsDurationOpen(false);
    setIsAnimateOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        closeAllPopovers();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectFont = async (fontName) => {
    await loadGoogleFont(fontName);
    onUpdateProp('fontFamily', fontName);
    if (canvas) {
      canvas.requestRenderAll();
    }
    setIsFontMenuOpen(false);
  };

  // When no object is selected: Page Context Bar
  if (!activeObject) {
    return (
      <div ref={toolbarRef} className="h-11 bg-white border-b border-slate-200 px-3 md:px-4 flex items-center justify-between text-xs text-slate-700 shadow-xs z-30 shrink-0 select-none overflow-x-auto scrollbar-none touch-pan-x relative">
        <div className="flex items-center space-x-2 shrink-0">
          {/* Page Background Color Swatch (Creativa Palette) */}
          <button
            onClick={() => setColorPickerTarget('page')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 font-semibold text-slate-700 transition-colors shadow-xs"
            title="Change canvas background color (Creativa Color Studio)"
          >
            <div
              className="w-4 h-4 rounded-full border border-slate-400 shadow-xs shrink-0"
              style={{
                background: backgroundColor || '#ffffff'
              }}
            />
            <span className="text-xs">Color</span>
          </button>

          {/* Animate Page Button */}
          <div className="relative">
            <button
              onClick={() => setIsAnimateOpen(!isAnimateOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 font-semibold text-slate-700 transition-colors shadow-xs"
              title="Page Transitions"
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>Animate</span>
            </button>

            {isAnimateOpen && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl p-2.5 z-50 w-52 space-y-1 animate-in fade-in duration-150">
                <p className="font-bold text-slate-800 text-xs px-2 py-1">Page Transitions</p>
                {['None', 'Fade', 'Pan', 'Rise', 'Pop', 'Breathe', 'Drift'].map(anim => (
                  <button
                    key={anim}
                    onClick={() => {
                      alert(`Page animation set to: ${anim}`);
                      setIsAnimateOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <span>{anim}</span>
                    <Sparkles size={11} className="text-purple-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Page Timing / Duration */}
          <div className="relative">
            <button
              onClick={() => setIsDurationOpen(!isDurationOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 font-semibold text-slate-700 transition-colors shadow-xs"
              title="Set Page Duration"
            >
              <Clock size={13} className="text-slate-500" />
              <span>{pageDuration || '5.0'}s</span>
            </button>

            {isDurationOpen && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 w-56 space-y-2 animate-in fade-in duration-150">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Duration:</span>
                  <span className="text-purple-600 font-mono">{pageDuration}s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="30.0"
                  step="0.5"
                  value={Number(pageDuration || 5.0)}
                  onChange={(e) => setPageDuration?.(e.target.value)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Notes Button */}
          <button
            onClick={onOpenNotes}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 font-semibold text-slate-700 transition-colors shadow-xs"
            title="Presenter Notes"
          >
            <FileText size={13} className="text-slate-500" />
            <span>Notes</span>
          </button>
        </div>

        {/* Right side Quick-Insert Pills */}
        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-500 font-medium">
          <span className="text-slate-400">Quick Keys:</span>
          <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-700 font-bold">T</span>
          <span>Text</span>
          <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-700 font-bold">R</span>
          <span>Rect</span>
          <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-700 font-bold">C</span>
          <span>Circle</span>
          <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-700 font-bold">L</span>
          <span>Line</span>
        </div>

        {/* Canva Color Picker Modal for Page Background */}
        <CanvaColorPickerModal
          isOpen={colorPickerTarget === 'page'}
          onClose={() => setColorPickerTarget(null)}
          currentColor={backgroundColor || '#ffffff'}
          onSelectColor={(c) => onSetBackground?.(c)}
          canvas={canvas}
        />
      </div>
    );
  }

  const isText = activeObject.type === 'textbox' || activeObject.type === 'i-text';
  const isImage = activeObject.type === 'image';
  const isShape = !isText && !isImage && activeObject.type !== 'group' && activeObject.type !== 'activeSelection';
  const isLocked = activeObject.lockMovementX;

  const handleToggleCase = () => {
    if (!activeObject || !activeObject.text) return;
    const current = activeObject.text;
    const isUpper = current === current.toUpperCase();
    onUpdateProp('text', isUpper ? current.toLowerCase() : current.toUpperCase());
  };

  const handleToggleList = () => {
    if (!activeObject || !activeObject.text) return;
    const lines = activeObject.text.split('\n');
    const isList = lines.every(l => l.startsWith('• '));
    const newText = isList 
      ? lines.map(l => l.replace(/^•\s*/, '')).join('\n')
      : lines.map(l => l.startsWith('• ') ? l : `• ${l}`).join('\n');
    onUpdateProp('text', newText);
  };

  return (
    <div ref={toolbarRef} className="h-11 bg-white border-b border-slate-200 px-3 flex items-center justify-between text-xs text-slate-700 shadow-xs z-30 shrink-0 overflow-x-auto scrollbar-none touch-pan-x relative select-none">
      {/* Left section: Type-specific controls */}
      <div className="flex items-center space-x-1.5 md:space-x-2 shrink-0">
        
        {/* ================= TEXT CONTROLS ================= */}
        {isText && (
          <>
            {/* Font Family Picker */}
            <div className="relative">
              <button
                onClick={() => {
                  const next = !isFontMenuOpen;
                  closeAllPopovers();
                  if (next) setIsFontMenuOpen(true);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg font-semibold text-xs max-w-[150px] truncate shadow-xs transition-colors"
                title="Select font family"
              >
                <span className="truncate" style={{ fontFamily: activeObject.fontFamily || 'Inter' }}>
                  {activeObject.fontFamily || 'Inter'}
                </span>
                <ChevronDown size={12} className="shrink-0 text-slate-500" />
              </button>

              {isFontMenuOpen && (
                <div className="fixed inset-x-3 top-28 md:absolute md:top-full md:left-0 md:inset-x-auto md:mt-1.5 w-auto md:w-76 max-w-sm mx-auto md:mx-0 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-800 animate-in fade-in duration-100">
                  {/* Search Bar */}
                  <div className="relative mb-2">
                    <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search 75+ premium fonts..."
                      value={fontSearchQuery}
                      onChange={(e) => setFontSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-xs"
                      autoFocus
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center space-x-1 overflow-x-auto pb-1.5 mb-1.5 border-b border-slate-100 scrollbar-none">
                    {['All', 'Sans-Serif', 'Serif', 'Handwriting', 'Display'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFontCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                          fontCategoryFilter === cat
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Fonts Scroll List */}
                  <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5">
                    {AVAILABLE_FONTS.filter(f => {
                      const matchesCat = fontCategoryFilter === 'All' || f.category.toLowerCase() === fontCategoryFilter.toLowerCase();
                      const q = fontSearchQuery.toLowerCase().trim();
                      const matchesSearch = !q || f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || (f.tag && f.tag.toLowerCase().includes(q));
                      return matchesCat && matchesSearch;
                    }).map(f => {
                      const isSelected = activeObject.fontFamily === f.name;
                      return (
                        <button
                          key={f.name}
                          onClick={() => handleSelectFont(f.name)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between group ${
                            isSelected ? 'bg-purple-50 border border-purple-200 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex flex-col truncate pr-2">
                            <span className="text-sm truncate" style={{ fontFamily: f.family }}>
                              {f.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-sans truncate">
                              {f.previewText || f.category}
                            </span>
                          </div>
                          {f.tag && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-purple-100 group-hover:text-purple-700 font-sans font-semibold shrink-0">
                              {f.tag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Font Size Stepper */}
            <div className="flex items-center border border-slate-300 rounded-lg bg-slate-100 overflow-hidden shadow-xs">
              <button
                onClick={() => onUpdateProp('fontSize', Math.max(8, (activeObject.fontSize || 20) - 2))}
                className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={Math.round(activeObject.fontSize || 20)}
                onChange={(e) => onUpdateProp('fontSize', Number(e.target.value))}
                className="w-10 text-center text-xs font-bold bg-transparent focus:outline-none"
              />
              <button
                onClick={() => onUpdateProp('fontSize', (activeObject.fontSize || 20) + 2)}
                className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                +
              </button>
            </div>

            {/* Text Color A with underline bar */}
            <button
              onClick={() => setColorPickerTarget('text')}
              className="p-1.5 rounded-lg hover:bg-slate-100 border border-slate-300 flex flex-col items-center justify-center min-w-[28px] h-7 shadow-xs"
              title="Text Color (Creativa Palette)"
            >
              <span className="font-bold text-xs leading-none">A</span>
              <div 
                className="w-4 h-1 rounded-full mt-0.5 shadow-xs" 
                style={{ backgroundColor: activeObject.fill || '#1e293b' }} 
              />
            </button>

            {/* Bold, Italic, Underline, Strikethrough */}
            <div className="flex items-center space-x-0.5 border-l border-slate-200 pl-1.5">
              <button
                onClick={() => onUpdateProp('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.fontWeight === 'bold' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-slate-600'}`}
                title="Bold (Ctrl+B)"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={() => onUpdateProp('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.fontStyle === 'italic' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Italic (Ctrl+I)"
              >
                <Italic size={14} />
              </button>
              <button
                onClick={() => onUpdateProp('underline', !activeObject.underline)}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.underline ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Underline (Ctrl+U)"
              >
                <Underline size={14} />
              </button>
              <button
                onClick={() => onUpdateProp('linethrough', !activeObject.linethrough)}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.linethrough ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Strikethrough"
              >
                <Strikethrough size={14} />
              </button>
              <button
                onClick={handleToggleCase}
                className="px-1.5 py-0.5 rounded-lg hover:bg-slate-100 text-slate-700 font-bold text-xs"
                title="Uppercase / Lowercase (aA)"
              >
                aA
              </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center space-x-0.5 border-l border-slate-200 pl-1.5">
              <button
                onClick={() => onUpdateProp('textAlign', 'left')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.textAlign === 'left' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Align Left"
              >
                <AlignLeft size={14} />
              </button>
              <button
                onClick={() => onUpdateProp('textAlign', 'center')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.textAlign === 'center' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Align Center"
              >
                <AlignCenter size={14} />
              </button>
              <button
                onClick={() => onUpdateProp('textAlign', 'right')}
                className={`p-1.5 rounded-lg hover:bg-slate-100 ${activeObject.textAlign === 'right' ? 'bg-purple-100 text-purple-700' : 'text-slate-600'}`}
                title="Align Right"
              >
                <AlignRight size={14} />
              </button>
              <button
                onClick={handleToggleList}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                title="Bullet List"
              >
                <List size={14} />
              </button>
            </div>

            {/* Spacing Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsSpacingOpen(!isSpacingOpen)}
                className={`p-1.5 rounded-lg hover:bg-slate-100 border shadow-xs ${
                  isSpacingOpen ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-slate-300 text-slate-600'
                }`}
                title="Spacing (Letter Spacing & Line Height)"
              >
                <SlidersHorizontal size={14} />
              </button>

              {isSpacingOpen && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 w-56 space-y-3 animate-in fade-in duration-100">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                      <span>Letter Spacing:</span>
                      <span className="font-bold text-purple-700">{activeObject.charSpacing || 0}</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="300"
                      value={activeObject.charSpacing || 0}
                      onChange={(e) => onUpdateProp('charSpacing', Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                      <span>Line Spacing:</span>
                      <span className="font-bold text-purple-700">{Number(activeObject.lineHeight || 1.16).toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.5"
                      step="0.05"
                      value={activeObject.lineHeight || 1.16}
                      onChange={(e) => onUpdateProp('lineHeight', Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Effects Button (Text Effects) */}
            <button
              onClick={() => {
                const next = !isEffectsOpen;
                closeAllPopovers();
                if (next) setIsEffectsOpen(true);
              }}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-semibold text-xs transition-all shadow-xs ${
                isEffectsOpen ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Sparkles size={12} className="text-purple-600" />
              <span>Effects</span>
            </button>

            {/* Magic Write AI Copywriter */}
            <button
              onClick={onOpenMagicWrite}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
              title="Creativa Magic Write AI Assistant"
            >
              <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
              <span>Magic Write</span>
            </button>
          </>
        )}

        {/* ================= SHAPE & VECTOR CONTROLS ================= */}
        {isShape && (
          <>
            {/* Fill Color */}
            <button
              onClick={() => setColorPickerTarget('fill')}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 shadow-xs"
              title="Fill Color (Creativa Palette)"
            >
              <div 
                className="w-4 h-4 rounded-full border border-slate-400 shadow-xs" 
                style={{ backgroundColor: activeObject.fill || '#7D2AE8' }} 
              />
              <span className="font-semibold text-xs">Fill</span>
            </button>

            {/* Stroke / Border Color */}
            <button
              onClick={() => setColorPickerTarget('stroke')}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-slate-100 border border-slate-300 shadow-xs"
              title="Border Color (Creativa Palette)"
            >
              <div 
                className="w-4 h-4 rounded-full border-2 shadow-xs" 
                style={{ borderColor: activeObject.stroke || '#000000', backgroundColor: 'transparent' }} 
              />
              <span className="font-semibold text-xs">Border</span>
            </button>

            {/* Border Width Stepper */}
            <div className="flex items-center border border-slate-300 rounded-lg bg-slate-100 overflow-hidden shadow-xs">
              <span className="px-2 text-[10px] text-slate-500 font-bold uppercase">Weight</span>
              <button
                onClick={() => onUpdateProp('strokeWidth', Math.max(0, (activeObject.strokeWidth || 0) - 1))}
                className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                -
              </button>
              <span className="w-6 text-center text-xs font-bold">
                {activeObject.strokeWidth || 0}
              </span>
              <button
                onClick={() => onUpdateProp('strokeWidth', (activeObject.strokeWidth || 0) + 1)}
                className="px-2 py-1 hover:bg-slate-200 text-slate-700 font-bold"
              >
                +
              </button>
            </div>
          </>
        )}

        {/* ================= IMAGE CONTROLS ================= */}
        {isImage && (
          <>
            {/* Edit Image / Magic Studio */}
            <button
              onClick={onOpenEditImage}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 hover:from-purple-100 hover:to-pink-100 border border-purple-300 text-purple-800 font-bold text-xs transition-all shadow-xs"
              title="Creativa Magic Studio Photo AI Suite"
            >
              <Wand2 size={13} className="text-purple-600" />
              <span>Edit photo (Magic Studio)</span>
            </button>

            {/* Flip Horizontal */}
            <button
              onClick={() => onUpdateProp('flipX', !activeObject.flipX)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 border border-slate-300 shadow-xs ${activeObject.flipX ? 'bg-purple-50 text-purple-700' : 'text-slate-600'}`}
              title="Flip Horizontal"
            >
              <FlipHorizontal size={14} />
            </button>

            {/* Flip Vertical */}
            <button
              onClick={() => onUpdateProp('flipY', !activeObject.flipY)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 border border-slate-300 shadow-xs ${activeObject.flipY ? 'bg-purple-50 text-purple-700' : 'text-slate-600'}`}
              title="Flip Vertical"
            >
              <FlipVertical size={14} />
            </button>
          </>
        )}

        {/* ================= UNIVERSAL TRANSPARENCY SLIDER ================= */}
        <div className="flex items-center space-x-1.5 border-l border-slate-200 pl-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Opacity</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={activeObject.opacity ?? 1}
            onChange={(e) => onUpdateProp('opacity', Number(e.target.value))}
            className="w-16 accent-purple-600 cursor-pointer"
            title="Opacity"
          />
        </div>
      </div>

      {/* ================= RIGHT SECTION: POSITION, LOCK, DUPLICATE, TRASH ================= */}
      <div className="flex items-center space-x-1.5 shrink-0 pl-3">
        {/* Position Panel Trigger */}
        <button
          onClick={() => {
            const next = !isPositionOpen;
            closeAllPopovers();
            if (next) setIsPositionOpen(true);
          }}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all shadow-xs ${
            isPositionOpen ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Move size={12} className="text-purple-600" />
          <span>Position</span>
        </button>

        {/* Lock / Unlock */}
        <button
          onClick={onToggleLock}
          className={`p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 shadow-xs ${isLocked ? 'text-amber-500 bg-amber-50' : 'text-slate-600'}`}
          title={isLocked ? 'Unlock element' : 'Lock element'}
        >
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>

        {/* Duplicate */}
        <button
          onClick={onDuplicate}
          className="p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-600 shadow-xs"
          title="Duplicate (Ctrl+D)"
        >
          <Copy size={14} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-50 border border-slate-200 text-red-500 hover:text-red-700 shadow-xs"
          title="Delete (Del)"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Text Effects Popover */}
      <TextEffectsPopover
        isOpen={isEffectsOpen}
        onClose={() => setIsEffectsOpen(false)}
        activeObject={activeObject}
        onUpdateProp={onUpdateProp}
        onSetShadow={(shadow) => onUpdateProp('shadow', shadow)}
      />

      {/* Position Inspector Panel */}
      <PositionPanel
        isOpen={isPositionOpen}
        onClose={() => setIsPositionOpen(false)}
        activeObject={activeObject}
        onUpdateProp={onUpdateProp}
        onMoveLayer={onMoveLayer}
        onAlign={onAlign}
      />

      {/* Canva Color Picker Modal for Active Element */}
      <CanvaColorPickerModal
        isOpen={colorPickerTarget !== null && colorPickerTarget !== 'page'}
        onClose={() => setColorPickerTarget(null)}
        currentColor={
          colorPickerTarget === 'stroke'
            ? (activeObject?.stroke || '#000000')
            : (activeObject?.fill || '#7D2AE8')
        }
        onSelectColor={(color) => {
          if (colorPickerTarget === 'stroke') {
            onUpdateProp('stroke', color);
          } else {
            onUpdateProp('fill', color);
          }
        }}
        canvas={canvas}
      />
    </div>
  );
}
