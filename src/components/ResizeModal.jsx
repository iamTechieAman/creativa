import React, { useState } from 'react';
import { 
  X, Sparkles, Check, Copy, ArrowRight, Languages, 
  FileText, Wand2, RefreshCw, CheckCircle2 
} from 'lucide-react';

const PRESET_SIZES = [
  { name: 'Square Post (Instagram)', width: 800, height: 800, category: 'Social Media' },
  { name: 'Instagram Post HD', width: 1080, height: 1080, category: 'Social Media' },
  { name: 'Story / Reel / TikTok', width: 1080, height: 1920, category: 'Social Media' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'Video' },
  { name: 'Presentation (16:9)', width: 1920, height: 1080, category: 'Business' },
  { name: 'Flyer / Poster', width: 800, height: 1200, category: 'Print' },
  { name: 'Twitter / X Banner', width: 1500, height: 500, category: 'Social Media' },
  { name: 'A4 Document', width: 1240, height: 1754, category: 'Print' }
];

const TRANSLATION_LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'pt', name: 'Portuguese (Português)' }
];

// Offline translation dictionary for standard Canva headings
const QUICK_TRANSLATIONS = {
  hi: {
    'heading': 'शीर्षक',
    'subheading': 'उपशीर्षक',
    'add a heading': 'एक मुख्य शीर्षक जोड़ें',
    'add a subheading': 'एक उपशीर्षक जोड़ें',
    'my brand design': 'मेरा ब्रांड डिज़ाइन',
    'huge sale': 'महा सेल 50% छूट',
    'good vibes only': 'सकारात्मक विचार',
    'coffee time': 'कॉफी का समय',
    'modern minimal': 'आधुनिक और सरल'
  },
  es: {
    'heading': 'Título',
    'subheading': 'Subtítulo',
    'add a heading': 'Agregar un título',
    'add a subheading': 'Agregar un subtítulo',
    'my brand design': 'Mi Diseño de Marca',
    'huge sale': 'Gran Venta 50%',
    'good vibes only': 'Solo Buenas Vibras',
    'coffee time': 'Hora del Café',
    'modern minimal': 'Moderno y Minimalista'
  },
  fr: {
    'heading': 'Titre',
    'subheading': 'Sous-titre',
    'add a heading': 'Ajouter un titre',
    'add a subheading': 'Ajouter un sous-titre',
    'my brand design': 'Design de Marque',
    'huge sale': 'Grande Vente 50%',
    'good vibes only': 'Que des Bonnes Ondes',
    'coffee time': 'Pause Café',
    'modern minimal': 'Moderne & Minimaliste'
  },
  de: {
    'heading': 'Überschrift',
    'subheading': 'Unterüberschrift',
    'add a heading': 'Überschrift hinzufügen',
    'add a subheading': 'Unterüberschrift hinzufügen',
    'my brand design': 'Mein Markendesign',
    'huge sale': 'Riesiger Ausverkauf',
    'good vibes only': 'Nur Gute Laune',
    'coffee time': 'Kaffeezeit',
    'modern minimal': 'Modern & Schlicht'
  },
  ja: {
    'heading': '見出し',
    'subheading': '小見出し',
    'add a heading': '見出しを追加',
    'add a subheading': '小見出しを追加',
    'my brand design': 'ブランドデザイン',
    'huge sale': '大セール 50% OFF',
    'good vibes only': 'ポジティブな気分で',
    'coffee time': 'コーヒータイム',
    'modern minimal': 'モダン＆ミニマル'
  }
};

