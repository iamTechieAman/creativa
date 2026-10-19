import React, { useState } from 'react';
import { 
  Search, Sparkles, Type, Smartphone, Table, Film, 
  ShieldCheck, Binary, QrCode, BarChart3, Eye, ArrowLeft, 
  Wand2, Plus, RefreshCw, Check, CheckCircle2, AlertCircle, Crown,
  Layers, Maximize2, Laptop, Camera
} from 'lucide-react';
import { CANVA_PLUGINS, BRAND_LOGOS, GIPHY_STICKERS, MATH_FORMULAS } from '../data/plugins';
import { createTypeCraftText } from '../utils/typeCraftHelper';
import { createDataTable } from '../utils/tableGenerator';
import { createPhoneMockup, createLaptopMockup, createPolaroidFrame } from '../utils/shapeHelper';
import { generateQRCodeDataUrl } from '../utils/qrGenerator';
import { createBarChart, createDonutChart } from '../utils/chartGenerator';
import { AVAILABLE_FONTS } from '../data/fonts';
import { Textbox, Rect, Group } from 'fabric';
import { 
  generateAiImage, generateMagicMorph, MORPH_TEXTURE_PRESETS 
} from '../utils/aiEngines';

export default function AppsPanel({
  onAddImage,
  onAddCustomObject,
  onAddText,
  canvasDimensions,
  onOpenMagicDesign
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePluginId, setActivePluginId] = useState(null);

  // 1. AI Image Generator State
  const [aiPrompt, setAiPrompt] = useState('Cyberpunk neon cat floating in cosmic space, hyper-realistic, 8k');
  const [aiStyle, setAiStyle] = useState('photo');
  const [aiAspect, setAiAspect] = useState('1:1');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiUrl, setGeneratedAiUrl] = useState('');

  // 2. Magic Morph State
  const [morphText, setMorphText] = useState('CREATIVA STUDIO');
  const [morphPresetId, setMorphPresetId] = useState('balloon');
  const [isMorphing, setIsMorphing] = useState(false);
  const [morphedUrl, setMorphedUrl] = useState('');

  // 3. TypeCraft State
  const [typeCraftText, setTypeCraftText] = useState('CREATIVA STUDIO');
  const [typeCraftFont, setTypeCraftFont] = useState('Montserrat');
  const [typeCraftFill, setTypeCraftFill] = useState('#00F0FF');
  const [typeCraftExtrude, setTypeCraftExtrude] = useState('#3a0ca3');
  const [typeCraftDepth, setTypeCraftDepth] = useState(8);

  // 4. Tables State
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tableHeaderBg, setTableHeaderBg] = useState('#7D2AE8');

  // 5. QR Code state in Apps
  const [appQrText, setAppQrText] = useState('https://creativa.design');
  const [appQrColor, setAppQrColor] = useState('#000000');
  const [appQrBg, setAppQrBg] = useState('#ffffff');
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);

  // 6. Charts state in Apps
  const [chartType, setChartType] = useState('donut'); // 'donut' | 'bar'
  const [chartTitle, setChartTitle] = useState('Q3 Sales Growth');
  const [chartPercentage, setChartPercentage] = useState(85);

  // 7. Contrast Checker State
  const [textColor, setTextColor] = useState('#1e293b');
  const [bgColor, setBgColor] = useState('#ffffff');

  // Categories
  const categories = ['All', 'AI & Magic', 'Typography', 'Design & Mockups', 'Productivity', 'Media & Social', 'Utility'];

  // AI Image generation using instant Pollinations AI
  const handleGenerateAI = async () => {
    setIsGeneratingAi(true);
    try {
      let w = 800, h = 800;
      if (aiAspect === '16:9') { w = 960; h = 540; }
      else if (aiAspect === '9:16') { w = 540; h = 960; }
      const url = await generateAiImage(aiPrompt, { width: w, height: h, style: aiStyle });
      setGeneratedAiUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Magic Morph 3D Texture generation
  const handleGenerateMorph = async () => {
    if (!morphText) return;
    setIsMorphing(true);
    try {
      const preset = MORPH_TEXTURE_PRESETS.find(p => p.id === morphPresetId) || MORPH_TEXTURE_PRESETS[0];
      const url = await generateMagicMorph(morphText, preset.prompt);
      setMorphedUrl(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMorphing(false);
    }
  };

  // Add TypeCraft 3D Text
  const handleAddTypeCraft = () => {
    const group = createTypeCraftText({
      text: typeCraftText,
      fontSize: 48,
      fontFamily: typeCraftFont,
      fill: typeCraftFill,
      extrudeColor: typeCraftExtrude,
      depth: typeCraftDepth,
      canvasWidth: canvasDimensions.width,
      canvasHeight: canvasDimensions.height
    });
    onAddCustomObject(group);
  };

  // Add Table
  const handleAddTable = () => {
    const tableGroup = createDataTable({
      rows: tableRows,
      cols: tableCols,
      headerBg: tableHeaderBg,
      canvasWidth: canvasDimensions.width,
      canvasHeight: canvasDimensions.height
    });
    onAddCustomObject(tableGroup);
  };

  // Add QR Code
  const handleAddQrApp = async () => {
    setIsGeneratingQr(true);
    try {
      const url = await generateQRCodeDataUrl(appQrText, { darkColor: appQrColor, lightColor: appQrBg });
      if (url) onAddImage(url);
    } catch (e) {
      console.error('Failed to generate QR code in Apps:', e);
    } finally {
      setIsGeneratingQr(false);
    }
  };

  // Add Vector Chart
  const handleAddChartApp = () => {
    const left = canvasDimensions.width / 2;
    const top = canvasDimensions.height / 2;
    if (chartType === 'donut') {
      const donut = createDonutChart({
        percentage: chartPercentage,
        label: chartTitle,
        left,
        top
      });
      onAddCustomObject(donut);
    } else {
      const bar = createBarChart({
        title: chartTitle,
        left,
        top
      });
      onAddCustomObject(bar);
    }
  };

  // Add Mockup Frame
  const handleAddMockupApp = (type) => {
    const left = canvasDimensions.width / 2;
    const top = canvasDimensions.height / 2;
    if (type === 'phone') {
      onAddCustomObject(createPhoneMockup({ left, top }));
    } else if (type === 'laptop') {
      onAddCustomObject(createLaptopMockup({ left, top }));
    } else if (type === 'polaroid') {
      onAddCustomObject(createPolaroidFrame({ left, top }));
    }
  };

  // Add Math Formula Group
  const handleAddFormula = (formula) => {
    const bgBox = new Rect({
      width: 320,
      height: 90,
      rx: 16,
      ry: 16,
      fill: '#f8fafc',
      stroke: '#cbd5e1',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetY: 4 }
    });

    const mathText = new Textbox(formula.formula, {
      fontSize: 26,
      fontWeight: 'bold',
      fontFamily: 'serif',
      fill: '#2563eb',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      top: -10,
      width: 290
    });

    const labelText = new Textbox(formula.name, {
      fontSize: 11,
      fontFamily: 'Inter',
      fill: '#64748b',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      top: 24,
      width: 290
    });

    const group = new Group([bgBox, mathText, labelText], {
      left: canvasDimensions.width / 2,
      top: canvasDimensions.height / 2,
      originX: 'center',
      originY: 'center'
    });

    onAddCustomObject(group);
  };

  // Add Brand Logo Card
  const handleAddBrandLogo = (brand) => {
    const bg = new Rect({
      width: 80,
      height: 80,
      rx: 20,
      ry: 20,
      fill: brand.bg,
      stroke: 'rgba(0,0,0,0.1)',
      strokeWidth: 1.5,
      originX: 'center',
      originY: 'center',
      shadow: { color: 'rgba(0,0,0,0.1)', blur: 12, offsetY: 4 }
    });

    const symbol = new Textbox(brand.symbol, {
      fontSize: 38,
      fontWeight: 'bold',
      fontFamily: 'Inter',
      fill: brand.color,
      textAlign: 'center',
      originX: 'center',
      originY: 'center'
    });

    const group = new Group([bg, symbol], {
      left: canvasDimensions.width / 2,
      top: canvasDimensions.height / 2,
      originX: 'center',
      originY: 'center'
    });

    onAddCustomObject(group);
  };

  // Calculate Luminance & Contrast
  const getLuminance = (hex) => {
    const c = parseInt(hex.replace('#', ''), 16);
    const r = ((c >> 16) & 255) / 255;
    const g = ((c >> 8) & 255) / 255;
    const b = (c & 255) / 255;
    const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const getContrastRatio = () => {
    try {
      const l1 = getLuminance(textColor);
      const l2 = getLuminance(bgColor);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return ratio.toFixed(2);
    } catch {
      return '4.50';
    }
  };

  const contrastRatio = Number(getContrastRatio());
  const passAA = contrastRatio >= 4.5;
  const passAAA = contrastRatio >= 7.0;

  // Active Plugin View
  if (activePluginId) {
    const plugin = CANVA_PLUGINS.find(p => p.id === activePluginId);

    return (
      <div className="space-y-4 text-slate-800">
        {/* Back navigation */}
        <button
          onClick={() => setActivePluginId(null)}
          className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 py-1"
        >
          <ArrowLeft size={14} />
          <span>Back to Apps Marketplace</span>
        </button>

        {/* Plugin Title Header */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-xs" style={{ backgroundColor: plugin?.color || '#7D2AE8' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs">{plugin?.name}</h3>
            <span className="text-[10px] text-purple-700 font-bold">{plugin?.badge} FREE</span>
          </div>
        </div>

        {/* ================= PLUGIN 1: AI IMAGE GENERATOR (MAGIC MEDIA) ================= */}
        {activePluginId === 'ai-image' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Describe what you want to create:</span>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white"
                placeholder="A magical forest with floating lanterns and glowing fireflies..."
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Aspect Ratio:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9 Landscape' },
                  { id: '9:16', label: '9:16 Story' }
                ].map(ar => (
                  <button
                    key={ar.id}
                    onClick={() => setAiAspect(ar.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      aiAspect === ar.id ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Art Style:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'photo', label: 'Photorealistic' },
                  { id: 'filmic', label: 'Cinematic' },
                  { id: '3d', label: '3D Render' },
                  { id: 'anime', label: 'Anime' },
                  { id: 'watercolor', label: 'Watercolor' },
                  { id: 'cyberpunk', label: 'Cyberpunk' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setAiStyle(st.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      aiStyle === st.id ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAi}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md text-white"
            >
              {isGeneratingAi ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
              <span>{isGeneratingAi ? 'Generating Art...' : 'Generate Image with AI'}</span>
            </button>

            {generatedAiUrl && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">AI Output:</span>
                <img 
                  src={generatedAiUrl} 
                  alt="AI Generation" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                  className="w-full h-44 object-cover rounded-xl shadow-xs" 
                />
                <button
                  onClick={() => onAddImage(generatedAiUrl)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Plus size={14} />
                  <span>Add AI Image to Canvas</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= PLUGIN: MAGIC MORPH ================= */}
        {activePluginId === 'magic-morph' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Text or Word to Morph:</span>
              <input
                type="text"
                value={morphText}
                onChange={(e) => setMorphText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 font-bold"
                placeholder="e.g. SUMMER, VIBES, CANVA..."
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Choose 3D Material / Texture:</span>
              <div className="grid grid-cols-2 gap-2">
                {MORPH_TEXTURE_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setMorphPresetId(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      morphPresetId === p.id ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold block">{p.name}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateMorph}
              disabled={isMorphing || !morphText}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md text-white"
            >
              {isMorphing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>{isMorphing ? 'Morphing Material...' : 'Morph 3D Graphic with AI'}</span>
            </button>

            {morphedUrl && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">3D Morphed Graphic:</span>
                <img 
                  src={morphedUrl} 
                  alt="Morphed Graphic" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80'; }}
                  className="w-full h-44 object-contain rounded-xl bg-slate-100" 
                />
                <button
                  onClick={() => onAddImage(morphedUrl)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Plus size={14} />
                  <span>Insert Morphed 3D Graphic</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= PLUGIN: MAGIC DESIGN ================= */}
        {activePluginId === 'magic-design' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-900">
              <p className="font-bold mb-1 flex items-center space-x-1 text-purple-950">
                <Wand2 size={13} className="text-purple-600" />
                <span>Magic Design Studio</span>
              </p>
              AI writes your headlines, selects harmonious palettes, and composes an entire multi-element layout in seconds!
            </div>
            <button
              onClick={() => onOpenMagicDesign?.()}
              className="canva-btn-primary w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md text-white"
            >
              <Sparkles size={15} />
              <span>Launch Magic Design Studio</span>
            </button>
          </div>
        )}

        {/* ================= PLUGIN 2: TYPECRAFT 3D TEXT ================= */}
        {activePluginId === 'typecraft' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Text:</span>
              <input
                type="text"
                value={typeCraftText}
                onChange={(e) => setTypeCraftText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600 font-bold"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Font Family:</span>
              <select
                value={typeCraftFont}
                onChange={(e) => setTypeCraftFont(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-600"
              >
                {AVAILABLE_FONTS.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Face Color:</span>
                <input
                  type="color"
                  value={typeCraftFill}
                  onChange={(e) => setTypeCraftFill(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">3D Extrusion:</span>
                <input
                  type="color"
                  value={typeCraftExtrude}
                  onChange={(e) => setTypeCraftExtrude(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>3D Extrude Depth:</span>
                <span className="font-bold text-purple-700">{typeCraftDepth}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="16"
                value={typeCraftDepth}
                onChange={(e) => setTypeCraftDepth(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handleAddTypeCraft}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md text-white"
            >
              <Plus size={14} />
              <span>Insert 3D Text to Canvas</span>
            </button>
          </div>
        )}

        {/* ================= PLUGIN 3: DATA TABLES ================= */}
        {activePluginId === 'tables' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Rows:</span>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Columns:</span>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Header Background:</span>
              <input
                type="color"
                value={tableHeaderBg}
                onChange={(e) => setTableHeaderBg(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
              />
            </div>

            <button
              onClick={handleAddTable}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md text-white"
            >
              <Table size={14} />
              <span>Insert Spreadsheet Table</span>
            </button>
          </div>
        )}

        {/* ================= PLUGIN 4: BRANDFETCH ================= */}
        {activePluginId === 'brandfetch' && (
          <div className="space-y-3.5">
            <span className="text-[11px] font-bold text-slate-700 block">Click to insert vector brand logos:</span>
            <div className="grid grid-cols-3 gap-2">
              {BRAND_LOGOS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => handleAddBrandLogo(brand)}
                  className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all shadow-xs"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shadow-xs"
                    style={{ backgroundColor: brand.bg, color: brand.color }}
                  >
                    {brand.symbol}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">{brand.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= PLUGIN 5: GIPHY ================= */}
        {activePluginId === 'giphy' && (
          <div className="space-y-3.5">
            <span className="text-[11px] font-bold text-slate-700 block">Click animated sticker to add:</span>
            <div className="grid grid-cols-2 gap-2">
              {GIPHY_STICKERS.map(gif => (
                <div
                  key={gif.id}
                  onClick={() => onAddImage(gif.url)}
                  className="cursor-pointer bg-slate-50 border border-slate-200 hover:border-purple-500 rounded-2xl overflow-hidden p-2 flex flex-col items-center justify-center hover:scale-105 transition-all shadow-xs"
                >
                  <img 
                    src={gif.url} 
                    alt={gif.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    className="h-20 w-20 object-contain" 
                  />
                  <span className="text-[10px] font-bold text-slate-600 mt-1">{gif.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PLUGIN: SMARTMOCKUPS ================= */}
        {activePluginId === 'smartmockups' && (
          <div className="space-y-3.5">
            <span className="text-[11px] font-bold text-slate-700 block">Click a 3D device frame to add to canvas:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddMockupApp('phone')}
                className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Phone Frame</span>
              </button>

              <button
                onClick={() => handleAddMockupApp('laptop')}
                className="p-3 bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-400 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Laptop size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Laptop Frame</span>
              </button>

              <button
                onClick={() => handleAddMockupApp('polaroid')}
                className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all shadow-xs group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-800">Polaroid</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              💡 Drag or place your design photos right into the mockup bezel on canvas!
            </p>
          </div>
        )}

        {/* ================= PLUGIN: DYNAMIC QR CODE ================= */}
        {activePluginId === 'qrcode' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Enter URL or Message:</span>
              <input
                type="text"
                value={appQrText}
                onChange={(e) => setAppQrText(e.target.value)}
                placeholder="https://creativa.design"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-600 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">QR Color:</span>
                <input
                  type="color"
                  value={appQrColor}
                  onChange={(e) => setAppQrColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Background:</span>
                <input
                  type="color"
                  value={appQrBg}
                  onChange={(e) => setAppQrBg(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            <button
              onClick={handleAddQrApp}
              disabled={isGeneratingQr || !appQrText}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md text-white"
            >
              {isGeneratingQr ? <RefreshCw size={14} className="animate-spin" /> : <QrCode size={14} />}
              <span>{isGeneratingQr ? 'Generating QR...' : 'Add QR Code to Canvas'}</span>
            </button>
          </div>
        )}

        {/* ================= PLUGIN: CHARTS & INFOGRAPHICS ================= */}
        {activePluginId === 'charts' && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Chart Type:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setChartType('donut')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    chartType === 'donut' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  Donut Metric Ring
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    chartType === 'bar' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  Monthly Bar Chart
                </button>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Chart Title:</span>
              <input
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800"
              />
            </div>

            {chartType === 'donut' && (
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Percentage Metric:</span>
                  <span className="font-bold text-purple-700">{chartPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={chartPercentage}
                  onChange={(e) => setChartPercentage(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            )}

            <button
              onClick={handleAddChartApp}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md text-white"
            >
              <BarChart3 size={14} />
              <span>Insert Vector Chart to Canvas</span>
            </button>
          </div>
        )}

        {/* ================= PLUGIN 6: MATH EQUATIONS ================= */}
        {(activePluginId === 'equations' || activePluginId === 'latex') && (
          <div className="space-y-3.5">
            <span className="text-[11px] font-bold text-slate-700 block">Click formula to insert:</span>
            <div className="space-y-2">
              {MATH_FORMULAS.map(formula => (
                <button
                  key={formula.id}
                  onClick={() => handleAddFormula(formula)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-400 rounded-2xl text-left transition-all shadow-xs flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-serif font-bold text-blue-700 block">{formula.formula}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{formula.name}</span>
                  </div>
                  <Plus size={14} className="text-purple-600" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= PLUGIN 7: CONTRAST CHECKER ================= */}
        {(activePluginId === 'contrast-checker' || activePluginId === 'contrast') && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Text Color:</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Background Color:</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div 
              className="p-4 rounded-2xl border border-slate-200 text-center shadow-xs" 
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <h4 className="font-bold text-base">Sample Heading Text</h4>
              <p className="text-xs mt-1">The quick brown fox jumps over the lazy dog.</p>
            </div>

            {/* Scorecard */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Contrast Ratio:</span>
                <span className="font-extrabold text-sm text-purple-700">{contrastRatio} : 1</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
                <span className="text-slate-700 font-medium">WCAG AA Standard (4.5:1)</span>
                <span className={`font-bold flex items-center space-x-1 ${passAA ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passAA ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  <span>{passAA ? 'Pass' : 'Fail'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">WCAG AAA Standard (7.0:1)</span>
                <span className={`font-bold flex items-center space-x-1 ${passAAA ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {passAAA ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                  <span>{passAAA ? 'Pass' : 'Fail'}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Marketplace Storefront Grid
  return (
    <div className="space-y-4 text-slate-800">
      {/* Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search Creativa apps & plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-xs"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full shrink-0 font-bold transition-colors ${
              selectedCategory === cat 
                ? 'bg-purple-600 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {CANVA_PLUGINS
          .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCat;
          })
          .map(plugin => (
            <div
              key={plugin.id}
              onClick={() => setActivePluginId(plugin.id)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-400 transition-all cursor-pointer group flex items-start space-x-3 shadow-xs hover:shadow-md"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                style={{ backgroundColor: plugin.color }}
              >
                <Sparkles size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 truncate">
                    {plugin.name}
                  </h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase flex items-center space-x-1 shrink-0">
                    <Crown size={9} className="fill-amber-500 text-amber-500" />
                    <span>{plugin.badge} FREE</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {plugin.description}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
