import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Wand2, Sliders, Sparkles, Check, RefreshCw, Download, 
  RotateCcw, Crown, Eraser, Maximize2, Scissors, Type, 
  Layers, ArrowRight, Palette 
} from 'lucide-react';
import { 
  removeImageBackground, applyImageAdjustments, applyDuotone, 
  inpaintImage, autoEnhanceImage,
  PHOTO_FILTER_PRESETS, DUOTONE_PRESETS 
} from '../utils/imageProcessing';
import { 
  magicEditInpaintObject, magicExpandImage, 
  magicGrabSubject, grabTextFromImage 
} from '../utils/aiEngines';
import { downloadDataUrl } from '../utils/export';

export default function EditImageModal({
  isOpen,
  onClose,
  activeImageObj,
  onApplyImageChanges,
  onMagicGrab,
  onGrabText
}) {
  const [originalSrc, setOriginalSrc] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [tolerance, setTolerance] = useState(35);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('Processing photo...');

  // Tabs: 'magic_edit', 'magic_eraser', 'magic_expand', 'magic_grab', 'grab_text', 'magic_cutout', 'filters', 'adjust', 'duotone'
  const [activeTab, setActiveTab] = useState('magic_edit');

  // Brush Mask State (for Magic Edit & Magic Eraser)
  const [brushSize, setBrushSize] = useState(25);
  const [hasDrawnMask, setHasDrawnMask] = useState(false);
  const [magicEditPrompt, setMagicEditPrompt] = useState('a bouquet of colorful wildflowers');

  // Magic Expand State
  const [expandAspect, setExpandAspect] = useState('16:9');

  // Magic Grab Result State
  const [grabResult, setGrabResult] = useState(null);

  // Grab Text Result State
  const [textResult, setTextResult] = useState(null);

  const canvasMaskRef = useRef(null);
  const imageElementRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0
  });

  useEffect(() => {
    if (isOpen && activeImageObj) {
      const src = activeImageObj.getSrc?.() || activeImageObj._element?.src || '';
      setOriginalSrc(src);
      setPreviewSrc(src);
      setHasDrawnMask(false);
      setGrabResult(null);
      setTextResult(null);
      setAdjustments({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
        hueRotate: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0
      });
    }
  }, [isOpen, activeImageObj]);

  // Sync mask canvas size when image loads or tab changes
  useEffect(() => {
    const isBrushTab = activeTab === 'magic_edit' || activeTab === 'magic_eraser';
    if (isBrushTab && canvasMaskRef.current && imageElementRef.current) {
      const img = imageElementRef.current;
      const mask = canvasMaskRef.current;
      mask.width = img.clientWidth || 400;
      mask.height = img.clientHeight || 300;
      const ctx = mask.getContext('2d');
      ctx.clearRect(0, 0, mask.width, mask.height);
      setHasDrawnMask(false);
    }
  }, [activeTab, previewSrc]);

  if (!isOpen) return null;

  // Mask drawing handlers
  const handleMouseDown = (e) => {
    const isBrushTab = activeTab === 'magic_edit' || activeTab === 'magic_eraser';
    if (!isBrushTab || !canvasMaskRef.current) return;
    const canvas = canvasMaskRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = activeTab === 'magic_edit' ? 'rgba(236, 72, 153, 0.65)' : 'rgba(168, 85, 247, 0.65)';
    ctx.fillStyle = activeTab === 'magic_edit' ? 'rgba(236, 72, 153, 0.65)' : 'rgba(168, 85, 247, 0.65)';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasDrawnMask(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || !canvasMaskRef.current) return;
    const canvas = canvasMaskRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleClearMask = () => {
    if (!canvasMaskRef.current) return;
    const canvas = canvasMaskRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnMask(false);
  };

  // 1. Magic Edit (AI Inpainting Replacement)
  const handleApplyMagicEdit = async () => {
    if (!canvasMaskRef.current || !hasDrawnMask || !magicEditPrompt) return;
    setIsProcessing(true);
    setProcessStatus('Synthesizing AI replacement...');
    try {
      const result = await magicEditInpaintObject(previewSrc, canvasMaskRef.current, magicEditPrompt);
      setPreviewSrc(result);
      setOriginalSrc(result);
      handleClearMask();
    } catch (e) {
      console.error(e);
      alert('Could not complete Magic Edit: ' + (e.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Magic Eraser (Content-Aware Eraser)
  const handleApplyEraser = async () => {
    if (!canvasMaskRef.current || !hasDrawnMask) return;
    setIsProcessing(true);
    setProcessStatus('Erasing object with background synthesis...');
    try {
      const result = await inpaintImage(previewSrc, canvasMaskRef.current);
      setPreviewSrc(result);
      setOriginalSrc(result);
      handleClearMask();
    } catch (e) {
      console.error(e);
      alert('Could not erase object: ' + (e.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Magic Expand (Outpainting)
  const handleApplyExpand = async () => {
    setIsProcessing(true);
    setProcessStatus(`Expanding canvas to ${expandAspect} with AI...`);
    try {
      const result = await magicExpandImage(previewSrc, expandAspect);
      setPreviewSrc(result);
      setOriginalSrc(result);
    } catch (e) {
      console.error(e);
      alert('Could not expand image: ' + (e.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Magic Grab (Subject Separation)
  const handleRunMagicGrab = async () => {
    setIsProcessing(true);
    setProcessStatus('Separating subject & inpainting background...');
    try {
      const result = await magicGrabSubject(previewSrc);
      setGrabResult(result);
    } catch (e) {
      console.error(e);
      alert('Could not perform Magic Grab: ' + (e.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyMagicGrabToCanvas = () => {
    if (!grabResult) return;
    if (onMagicGrab) {
      onMagicGrab(grabResult);
    } else {
      onApplyImageChanges(grabResult.subjectDataUrl);
    }
    onClose();
  };

  // 5. Grab Text (OCR & Editable Canvas Text)
  const handleRunGrabText = async () => {
    setIsProcessing(true);
    setProcessStatus('Extracting text and inpainting photo...');
    try {
      const result = await grabTextFromImage(previewSrc);
      setTextResult(result);
      setPreviewSrc(result.cleanedImage);
    } catch (e) {
      console.error(e);
      alert('Could not grab text: ' + (e.message || 'Error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyGrabTextToCanvas = () => {
    if (!textResult) return;
    if (onGrabText) {
      onGrabText(textResult);
    } else {
      onApplyImageChanges(textResult.cleanedImage);
    }
    onClose();
  };

  // 6. Magic BG Remover (Cutout)
  const handleRemoveBg = async () => {
    setIsProcessing(true);
    setProcessStatus('Keying out background alpha...');
    try {
      const result = await removeImageBackground(originalSrc, tolerance);
      setOriginalSrc(result);
      setPreviewSrc(result);
    } catch (e) {
      alert('Could not remove background: ' + (e.message || 'CORS or format issue'));
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Click Auto Enhance
  const handleAutoEnhance = async () => {
    setIsProcessing(true);
    setProcessStatus('Optimizing dynamic range & vibrancy...');
    try {
      const result = await autoEnhanceImage(previewSrc);
      setPreviewSrc(result);
      setAdjustments({
        brightness: 104,
        contrast: 114,
        saturate: 118,
        blur: 0,
        hueRotate: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPreset = async (preset) => {
    setAdjustments(preset.filters);
    setIsProcessing(true);
    try {
      const result = await applyImageAdjustments(originalSrc, preset.filters);
      setPreviewSrc(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDuotone = async (duo) => {
    setIsProcessing(true);
    try {
      const result = await applyDuotone(originalSrc, duo.shadow, duo.highlight);
      setPreviewSrc(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = async (key, val) => {
    const updated = { ...adjustments, [key]: Number(val) };
    setAdjustments(updated);
    try {
      const result = await applyImageAdjustments(originalSrc, updated);
      setPreviewSrc(result);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    const initial = activeImageObj?.getSrc?.() || activeImageObj?._element?.src || '';
    setOriginalSrc(initial);
    setPreviewSrc(initial);
    setGrabResult(null);
    setTextResult(null);
    handleClearMask();
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0
    });
  };

  const handleSave = () => {
    onApplyImageChanges(previewSrc);
    onClose();
  };

  const isBrushActive = activeTab === 'magic_edit' || activeTab === 'magic_eraser';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl canva-gradient flex items-center justify-center text-white shadow-sm">
              <Wand2 size={16} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">Creativa Magic Studio</h3>
              </div>
              <p className="text-[11px] text-slate-500">Magic Edit, Eraser, Expand, Grab, OCR, Cutout & Photo Studio</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAutoEnhance}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors shadow-xs"
              title="1-Click AI Auto Enhance"
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>Auto Enhance</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Reset all adjustments"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content: 2-column layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Live Interactive Preview */}
          <div className="flex-1 bg-slate-100/80 p-6 flex items-center justify-center relative overflow-hidden select-none">
            <div 
              className="relative max-h-80 max-w-full rounded-2xl shadow-lg overflow-hidden border border-slate-200/60"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              <img 
                ref={imageElementRef}
                src={previewSrc} 
                alt="Preview" 
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="max-h-80 object-contain block pointer-events-none"
              />

              {/* Overlay Canvas for Brush Masking (Magic Edit & Eraser) */}
              {isBrushActive && (
                <canvas
                  ref={canvasMaskRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="absolute inset-0 cursor-crosshair z-10"
                />
              )}
            </div>

            {/* Processing Spinner Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-semibold space-y-2 z-20">
                <RefreshCw size={24} className="animate-spin text-purple-400" />
                <span>{processStatus}</span>
              </div>
            )}
          </div>

          {/* Right: AI Tools & Adjustment Controls */}
          <div className="w-88 border-l border-slate-200 p-4 overflow-y-auto space-y-4 shrink-0 bg-slate-50/50 text-xs">
            
            {/* AI MAGIC STUDIO CATEGORY */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center space-x-1">
                <Sparkles size={11} className="text-purple-600" />
                <span>Creativa Magic Studio AI Tools</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('magic_edit')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'magic_edit' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Magic Edit: Replace objects with AI"
                >
                  <Wand2 size={12} className="text-purple-600 shrink-0" />
                  <span>Magic Edit</span>
                </button>

                <button
                  onClick={() => setActiveTab('magic_eraser')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'magic_eraser' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Magic Eraser: Content-aware object eraser"
                >
                  <Eraser size={12} className="text-purple-600 shrink-0" />
                  <span>Eraser</span>
                </button>

                <button
                  onClick={() => setActiveTab('magic_expand')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'magic_expand' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Magic Expand: AI Outpainting"
                >
                  <Maximize2 size={12} className="text-purple-600 shrink-0" />
                  <span>Expand</span>
                </button>

                <button
                  onClick={() => setActiveTab('magic_grab')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'magic_grab' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Magic Grab: Separate subject into movable layer"
                >
                  <Scissors size={12} className="text-purple-600 shrink-0" />
                  <span>Grab</span>
                </button>

                <button
                  onClick={() => setActiveTab('grab_text')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'grab_text' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grab Text: OCR text into editable canvas text"
                >
                  <Type size={12} className="text-purple-600 shrink-0" />
                  <span>Grab Text</span>
                </button>

                <button
                  onClick={() => setActiveTab('magic_cutout')}
                  className={`py-1.5 px-1 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                    activeTab === 'magic_cutout' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Magic Cutout: Background Remover"
                >
                  <Crown size={11} className="fill-amber-500 text-amber-500 shrink-0" />
                  <span>Cutout BG</span>
                </button>
              </div>
            </div>

            {/* CLASSIC STUDIO TABS */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Adjustments & Styles
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-xl text-[11px] font-semibold text-slate-600">
                <button
                  onClick={() => setActiveTab('filters')}
                  className={`py-1 rounded-lg transition-all text-center ${activeTab === 'filters' ? 'bg-white text-purple-700 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Filters
                </button>
                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`py-1 rounded-lg transition-all text-center ${activeTab === 'adjust' ? 'bg-white text-purple-700 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Adjust
                </button>
                <button
                  onClick={() => setActiveTab('duotone')}
                  className={`py-1 rounded-lg transition-all text-center ${activeTab === 'duotone' ? 'bg-white text-purple-700 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Duotone
                </button>
              </div>
            </div>

            {/* ================= TAB CONTENT ================= */}

            {/* 1. MAGIC EDIT TAB */}
            {activeTab === 'magic_edit' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-100 text-pink-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-pink-700">
                    <Wand2 size={13} />
                    <span>Creativa Magic Edit (AI Inpainting)</span>
                  </p>
                  1. Paint over the object you want to change.<br/>
                  2. Describe what you want to replace it with.
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Brush Thickness:</span>
                    <span className="font-semibold">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    What should replace it?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. bouquet of red roses, golden watch, sunglasses..."
                    value={magicEditPrompt}
                    onChange={(e) => setMagicEditPrompt(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-purple-600"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleApplyMagicEdit}
                    disabled={isProcessing || !hasDrawnMask || !magicEditPrompt}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 ${
                      hasDrawnMask && magicEditPrompt ? 'canva-btn-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Wand2 size={13} />
                    <span>Generate With AI</span>
                  </button>

                  <button
                    onClick={handleClearMask}
                    disabled={!hasDrawnMask}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors"
                  >
                    Clear Mask
                  </button>
                </div>
              </div>
            )}

            {/* 2. MAGIC ERASER TAB */}
            {activeTab === 'magic_eraser' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-purple-700">
                    <Eraser size={13} />
                    <span>Magic Eraser (Content-Aware)</span>
                  </p>
                  Brush over people, watermarks, or unwanted items to erase them seamlessly.
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Brush Thickness:</span>
                    <span className="font-semibold">{brushSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="60"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleApplyEraser}
                    disabled={isProcessing || !hasDrawnMask}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 ${
                      hasDrawnMask ? 'canva-btn-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Eraser size={13} />
                    <span>Erase Object</span>
                  </button>

                  <button
                    onClick={handleClearMask}
                    disabled={!hasDrawnMask}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-colors"
                  >
                    Clear Brush Mask
                  </button>
                </div>
              </div>
            )}

            {/* 3. MAGIC EXPAND TAB */}
            {activeTab === 'magic_expand' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-indigo-700">
                    <Maximize2 size={13} />
                    <span>Magic Expand (AI Outpainting)</span>
                  </p>
                  Extend your image beyond its borders to fit any aspect ratio seamlessly.
                </div>

                <div>
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Target Aspect Ratio:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: '16:9', label: '16:9 Landscape' },
                      { id: '1:1', label: '1:1 Square' },
                      { id: '9:16', label: '9:16 Story' }
                    ].map(ar => (
                      <button
                        key={ar.id}
                        onClick={() => setExpandAspect(ar.id)}
                        className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                          expandAspect === ar.id ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleApplyExpand}
                  disabled={isProcessing}
                  className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Sparkles size={13} />
                  <span>Expand Canvas With AI</span>
                </button>
              </div>
            )}

            {/* 4. MAGIC GRAB TAB */}
            {activeTab === 'magic_grab' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-purple-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-purple-700">
                    <Scissors size={13} />
                    <span>Magic Grab (Subject Isolation)</span>
                  </p>
                  Separates the main subject from the photo into an independent movable layer, while inpainting the background behind it!
                </div>

                {!grabResult ? (
                  <button
                    onClick={handleRunMagicGrab}
                    disabled={isProcessing}
                    className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Scissors size={13} />
                    <span>Isolate Subject With AI</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-900 text-[11px]">
                      ✓ Subject successfully isolated into a transparent layer!
                    </div>
                    <button
                      onClick={handleApplyMagicGrabToCanvas}
                      className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <Layers size={13} />
                      <span>Apply & Separate Layers On Canvas</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. GRAB TEXT TAB */}
            {activeTab === 'grab_text' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-blue-700">
                    <Type size={13} />
                    <span>Grab Text (OCR to Canvas)</span>
                  </p>
                  Scans any image, extracts baked-in text, and converts it into editable Canvas textboxes!
                </div>

                {!textResult ? (
                  <button
                    onClick={handleRunGrabText}
                    disabled={isProcessing}
                    className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Type size={13} />
                    <span>Extract Text With AI</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-900 text-[11px]">
                      ✓ Extracted {textResult.textElements.length} editable text layers!
                    </div>
                    <button
                      onClick={handleApplyGrabTextToCanvas}
                      className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <Type size={13} />
                      <span>Convert To Editable Canvas Text</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6. MAGIC CUTOUT (BG REMOVER) */}
            {activeTab === 'magic_cutout' && (
              <div className="space-y-3.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                  <p className="font-bold flex items-center space-x-1 mb-0.5 text-amber-800">
                    <Crown size={12} className="fill-amber-500 text-amber-500" />
                    <span>Magic Cutout</span>
                  </p>
                  Automatically isolates the subject by keying out backgrounds with smooth edge alpha falloff.
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Cutout Tolerance:</span>
                    <span className="font-semibold">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleRemoveBg}
                    disabled={isProcessing}
                    className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Wand2 size={13} />
                    <span>Remove Background</span>
                  </button>

                  <button
                    onClick={() => downloadDataUrl(previewSrc, 'cutout-photo.png')}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
                  >
                    <Download size={13} />
                    <span>Download Cutout PNG</span>
                  </button>
                </div>
              </div>
            )}

            {/* 7. FILTERS */}
            {activeTab === 'filters' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Curated Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PHOTO_FILTER_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => handleApplyPreset(preset)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-purple-500 hover:shadow-xs text-xs font-semibold text-slate-700 text-center transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 8. ADJUST */}
            {activeTab === 'adjust' && (
              <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Brightness</span>
                    <span className="font-semibold">{adjustments.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    value={adjustments.brightness}
                    onChange={(e) => handleSliderChange('brightness', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Contrast</span>
                    <span className="font-semibold">{adjustments.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    value={adjustments.contrast}
                    onChange={(e) => handleSliderChange('contrast', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Saturation</span>
                    <span className="font-semibold">{adjustments.saturate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={adjustments.saturate}
                    onChange={(e) => handleSliderChange('saturate', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Blur</span>
                    <span className="font-semibold">{adjustments.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={adjustments.blur}
                    onChange={(e) => handleSliderChange('blur', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Hue Rotate</span>
                    <span className="font-semibold">{adjustments.hueRotate}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={adjustments.hueRotate}
                    onChange={(e) => handleSliderChange('hueRotate', e.target.value)}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 9. DUOTONE */}
            {activeTab === 'duotone' && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Duotone Color Presets
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {DUOTONE_PRESETS.map(duo => (
                    <button
                      key={duo.name}
                      onClick={() => handleApplyDuotone(duo)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-purple-500 hover:shadow-xs flex items-center justify-between text-xs font-semibold text-slate-700 transition-all"
                    >
                      <span>{duo.name}</span>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: duo.shadow }} title="Shadows" />
                        <div className="w-5 h-5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: duo.highlight }} title="Highlights" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="canva-btn-primary flex items-center space-x-1.5 px-6 py-2 rounded-xl font-bold text-xs shadow-md"
          >
            <Check size={14} />
            <span>Apply to Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
