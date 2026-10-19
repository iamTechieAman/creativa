import React, { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Check, Layout, Crown, ArrowRight } from 'lucide-react';
import { generateMagicDesignLayout } from '../utils/aiEngines';

const TRENDING_DESIGN_PROMPTS = [
  { label: '☕ Coffee Roastery Special', prompt: 'Artisanal coffee shop 50% off fresh roasts promo' },
  { label: '💪 Gym & Fitness Coaching', prompt: 'Elite fitness coaching and personal training transform your power' },
  { label: '🛍️ Luxury Flash Sale', prompt: 'Mega flash sale 60% off signature fashion collection' },
  { label: '🚀 AI & Tech Innovation', prompt: 'Next-gen AI cloud autonomous agentic platform launch' }
];

export default function MagicDesignModal({
  isOpen,
  onClose,
  canvasDimensions,
  onApplyLayout
}) {
  const [prompt, setPrompt] = useState('Artisanal coffee shop 50% off fresh roasts promo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(null);

  if (!isOpen) return null;

  const handleGeneratePreview = (designPrompt = prompt) => {
    setIsGenerating(true);
    setTimeout(() => {
      const layout = generateMagicDesignLayout(designPrompt, canvasDimensions);
      setPreviewLayout(layout);
      setIsGenerating(false);
    }, 400);
  };

  const handleApplyToCanvas = () => {
    if (!previewLayout) {
      const layout = generateMagicDesignLayout(prompt, canvasDimensions);
      onApplyLayout(layout);
    } else {
      onApplyLayout(previewLayout);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl canva-gradient flex items-center justify-center text-white shadow-md">
              <Layout size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">Creativa Magic Design™</h3>
              </div>
              <p className="text-[11px] text-slate-500">Describe your idea — AI composes full multi-element layouts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              What do you want to create?
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Modern Instagram post for luxury summer sneakers sale..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGeneratePreview();
                }}
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-xs"
              />
              <button
                onClick={() => handleGeneratePreview()}
                disabled={isGenerating || !prompt.trim()}
                className="canva-btn-primary px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1 shadow-md text-xs"
              >
                {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          {/* Trending Prompts */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Or Try Popular Ideas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_DESIGN_PROMPTS.map(tp => (
                <button
                  key={tp.label}
                  onClick={() => {
                    setPrompt(tp.prompt);
                    handleGeneratePreview(tp.prompt);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-all flex items-center space-x-1"
                >
                  <span>{tp.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layout Preview */}
          {previewLayout && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>AI Generated Canvas Architecture</span>
                </span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">
                  {previewLayout.objects.length} Elements Composed
                </span>
              </div>

              {/* Visual Mini Artboard Card */}
              <div 
                className="w-full h-44 rounded-xl border border-slate-300/80 p-4 flex flex-col items-center justify-between shadow-inner relative overflow-hidden"
                style={{ backgroundColor: previewLayout.backgroundColor }}
              >
                {/* Simulated Badge */}
                <div className="px-3 py-0.5 rounded-full text-[10px] font-bold shadow-xs border border-black/10" style={{ backgroundColor: previewLayout.objects[0]?.fill, color: previewLayout.objects[1]?.fill }}>
                  {previewLayout.objects[1]?.text || 'SPECIAL'}
                </div>

                {/* Simulated Heading & Subtitle */}
                <div className="text-center my-auto px-4">
                  <h4 className="font-bold text-base leading-tight" style={{ color: previewLayout.objects[2]?.fill }}>
                    {previewLayout.objects[2]?.text}
                  </h4>
                  <p className="text-[10px] mt-1 line-clamp-1" style={{ color: previewLayout.objects[3]?.fill }}>
                    {previewLayout.objects[3]?.text}
                  </p>
                </div>

                {/* Simulated CTA Button */}
                <div className="px-5 py-1.5 rounded-full text-[11px] font-bold text-white shadow-md" style={{ backgroundColor: previewLayout.objects[4]?.fill }}>
                  {previewLayout.objects[5]?.text || 'Action'}
                </div>
              </div>
            </div>
          )}
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
            onClick={handleApplyToCanvas}
            className="canva-btn-primary flex items-center space-x-1.5 px-5 py-2 rounded-xl font-bold text-xs shadow-md"
          >
            <Check size={14} />
            <span>Apply to Artboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
