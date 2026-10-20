import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Search, Plus, Trash2, Eye, EyeOff, Lock, Unlock, 
  ArrowUp, ArrowDown, Upload, Sparkles, FolderOpen, RefreshCw, 
  BarChart3, QrCode, Shuffle, Wand2, Image as ImageIcon,
  Smartphone, Laptop, Camera, Share2, Type, ChevronsUp, ChevronsDown,
  Palette, Globe, FileText, Check, LayoutGrid, Heart, Flame,
  Users, UserPlus, UserCheck
} from 'lucide-react';
import { PREMADE_TEMPLATES } from '../data/templates';
import { searchCanvaTemplates, searchCreators } from '../utils/canvaTemplateEngine';
import { 
  SHAPE_ELEMENTS, LINE_ELEMENTS, STICKERS_AND_BADGES, 
  CURATED_STOCK_PHOTOS, MOCKUP_FRAMES, SOCIAL_MEDIA_ICONS,
  RETRO_GRAPHICS_ELEMENTS, ELEMENT_FILTER_TAGS
} from '../data/elements';
import { CANVA_CREATORS, getAllCreators } from '../data/creators';
import { AVAILABLE_FONTS, PRESET_TEXT_STYLES, CANVA_FONT_PAIRINGS } from '../data/fonts';
import { loadGoogleFont } from '../utils/fontLoader';
import { SOLID_COLORS, GRADIENT_PRESETS } from '../data/backgrounds';
import { generateQRCodeDataUrl } from '../utils/qrGenerator';
import { createBarChart, createDonutChart } from '../utils/chartGenerator';
import { extractPaletteFromImage } from '../utils/colorExtractor';
import { BRAND_PALETTES, BRAND_FONT_PAIRS } from '../data/brand';
import { 
  getIsolatedUserUploads, 
  saveIsolatedUserUpload, 
  deleteIsolatedUserUpload 
} from '../utils/userSession';
import AppsPanel from './AppsPanel';
import MagicStudioPanel from './MagicStudioPanel';
import BrandKitPanel from './BrandKitPanel';

