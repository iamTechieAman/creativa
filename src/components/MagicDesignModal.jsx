import React, { useState } from 'react';
import { X, Sparkles, Wand2, RefreshCw, Check, Layout, ArrowRight } from 'lucide-react';
import { generateMagicDesignLayout, generateMagicDesignVariants } from '../utils/aiEngines';

const TRENDING_DESIGN_PROMPTS = [
  { label: '☕ Coffee Roastery Special', prompt: 'Artisanal coffee shop 50% off fresh roasts promo' },
  { label: '💪 Gym & Fitness Coaching', prompt: 'Elite fitness coaching and personal training transform your power' },
  { label: '🛍️ Luxury Flash Sale', prompt: 'Mega flash sale 60% off signature fashion collection' },
  { label: '🚀 AI & Tech Innovation', prompt: 'Next-gen AI cloud autonomous agentic platform launch' },
  { label: '🏖️ Tropical Resort Escape', prompt: 'Luxury tropical island beach resort vacation booking discount' },
  { label: '🍔 Gourmet Burger House', prompt: 'Delicious artisanal smash burger weekend special order online' }
];

const STYLE_VARIANTS = [
  { id: 'modern', label: 'Modern Glass', icon: '✨' },
  { id: 'bold', label: 'Bold Editorial', icon: '🔥' },
  { id: 'minimal', label: 'Minimalist', icon: '🌿' },
  { id: 'promo', label: 'Vibrant Promo', icon: '⚡' }
];

export default function MagicDesignModal({
  isOpen,
  onClose,
  canvasDimensions,
  onApplyLayout
}) {
  const [prompt, setPrompt] = useState('Artisanal coffee shop 50% off fresh roasts promo');
  const [selectedVariant, setSelectedVariant] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewLayout, setPreviewLayout] = useState(null);

  if (!isOpen) return null;

  const handleGeneratePreview = (designPrompt = prompt, variant = selectedVariant) => {
    setIsGenerating(true);
    setTimeout(() => {
      const layout = generateMagicDesignLayout(designPrompt, canvasDimensions, variant);
      setPreviewLayout(layout);
      setIsGenerating(false);
    }, 350);
  };

  const handleSelectVariant = (variantId) => {
    setSelectedVariant(variantId);
    if (previewLayout || prompt) {
      handleGeneratePreview(prompt, variantId);
    }
  };

  const handleApplyToCanvas = () => {
    if (!previewLayout) {
      const layout = generateMagicDesignLayout(prompt, canvasDimensions, selectedVariant);
      onApplyLayout(layout);
    } else {
      onApplyLayout(previewLayout);
    }
    onClose();
  };

  // Helper selectors for preview
  const bgImg = previewLayout?.objects?.find(o => o.role === 'background' || o.type === 'image');
  const headline = previewLayout?.headline || previewLayout?.objects?.find(o => o.role === 'headline')?.text || 'Creativa Design';
  const subtitle = previewLayout?.subtitle || previewLayout?.objects?.find(o => o.role === 'subtitle')?.text || '';
  const badgeText = previewLayout?.badge || previewLayout?.objects?.find(o => o.role === 'badge-text')?.text || 'EXCLUSIVE';
  const ctaText = previewLayout?.cta || previewLayout?.objects?.find(o => o.role === 'cta-text')?.text || 'GET STARTED';
  const accentColor = previewLayout?.accentColor || '#7D2AE8';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl canva-gradient flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">Creativa Magic Design™</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-600 text-white">AI</span>
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
                className="canva-btn-primary px-4 py-2.5 rounded-xl font-bold flex items-center space-x-1 shadow-md text-xs shrink-0"
              >
                {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Wand2 size={13} />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          {/* Design Style Selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Style Preset
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {STYLE_VARIANTS.map(sv => (
                <button
                  key={sv.id}
                  onClick={() => handleSelectVariant(sv.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1.5 ${
                    selectedVariant === sv.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{sv.icon}</span>
                  <span>{sv.label}</span>
                </button>
              ))}
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
                className="w-full h-52 rounded-xl border border-slate-300/80 p-5 flex flex-col justify-between shadow-inner relative overflow-hidden"
                style={{ backgroundColor: previewLayout.backgroundColor || '#0f172a' }}
              >
                {/* Background image if present */}
                {bgImg?.src && (
                  <img
                    src={bgImg.src}
                    alt="Background preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                  />
                )}

                {/* Simulated Badge */}
                <div className="relative z-10 flex justify-center">
                  <span 
                    className="px-3.5 py-1 rounded-full text-[10px] font-black text-white shadow-md uppercase tracking-wider"
                    style={{ backgroundColor: accentColor }}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Simulated Heading & Subtitle */}
                <div className="relative z-10 text-center my-auto px-4 space-y-1">
                  <h4 className="font-black text-base md:text-lg leading-tight text-white drop-shadow-md">
                    {headline}
                  </h4>
                  <p className="text-[11px] text-slate-200 line-clamp-2 max-w-sm mx-auto drop-shadow-xs">
                    {subtitle}
                  </p>
                </div>

                {/* Simulated CTA Button */}
                <div className="relative z-10 flex justify-center">
                  <span 
                    className="px-5 py-1.5 rounded-full text-[11px] font-black text-white shadow-lg uppercase tracking-wider"
                    style={{ backgroundColor: accentColor }}
                  >
                    {ctaText}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Instant Generation • Powered by Creativa Magic Studio</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-200 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyToCanvas}
              className="canva-btn-primary px-4 py-2 rounded-xl text-white font-bold flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <span>Apply to Canvas Editor</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
