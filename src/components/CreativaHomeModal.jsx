import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Sparkles, LayoutTemplate, Smartphone, 
  Monitor, FileText, Image, Video, Award, ChevronRight, 
  Compass, Flame, Heart, ArrowRight, Plus,
  Users, UserPlus, UserCheck, FolderOpen, Palette,
  LayoutGrid, RefreshCw, Wand2, Bell, Settings,
  User, Check, ChevronDown, ExternalLink, Play,
  Printer, Briefcase, GraduationCap, BookOpen, ShieldCheck,
  Layers, Type, QrCode, BarChart2, Star, Zap,
  Menu, ChevronLeft, Trash2, Copy, Sliders, Scissors, Crop,
  Globe
} from 'lucide-react';
import { CANVA_CREATORS, getAllCreators } from '../data/creators';
import { searchCanvaTemplates, getAllTemplates, searchCreators } from '../utils/canvaTemplateEngine';
import { getAutoScrapedData, triggerLiveCanvaSync, getAutoScrapingStats } from '../utils/autoScraper';
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
import CreativaLogo from './CreativaLogo';
import MagicStudioView from './MagicStudioView';
import TemplatesHubView from './TemplatesHubView';
import CreatorsDirectoryView from './CreatorsDirectoryView';
import ProjectsWorkspaceView from './ProjectsWorkspaceView';

const HERO_WORKFLOWS = [
  { id: 'for_you', label: 'For you', icon: Sparkles, category: 'All' },
  { id: 'docs', label: 'Docs', icon: FileText, category: 'Resume' },
  { id: 'whiteboards', label: 'Whiteboards', icon: LayoutGrid, category: 'Business' },
  { id: 'presentations', label: 'Presentations', icon: Monitor, category: 'Presentation' },
  { id: 'social', label: 'Social Media', icon: Smartphone, category: 'Social Media' },
  { id: 'videos', label: 'Videos', icon: Video, category: 'Video' },
  { id: 'prints', label: 'Print Products', icon: Printer, category: 'Poster' },
  { id: 'websites', label: 'Websites', icon: Globe, category: 'Marketing' },
  { id: 'more', label: 'More', icon: Layers, category: 'All' }
];

