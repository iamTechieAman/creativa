import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Image as ImageIcon, Type, Sliders, RefreshCw, 
  Copy, Check, ArrowRight, Download, Eye, Zap, Layers, Scissors, 
  Crop, Palette, Maximize2, Send, Plus, Crown, ChevronRight
} from 'lucide-react';
import { 
  generateMagicDesignLayout, 
  generateAiImage, 
  STYLE_PROMPTS, 
  runMagicWrite, 
  MAGIC_WRITE_ACTIONS, 
  TONE_PRESETS,
  generateMagicMorph,
  MORPH_TEXTURE_PRESETS
} from '../utils/aiEngines';

const TRENDING_DESIGN_IDEAS = [
  { icon: '☕', label: 'Coffee Special', prompt: 'Artisanal coffee shop 50% off fresh roasts promo announcement' },
  { icon: '💪', label: 'Fitness & Gym', prompt: 'Elite fitness coaching and personal training transform your power' },
  { icon: '🛍️', label: 'Flash Sale', prompt: 'Mega flash sale 60% off signature luxury fashion collection' },
  { icon: '🚀', label: 'AI Tech Launch', prompt: 'Next-gen AI cloud autonomous agentic platform launch keynote' },
  { icon: '🏖️', label: 'Travel Resort', prompt: 'Tropical luxury paradise island travel tour package booking' },
  { icon: '🍔', label: 'Food & Burger', prompt: 'Delicious gourmet artisan smash burger weekend promo deal' }
];

