import React, { useState, useEffect } from 'react';
import { 
  X, Search, Sparkles, Check, Share2, Heart, 
  ExternalLink, ArrowLeft, Users, UserPlus, UserCheck,
  LayoutTemplate, Grid, Award, MapPin, Star, ThumbsUp,
  Layers, Copy, ArrowRight
} from 'lucide-react';
import { 
  getIsolatedFollowedCreators, 
  toggleIsolatedFollowedCreator 
} from '../utils/userSession';
import { getAllTemplates, getExpandedCreatorPortfolio } from '../utils/canvaTemplateEngine';
import CreativaLogo from './CreativaLogo';

export default function CreatorProfileModal({
  isOpen,
  onClose,
  creator,
  onLoadTemplate,
  allCreators = [],
  onSelectCreator
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'title'
  const [followedIds, setFollowedIds] = useState(() => getIsolatedFollowedCreators());
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [favoriteDesignIds, setFavoriteDesignIds] = useState([]);
  const [portfolioLimit, setPortfolioLimit] = useState(36);
  const [, setSyncRev] = useState(0);

  useEffect(() => {
    const handleSync = () => setSyncRev(r => r + 1);
    window.addEventListener('canva_autoscrape_sync', handleSync);
    window.addEventListener('creativa_autoscrape_sync', handleSync);
    return () => {
      window.removeEventListener('canva_autoscrape_sync', handleSync);
      window.removeEventListener('creativa_autoscrape_sync', handleSync);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset category and search when creator changes
  useEffect(() => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPortfolioLimit(36);
  }, [creator?.id]);

  if (!isOpen || !creator) return null;

  const isFollowed = followedIds.includes(creator.id);

  const handleToggleFollow = () => {
    const updated = toggleIsolatedFollowedCreator(creator.id);
    setFollowedIds(updated);
  };

  const handleShareProfile = () => {
    const shareUrl = `${window.location.origin}/#creator/${creator.handle.replace('@', '')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2500);
      });
    }
  };

  const handleToggleFavorite = (designId, e) => {
    e.stopPropagation();
    setFavoriteDesignIds(prev => 
      prev.includes(designId) ? prev.filter(id => id !== designId) : [...prev, designId]
    );
  };

  // Deep, dynamic portfolio: Load complete authentic gallery for this creator
  const designs = getExpandedCreatorPortfolio(creator, portfolioLimit);
  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category || 'Marketing')))];

  const filteredDesigns = designs.filter(d => {
    const matchesCategory = selectedCategory === 'All' || (d.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || (d.title || '').toLowerCase().includes(q) || (d.category || '').toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0; // Default order
  });

  // Recommended other creators
  const recommendedCreators = allCreators.filter(c => c.id !== creator.id).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col overflow-hidden animate-in fade-in duration-200 select-none text-slate-800">
      
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 z-30 shadow-xs">
        
        {/* Left: Back & Branding */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
            <CreativaLogo className="h-7 w-auto" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Creator Profile
            </span>
          </div>
        </div>

        {/* Center: In-Profile Search */}
        <div className="relative w-64 md:w-96 hidden sm:block">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${creator.name}'s designs...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs transition-all"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareProfile}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-xs"
            title="Copy Profile Link"
          >
            {copyFeedback ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copyFeedback ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* ================= SCROLLABLE PROFILE VIEWPORT ================= */}
      <main className="flex-1 overflow-y-auto">
        
        {/* Profile Hero Header Banner */}
        <div className="relative">
          {/* Panoramic Cover Art */}
          <div className="h-56 md:h-72 w-full relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600">
            {creator.coverImage && (
              <img 
                src={creator.coverImage} 
                alt={`${creator.name} Cover`}
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80'; }}
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30 flex items-center space-x-1.5">
              <Award size={13} className="text-amber-300" />
              <span>Verified Creativa Studio Partner</span>
            </div>
          </div>

          {/* Profile Identity Card */}
          <div className="max-w-6xl mx-auto px-4 md:px-8 relative -mt-20 z-10">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Avatar and Info */}
                <div className="flex items-start md:items-center space-x-5">
                  <div className="relative shrink-0">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-xl bg-slate-100"
                    />
                    {creator.verified && (
                      <span 
                        className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-md"
                        title="Verified Creator"
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">
                        {creator.name}
                      </h1>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold text-[11px]">
                        {creator.specialty || 'Verified Designer'}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm font-semibold text-slate-500">
                      {creator.handle} • {creator.location || 'Global Creator'}
                    </p>

                    <div className="flex items-center space-x-4 text-xs font-bold text-slate-700 pt-1">
                      <span className="flex items-center space-x-1">
                        <Users size={14} className="text-purple-600" />
                        <span>{creator.followers || '45K'} followers</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Layers size={14} className="text-cyan-600" />
                        <span>{creator.templatesCount || designs.length} templates</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <ThumbsUp size={14} className="text-pink-600" />
                        <span>{creator.totalLikes || '82K likes'}</span>
                      </span>
                      {creator.rating && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 flex items-center space-x-0.5">
                            <Star size={13} className="fill-amber-500" />
                            <span>{creator.rating}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Follow & Action Buttons */}
                <div className="flex items-center space-x-3 shrink-0">
                  <button
                    onClick={handleToggleFollow}
                    className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center space-x-2 ${
                      isFollowed
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        : 'canva-btn-primary text-white hover:scale-105'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <UserCheck size={15} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>Follow Creator</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareProfile}
                    className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
                    title="Share Creator Profile"
                  >
                    <Share2 size={16} />
                  </button>
                </div>

              </div>

              {/* Bio Box */}
              {creator.bio && (
                <div className="pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  <p className="italic">
                    "{creator.bio}"
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ================= DESIGNS SHOWCASE SECTION ================= */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                <LayoutTemplate size={20} className="text-purple-600" />
                <span>Templates by {creator.name}</span>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {filteredDesigns.length} of {creator.templatesCount || designs.length} loaded
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Unlocked studio templates • Zero text clipping • Single-click instant canvas import
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
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

          {/* Designs Gallery Grid */}
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredDesigns.map((design) => {
                const isFavorite = favoriteDesignIds.includes(design.id);
                return (
                  <div
                    key={design.id}
                    onClick={() => {
                      onLoadTemplate(design);
                      onClose();
                    }}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-purple-500 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Visual Card */}
                    <div className="relative overflow-hidden bg-slate-100 aspect-square flex items-center justify-center">
                      {design.previewUrl ? (
                        <img 
                          src={design.previewUrl} 
                          alt={design.title}
                          referrerPolicy="no-referrer"
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div 
                          className="w-full h-full p-4 flex flex-col justify-between text-white"
                          style={{ background: design.previewGradient || design.backgroundColor || '#7D2AE8' }}
                        >
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 w-fit">
                            {design.category}
                          </span>
                          <span className="font-extrabold text-sm text-center drop-shadow">
                            {design.title}
                          </span>
                          <span className="text-[9px] font-mono text-white/80">
                            {design.width}×{design.height}px
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          {design.category || 'Design'}
                        </span>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(design.id, e)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-colors"
                        title="Save to favorites"
                      >
                        <Heart 
                          size={13} 
                          className={isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'} 
                        />
                      </button>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <span className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span>Customize in Creativa</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>

                    {/* Card Title & Dimension Info */}
                    <div className="p-3.5 bg-white border-t border-slate-100">
                      <p className="font-bold text-xs text-slate-800 truncate group-hover:text-purple-600 transition-colors">
                        {design.title}
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{design.width}×{design.height} px</span>
                        <span className="font-bold text-purple-600 group-hover:underline">Open in Studio ➔</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <LayoutTemplate size={32} className="mx-auto text-slate-300" />
              <p className="font-bold text-sm text-slate-700">No templates found for this filter</p>
              <p className="text-xs text-slate-400">Try choosing a different category or clearing the search query.</p>
            </div>
          )}

          {/* Sync & Load More Templates Action */}
          {portfolioLimit < (creator.templatesCount || 60) && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setPortfolioLimit(prev => Math.min(prev + 24, creator.templatesCount || 100))}
                className="canva-btn-primary px-8 py-3 rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-white"
              >
                <Sparkles size={15} />
                <span>Sync Next 24 Templates ({designs.length} of {creator.templatesCount || designs.length} Loaded)</span>
              </button>
            </div>
          )}

          {/* ================= RECOMMENDED CREATORS CAROUSEL ================= */}
          {recommendedCreators.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Users size={17} className="text-purple-600" />
                <span>More Verified Creators to Explore</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                {recommendedCreators.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onSelectCreator?.(rec)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-3.5 text-center space-y-2 cursor-pointer shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="relative mx-auto w-14 h-14">
                      <img 
                        src={rec.avatar} 
                        alt={rec.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; }}
                        className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      {rec.verified && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] border border-white">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-purple-600">
                        {rec.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{rec.handle}</p>
                    </div>
                    <span className="inline-block text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {rec.followers}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