const WORKFLOW_FORMATS = {
  for_you: [
    { label: 'Doc', icon: FileText, width: 816, height: 1056, desc: '816 × 1056 px' },
    { label: 'Whiteboard', icon: LayoutGrid, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Presentation (16:9)', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Instagram Post (Square)', icon: Smartphone, width: 1080, height: 1080, desc: '1080 × 1080 px' },
    { label: 'Resume / CV', icon: FileText, width: 794, height: 1123, desc: '794 × 1123 px' },
    { label: 'Flyer (Portrait)', icon: Image, width: 1080, height: 1350, desc: '1080 × 1350 px' },
    { label: 'Logo', icon: Award, width: 800, height: 800, desc: '800 × 800 px' },
    { label: 'YouTube Thumbnail', icon: Video, width: 1280, height: 720, desc: '1280 × 720 px' }
  ],
  docs: [
    { label: 'Canva Doc', icon: FileText, width: 816, height: 1056, desc: '816 × 1056 px' },
    { label: 'Executive Summary', icon: FileText, width: 816, height: 1056, desc: '816 × 1056 px' },
    { label: 'Resume / CV', icon: FileText, width: 794, height: 1123, desc: '794 × 1123 px' },
    { label: 'Project Proposal', icon: FileText, width: 1200, height: 1600, desc: '1200 × 1600 px' },
    { label: 'Newsletter', icon: FileText, width: 816, height: 1056, desc: '816 × 1056 px' }
  ],
  whiteboards: [
    { label: 'Brainstorm Whiteboard', icon: LayoutGrid, width: 2560, height: 1440, desc: '2560 × 1440 px' },
    { label: 'Agile Retrospective', icon: LayoutGrid, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Flowchart Canvas', icon: LayoutGrid, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Team Mind Map', icon: LayoutGrid, width: 2560, height: 1440, desc: '2560 × 1440 px' },
    { label: 'Mood Board', icon: LayoutGrid, width: 1920, height: 1080, desc: '1920 × 1080 px' }
  ],
  presentations: [
    { label: 'Presentation (16:9)', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Talking Presentation', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Mobile Presentation', icon: Smartphone, width: 1080, height: 1920, desc: '1080 × 1920 px' },
    { label: 'Pitch Deck', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Educational Deck', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' }
  ],
  social: [
    { label: 'Instagram Post (Square)', icon: Smartphone, width: 1080, height: 1080, desc: '1080 × 1080 px' },
    { label: 'Instagram Story', icon: Smartphone, width: 1080, height: 1920, desc: '1080 × 1920 px' },
    { label: 'Facebook Post', icon: Smartphone, width: 1200, height: 630, desc: '1200 × 630 px' },
    { label: 'TikTok Video', icon: Video, width: 1080, height: 1920, desc: '1080 × 1920 px' },
    { label: 'YouTube Thumbnail', icon: Video, width: 1280, height: 720, desc: '1280 × 720 px' },
    { label: 'Twitter / X Header', icon: Image, width: 1500, height: 500, desc: '1500 × 500 px' }
  ],
  videos: [
    { label: 'Video (16:9)', icon: Video, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Mobile Video / Reel', icon: Video, width: 1080, height: 1920, desc: '1080 × 1920 px' },
    { label: 'YouTube Video', icon: Video, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Video Message', icon: Video, width: 1080, height: 1920, desc: '1080 × 1920 px' },
    { label: 'Video Collage', icon: Video, width: 1080, height: 1080, desc: '1080 × 1080 px' }
  ],
  prints: [
    { label: 'Flyer (Portrait)', icon: Printer, width: 1080, height: 1350, desc: '1080 × 1350 px' },
    { label: 'Poster', icon: Image, width: 1080, height: 1350, desc: '1080 × 1350 px' },
    { label: 'Business Card', icon: Award, width: 1050, height: 600, desc: '1050 × 600 px' },
    { label: 'Brochure (Tri-fold)', icon: FileText, width: 1123, height: 794, desc: '1123 × 794 px' },
    { label: 'Invitation (Portrait)', icon: Heart, width: 1080, height: 1920, desc: '1080 × 1920 px' }
  ],
  websites: [
    { label: 'Portfolio Website', icon: Globe, width: 1366, height: 768, desc: '1366 × 768 px' },
    { label: 'Business Landing Page', icon: Globe, width: 1440, height: 900, desc: '1440 × 900 px' },
    { label: 'Event Website', icon: Globe, width: 1366, height: 768, desc: '1366 × 768 px' },
    { label: 'Bio Link Website', icon: Smartphone, width: 1080, height: 1920, desc: '1080 × 1920 px' }
  ],
  more: [
    { label: 'Infographic', icon: Layers, width: 800, height: 2000, desc: '800 × 2000 px' },
    { label: 'Desktop Wallpaper', icon: Monitor, width: 1920, height: 1080, desc: '1920 × 1080 px' },
    { label: 'Book Cover', icon: Image, width: 1410, height: 2250, desc: '1410 × 2250 px' },
    { label: 'Calendar', icon: LayoutGrid, width: 1080, height: 1080, desc: '1080 × 1080 px' }
  ]
};

export default function CreativaHomeModal({
  isOpen,
  onClose,
  onLoadTemplate,
  onNewCustomDesign,
  savedProjects = [],
  onLoadProject,
  onDeleteProject,
  onOpenMagicDesign,
  onOpenMagicWrite,
  onApplyMagicDesign,
  onApplyAiImage,
  canvasDimensions = { width: 1080, height: 1080 },
  onOpenCreatorProfile
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'templates' | 'creators' | 'projects' | 'magic'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [heroWorkflow, setHeroWorkflow] = useState('for_you');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedCreators, setFollowedCreators] = useState(['creator-babhelluq50', 'creator-marina']);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Creativa Global Design Network • Synchronized');
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [activeNavMenu, setActiveNavMenu] = useState(null); // 'spotlight' | 'business' | 'education' | 'pricing' | 'learn' | null
  const [liveDataRev, setLiveDataRev] = useState(0);
  const [showAllCreators, setShowAllCreators] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Magic Studio State
  const [magicStudioTab, setMagicStudioTab] = useState('design'); // 'design' | 'media' | 'write' | 'morph' | 'switch'
  const [magicDesignPrompt, setMagicDesignPrompt] = useState('Artisanal coffee shop 50% off fresh roasts promo');
  const [magicDesignLayout, setMagicDesignLayout] = useState(null);
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false);

  const [magicMediaPrompt, setMagicMediaPrompt] = useState('Futuristic neon botanical garden with glowing flowers, cinematic 8k');
  const [magicMediaStyle, setMagicMediaStyle] = useState('photo');
  const [magicMediaAspect, setMagicMediaAspect] = useState('1:1');
  const [magicMediaResult, setMagicMediaResult] = useState(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);

  const [magicWriteInput, setMagicWriteInput] = useState('Craft captivating visual experiences that elevate your brand and spark lasting connection.');
  const [magicWriteAction, setMagicWriteAction] = useState('rewrite');
  const [magicWriteTone, setMagicWriteTone] = useState('enthusiastic');
  const [magicWriteResult, setMagicWriteResult] = useState('');
  const [isGeneratingWrite, setIsGeneratingWrite] = useState(false);
  const [copiedWriteResult, setCopiedWriteResult] = useState(false);

  const [magicMorphText, setMagicMorphText] = useState('CREATIVA');
  const [magicMorphTexture, setMagicMorphTexture] = useState('balloon');
  const [magicMorphResult, setMagicMorphResult] = useState(null);
  const [isGeneratingMorph, setIsGeneratingMorph] = useState(false);

  const [creatorSpecialtyFilter, setCreatorSpecialtyFilter] = useState('All');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  const quickTypesScrollRef = useRef(null);

  const scrollQuickTypes = (direction) => {
    if (quickTypesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      quickTypesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleSync = () => setLiveDataRev(r => r + 1);
    window.addEventListener('canva_autoscrape_sync', handleSync);
    window.addEventListener('creativa_autoscrape_sync', handleSync);
    return () => {
      window.removeEventListener('canva_autoscrape_sync', handleSync);
      window.removeEventListener('creativa_autoscrape_sync', handleSync);
    };
  }, []);

  if (!isOpen) return null;

  const categories = [
    'All', 'Presentation', 'Social Media', 'Marketing', 
    'Video', 'Business', 'Logo', 'Invitation', 'Poster', 'Resume'
  ];

  const quickTypes = [
    { label: 'Presentation', icon: Monitor, width: 1920, height: 1080, bg: 'from-amber-400 to-orange-500' },
    { label: 'Instagram Post', icon: Smartphone, width: 1080, height: 1080, bg: 'from-pink-500 to-purple-600' },
    { label: 'YouTube Thumbnail', icon: Video, width: 1280, height: 720, bg: 'from-red-500 to-rose-600' },
    { label: 'Resume / CV', icon: FileText, width: 794, height: 1123, bg: 'from-blue-400 to-indigo-500' },
    { label: 'Invitation', icon: Heart, width: 1080, height: 1920, bg: 'from-purple-500 to-pink-500' },
    { label: 'Logo', icon: Award, width: 800, height: 800, bg: 'from-emerald-400 to-teal-500' },
    { label: 'Reel / Video', icon: Video, width: 1080, height: 1920, bg: 'from-fuchsia-500 to-purple-600' },
    { label: 'Poster', icon: Image, width: 1080, height: 1350, bg: 'from-cyan-400 to-blue-500' }
  ];

  const allTemplates = getAllTemplates();
  const allCreators = getAllCreators();
  const filteredTemplates = searchCanvaTemplates(searchQuery, selectedCategory);
  const filteredCreators = searchCreators(searchQuery, creatorSpecialtyFilter);

  const filteredProjects = (savedProjects || []).filter(p => {
    if (!projectSearchQuery) return true;
    return p.title?.toLowerCase().includes(projectSearchQuery.toLowerCase());
  });

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to live creator endpoints...');
    try {
      const res = await triggerLiveCanvaSync();
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus(`Synced ${res.templatesCount} templates & ${res.creatorsCount} verified creators!`);
        setTimeout(() => setSyncStatus('Creativa Global Design Network • Synchronized'), 3500);
      }, 700);
    } catch (e) {
      setIsSyncing(false);
      setSyncStatus('Live Network Connected');
    }
  };

  const handleGenerateMagicDesign = (customPrompt = magicDesignPrompt) => {
    setIsGeneratingDesign(true);
    setTimeout(() => {
      const layout = generateMagicDesignLayout(customPrompt, canvasDimensions);
      setMagicDesignLayout(layout);
      setIsGeneratingDesign(false);
    }, 450);
  };

  const handleGenerateMagicMedia = async () => {
    if (!magicMediaPrompt.trim()) return;
    setIsGeneratingMedia(true);
    try {
      let w = 800, h = 800;
      if (magicMediaAspect === '16:9') { w = 960; h = 540; }
      else if (magicMediaAspect === '9:16') { w = 540; h = 960; }
      const res = await generateAiImage(magicMediaPrompt, {
        width: w,
        height: h,
        style: magicMediaStyle
      });
      setMagicMediaResult(res);
    } catch (e) {
      console.error('Magic media generation failed:', e);
    } finally {
      setIsGeneratingMedia(false);
    }
  };

  const handleRunMagicWrite = async () => {
    if (!magicWriteInput.trim()) return;
    setIsGeneratingWrite(true);
    try {
      const copy = await runMagicWrite({
        action: magicWriteAction,
        originalText: magicWriteInput,
        tone: magicWriteTone
      });
      setMagicWriteResult(copy);
    } catch (e) {
      console.error('Magic write failed:', e);
    } finally {
      setIsGeneratingWrite(false);
    }
  };

  const handleGenerateMagicMorph = async () => {
    if (!magicMorphText.trim()) return;
    setIsGeneratingMorph(true);
    try {
      const textureObj = MORPH_TEXTURE_PRESETS.find(t => t.id === magicMorphTexture) || MORPH_TEXTURE_PRESETS[0];
      const res = await generateMagicMorph(magicMorphText, textureObj.prompt);
      setMagicMorphResult(res);
    } catch (e) {
      console.error('Magic morph failed:', e);
    } finally {
      setIsGeneratingMorph(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] flex flex-col overflow-hidden animate-in fade-in duration-150 select-none text-slate-800">
      
      {/* ================= 1. OFFICIAL TOP NAVIGATION BAR ================= */}
      <header className="h-14 md:h-15 bg-white border-b border-slate-200 px-3 md:px-6 flex items-center justify-between shrink-0 shadow-xs z-30">
        
        {/* Left: Mobile Menu, Creativa Logo & Nav Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Open Menu"
          >
            <Menu size={20} />
          </button>

          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center cursor-pointer group pr-1 sm:pr-2"
            title="Creativa Home"
          >
            <CreativaLogo className="h-8 sm:h-9 md:h-10 w-auto" showTagline={true} />
          </div>

          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold text-slate-600">
            <button 
              onClick={() => setActiveNavMenu(prev => prev === 'spotlight' ? null : 'spotlight')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors ${
                activeNavMenu === 'spotlight' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100'
              }`}
            >
              <span>Design spotlight</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${activeNavMenu === 'spotlight' ? 'rotate-180 text-purple-600' : ''}`} />
            </button>
            <button 
              onClick={() => setActiveNavMenu(prev => prev === 'business' ? null : 'business')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors ${
                activeNavMenu === 'business' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100'
              }`}
            >
              <span>Business</span>
              <ChevronDown size={12} className={`text-slate-400 transition-transform ${activeNavMenu === 'business' ? 'rotate-180 text-purple-600' : ''}`} />
            </button>
          </nav>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-6 relative">
          <Search size={16} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates, creators, or describe with AI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 rounded-2xl pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right: Return to Editor & Create a Design Button */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
          
          {/* Return to Canvas Editor Button */}
          <button
            onClick={onClose}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-700 shadow-xs transition-colors"
            title="Return to your open design canvas"
          >
            <span className="hidden sm:inline">Return to Editor</span>
            <span className="sm:hidden text-[11px]">Editor</span>
            <ArrowRight size={13} className="text-purple-600 shrink-0" />
          </button>

          {/* Create a Design Button */}
          <div className="relative">
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="canva-btn-primary flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-purple-500/25 transition-all text-white shrink-0"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Create a design</span>
              <span className="sm:hidden text-[11px]">Create</span>
            </button>

            {isCreateMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-slate-700 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggested Dimensions
                </div>
                {quickTypes.slice(0, 5).map(qt => (
                  <button
                    key={qt.label}
                    onClick={() => {
                      onLoadTemplate({
                        id: `blank-${qt.label.toLowerCase()}`,
                        title: `Untitled ${qt.label}`,
                        width: qt.width,
                        height: qt.height,
                        backgroundColor: '#ffffff',
                        objects: []
                      });
                      setIsCreateMenuOpen(false);
                      onClose();
                    }}
                    className="w-full px-3.5 py-2 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <qt.icon size={14} className="text-slate-500" />
                      <span>{qt.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{qt.width}×{qt.height}</span>
                  </button>
                ))}
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      setIsCreateMenuOpen(false);
                      onNewCustomDesign?.();
                    }}
                    className="w-full px-3.5 py-2 hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-2 font-bold text-purple-600 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Custom size...</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-5 animate-in slide-in-from-left duration-200">
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <CreativaLogo className="h-8 w-auto" showTagline={false} />
                <button onClick={() => setIsMobileNavOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Workspace</p>
                <button 
                  onClick={() => { setActiveTab('home'); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === 'home' ? 'bg-purple-100 text-purple-700' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center space-x-2"><Compass size={16} className="text-purple-600" /><span>Home</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button 
                  onClick={() => { setActiveTab('magic'); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === 'magic' ? 'bg-purple-100 text-purple-700' : 'text-purple-900 bg-purple-50/70 hover:bg-purple-100'
                  }`}
                >
                  <span className="flex items-center space-x-2"><Sparkles size={16} className="text-purple-600 fill-purple-600" /><span>Magic Studio AI</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button 
                  onClick={() => { setActiveTab('templates'); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === 'templates' ? 'bg-purple-100 text-purple-700' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center space-x-2"><LayoutTemplate size={16} className="text-purple-600" /><span>Templates</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button 
                  onClick={() => { setActiveTab('creators'); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === 'creators' ? 'bg-purple-100 text-purple-700' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center space-x-2"><Users size={16} className="text-purple-600" /><span>Creators</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button 
                  onClick={() => { setActiveTab('projects'); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                    activeTab === 'projects' ? 'bg-purple-100 text-purple-700' : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center space-x-2"><FolderOpen size={16} className="text-purple-600" /><span>Projects ({savedProjects.length})</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-3">Explore</p>
                <button 
                  onClick={() => { setActiveNavMenu('spotlight'); setIsMobileNavOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <span className="flex items-center space-x-2"><Sparkles size={16} className="text-purple-600" /><span>Design Spotlight</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button 
                  onClick={() => { setActiveNavMenu('business'); setIsMobileNavOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  <span className="flex items-center space-x-2"><Briefcase size={16} className="text-purple-600" /><span>Business</span></span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => { onClose(); setIsMobileNavOpen(false); }}
                className="w-full canva-btn-primary py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center space-x-2"
              >
                <span>Open Canvas Editor</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileNavOpen(false)} />
        </div>
      )}

      {/* Backdrop Overlay for Nav Dropdowns */}
      {activeNavMenu && (
        <div 
          className="fixed inset-0 z-30 bg-black/15 backdrop-blur-2xs transition-opacity"
          onClick={() => setActiveNavMenu(null)}
        />
      )}

      {/* Nav Dropdowns Container */}
      {activeNavMenu && (
        <div className="absolute top-14 md:top-15 left-0 right-0 bg-white border-b border-slate-200 shadow-2xl z-40 p-4 sm:p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
            {/* 1. DESIGN SPOTLIGHT MEGA-MENU */}
            {activeNavMenu === 'spotlight' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                      <Sparkles size={18} className="text-purple-600" />
                      <span>Creativa Design Spotlight</span>
                    </h3>
                    <p className="text-xs text-slate-500">Explore millions of design possibilities across every medium and format</p>
                  </div>
                  <button 
                    onClick={() => setActiveNavMenu(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-xs">
                  {/* Column 1: Visual Suite */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-extrabold uppercase text-[11px] tracking-wider text-purple-700">
                      <FileText size={14} />
                      <span>Visual Suite</span>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setSelectedCategory('Presentation'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Monitor size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-purple-700 block">Presentations</span>
                          <span className="text-[10px] text-slate-400">Pitch decks, keynotes & 16:9 masterdecks</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Business'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <FileText size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-purple-700 block">Visual Docs & Reports</span>
                          <span className="text-[10px] text-slate-400">Proposals, memos & project briefs</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Resume'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <User size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-purple-700 block">Resumes & CVs</span>
                          <span className="text-[10px] text-slate-400">Professional executive & modern layouts</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('All'); setSearchQuery('chart'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <BarChart2 size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-purple-700 block">Charts & Infographics</span>
                          <span className="text-[10px] text-slate-400">Data visualization & diagram templates</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Photos & Videos */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-extrabold uppercase text-[11px] tracking-wider text-pink-600">
                      <Video size={14} />
                      <span>Photos & Videos</span>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setSelectedCategory('Video'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-pink-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Video size={16} className="text-pink-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-pink-700 block">Reels & TikTok Video</span>
                          <span className="text-[10px] text-slate-400">9:16 vertical motion hooks & stories</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Social Media'); setSearchQuery('youtube'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-pink-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Play size={16} className="text-pink-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-pink-700 block">YouTube Thumbnails</span>
                          <span className="text-[10px] text-slate-400">High-CTR video banners & gaming art</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('All'); setSearchQuery('photo'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-pink-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Image size={16} className="text-pink-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-pink-700 block">Photo Editor & Collages</span>
                          <span className="text-[10px] text-slate-400">Filter presets, frames & studio effects</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Column 3: Print & Events */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-extrabold uppercase text-[11px] tracking-wider text-emerald-600">
                      <Printer size={14} />
                      <span>Print & Events</span>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setSelectedCategory('Invitation'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Heart size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-emerald-700 block">Cards & Invitations</span>
                          <span className="text-[10px] text-slate-400">Weddings, birthdays & gala announcements</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Poster'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Image size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-emerald-700 block">Posters & Wall Art</span>
                          <span className="text-[10px] text-slate-400">Events, concerts & festival promotions</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Business'); setSearchQuery('business card'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Briefcase size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-emerald-700 block">Business Cards</span>
                          <span className="text-[10px] text-slate-400">Executive, minimal & modern branding</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Column 4: Marketing & Brands */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-extrabold uppercase text-[11px] tracking-wider text-blue-600">
                      <Award size={14} />
                      <span>Marketing Suite</span>
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setSelectedCategory('Logo'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Award size={16} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-blue-700 block">Logos & Brandmarks</span>
                          <span className="text-[10px] text-slate-400">Vector badges, emblems & wordmarks</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Marketing'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Sparkles size={16} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-blue-700 block">Flyers & Brochures</span>
                          <span className="text-[10px] text-slate-400">Marketing campaigns & sales announcements</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { setSelectedCategory('Social Media'); setActiveTab('templates'); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 group flex items-start space-x-2.5 transition-colors"
                      >
                        <Smartphone size={16} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800 group-hover:text-blue-700 block">Social Media Posts</span>
                          <span className="text-[10px] text-slate-400">Instagram, Facebook, LinkedIn & Pinterest</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => { onOpenMagicDesign?.(); setActiveNavMenu(null); }} 
                        className="w-full text-left p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 group flex items-start space-x-2.5 transition-colors border border-purple-200"
                      >
                        <Wand2 size={16} className="text-purple-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-purple-900 block flex items-center space-x-1">
                            <span>Magic Studio AI</span>
                            <span className="text-[9px] bg-purple-600 text-white px-1.5 rounded">AI</span>
                          </span>
                          <span className="text-[10px] text-purple-700">Instant multi-element design from prompt</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BUSINESS DROPDOWN */}
            {activeNavMenu === 'business' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                      <Briefcase size={18} className="text-purple-600" />
                      <span>Creativa for Business & Teams</span>
                    </h3>
                    <p className="text-xs text-slate-500">Scale high-impact visual design, brand consistency and creative output</p>
                  </div>
                  <button onClick={() => setActiveNavMenu(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      <ShieldCheck size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Brand Kit & Visual Consistency</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Extract color palettes from any brand website or guidelines PDF. Keep logos, fonts, and hex codes unified across all presentations.
                    </p>
                    <button 
                      onClick={() => { setSelectedCategory('Business'); setActiveTab('templates'); setActiveNavMenu(null); }}
                      className="text-xs font-bold text-purple-700 hover:underline pt-2 block"
                    >
                      Browse Business Templates ➔
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Monitor size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Executive Pitch Decks</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Over 100+ master slides, financial roadmaps, data charts and investor presentation decks ready for customization.
                    </p>
                    <button 
                      onClick={() => { setSelectedCategory('Presentation'); setActiveTab('templates'); setActiveNavMenu(null); }}
                      className="text-xs font-bold text-blue-700 hover:underline pt-2 block"
                    >
                      Browse Pitch Decks ➔
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Sparkles size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">Creative Agency Suite</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      High-converting social campaigns, advertising posters, flyers and video hooks aggregated from 237+ verified designers.
                    </p>
                    <button 
                      onClick={() => { setSelectedCategory('Marketing'); setActiveTab('templates'); setActiveNavMenu(null); }}
                      className="text-xs font-bold text-emerald-700 hover:underline pt-2 block"
                    >
                      Browse Marketing Kits ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= 2. MAIN BODY (SIDEBAR + DASHBOARD) ================= */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Dashboard Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 p-3 flex flex-col justify-between shrink-0 hidden md:flex">
          
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'home' 
                  ? 'bg-purple-50 text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass size={17} className={activeTab === 'home' ? 'text-purple-600' : 'text-slate-400'} />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('magic')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'magic'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs'
                  : 'text-purple-900 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border border-purple-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles size={17} className="text-purple-600 fill-purple-600" />
                <span>Magic Studio</span>
              </div>
              <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-md font-bold">AI</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'templates' 
                  ? 'bg-purple-50 text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutTemplate size={17} className={activeTab === 'templates' ? 'text-purple-600' : 'text-slate-400'} />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setActiveTab('creators')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'creators' 
                  ? 'bg-purple-50 text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users size={17} className={activeTab === 'creators' ? 'text-purple-600' : 'text-slate-400'} />
              <span>Creators</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'projects' 
                  ? 'bg-purple-50 text-purple-700 shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FolderOpen size={17} className={activeTab === 'projects' ? 'text-purple-600' : 'text-slate-400'} />
                <span>Projects</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full font-mono">
                {savedProjects?.length || 0}
              </span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Canvas Viewport (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#f9fafb] pb-24 md:pb-8">
          
          {/* ================= 1. HOME TAB ================= */}
          {activeTab === 'home' && (
            <>
              {/* ================= HERO BANNER: WHAT WILL YOU DESIGN TODAY? ================= */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 p-6 md:p-10 text-white shadow-xl">
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-pink-500/20 blur-xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold border border-white/20">
                <Sparkles size={13} className="text-amber-300 fill-amber-300" />
                <span>Creativa • Design Without Limits • Open Creative Platform</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                What will you design today?
              </h1>

              {/* Giant Hero Search Bar */}
              <div className="relative max-w-2xl pt-1">
                <Search size={18} className="absolute left-4 top-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search thousands of official templates, verified creators, or describe for AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 text-xs md:text-sm font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 placeholder-slate-400 transition-all"
                />
              </div>

              {/* Canva Authentic Circular Workflow Category Tabs */}
              <div className="pt-2 pb-1 overflow-x-auto scrollbar-none touch-pan-x">
                <div className="flex items-center space-x-4 md:space-x-6 min-w-max pb-1">
                  {HERO_WORKFLOWS.map((wf) => {
                    const isActive = heroWorkflow === wf.id;
                    return (
                      <button
                        key={wf.id}
                        type="button"
                        onClick={() => {
                          setHeroWorkflow(wf.id);
                          if (wf.category) setSelectedCategory(wf.category);
                        }}
                        className={`flex flex-col items-center group cursor-pointer focus:outline-none transition-colors ${
                          isActive ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-150 ${
                            isActive 
                              ? 'bg-white text-purple-700 shadow-xl ring-4 ring-white/30 scale-105' 
                              : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-md border border-white/20'
                          }`}
                        >
                          <wf.icon size={22} />
                        </div>
                        <span className={`text-[11px] md:text-xs font-semibold mt-2 whitespace-nowrap transition-colors ${
                          isActive ? 'text-white font-bold' : 'text-white/80'
                        }`}>
                          {wf.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Format Cards Carousel for Active Workflow */}
              <div className="relative pt-1 pb-1 group/pills">
                {/* Scroll Left Button */}
                <button
                  type="button"
                  onClick={() => scrollQuickTypes('left')}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white items-center justify-center z-10 opacity-0 group-hover/pills:opacity-100 transition-all shadow-md"
                  title="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>

                <div 
                  ref={quickTypesScrollRef}
                  className="flex items-center space-x-2.5 overflow-x-auto scrollbar-none py-1 scroll-smooth touch-pan-x"
                >
                  {(WORKFLOW_FORMATS[heroWorkflow] || WORKFLOW_FORMATS.for_you).map((fmt) => (
                    <button
                      key={fmt.label}
                      type="button"
                      onClick={() => {
                        onLoadTemplate({
                          id: `blank-${fmt.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                          title: `Untitled ${fmt.label}`,
                          width: fmt.width,
                          height: fmt.height,
                          backgroundColor: '#ffffff',
                          objects: []
                        });
                        onClose();
                      }}
                      className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md text-white text-xs font-semibold shrink-0 transition-colors duration-150 border border-white/20 shadow-xs cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <fmt.icon size={13} />
                      </div>
                      <div className="text-left">
                        <div className="leading-tight truncate max-w-[130px] sm:max-w-[160px]">{fmt.label}</div>
                        <div className="text-[10px] text-white/70 font-normal">{fmt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Scroll Right Button */}
                <button
                  type="button"
                  onClick={() => scrollQuickTypes('right')}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white items-center justify-center z-10 opacity-0 group-hover/pills:opacity-100 transition-all shadow-md"
                  title="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          </div>

          {/* ================= RECENT DESIGNS CAROUSEL ================= */}
          {savedProjects && savedProjects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <FolderOpen size={16} className="text-purple-600" />
                  <span>Recent Designs ({savedProjects.length})</span>
                </h2>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  View all projects ➔
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {/* Create Blank Card */}
                <div
                  onClick={() => onNewCustomDesign?.()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group h-36"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform mb-2">
                    <Plus size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Create blank</span>
                  <span className="text-[10px] text-slate-400">Custom size</span>
                </div>

                {savedProjects.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => onLoadProject?.(proj)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-purple-500 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-36"
                  >
                    <div className="h-24 bg-slate-100 flex items-center justify-center p-2 text-center text-slate-500 text-xs font-bold group-hover:bg-purple-50 transition-colors">
                      <span className="line-clamp-2">{proj.title}</span>
                    </div>
                    <div className="p-2 bg-white border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-purple-600">
                        {proj.title}
                      </p>
                      <span className="text-[9px] text-slate-400">{proj.width}×{proj.height} px</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= OFFICIAL CANVA TEMPLATES SECTION ================= */}
          <div className="space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span className="flex items-center space-x-1.5">
                    <LayoutTemplate size={18} className="text-purple-600 shrink-0" />
                    <span>Creativa Official Templates</span>
                  </span>
                  <span className="text-xs font-normal text-slate-500">
                    ({filteredTemplates.length} designs)
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Aggregated live from global creator network • Open Design Community</p>
              </div>

              <div className="flex items-center space-x-3 max-w-full overflow-hidden">
                <button
                  onClick={() => setActiveTab('templates')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap hidden sm:inline"
                >
                  View all templates ➔
                </button>
                {/* Category Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full touch-pan-x">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                </div>
              </div>
            </div>

            {/* If searching, and matching creators exist: Featured Creator Search Cards */}
            {searchQuery && filteredCreators.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-pink-50/80 rounded-3xl border border-purple-200 shadow-xs space-y-3 animate-in fade-in duration-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-purple-600" />
                    <span className="font-extrabold text-xs text-purple-950 uppercase tracking-wider">
                      Matching Verified Creators ({filteredCreators.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-600 font-medium hidden sm:inline">Click to view full portfolio & published templates</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCreators.slice(0, 3).map(creator => (
                    <div
                      key={creator.id}
                      onClick={() => onOpenCreatorProfile?.(creator)}
                      className="bg-white rounded-2xl border border-purple-100 hover:border-purple-400 p-3 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <img 
                          src={creator.avatar} 
                          alt={creator.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                          className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shrink-0" 
                        />
                        <div className="truncate text-left">
                          <div className="flex items-center space-x-1">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                              {creator.name}
                            </span>
                            {creator.verified && <Check size={11} className="text-white bg-purple-600 rounded-full p-0.5" />}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{creator.specialty || creator.handle}</p>
                          <span className="text-[10px] font-semibold text-purple-600 font-mono">{creator.followers}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 group-hover:bg-purple-600 group-hover:text-white px-2.5 py-1 rounded-xl transition-colors shrink-0 shadow-xs">
                        Profile ➔
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template);
                    onClose();
                  }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-purple-500 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* Template Visual Thumbnail */}
                  {template.previewUrl ? (
                    <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img 
                        src={template.previewUrl} 
                        alt={template.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold">
                        {template.category}
                      </div>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white font-bold text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-1 rounded-lg shadow-sm">
                        Edit ➔
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="h-36 sm:h-44 w-full relative p-3 sm:p-4 flex flex-col justify-between overflow-hidden"
                      style={{ background: template.previewGradient || template.backgroundColor || '#7D2AE8' }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white">
                          {template.category}
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-sm font-extrabold text-white drop-shadow-md line-clamp-2">
                          {template.title}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-white/80 font-mono">
                        <span>{template.width}×{template.height}px</span>
                        <span className="group-hover:translate-x-1 transition-transform font-bold text-white flex items-center">
                          Use ➔
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Label */}
                  <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-xs text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                        {template.title}
                      </p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {template.category} • {template.width}×{template.height}
                      </p>
                    </div>
                    {template.creator && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCreatorProfile?.(template.creator);
                        }}
                        className="flex items-center space-x-1.5 shrink-0 hover:text-purple-600 cursor-pointer p-1 rounded-lg hover:bg-purple-50 transition-colors"
                        title={`View ${template.creator.name}'s profile`}
                      >
                        {template.creator.avatar && (
                          <img 
                            src={template.creator.avatar} 
                            alt={template.creator.name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                          />
                        )}
                        <span className="text-[10px] text-slate-500 hover:text-purple-600 font-semibold truncate max-w-[80px] hidden sm:inline">
                          {template.creator.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ================= FEATURED CANVA CREATORS COMMUNITY ================= */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <Users size={18} className="text-purple-600" />
                  <span>Creativa Verified Creators Hub</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({filteredCreators.length} verified creators)
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Live profiles & portfolio designs aggregated directly from the global creator network</p>
              </div>
              <button
                onClick={() => setActiveTab('creators')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                View all creators ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCreators.slice(0, showAllCreators ? filteredCreators.length : 12).map((creator) => {
                const isFollowed = followedCreators.includes(creator.id);
                return (
                  <div 
                    key={creator.id}
                    onClick={() => onOpenCreatorProfile?.(creator)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-4 space-y-3 shadow-xs hover:shadow-md transition-all cursor-pointer group/card"
                    title="Click anywhere to view full profile & portfolio"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 group/author"
                      >
                        <img 
                          src={creator.avatar} 
                          alt={creator.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                          className="w-11 h-11 rounded-full object-cover border-2 border-purple-200 shadow-xs group-hover/card:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-xs text-slate-900 group-hover/card:text-purple-600 transition-colors">
                              {creator.name}
                            </h4>
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]" title="Verified Creator">
                              ✓
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{creator.handle} • {creator.followers}</p>
                          <span className="text-[9px] font-bold text-purple-600 group-hover/card:underline flex items-center pt-0.5">
                            View Profile ➔
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFollowedCreators(prev => 
                            prev.includes(creator.id) 
                              ? prev.filter(id => id !== creator.id) 
                              : [...prev, creator.id]
                          );
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1 ${
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

                    {/* Bio */}
                    <p className="text-xs text-slate-600 line-clamp-2 italic">
                      "{creator.bio}"
                    </p>

                    {/* Designs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      {creator.designs.slice(0, 2).map((design) => (
                        <div
                          key={design.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLoadTemplate(design);
                            onClose();
                          }}
                          className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 bg-white shadow-xs transition-all flex flex-col justify-between"
                        >
                          {design.previewUrl ? (
                            <div className="h-20 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                              <img 
                                src={design.previewUrl} 
                                alt={design.title} 
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              <span className="absolute bottom-1 right-1 text-[8px] font-bold text-white bg-purple-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Use ➔
                              </span>
                            </div>
                          ) : (
                            <div 
                              className="h-20 w-full p-2 flex items-end justify-between relative overflow-hidden"
                              style={{ background: design.previewGradient || design.backgroundColor || '#7D2AE8' }}
                            >
                              <span className="text-[8px] font-extrabold px-1 py-0.5 rounded bg-black/40 text-white">
                                {design.category}
                              </span>
                              <span className="text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
                );
              })}
            </div>

            {filteredCreators.length > 12 && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAllCreators(prev => !prev)}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-purple-700 font-bold text-xs border border-purple-200 hover:border-purple-400 transition-all shadow-xs"
                >
                  {showAllCreators ? 'Show Less Creators' : `View All ${filteredCreators.length} Verified Creators ➔`}
                </button>
              </div>
            )}
          </div>

          {/* ================= MAGIC STUDIO AI BANNER ================= */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-purple-500/30">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-400/30">
                <Sparkles size={12} className="fill-purple-400" />
                <span>Creativa Magic Studio™ Suite</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black">
                Next-generation AI design tools, unlocked & unlimited.
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Experience Magic Design, Magic Write, Magic Edit inpainting, Magic Grab layer separation, background removal, and 3D typography without subscriptions.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={onOpenMagicDesign}
                className="canva-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center space-x-2"
              >
                <Sparkles size={14} className="fill-white" />
                <span>Explore Magic Studio Suite ➔</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
              >
                Go to Editor
              </button>
            </div>
          </div>
          </>
        )}

        {/* ================= 2. TEMPLATES TAB ================= */}
        {activeTab === 'templates' && (
          <TemplatesHubView
            filteredTemplates={filteredTemplates}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onLoadTemplate={(tpl) => {
              onLoadTemplate(tpl);
              onClose();
            }}
            onOpenCreatorProfile={onOpenCreatorProfile}
          />
        )}

        {/* ================= 3. CREATORS TAB ================= */}
        {activeTab === 'creators' && (
          <CreatorsDirectoryView
            filteredCreators={filteredCreators}
            allCreatorsCount={allCreators.length}
            followedCreators={followedCreators}
            onToggleFollow={(id) => {
              setFollowedCreators(prev => 
                prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
              );
            }}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            creatorSpecialtyFilter={creatorSpecialtyFilter}
            onSelectSpecialty={(spec) => setCreatorSpecialtyFilter(spec)}
            onLoadTemplate={(tpl) => {
              onLoadTemplate(tpl);
              onClose();
            }}
            onOpenCreatorProfile={onOpenCreatorProfile}
          />
        )}

        {/* ================= 4. PROJECTS TAB ================= */}
        {activeTab === 'projects' && (
          <ProjectsWorkspaceView
            savedProjects={savedProjects}
            projectSearchQuery={projectSearchQuery}
            onSearchChange={(q) => setProjectSearchQuery(q)}
            onLoadProject={(proj) => {
              onLoadProject?.(proj);
              onClose();
            }}
            onDeleteProject={onDeleteProject}
            onNewCustomDesign={() => {
              onClose();
              onNewCustomDesign?.();
            }}
          />
        )}

        {/* ================= 5. MAGIC STUDIO TAB ================= */}
        {activeTab === 'magic' && (
          <MagicStudioView
            onApplyMagicDesign={(layout) => {
              onApplyMagicDesign?.(layout);
              onClose();
            }}
            onApplyAiImage={(imgUrl) => {
              onApplyAiImage?.(imgUrl);
              onClose();
            }}
            onOpenMagicWrite={onOpenMagicWrite}
            onCloseHome={onClose}
            canvasDimensions={canvasDimensions}
          />
        )}

        </main>
      </div>

      {/* Official Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 z-40 flex items-center justify-around shadow-xl">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'home' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'}`}
        >
          <LayoutTemplate size={18} />
          <span className="mt-0.5">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'templates' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'}`}
        >
          <Compass size={18} />
          <span className="mt-0.5">Templates</span>
        </button>
        <button 
          onClick={() => setActiveTab('magic')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'magic' ? 'text-purple-700 bg-purple-50' : 'text-purple-600'}`}
        >
          <div className="w-8 h-8 rounded-full canva-gradient text-white flex items-center justify-center shadow-md -mt-3 border-2 border-white">
            <Wand2 size={16} />
          </div>
          <span className="mt-0.5">Magic AI</span>
        </button>
        <button 
          onClick={() => setActiveTab('creators')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'creators' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'}`}
        >
          <Users size={18} />
          <span className="mt-0.5">Creators</span>
        </button>
        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all ${activeTab === 'projects' ? 'text-purple-700 bg-purple-50' : 'text-slate-500'}`}
        >
          <FolderOpen size={18} />
          <span className="mt-0.5">Projects</span>
        </button>
      </nav>

    </div>
  );
}