export default function MagicStudioPanel({
  canvasDimensions = { width: 800, height: 800 },
  onApplyMagicDesign,
  onAddImage,
  onAddText,
  onReplaceText,
  onOpenEditImage,
  onOpenResize,
  activeObject
}) {
  const [activeSubTab, setActiveSubTab] = useState('design'); // 'design' | 'media' | 'write' | 'morph' | 'photo'

  // 1. Magic Design State
  const [designPrompt, setDesignPrompt] = useState('Artisanal coffee shop 50% off fresh roasts promo announcement');
  const [designStyleVariant, setDesignStyleVariant] = useState('modern');
  const [designLayout, setDesignLayout] = useState(null);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);

  // 2. Magic Media State
  const [mediaPrompt, setMediaPrompt] = useState('Futuristic neon botanical garden with glowing flowers, cinematic 8k');
  const [mediaStyle, setMediaStyle] = useState('photo');
  const [mediaAspect, setMediaAspect] = useState('1:1');
  const [mediaResult, setMediaResult] = useState(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);

  // 3. Magic Write State
  const activeTextContent = (activeObject?.type === 'textbox' || activeObject?.type === 'i-text' || activeObject?.type === 'text')
    ? activeObject.text
    : '';
  const [writeInput, setWriteInput] = useState(activeTextContent || 'Craft captivating visual experiences that elevate your brand and spark lasting connection.');
  const [writeAction, setWriteAction] = useState('rewrite');
  const [writeTone, setWriteTone] = useState('enthusiastic');
  const [writeResult, setWriteResult] = useState('');
  const [isGeneratingWrite, setIsGeneratingWrite] = useState(false);
  const [copiedWrite, setCopiedWrite] = useState(false);

  // 4. Magic Morph State
  const [morphText, setMorphText] = useState('CREATIVA');
  const [morphTexture, setMorphTexture] = useState('balloon');
  const [morphResult, setMorphResult] = useState(null);
  const [isGeneratingMorph, setIsGeneratingMorph] = useState(false);

  // Handlers
  const handleGenerateDesign = (promptText = designPrompt, variant = designStyleVariant) => {
    setIsGeneratingDesign(true);
    setTimeout(() => {
      const layout = generateMagicDesignLayout(promptText, canvasDimensions, variant);
      setDesignLayout(layout);
      setIsGeneratingDesign(false);
    }, 400);
  };

  const handleGenerateMedia = async () => {
    if (!mediaPrompt.trim()) return;
    setIsGeneratingMedia(true);
    try {
      let w = 800, h = 800;
      if (mediaAspect === '16:9') { w = 960; h = 540; }
      else if (mediaAspect === '9:16') { w = 540; h = 960; }
      const res = await generateAiImage(mediaPrompt, {
        width: w,
        height: h,
        style: mediaStyle,
        model: 'turbo'
      });
      setMediaResult(res);
    } catch (e) {
      console.error('Magic media generation error:', e);
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleRunWrite = async () => {
    if (!writeInput.trim()) return;
    setIsGeneratingWrite(true);
    try {
      const res = await runMagicWrite({
        action: writeAction,
        originalText: writeInput,
        tone: writeTone
      });
      setWriteResult(res);
    } catch (e) {
      console.error('Magic write error:', e);
    } finally {
      setIsGeneratingWrite(false);
    }
  };

  const handleGenerateMorph = async () => {
    if (!morphText.trim()) return;
    setIsGeneratingMorph(true);
    try {
      const textureObj = MORPH_TEXTURE_PRESETS.find(t => t.id === morphTexture) || MORPH_TEXTURE_PRESETS[0];
      const res = await generateMagicMorph(morphText, textureObj.prompt);
      setMorphResult(res);
    } catch (e) {
      console.error('Magic morph error:', e);
    } finally {
      setIsGeneratingMorph(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedWrite(true);
    setTimeout(() => setCopiedWrite(false), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* Magic Studio AI Header Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden border border-purple-500/30">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-28 h-28 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles size={14} className="fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs tracking-tight">Creativa Magic Studio™</h3>
              <p className="text-[10px] text-purple-200">Next-Gen Generative AI Suite</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
            PRO FREE
          </span>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="grid grid-cols-5 gap-1 mt-3 pt-2.5 border-t border-white/10">
          {[
            { id: 'design', label: 'Design', icon: Wand2 },
            { id: 'media', label: 'Media', icon: ImageIcon },
            { id: 'write', label: 'Write', icon: Type },
            { id: 'morph', label: 'Morph', icon: Sparkles },
            { id: 'photo', label: 'Photo AI', icon: Sliders }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveSubTab(tool.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-[9px] font-bold transition-all ${
                activeSubTab === tool.id
                  ? 'bg-white text-purple-950 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
            >
              <tool.icon size={13} className="mb-0.5" />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 1. MAGIC DESIGN TAB ================= */}
      {activeSubTab === 'design' && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Prompt to Complete Design
            </label>
            <textarea
              rows={2}
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
              placeholder="e.g. Minimalist coffee shop special offer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Style Preset Selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Layout Style Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'modern', label: 'Modern Glass', icon: '✨' },
                { id: 'bold', label: 'Bold Editorial', icon: '🔥' },
                { id: 'minimal', label: 'Minimalist', icon: '🌿' },
                { id: 'promo', label: 'Vibrant Promo', icon: '⚡' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => {
                    setDesignStyleVariant(st.id);
                    if (designLayout) handleGenerateDesign(designPrompt, st.id);
                  }}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center space-x-1.5 ${
                    designStyleVariant === st.id
                      ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{st.icon}</span>
                  <span className="truncate">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Ideas
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {TRENDING_DESIGN_IDEAS.map(idea => (
                <button
                  key={idea.label}
                  onClick={() => {
                    setDesignPrompt(idea.prompt);
                    handleGenerateDesign(idea.prompt, designStyleVariant);
                  }}
                  className="p-1.5 rounded-lg border border-slate-100 hover:border-purple-300 bg-slate-50 hover:bg-purple-50 text-left transition-all flex items-center space-x-1.5 group"
                >
                  <span className="text-sm">{idea.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-700 group-hover:text-purple-700 truncate">{idea.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleGenerateDesign(designPrompt, designStyleVariant)}
            disabled={isGeneratingDesign || !designPrompt.trim()}
            className="w-full canva-btn-primary py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {isGeneratingDesign ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Synthesizing Design Elements...</span>
              </>
            ) : (
              <>
                <Wand2 size={13} />
                <span>Generate Multi-Layer Design</span>
              </>
            )}
          </button>

          {/* Design Layout Preview & Apply */}
          {designLayout && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <Eye size={12} className="text-purple-600" />
                  <span>Generated Preview</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-md font-bold">
                  {designLayout.objects?.length || 0} Layers
                </span>
              </div>

              {/* Live Mini Preview Box */}
              <div 
                className="w-full h-40 rounded-xl border border-slate-300/80 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner"
                style={{ backgroundColor: designLayout.backgroundColor || '#0f172a' }}
              >
                {designLayout.objects?.find(o => o.role === 'background' || o.type === 'image') && (
                  <img
                    src={designLayout.objects.find(o => o.role === 'background' || o.type === 'image').src}
                    alt="Preview background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                  />
                )}
                <div className="relative z-10 flex justify-center">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm uppercase tracking-wider"
                    style={{ backgroundColor: designLayout.accentColor || '#7D2AE8' }}
                  >
                    {designLayout.badge || 'EXCLUSIVE'}
                  </span>
                </div>
                <div className="relative z-10 text-center px-2">
                  <h4 className="font-black text-xs md:text-sm text-white leading-tight drop-shadow-md">
                    {designLayout.headline || 'Creativa Design'}
                  </h4>
                  <p className="text-[9px] text-slate-200 line-clamp-1 mt-0.5 drop-shadow-xs">
                    {designLayout.subtitle}
                  </p>
                </div>
                <div className="relative z-10 flex justify-center">
                  <span 
                    className="px-3 py-1 rounded-full text-[9px] font-black text-white shadow-md uppercase tracking-wider"
                    style={{ backgroundColor: designLayout.accentColor || '#7D2AE8' }}
                  >
                    {designLayout.cta || 'ACTION'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onApplyMagicDesign?.(designLayout)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Apply to Canvas Editor</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 2. MAGIC MEDIA (TEXT TO IMAGE) TAB ================= */}
      {activeSubTab === 'media' && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Describe Any Image
            </label>
            <textarea
              rows={2}
              value={mediaPrompt}
              onChange={(e) => setMediaPrompt(e.target.value)}
              placeholder="e.g. Glowing neon crystal butterfly in forest, cinematic lighting..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Style Selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Art Style
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'photo', label: 'DSLR Photo', emoji: '📸' },
                { id: '3d', label: '3D Render', emoji: '🎨' },
                { id: 'anime', label: 'Anime Style', emoji: '🌸' },
                { id: 'watercolor', label: 'Watercolor', emoji: '💧' },
                { id: 'cyberpunk', label: 'Cyberpunk', emoji: '⚡' },
                { id: 'minimalist', label: 'Minimalist', emoji: '📐' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setMediaStyle(st.id)}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center space-x-1.5 ${
                    mediaStyle === st.id
                      ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{st.emoji}</span>
                  <span className="truncate">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Aspect Ratio
            </span>
            <div className="flex items-center space-x-1.5">
              {[
                { id: '1:1', label: 'Square (1:1)' },
                { id: '16:9', label: 'Landscape (16:9)' },
                { id: '9:16', label: 'Portrait (9:16)' }
              ].map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setMediaAspect(ratio.id)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[11px] font-bold transition-all border text-center ${
                    mediaAspect === ratio.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateMedia}
            disabled={isGeneratingMedia || !mediaPrompt.trim()}
            className="w-full canva-btn-primary py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {isGeneratingMedia ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Synthesizing Image with Turbo AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Generate AI Image</span>
              </>
            )}
          </button>

          {/* Media Result & Add to Canvas */}
          {mediaResult && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <div className="aspect-square w-full rounded-xl overflow-hidden border border-slate-300 relative bg-slate-100 shadow-inner flex items-center justify-center">
                <img
                  src={mediaResult}
                  alt="Generated AI Art"
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={() => onAddImage?.(mediaResult)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Plus size={13} />
                <span>Add Image to Canvas</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 3. MAGIC WRITE TAB ================= */}
      {activeSubTab === 'write' && (
        <div className="space-y-3.5">
          {/* Quick Actions */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Magic Action
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {MAGIC_WRITE_ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => setWriteAction(action.id)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    writeAction === action.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-500 shadow-xs'
                      : 'border-slate-200 hover:border-purple-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block">{action.label}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{action.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Tone of Voice
            </span>
            <div className="flex flex-wrap gap-1">
              {TONE_PRESETS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setWriteTone(t.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all border flex items-center space-x-1 ${
                    writeTone === t.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Source Copy or Idea
            </label>
            <textarea
              rows={2}
              value={writeInput}
              onChange={(e) => setWriteInput(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-all resize-none"
            />
          </div>

          <button
            onClick={handleRunWrite}
            disabled={isGeneratingWrite || !writeInput.trim()}
            className="w-full canva-btn-primary py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {isGeneratingWrite ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Generating Copy with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Generate Magic Copy</span>
              </>
            )}
          </button>

          {/* Write Result */}
          {writeResult && (
            <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-purple-100">
                <span className="font-bold text-purple-900 flex items-center space-x-1">
                  <Sparkles size={12} className="text-purple-600" />
                  <span>Magic Result</span>
                </span>
                <button
                  onClick={() => copyToClipboard(writeResult)}
                  className="flex items-center space-x-1 text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200 shadow-xs"
                >
                  {copiedWrite ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                  <span>{copiedWrite ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                {writeResult}
              </p>

              <div className="flex items-center space-x-1.5 pt-1">
                {activeObject && (
                  <button
                    onClick={() => onReplaceText?.(writeResult)}
                    className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1"
                  >
                    <Check size={12} />
                    <span>Replace Canvas Text</span>
                  </button>
                )}
                <button
                  onClick={() => onAddText?.(writeResult)}
                  className="flex-1 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-purple-300 text-purple-700 font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus size={12} />
                  <span>Insert As New Text</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 4. MAGIC MORPH (3D TYPOGRAPHY) TAB ================= */}
      {activeSubTab === 'morph' && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Word or Short Text
            </label>
            <input
              type="text"
              value={morphText}
              maxLength={20}
              onChange={(e) => setMorphText(e.target.value.toUpperCase())}
              placeholder="e.g. CREATIVA, SALE, SUMMER..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-black tracking-wider focus:outline-none focus:ring-1 focus:ring-purple-500 uppercase"
            />
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              3D Texture Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {MORPH_TEXTURE_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => setMorphTexture(preset.id)}
                  className={`p-2 rounded-xl text-left transition-all border ${
                    morphTexture === preset.id
                      ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateMorph}
            disabled={isGeneratingMorph || !morphText.trim()}
            className="w-full canva-btn-primary py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
          >
            {isGeneratingMorph ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Rendering 3D Material...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>Generate 3D Typography</span>
              </>
            )}
          </button>

          {/* Morph Result */}
          {morphResult && (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
              <div className="aspect-square w-full rounded-xl overflow-hidden relative flex items-center justify-center bg-slate-950 p-2">
                <img
                  src={morphResult}
                  alt={morphText}
                  className="w-full h-full object-contain"
                />
              </div>

              <button
                onClick={() => onAddImage?.(morphResult)}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-1.5 transition-all"
              >
                <Plus size={13} />
                <span>Add 3D Graphic to Canvas</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= 5. PHOTO AI SUITE TAB ================= */}
      {activeSubTab === 'photo' && (
        <div className="space-y-2.5">
          <p className="text-xs text-slate-500">
            Select any image on the canvas to unleash deep generative AI manipulations:
          </p>

          {[
            {
              id: 'edit',
              title: 'Magic Edit™ (Inpainting)',
              desc: 'Brush over any area and describe what you want to replace or add with AI.',
              icon: Wand2,
              action: onOpenEditImage
            },
            {
              id: 'eraser',
              title: 'Magic Eraser™',
              desc: 'Brush over unwanted people, watermarks, or objects for clean removal.',
              icon: Scissors,
              action: onOpenEditImage
            },
            {
              id: 'bg',
              title: '1-Click Background Remover',
              desc: 'Instantly isolate portraits and products with precision alpha masking.',
              icon: Layers,
              action: onOpenEditImage
            },
            {
              id: 'grab',
              title: 'Magic Grab™ Layer Separation',
              desc: 'Separate subject from background into two movable layers while infilling backdrop.',
              icon: Crop,
              action: onOpenEditImage
            },
            {
              id: 'resize',
              title: 'Magic Switch™ Pro Resize',
              desc: 'Auto-reformat canvas artboard to Instagram, YouTube, Posters and Reels.',
              icon: Maximize2,
              action: onOpenResize
            }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={tool.action}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50/50 text-left transition-all shadow-2xs flex items-center justify-between group"
            >
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <tool.icon size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 group-hover:text-purple-700">{tool.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{tool.desc}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-purple-600 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