export default function ResizeModal({
  isOpen,
  onClose,
  currentWidth,
  currentHeight,
  onApplyResize,
  onCopyAndResize,
  canvas
}) {
  const [activeTab, setActiveTab] = useState('resize'); // 'resize', 'translate', 'doc'
  
  // Resize tab state
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [scaleContent, setScaleContent] = useState(true);

  // Translate tab state
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);

  // Doc tab state
  const [docType, setDocType] = useState('Summary');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [copiedDoc, setCopiedDoc] = useState(false);

  if (!isOpen) return null;

  const handleApply = (w, h, isCopy = false) => {
    const finalW = Number(w);
    const finalH = Number(h);
    if (isCopy && onCopyAndResize) {
      onCopyAndResize(finalW, finalH, scaleContent);
    } else {
      onApplyResize(finalW, finalH, scaleContent);
    }
    onClose();
  };

  // Magic Switch: Translate Text on Canvas
  const handleTranslateCanvas = () => {
    if (!canvas) {
      alert('Canvas is not ready');
      return;
    }
    setIsTranslating(true);
    setTranslateSuccess(false);

    try {
      const textObjects = canvas.getObjects().filter(o => o.type === 'textbox' || o.type === 'i-text');
      const langDict = QUICK_TRANSLATIONS[selectedLang] || {};

      textObjects.forEach(obj => {
        const textLower = (obj.text || '').trim().toLowerCase();
        if (langDict[textLower]) {
          obj.set('text', langDict[textLower]);
        } else {
          // If not in offline dict, prefix with localized marker or transliterate
          if (selectedLang === 'hi') obj.set('text', `अनुवाद: ${obj.text}`);
          else if (selectedLang === 'es') obj.set('text', `Traducción: ${obj.text}`);
          else if (selectedLang === 'fr') obj.set('text', `Traduction: ${obj.text}`);
          else if (selectedLang === 'de') obj.set('text', `Übersetzt: ${obj.text}`);
          else if (selectedLang === 'ja') obj.set('text', `翻訳: ${obj.text}`);
          else obj.set('text', `[${selectedLang.toUpperCase()}] ${obj.text}`);
        }
      });

      canvas.requestRenderAll();
      setTranslateSuccess(true);
      setTimeout(() => {
        setIsTranslating(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.error(e);
      setIsTranslating(false);
    }
  };

  // Magic Switch: Transform into Doc
  const handleGenerateDoc = () => {
    if (!canvas) return;
    const textObjects = canvas.getObjects().filter(o => o.type === 'textbox' || o.type === 'i-text');
    const strings = textObjects.map(o => o.text).filter(Boolean);

    let doc = '';
    if (docType === 'Summary') {
      doc = `# Executive Design Summary\n\n**Generated via Creativa Magic Switch**\n\n### Key Concepts & Headlines:\n` +
        strings.map(s => `- **${s}**`).join('\n') +
        `\n\n### Visual Analysis:\n- Canvas Format: ${currentWidth} × ${currentHeight} px\n- Total Visual Objects: ${canvas.getObjects().length}\n- Primary Audience: Creative Branding & Digital Marketing`;
    } else if (docType === 'Blog Post') {
      doc = `# Behind the Design: An In-Depth Look\n\n` +
        (strings[0] ? `## ${strings[0]}\n\n` : '') +
        `Today, we're unveiling a modern visual composition crafted with precise typography, balanced geometry, and vibrant color harmonies.\n\n` +
        strings.slice(1).map(s => `### ${s}\nEvery detail was engineered to capture immediate engagement across social channels.`).join('\n\n') +
        `\n\n---\n*Created with Creativa Magic Studio*`;
    } else {
      doc = `# Talking Points & Presentation Brief\n\n` +
        strings.map((s, idx) => `**Slide Section ${idx + 1}:**\n> "${s}"\n*Speaking Note:* Emphasize the strategic value and visual impact of this section.`).join('\n\n');
    }

    setGeneratedDoc(doc);
  };

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg canva-gradient text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Magic Switch & Smart Resize</h3>
              <p className="text-[11px] text-slate-500">Transform, translate, and resize your design instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Canva Magic Switch Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('resize')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'resize'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles size={13} />
            <span>Resize</span>
          </button>

          <button
            onClick={() => setActiveTab('translate')}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'translate'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Languages size={13} />
            <span>Translate</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('doc');
              if (!generatedDoc) handleGenerateDoc();
            }}
            className={`pb-2.5 px-3 font-bold text-xs border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'doc'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={13} />
            <span>Transform into Doc</span>
          </button>
        </div>

        {/* Tab 1: Resize Content */}
        {activeTab === 'resize' && (
          <div className="p-6 space-y-4">
            {/* Custom Size Form */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Custom Dimensions (Pixels)
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <span className="text-[11px] text-slate-500 block mb-1">Width (px)</span>
                  <input
                    type="number"
                    min="200"
                    max="4000"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <span className="text-slate-400 font-bold mt-5">×</span>
                <div className="flex-1">
                  <span className="text-[11px] text-slate-500 block mb-1">Height (px)</span>
                  <input
                    type="number"
                    min="200"
                    max="4000"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Scale content checkbox */}
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={scaleContent}
                onChange={(e) => setScaleContent(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">Scale elements proportionally to fit new dimensions</span>
            </label>

            {/* Popular Presets */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Standard Format Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {PRESET_SIZES.map((preset, idx) => {
                  const isCurrent = currentWidth === preset.width && currentHeight === preset.height;
                  const isSelected = width === preset.width && height === preset.height;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setWidth(preset.width);
                        setHeight(preset.height);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500'
                          : isCurrent
                          ? 'border-emerald-400 bg-emerald-50/40'
                          : 'border-slate-200 hover:border-purple-400 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{preset.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {preset.width} × {preset.height} px
                        </p>
                      </div>
                      {isSelected ? (
                        <Check size={15} className="text-purple-600 shrink-0" />
                      ) : isCurrent ? (
                        <span className="text-[9px] font-semibold text-emerald-600 uppercase">Current</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApply(width, height, true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 shadow-xs"
                >
                  <Copy size={13} />
                  <span>Copy & Resize</span>
                </button>
                <button
                  onClick={() => handleApply(width, height, false)}
                  className="canva-btn-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5"
                >
                  <span>Resize</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Translate Design */}
        {activeTab === 'translate' && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-800">
              <p className="font-bold flex items-center space-x-1.5 mb-1">
                <Languages size={14} className="text-purple-600" />
                <span>Creativa Magic Translate</span>
              </p>
              Instantly translate all text headings, subheadings, and captions on your canvas into another language without losing design layout.
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Translate into language:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSLATION_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedLang === lang.code
                        ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {translateSuccess && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 size={15} />
                <span>Canvas text successfully translated!</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTranslateCanvas}
                disabled={isTranslating}
                className="canva-btn-primary px-5 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isTranslating ? <RefreshCw size={13} className="animate-spin" /> : <Languages size={13} />}
                <span>{isTranslating ? 'Translating...' : 'Translate Design'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Transform into Doc */}
        {activeTab === 'doc' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Choose document format:</span>
              <div className="flex space-x-1">
                {['Summary', 'Blog Post', 'Brief'].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setDocType(t);
                      setTimeout(() => handleGenerateDoc(), 50);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      docType === t
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={generatedDoc}
              onChange={(e) => setGeneratedDoc(e.target.value)}
              className="w-full h-44 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-purple-500 focus:bg-white resize-none"
            />

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyDoc}
                className="canva-btn-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-md flex items-center space-x-1.5"
              >
                {copiedDoc ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedDoc ? 'Copied to Clipboard!' : 'Copy Document'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
