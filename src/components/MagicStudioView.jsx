import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Image, Type, Sliders, RefreshCw, Copy, Check, 
  ArrowRight, Download, Eye, Zap, Layers, Scissors, Crop, 
  Palette, Maximize2, ExternalLink
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
  { icon: '☕', label: 'Coffee Shop Promo', prompt: 'Artisanal coffee shop 50% off fresh roasts promo announcement' },
  { icon: '💪', label: 'Fitness & Gym', prompt: 'Elite fitness coaching and personal training transform your power' },
  { icon: '🛍️', label: 'Luxury Flash Sale', prompt: 'Mega flash sale 60% off signature luxury fashion collection' },
  { icon: '🚀', label: 'AI Platform Launch', prompt: 'Next-gen AI cloud autonomous agentic platform launch keynote' },
  { icon: '🏖️', label: 'Travel Resort Escape', prompt: 'Tropical luxury paradise island travel tour package booking' },
  { icon: '🏡', label: 'Modern Real Estate', prompt: 'Exclusive modern luxury villa architectural property showcase' }
];

export default function MagicStudioView({
  onApplyMagicDesign,
  onApplyAiImage,
  onOpenMagicWrite,
  onCloseHome,
  canvasDimensions = { width: 1080, height: 1080 }
}) {
  const [activeTool, setActiveTool] = useState('design'); // 'design' | 'media' | 'write' | 'morph' | 'switch'

  // 1. Magic Design State
  const [designPrompt, setDesignPrompt] = useState('Artisanal coffee shop 50% off fresh roasts promo announcement');
  const [designLayout, setDesignLayout] = useState(null);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);

  // 2. Magic Media State
  const [mediaPrompt, setMediaPrompt] = useState('Futuristic neon botanical garden with glowing flowers, cinematic 8k');
  const [mediaStyle, setMediaStyle] = useState('photo');
  const [mediaAspect, setMediaAspect] = useState('1:1');
  const [mediaResult, setMediaResult] = useState(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);

  // 3. Magic Write State
  const [writeInput, setWriteInput] = useState('Craft captivating visual experiences that elevate your brand and spark lasting connection.');
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
  const handleGenerateDesign = (promptText = designPrompt) => {
    setIsGeneratingDesign(true);
    setTimeout(() => {
      const layout = generateMagicDesignLayout(promptText, canvasDimensions);
      setDesignLayout(layout);
      setIsGeneratingDesign(false);
    }, 450);
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
        style: mediaStyle
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
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hero Suite Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-400/30">
            <Sparkles size={12} className="fill-purple-400" />
            <span>Creativa Magic Studio™ • Complete Generative AI Suite</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Design at the speed of thought with next-gen AI.
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Generate complete visual layouts from simple text prompts, create photorealistic 8K FLUX.1 images, generate persuasive marketing copy, and render 3D typographic textures — all 100% free with zero subscriptions.
          </p>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 pt-6 overflow-x-auto scrollbar-none relative z-10 max-w-full touch-pan-x pb-1">
          {[
            { id: 'design', label: 'Magic Design™', icon: Wand2, desc: 'Prompt to Layout' },
            { id: 'media', label: 'Magic Media™', icon: Image, desc: 'FLUX.1 Text to Image' },
            { id: 'write', label: 'Magic Write™', icon: Type, desc: 'AI Copywriting' },
            { id: 'morph', label: 'Magic Morph™', icon: Sparkles, desc: '3D Materials' },
            { id: 'switch', label: 'Magic Switch & Pro Tools', icon: Sliders, desc: 'AI Photo Suite' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                activeTool === tool.id
                  ? 'bg-white text-purple-950 shadow-lg scale-102 ring-2 ring-purple-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              <tool.icon size={15} className={activeTool === tool.id ? 'text-purple-600' : 'text-purple-300'} />
              <span>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= 1. MAGIC DESIGN TAB ================= */}
      {activeTool === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Wand2 size={18} className="text-purple-600" />
                <span>Prompt to Multi-Element Design</span>
              </h3>
              <p className="text-xs text-slate-500">
                Describe your vision in plain words. Creativa AI synthesizes cohesive typography, color harmony, vector badges, and curated imagery into an editable canvas artboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Design Prompt
              </label>
              <textarea
                rows={3}
                value={designPrompt}
                onChange={(e) => setDesignPrompt(e.target.value)}
                placeholder="e.g. Minimalist coffee shop special offer, fresh brews & pastries..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Trending Prompts */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Inspiration Ideas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRENDING_DESIGN_IDEAS.map(idea => (
                  <button
                    key={idea.label}
                    onClick={() => {
                      setDesignPrompt(idea.prompt);
                      handleGenerateDesign(idea.prompt);
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-300 bg-slate-50/70 hover:bg-purple-50/60 text-left transition-all flex items-center space-x-2.5 group"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">{idea.icon}</span>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-purple-700 truncate">{idea.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleGenerateDesign()}
              disabled={isGeneratingDesign || !designPrompt.trim()}
              className="w-full canva-btn-primary py-3 rounded-2xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGeneratingDesign ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Synthesizing Design Elements...</span>
                </>
              ) : (
                <>
                  <Wand2 size={15} />
                  <span>Generate Multi-Layer Design</span>
                </>
              )}
            </button>
          </div>

          {/* Design Preview Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Eye size={14} className="text-purple-600" />
                  <span>Live Artboard Preview</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
                  {canvasDimensions.width} × {canvasDimensions.height} px
                </span>
              </div>

              <div className="mt-4 aspect-square max-h-[380px] w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner flex items-center justify-center p-4"
                style={{ background: designLayout?.backgroundColor || '#1e1b4b' }}
              >
                {designLayout ? (
                  <div className="relative w-full h-full flex flex-col justify-between p-6 rounded-xl overflow-hidden shadow-lg border border-white/10"
                    style={{ background: designLayout.backgroundColor || '#1e1b4b' }}
                  >
                    {/* Background image if present */}
                    {designLayout.objects?.find(o => o.type === 'image') && (
                      <img 
                        src={designLayout.objects.find(o => o.type === 'image').src} 
                        alt="Background" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                    )}

                    <div className="relative z-10 space-y-2">
                      {/* Badge */}
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white shadow-sm"
                        style={{ background: designLayout.accentColor || '#7D2AE8' }}
                      >
                        {designLayout.badge || 'EXCLUSIVE'}
                      </span>

                      {/* Main Title */}
                      <h4 className="text-lg md:text-xl font-black text-white leading-tight drop-shadow-md">
                        {designLayout.headline || 'Handcrafted Quality'}
                      </h4>

                      <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-xs">
                        {designLayout.subtitle}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="relative z-10 pt-4">
                      <span className="inline-block px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md uppercase tracking-wider"
                        style={{ background: designLayout.accentColor || '#7D2AE8' }}
                      >
                        {designLayout.cta || 'Customize on Canvas ➔'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <Wand2 size={36} className="mx-auto text-purple-400 animate-pulse" />
                    <p className="text-xs font-bold text-slate-600">No layout generated yet</p>
                    <p className="text-[11px] text-slate-400">Click generate or choose a quick prompt to preview full design</p>
                  </div>
                )}
              </div>
            </div>

            {designLayout && (
              <button
                onClick={() => onApplyMagicDesign?.(designLayout)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Apply Layout Directly to Canvas Editor</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. MAGIC MEDIA (TEXT TO IMAGE) TAB ================= */}
      {activeTool === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Image size={18} className="text-purple-600" />
                <span>FLUX.1 Text-to-Image Generator</span>
              </h3>
              <p className="text-xs text-slate-500">
                Generate high-resolution images from any prompt using advanced FLUX.1 neural models with zero watermarks.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Describe the Image
              </label>
              <textarea
                rows={3}
                value={mediaPrompt}
                onChange={(e) => setMediaPrompt(e.target.value)}
                placeholder="e.g. Glowing crystal butterfly resting on a futuristic glowing moss stone, cinematic lighting..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Style Selector */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Visual Art Style
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'photo', label: 'DSLR Photo', emoji: '📸' },
                  { id: '3d', label: '3D Render', emoji: '🎨' },
                  { id: 'anime', label: 'Anime Style', emoji: '🌸' },
                  { id: 'watercolor', label: 'Watercolor', emoji: '💧' },
                  { id: 'filmic', label: 'Filmic 35mm', emoji: '🎬' },
                  { id: 'cyberpunk', label: 'Cyberpunk', emoji: '⚡' },
                  { id: 'minimalist', label: 'Minimalist', emoji: '📐' },
                  { id: 'retro', label: 'Vintage 70s', emoji: '📻' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setMediaStyle(st.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2 ${
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Aspect Ratio
              </span>
              <div className="flex items-center space-x-2">
                {[
                  { id: '1:1', label: 'Square (1:1)' },
                  { id: '16:9', label: 'Landscape (16:9)' },
                  { id: '9:16', label: 'Portrait / Story (9:16)' }
                ].map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setMediaAspect(ratio.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
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
              className="w-full canva-btn-primary py-3 rounded-2xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGeneratingMedia ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Synthesizing FLUX.1 Photorealistic Image...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate AI Image</span>
                </>
              )}
            </button>
          </div>

          {/* Media Preview Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Image size={14} className="text-purple-600" />
                  <span>Generated Image Result</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold uppercase">
                  FLUX.1 • {mediaStyle}
                </span>
              </div>

              <div className="mt-4 aspect-square max-h-[380px] w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100 flex items-center justify-center shadow-inner">
                {mediaResult ? (
                  <img
                    src={mediaResult}
                    alt="AI Generated"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <Image size={36} className="mx-auto text-purple-400" />
                    <p className="text-xs font-bold text-slate-600">No image generated yet</p>
                    <p className="text-[11px] text-slate-400">Enter a description and click generate to create high-res art</p>
                  </div>
                )}
              </div>
            </div>

            {mediaResult && (
              <button
                onClick={() => onApplyAiImage?.(mediaResult)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Add Image to Canvas Artboard</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 3. MAGIC WRITE (AI COPYWRITING) TAB ================= */}
      {activeTool === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Type size={18} className="text-purple-600" />
                <span>Magic Write™ Generative Copywriting</span>
              </h3>
              <p className="text-xs text-slate-500">
                Rewrite headlines, generate marketing copy, condense key bullet points, or sprinkle creative flair in seconds.
              </p>
            </div>

            {/* Action selector */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Choose Action
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MAGIC_WRITE_ACTIONS.map(act => (
                  <button
                    key={act.id}
                    onClick={() => setWriteAction(act.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      writeAction === act.id
                        ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{act.label}</span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">{act.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Tone of Voice
              </span>
              <div className="flex flex-wrap gap-2">
                {TONE_PRESETS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setWriteTone(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Source Copy or Idea
              </label>
              <textarea
                rows={3}
                value={writeInput}
                onChange={(e) => setWriteInput(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              onClick={handleRunWrite}
              disabled={isGeneratingWrite || !writeInput.trim()}
              className="w-full canva-btn-primary py-3 rounded-2xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGeneratingWrite ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Generating Persuasive Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate Magic Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Copy Result Area */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Type size={14} className="text-purple-600" />
                  <span>Magic Output</span>
                </span>
                {writeResult && (
                  <button
                    onClick={() => copyToClipboard(writeResult)}
                    className="flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    {copiedWrite ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedWrite ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="min-h-[260px] p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                {writeResult || (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-2">
                    <Type size={32} className="text-purple-400" />
                    <p className="font-bold text-slate-600">No copy generated yet</p>
                    <p className="text-[11px] text-slate-400">Select an action, pick a tone, and hit generate</p>
                  </div>
                )}
              </div>
            </div>

            {writeResult && (
              <button
                onClick={() => {
                  copyToClipboard(writeResult);
                  onCloseHome?.();
                }}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Copy & Return to Canvas Editor</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. MAGIC MORPH (3D TYPOGRAPHY) TAB ================= */}
      {activeTool === 'morph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Sparkles size={18} className="text-purple-600" />
                <span>Magic Morph™ 3D Material Transformation</span>
              </h3>
              <p className="text-xs text-slate-500">
                Turn ordinary words into high-octane 3D balloon, liquid chrome, melted gold, or glowing neon glass renders.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Word or Short Text
              </label>
              <input
                type="text"
                value={morphText}
                maxLength={20}
                onChange={(e) => setMorphText(e.target.value.toUpperCase())}
                placeholder="e.g. CREATIVA, SALE, SUMMER..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-black tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all uppercase"
              />
            </div>

            {/* Material Texture Preset Selector */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                3D Material Texture
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MORPH_TEXTURE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setMorphTexture(preset.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
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
              className="w-full canva-btn-primary py-3 rounded-2xl font-bold text-xs text-white shadow-md hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isGeneratingMorph ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Rendering 3D Material Texture...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate 3D Typography</span>
                </>
              )}
            </button>
          </div>

          {/* Morph Result Preview */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>3D Rendered Word</span>
                </span>
                <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold uppercase">
                  {morphTexture}
                </span>
              </div>

              <div className="mt-4 aspect-square max-h-[380px] w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-900 flex items-center justify-center shadow-inner">
                {morphResult ? (
                  <img
                    src={morphResult}
                    alt={morphText}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2 text-slate-400">
                    <Sparkles size={36} className="mx-auto text-purple-400" />
                    <p className="text-xs font-bold text-slate-300">No 3D morph generated yet</p>
                    <p className="text-[11px] text-slate-500">Pick a material and click generate</p>
                  </div>
                )}
              </div>
            </div>

            {morphResult && (
              <button
                onClick={() => onApplyAiImage?.(morphResult)}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <span>Add 3D Element to Canvas Artboard</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= 5. MAGIC SWITCH & PRO TOOLS TAB ================= */}
      {activeTool === 'switch' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Sliders size={18} className="text-purple-600" />
              <span>Pro Creative Intelligence & Transform Tools</span>
            </h3>
            <p className="text-xs text-slate-500">
              Unleash deep generative photo manipulation tools inside the Creativa Canvas Editor with single-click actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Tool 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Maximize2 size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Magic Switch™ Pro Resize</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automatically reformat your designs across 10+ standard formats — from Instagram 1:1 to YouTube 16:9, A4 Resumes, and Reels.
                </p>
              </div>
              <button
                onClick={onCloseHome}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-bold text-xs transition-colors"
              >
                Launch in Editor ➔
              </button>
            </div>

            {/* Tool 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Scissors size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">1-Click Background Remover</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Isolate portraits, products, and subjects with smart alpha channel edge detection. Zero manual lasso masking required.
                </p>
              </div>
              <button
                onClick={onCloseHome}
                className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs transition-colors"
              >
                Launch in Editor ➔
              </button>
            </div>

            {/* Tool 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Magic Grab™ Layer Separation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Separate any foreground subject from its background into two distinct movable layers while automatically filling the backdrop behind.
                </p>
              </div>
              <button
                onClick={onCloseHome}
                className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs transition-colors"
              >
                Launch in Editor ➔
              </button>
            </div>

            {/* Tool 4 */}
            <div className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Crop size={20} />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Grab Text OCR Extraction</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extract baked text from imported images or scans and instantly convert them into live, editable canvas textboxes.
                </p>
              </div>
              <button
                onClick={onCloseHome}
                className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 font-bold text-xs transition-colors"
              >
                Launch in Editor ➔
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