export default function Drawer({
  activeTab,
  onClose,
  onLoadTemplate,
  onAddShape,
  onAddLine,
  onAddSticker,
  onAddText,
  onAddImage,
  isDrawingMode,
  setIsDrawingMode,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  onSetBackground,
  savedProjects,
  onLoadProject,
  onDeleteProject,
  canvasObjects,
  onSelectObject,
  onMoveLayer,
  onToggleLock,
  onDeleteObject,
  onAddCustomObject,
  onShuffleCanvasColors,
  onAddMockup,
  onAddSocialIcon,
  onAddRetroGraphic,
  onToggleVisibility,
  onApplyFontPair,
  onAddFontPairing,
  canvasDimensions,
  onOpenMagicDesign,
  onOpenMagicWrite,
  onOpenCreatorProfile,
  onApplyMagicDesign,
  onReplaceText,
  onOpenEditImage,
  onOpenResize,
  activeObject
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [elementsSearchQuery, setElementsSearchQuery] = useState('');
  const [photosSearchQuery, setPhotosSearchQuery] = useState('');
  const [photosCategoryFilter, setPhotosCategoryFilter] = useState('All');
  const [creatorsSearchQuery, setCreatorsSearchQuery] = useState('');
  const [drawerFontSearch, setDrawerFontSearch] = useState('');
  const [drawerFontCategory, setDrawerFontCategory] = useState('All');
  const [selectedElementTag, setSelectedElementTag] = useState('All');
  const [followedCreators, setFollowedCreators] = useState(['creator-marina']);
  const [uploadedImages, setUploadedImages] = useState(() => getIsolatedUserUploads());
  const [liveSyncRev, setLiveSyncRev] = useState(0);

  useEffect(() => {
    const handleSync = () => setLiveSyncRev(r => r + 1);
    window.addEventListener('canva_autoscrape_sync', handleSync);
    window.addEventListener('creativa_autoscrape_sync', handleSync);
    return () => {
      window.removeEventListener('canva_autoscrape_sync', handleSync);
      window.removeEventListener('creativa_autoscrape_sync', handleSync);
    };
  }, []);

  const fileInputRef = useRef(null);
  const paletteExtractInputRef = useRef(null);

  // QR Code generator state
  const [qrText, setQrText] = useState('https://creativa.toonplayer.in');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrPreviewUrl, setQrPreviewUrl] = useState('');

  // Charts generator state
  const [chartTitle, setChartTitle] = useState('Q3 Sales Growth');
  const [donutPercentage, setDonutPercentage] = useState(82);

  // Generate QR preview on tab open or change
  const handleGenerateQR = async () => {
    try {
      const url = await generateQRCodeDataUrl(qrText, {
        darkColor: qrColor,
        lightColor: qrBgColor
      });
      setQrPreviewUrl(url);
      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleAddQrToCanvas = async () => {
    const url = await handleGenerateQR();
    if (url) onAddImage(url);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImg = {
          id: `upload-${Date.now()}-${Math.random()}`,
          name: file.name,
          url: event.target.result
        };
        const updated = saveIsolatedUserUpload(newImg);
        setUploadedImages(updated);
        onAddImage(newImg.url);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExtractPalette = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const colors = await extractPaletteFromImage(img, 5);
          setCustomPalette(colors);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered Elements
  const eq = elementsSearchQuery.toLowerCase().trim();
  const matchElement = (item) => {
    if (!eq) return true;
    return item.name?.toLowerCase().includes(eq) ||
           item.text?.toLowerCase().includes(eq) ||
           item.description?.toLowerCase().includes(eq) ||
           item.platform?.toLowerCase().includes(eq) ||
           item.keywords?.some(k => k.toLowerCase().includes(eq));
  };
  const filteredRetro = RETRO_GRAPHICS_ELEMENTS.filter(matchElement);
  const filteredShapes = SHAPE_ELEMENTS.filter(matchElement);
  const filteredMockups = MOCKUP_FRAMES.filter(matchElement);
  const filteredIcons = SOCIAL_MEDIA_ICONS.filter(matchElement);
  const filteredLines = LINE_ELEMENTS.filter(matchElement);
  const filteredBadges = STICKERS_AND_BADGES.filter(matchElement);

  // Filtered Templates & Matching Creators
  const filteredTemplates = searchCanvaTemplates(searchQuery, 'All');
  const sq = searchQuery.toLowerCase().trim();
  const allCreatorsList = getAllCreators();
  const matchingCreators = sq ? allCreatorsList.filter(c => 
    c.name.toLowerCase().includes(sq) ||
    c.handle.toLowerCase().includes(sq) ||
    (c.specialty && c.specialty.toLowerCase().includes(sq))
  ) : [];

  // Filtered Photos
  const pq = photosSearchQuery.toLowerCase().trim();
  const matchedPhotos = CURATED_STOCK_PHOTOS.filter(photo => {
    const matchesCat = photosCategoryFilter === 'All' || photo.category.toLowerCase() === photosCategoryFilter.toLowerCase();
    const matchesQuery = !pq || 
      photo.name.toLowerCase().includes(pq) || 
      photo.category.toLowerCase().includes(pq) || 
      photo.keywords?.some(k => k.toLowerCase().includes(pq));
    return matchesCat && matchesQuery;
  });

  const dynamicPhotos = pq ? [
    {
      id: `live-unsplash-1-${pq}`,
      name: `${photosSearchQuery} (HD Live Unsplash)`,
      category: 'Unsplash Live',
      url: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80`,
      thumb: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80`
    },
    {
      id: `live-unsplash-2-${pq}`,
      name: `${photosSearchQuery} (Studio Shot)`,
      category: 'Unsplash Live',
      url: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80`,
      thumb: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80`
    }
  ] : [];

  const filteredPhotos = [...matchedPhotos, ...dynamicPhotos];

  // Filtered Creators with 100% discovery and live dynamic synthesis
  const filteredCreators = searchCreators(creatorsSearchQuery);

  if (!activeTab) return null;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className="md:hidden fixed inset-0 bg-black/40 z-35 backdrop-blur-2xs animate-in fade-in duration-150" 
        onClick={onClose} 
      />

      <div className="fixed inset-x-0 bottom-14 top-14 md:static md:inset-auto w-full md:w-80 lg:w-88 bg-white border-t md:border-t-0 md:border-r border-slate-200 rounded-t-3xl md:rounded-none flex flex-col z-40 select-none shadow-2xl md:shadow-none transition-all text-slate-800 animate-in slide-in-from-bottom-5 md:animate-none h-auto md:h-full">
        {/* Mobile Drag Indicator */}
        <div className="md:hidden w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

        {/* Top Header of Drawer */}
        <div className="h-13 md:h-14 border-b border-slate-100 flex items-center justify-between px-4 shrink-0 bg-white">
          <h2 className="font-extrabold text-slate-900 capitalize text-sm tracking-wide flex items-center space-x-1.5">
            {activeTab === 'templates' ? (
              <span>Design Templates</span>
            ) : activeTab === 'magic' ? (
              <>
                <Sparkles size={16} className="text-purple-600 fill-purple-600" />
                <span className="bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 bg-clip-text text-transparent">Magic Studio AI</span>
              </>
            ) : activeTab === 'brand' ? (
              <span>Brand Kit</span>
            ) : activeTab === 'creators' ? (
              <span>Creators Hub</span>
            ) : activeTab === 'apps' ? (
              <span>Creativa Apps</span>
            ) : (
              <span>{activeTab}</span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white pb-24 md:pb-8 overscroll-contain">
        
        {/* ===================== TAB: MAGIC STUDIO AI ===================== */}
        {activeTab === 'magic' && (
          <MagicStudioPanel
            canvasDimensions={canvasDimensions}
            onApplyMagicDesign={onApplyMagicDesign}
            onAddImage={onAddImage}
            onAddText={onAddText}
            onReplaceText={onReplaceText}
            onOpenEditImage={onOpenEditImage}
            onOpenResize={onOpenResize}
            activeObject={activeObject}
          />
        )}

        {/* ===================== TAB: TEMPLATES ===================== */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Magic Design AI Banner */}
            <div 
              onClick={onOpenMagicDesign}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-purple-900 flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-purple-600 fill-purple-600" />
                  <span>Magic Design™ (AI Layouts)</span>
                </span>
              </div>
              <p className="text-[11px] text-purple-700 leading-snug">
                Describe your vision — AI generates full multi-element designs, typography & color palettes in seconds.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates or creators (e.g. Elena, sale, minimal)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
              />
            </div>

            {/* Matching Creator Callout Banner if searched */}
            {searchQuery && matchingCreators.length > 0 && (
              <div className="space-y-1.5 animate-in fade-in duration-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Matching Official Creator</span>
                {matchingCreators.slice(0, 2).map(c => (
                  <div
                    key={c.id}
                    onClick={() => onOpenCreatorProfile?.(c)}
                    className="p-2.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 hover:border-purple-400 cursor-pointer flex items-center justify-between transition-all shadow-xs group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <img 
                        src={c.avatar} 
                        alt={c.name} 
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                        className="w-8 h-8 rounded-full object-cover border border-purple-300 shrink-0" 
                      />
                      <div className="truncate text-left">
                        <div className="flex items-center space-x-1">
                          <span className="font-bold text-xs text-purple-950 truncate">{c.name}</span>
                          {c.verified && <Check size={10} className="text-white bg-purple-600 rounded-full p-0.5" />}
                        </div>
                        <span className="text-[10px] text-purple-600 font-medium block truncate">{c.specialty || c.handle} • {c.followers}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-full shrink-0 shadow-xs group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      View Profile
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map(tpl => (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      onLoadTemplate(tpl);
                      if (typeof window !== 'undefined' && window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 transition-all bg-white hover:shadow-md shadow-xs flex flex-col justify-between"
                  >
                    {tpl.previewUrl ? (
                      <div className="h-28 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                        <img 
                          src={tpl.previewUrl} 
                          alt={tpl.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex items-center px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white font-medium text-[8px] shadow-xs">
                          {tpl.category}
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="h-28 w-full flex items-center justify-center p-2 text-center relative overflow-hidden"
                        style={{ background: tpl.previewGradient || tpl.backgroundColor || '#7D2AE8' }}
                      >
                        <div className="absolute top-2 right-2 flex items-center px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white font-medium text-[9px] shadow-xs">
                          {tpl.category}
                        </div>
                        <span className="text-white text-xs font-extrabold drop-shadow-md group-hover:scale-105 transition-transform line-clamp-2">
                          {tpl.title}
                        </span>
                      </div>
                    )}
                    <div className="p-2 bg-white border-t border-slate-100 text-left">
                      <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                        {tpl.title}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className="text-slate-400">{tpl.category}</span>
                        {tpl.creator && (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCreatorProfile?.(tpl.creator);
                            }}
                            className="flex items-center space-x-1 hover:text-purple-600 cursor-pointer group/cr"
                            title={`View ${tpl.creator.name}'s profile`}
                          >
                            {tpl.creator.avatar && (
                              <img 
                                src={tpl.creator.avatar} 
                                alt={tpl.creator.name} 
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                                className="w-3.5 h-3.5 rounded-full object-cover" 
                              />
                            )}
                            <span className="text-[9px] text-slate-500 group-hover/cr:text-purple-600 font-semibold truncate max-w-[65px]">
                              {tpl.creator.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: ELEMENTS ===================== */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            {/* Search Elements */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={elementsSearchQuery}
                onChange={(e) => setElementsSearchQuery(e.target.value)}
                placeholder="Search shapes, retro, lines, stickers..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
              />
            </div>

            {/* Filter Tags Carousel */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {ELEMENT_FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedElementTag(tag)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                    selectedElementTag === tag
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Retro Graphics (Screenshot 3) */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Graphics') && filteredRetro.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                    <span>Retro Graphics & Aesthetics ({filteredRetro.length})</span>
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {filteredRetro.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onAddRetroGraphic?.(item.type)}
                      className="p-3 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/50 border border-purple-200/80 hover:border-purple-400 hover:scale-105 flex flex-col items-center justify-center space-y-1 transition-all shadow-xs group cursor-pointer"
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                      <span className="text-[11px] font-bold text-slate-700 text-center">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shapes */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Shapes') && filteredShapes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Geometric Shapes ({filteredShapes.length})
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {filteredShapes.map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => onAddShape(shape)}
                      className="h-16 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 flex flex-col items-center justify-center p-2 group transition-all shadow-xs"
                    >
                      <div 
                        className="w-8 h-8 rounded group-hover:scale-110 transition-transform shadow-xs"
                        style={{ 
                          backgroundColor: shape.fill,
                          borderRadius: shape.type === 'circle' ? '9999px' : shape.rx ? '8px' : '3px'
                        }}
                      />
                      <span className="text-[10px] text-slate-600 font-medium mt-1 truncate max-w-full">
                        {shape.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mockup Frames */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Frames') && filteredMockups.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mockup Frames ({filteredMockups.length})
                  </h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {filteredMockups.map(frame => (
                    <button
                      key={frame.id}
                      onClick={() => onAddMockup?.(frame.type)}
                      className="h-20 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 flex flex-col items-center justify-center p-2 transition-all group shadow-xs"
                      title={frame.description}
                    >
                      {frame.type === 'phone' && <Smartphone size={22} className="text-purple-600 group-hover:scale-110 transition-transform" />}
                      {frame.type === 'laptop' && <Laptop size={22} className="text-cyan-600 group-hover:scale-110 transition-transform" />}
                      {frame.type === 'polaroid' && <Camera size={22} className="text-amber-500 group-hover:scale-110 transition-transform" />}
                      {frame.type === 'circle' && (
                        <div className="w-6 h-6 rounded-full border-2 border-dashed border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600 group-hover:scale-110 transition-transform font-bold">
                          O
                        </div>
                      )}
                      <span className="text-[10px] text-slate-700 font-semibold mt-1 truncate max-w-full">{frame.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media & Vector Icons */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Graphics') && filteredIcons.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Social Media Icons ({filteredIcons.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {filteredIcons.map(icon => (
                    <button
                      key={icon.id}
                      onClick={() => onAddSocialIcon?.(icon.platform, icon.fill)}
                      className="py-2 px-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500 flex items-center justify-center space-x-1.5 transition-all hover:bg-purple-50/30 shadow-xs"
                    >
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: icon.fill }} />
                      <span className="text-[11px] text-slate-700 font-medium truncate">{icon.name.replace(' Icon', '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lines & Connectors */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Lines') && filteredLines.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Lines & Connectors ({filteredLines.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredLines.map(line => (
                    <button
                      key={line.id}
                      onClick={() => onAddLine(line)}
                      className="h-11 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500 flex items-center justify-center px-3 group transition-all shadow-xs"
                    >
                      <div 
                        className="w-full h-1 rounded" 
                        style={{ 
                          backgroundColor: line.stroke,
                          borderTop: line.strokeDashArray ? `3px dashed ${line.stroke}` : 'none'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badges & Stickers */}
            {(selectedElementTag === 'All' || selectedElementTag === 'Stickers') && filteredBadges.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Badges & Stickers ({filteredBadges.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredBadges.map(badge => (
                    <button
                      key={badge.id}
                      onClick={() => onAddSticker(badge)}
                      className="py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs hover:scale-105 transition-all text-center"
                      style={{ backgroundColor: badge.bg, color: badge.textColor }}
                    >
                      {badge.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty Search State */}
            {elementsSearchQuery && filteredRetro.length === 0 && filteredShapes.length === 0 && filteredMockups.length === 0 && filteredIcons.length === 0 && filteredLines.length === 0 && filteredBadges.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                <Search size={22} className="mx-auto text-slate-400 mb-1.5" />
                <p className="font-bold text-slate-700">No elements match "{elementsSearchQuery}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try searching for "star", "phone", "circle", "retro", or "line".</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: PHOTOS (SCREENSHOT 2) ===================== */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={photosSearchQuery}
                onChange={(e) => setPhotosSearchQuery(e.target.value)}
                placeholder="Search photos (e.g. workspace, sunset, coffee)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Business', 'Nature', 'Architecture', 'Lifestyle', 'Food', 'Fashion', 'Technology', 'Abstract'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPhotosCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                    photosCategoryFilter === cat
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Stock Photography ({filteredPhotos.length})
              </h3>
            </div>

            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {filteredPhotos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => onAddImage(photo.url)}
                    className="group relative cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 transition-all h-28 shadow-xs"
                  >
                    <img 
                      src={photo.thumb} 
                      alt={photo.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end p-2 transition-opacity">
                      <span className="text-[11px] text-white font-bold truncate">{photo.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                <Search size={22} className="mx-auto text-slate-400 mb-1.5" />
                <p className="font-bold text-slate-700">No photos match "{photosSearchQuery}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try "workspace", "beach", "city", "leaves", or "coding".</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: BRAND KIT ===================== */}
        {activeTab === 'brand' && (
          <BrandKitPanel
            onAddImage={onAddImage}
            onSetBackground={onSetBackground}
            onShuffleCanvasColors={onShuffleCanvasColors}
            onApplyFontPair={onApplyFontPair}
          />
        )}

        {/* ===================== TAB: TEXT ===================== */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Canva Primary Add a Text Box Button */}
            <button
              onClick={() => onAddText({
                text: 'Your paragraph text',
                fontSize: 24,
                fontWeight: 'normal',
                fontFamily: 'Inter',
                fill: '#1e293b'
              })}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md text-white"
            >
              <Type size={16} />
              <span>Add a text box</span>
            </button>

            {/* Magic Write AI Assistant Banner */}
            <div 
              onClick={onOpenMagicWrite}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 hover:border-purple-400 cursor-pointer transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-purple-900 flex items-center space-x-1.5">
                  <Sparkles size={14} className="text-yellow-500 fill-yellow-500" />
                  <span>Magic Write™ (AI Copywriter)</span>
                </span>
              </div>
              <p className="text-[11px] text-purple-700 leading-snug">
                Brainstorm, rewrite, summarize, or craft captivating headlines and social copy with AI.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Default Text Styles
              </h3>
              {PRESET_TEXT_STYLES.slice(0, 3).map((style, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddText(style)}
                  className="w-full bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-400 rounded-xl p-3 text-left transition-all group shadow-xs"
                >
                  <p 
                    className="text-slate-800 group-hover:text-purple-700 transition-colors"
                    style={{ fontSize: Math.min(style.fontSize * 0.5, 24), fontWeight: style.fontWeight, fontFamily: style.fontFamily }}
                  >
                    {style.label}
                  </p>
                </button>
              ))}
            </div>

            {/* Curated Font Pairings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Curated Font Pairings
                </h3>
                <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">Smart Typography</span>
              </div>
              <div className="space-y-2">
                {CANVA_FONT_PAIRINGS.map((pair, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddFontPairing?.(pair)}
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-3 text-left transition-all group shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{pair.name}</span>
                      <span className="text-[10px] text-purple-600 font-mono font-medium">{pair.headingFont} + {pair.bodyFont}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-tight" style={{ fontFamily: pair.headingFont }}>
                      {pair.sampleHeading}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1" style={{ fontFamily: pair.bodyFont }}>
                      {pair.sampleSub}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Creative Text Presets */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Creative Font Presets
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {PRESET_TEXT_STYLES.slice(3).map((style, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAddText(style)}
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-3 text-center transition-all shadow-xs hover:shadow-md"
                  >
                    <span 
                      style={{ 
                        fontSize: 20, 
                        fontWeight: style.fontWeight, 
                        fontFamily: style.fontFamily, 
                        color: style.fill 
                      }}
                    >
                      {style.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse 75+ Canva Fonts Library */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Creativa Fonts Library ({AVAILABLE_FONTS.length})
                </h3>
              </div>

              {/* Font Search in Drawer */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search fonts (e.g. Spartan, Playfair, Neon)..."
                  value={drawerFontSearch}
                  onChange={(e) => setDrawerFontSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-xs transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Sans-Serif', 'Serif', 'Handwriting', 'Display'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDrawerFontCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                      drawerFontCategory === cat
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Fonts list */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
                {AVAILABLE_FONTS.filter(f => {
                  const matchesCat = drawerFontCategory === 'All' || f.category.toLowerCase() === drawerFontCategory.toLowerCase();
                  const q = drawerFontSearch.toLowerCase().trim();
                  const matchesQuery = !q || f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q) || (f.tag && f.tag.toLowerCase().includes(q));
                  return matchesCat && matchesQuery;
                }).map(f => (
                  <button
                    key={f.name}
                    onClick={async () => {
                      await loadGoogleFont(f.name);
                      onAddText({
                        text: f.name,
                        fontFamily: f.name,
                        fontSize: 40,
                        fontWeight: 'bold',
                        fill: '#1e293b'
                      });
                    }}
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400 rounded-xl px-3 py-2 text-left transition-all shadow-xs flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors block truncate" style={{ fontFamily: f.family }}>
                        {f.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans block truncate">
                        {f.previewText || f.category}
                      </span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-sans font-semibold shrink-0 group-hover:bg-purple-100 group-hover:text-purple-700">
                      {f.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: CHARTS ===================== */}
        {activeTab === 'charts' && (
          <div className="space-y-5">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-800 leading-relaxed">
              <p className="font-bold flex items-center space-x-1 mb-1 text-purple-900">
                <BarChart3 size={14} className="text-purple-600" />
                <span>Vector Infographic Generator</span>
              </p>
              Generate presentation-ready vector bar charts and progress donut charts.
            </div>

            {/* Bar Chart Generator */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Growth Bar Chart</span>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Chart Title</span>
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={() => {
                  const chart = createBarChart({ title: chartTitle });
                  onAddCustomObject(chart);
                }}
                className="canva-btn-primary w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs text-white"
              >
                <Plus size={14} />
                <span>Add Bar Chart</span>
              </button>
            </div>

            {/* Donut Chart Generator */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Donut Progress Ring</span>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>Target Value:</span>
                  <span className="font-bold text-purple-700">{donutPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={donutPercentage}
                  onChange={(e) => setDonutPercentage(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
              <button
                onClick={() => {
                  const chart = createDonutChart({ percentage: donutPercentage });
                  onAddCustomObject(chart);
                }}
                className="canva-btn-primary w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs text-white"
              >
                <Plus size={14} />
                <span>Add Donut Chart</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================== TAB: QR CODE ===================== */}
        {activeTab === 'qrcode' && (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-800 leading-relaxed">
              <p className="font-bold flex items-center space-x-1 mb-1 text-purple-900">
                <QrCode size={14} className="text-purple-600" />
                <span>QR Code Generator</span>
              </p>
              Instantly create custom branded QR codes for URLs, social profiles, menus, or Wi-Fi.
            </div>

            <div>
              <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Destination URL or Text</span>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-mono shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Dark Modules</span>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Light Background</span>
                <input
                  type="color"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer bg-slate-50 border border-slate-300"
                />
              </div>
            </div>

            <button
              onClick={handleAddQrToCanvas}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md text-white"
            >
              <QrCode size={15} />
              <span>Generate & Add to Canvas</span>
            </button>
          </div>
        )}

        {/* ===================== TAB: UPLOADS ===================== */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="canva-btn-primary w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md text-white"
            >
              <Upload size={16} />
              <span>Upload Images or Photos</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-purple-500 transition-colors bg-slate-50 space-y-1">
              <p className="text-xs font-semibold text-slate-700">Drag & drop files here or click above</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, SVG, WebP up to 25MB</p>
            </div>

            <div className="flex items-center space-x-1.5 p-2 rounded-xl bg-purple-50 text-purple-800 text-[10px] font-semibold border border-purple-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Isolated Local Device Storage • 100% Private</span>
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Uploaded Media ({uploadedImages.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map(img => (
                    <div
                      key={img.id}
                      onClick={() => onAddImage(img.url)}
                      className="group relative cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 transition-all h-24 shadow-xs"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = deleteIsolatedUserUpload(img.id);
                          setUploadedImages(updated);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                        title="Delete from local uploads"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: DRAW ===================== */}
        {activeTab === 'draw' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Drawing Mode</span>
              <button
                onClick={() => setIsDrawingMode(!isDrawingMode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  isDrawingMode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isDrawingMode ? 'Active (ON)' : 'Turn ON'}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>Stroke Size</span>
                <span className="font-bold text-purple-700">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-xs text-slate-600 font-bold block mb-2">Brush Color</span>
              <div className="grid grid-cols-6 gap-2">
                {SOLID_COLORS.slice(0, 18).map(col => (
                  <button
                    key={col}
                    onClick={() => setBrushColor(col)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform shadow-xs ${brushColor === col ? 'border-purple-600 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <input 
                  type="color" 
                  value={brushColor} 
                  onChange={(e) => setBrushColor(e.target.value)} 
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0" 
                />
                <span className="text-xs text-slate-600 font-mono font-bold">{brushColor}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: BACKGROUND ===================== */}
        {activeTab === 'background' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Solid Colors
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {SOLID_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => onSetBackground(color)}
                    className="w-10 h-10 rounded-xl border border-slate-200 hover:scale-105 transition-transform shadow-xs"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Vibrant Gradients
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {GRADIENT_PRESETS.map((grad, i) => (
                  <button
                    key={i}
                    onClick={() => onSetBackground(grad.gradient)}
                    className="h-16 rounded-2xl border border-slate-200 hover:scale-102 hover:border-purple-500 transition-all flex items-end p-2.5 shadow-xs"
                    style={{ background: grad.gradient }}
                  >
                    <span className="text-[10px] text-white font-bold drop-shadow px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs">
                      {grad.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: LAYERS ===================== */}
        {activeTab === 'layers' && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Layer Hierarchy
            </h3>
            {canvasObjects && canvasObjects.length > 0 ? (
              <div className="space-y-1.5">
                {canvasObjects.slice().reverse().map((obj, i) => {
                  const actualIndex = canvasObjects.length - 1 - i;
                  const isVisible = obj.visible !== false;
                  const label = obj.type === 'textbox' 
                    ? `Text: "${obj.text?.slice(0, 16)}..."`
                    : obj.type === 'image' ? 'Image Layer'
                    : obj.type === 'group' ? 'Group Object'
                    : `${obj.type?.toUpperCase()} Shape`;

                  return (
                    <div 
                      key={actualIndex}
                      onClick={() => onSelectObject(obj)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer border transition-colors shadow-xs ${
                        !isVisible 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60' 
                          : 'bg-slate-50 hover:bg-purple-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="truncate max-w-[130px] font-semibold">{label}</span>
                      <div className="flex items-center space-x-1 text-slate-500">
                        {/* Eye Toggle Visibility */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(obj); }}
                          className={`p-1 rounded hover:bg-slate-200 ${!isVisible ? 'text-slate-400' : 'text-slate-600'}`} 
                          title={isVisible ? 'Hide layer' : 'Show layer'}
                        >
                          {isVisible ? <Eye size={13} /> : <EyeOff size={13} className="text-red-500" />}
                        </button>
                        {/* Reordering */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); onMoveLayer(obj, 'up'); }}
                          className="p-1 hover:text-purple-700 hover:bg-slate-200 rounded" 
                          title="Bring Forward"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onMoveLayer(obj, 'down'); }}
                          className="p-1 hover:text-purple-700 hover:bg-slate-200 rounded" 
                          title="Send Backward"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleLock(obj); }}
                          className="p-1 hover:text-purple-700 hover:bg-slate-200 rounded" 
                          title={obj.lockMovementX ? 'Unlock' : 'Lock'}
                        >
                          {obj.lockMovementX ? <Lock size={13} className="text-amber-500" /> : <Unlock size={13} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteObject(obj); }}
                          className="p-1 hover:text-red-600 hover:bg-red-50 rounded" 
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No objects on artboard yet.</p>
            )}
          </div>
        )}

        {/* ===================== TAB: PROJECTS ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Saved Browser Projects ({savedProjects?.length || 0})
            </h3>
            {savedProjects && savedProjects.length > 0 ? (
              <div className="space-y-2">
                {savedProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-400 transition-all flex items-center justify-between group shadow-xs"
                  >
                    <div 
                      onClick={() => onLoadProject(proj)} 
                      className="cursor-pointer flex-1 min-w-0 pr-2"
                    >
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-purple-700">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {proj.width} × {proj.height} px • {new Date(proj.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 border border-slate-200 rounded-2xl bg-slate-50">
                <FolderOpen size={28} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-bold">No saved designs yet</p>
                <p className="text-[11px] text-slate-500 mt-1">Click the "Save" button in the top bar to save your current work.</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: APPS & MARKETPLACE ===================== */}
        {activeTab === 'apps' && (
          <AppsPanel
            onAddImage={onAddImage}
            onAddCustomObject={onAddCustomObject}
            onAddText={onAddText}
            canvasDimensions={canvasDimensions}
            onOpenMagicDesign={onOpenMagicDesign}
          />
        )}

        {/* ===================== TAB: CREATORS COMMUNITY (SCREENSHOT 4) ===================== */}
        {activeTab === 'creators' && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-purple-600" />
                <h3 className="font-extrabold text-xs text-slate-900">Featured Verified Creators</h3>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Discover verified creators, follow your favorite designers, and use their designs directly on your canvas.
              </p>
            </div>

            {/* Search Creators */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={creatorsSearchQuery}
                onChange={(e) => setCreatorsSearchQuery(e.target.value)}
                placeholder="Search creators by name, style, or tag..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
              />
            </div>

            {/* Creators List */}
            <div className="space-y-4">
              {filteredCreators.length > 0 ? (
                filteredCreators.map((creator) => {
                const isFollowed = followedCreators.includes(creator.id);
                return (
                  <div 
                    key={creator.id}
                    onClick={() => onOpenCreatorProfile?.(creator)}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-purple-400 transition-all space-y-3 cursor-pointer group/creator-card"
                    title="Click to view full creator profile"
                  >
                    {/* Creator Profile Header */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-2.5 group/creator"
                      >
                        <img 
                          src={creator.avatar} 
                          alt={creator.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs group-hover/creator-card:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-xs text-slate-900 group-hover/creator-card:text-purple-600 transition-colors">
                              {creator.name}
                            </h4>
                            {creator.verified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]" title="Verified Creator">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">{creator.handle} • {creator.followers}</p>
                          <span className="text-[9px] font-bold text-purple-600 group-hover/creator-card:underline">
                            Profile ➔
                          </span>
                        </div>
                      </div>

                      {/* Follow Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFollowedCreators(prev => 
                            prev.includes(creator.id) 
                              ? prev.filter(id => id !== creator.id) 
                              : [...prev, creator.id]
                          );
                        }}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center space-x-1 ${
                          isFollowed 
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <UserCheck size={11} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={11} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bio & Specialty */}
                    <div className="text-[11px] text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] mb-1">
                        {creator.specialty}
                      </span>
                      <p className="line-clamp-2 text-slate-500 italic">"{creator.bio}"</p>
                    </div>

                    {/* Designs published by this creator */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Published Designs ({creator.designs?.length || 0})
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {creator.designs.map((design) => (
                          <div
                            key={design.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onLoadTemplate(design);
                              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                onClose();
                              }
                            }}
                            className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 bg-white shadow-xs transition-all flex flex-col justify-between"
                          >
                            {design.previewUrl ? (
                              <div className="h-16 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                <img 
                                  src={design.previewUrl} 
                                  alt={design.title} 
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                <span className="absolute top-1 left-1 text-[7px] font-extrabold px-1 py-0.5 rounded bg-black/60 text-white">
                                  {design.category}
                                </span>
                                <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white bg-purple-600 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  Use ➔
                                </span>
                              </div>
                            ) : (
                              <div 
                                className="h-16 w-full p-2 flex items-end justify-between relative overflow-hidden"
                                style={{ background: design.previewGradient || design.backgroundColor || '#7D2AE8' }}
                              >
                                <span className="text-[8px] font-extrabold px-1 py-0.5 rounded bg-black/40 text-white">
                                  {design.category}
                                </span>
                                <span className="text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  Use ➔
                                </span>
                              </div>
                            )}
                            <div className="p-1.5 bg-white">
                              <p className="text-[10px] font-bold text-slate-800 truncate group-hover:text-purple-600">
                                {design.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 p-4">
                <Users size={22} className="mx-auto text-slate-400 mb-1.5" />
                <p className="font-bold text-slate-700">No creators match "{creatorsSearchQuery}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try searching for "marina", "retro", "naveen", or "borcelle".</p>
              </div>
            )}
            </div>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
