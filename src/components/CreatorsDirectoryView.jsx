import React from 'react';
import { Users, Search, X, Check, UserPlus, UserCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function CreatorsDirectoryView({
  filteredCreators = [],
  allCreatorsCount = 0,
  followedCreators = [],
  onToggleFollow,
  searchQuery = '',
  onSearchChange,
  creatorSpecialtyFilter = 'All',
  onSelectSpecialty,
  onLoadTemplate,
  onOpenCreatorProfile
}) {
  const specialties = [
    'All', 'Presentation', 'Branding', 'Social Media', 
    'Typography', 'Video', 'Illustration', 'Marketing'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-200">
          <Users size={16} />
          <span>Creativa Verified Creators Community</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Global Designer Directory ({filteredCreators.length} Verified Creators)
            </h2>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed mt-1">
              Connect with top official designers, typography masters, and visual artists. Browse their complete published template collections with live autoupdates.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2 relative max-w-xl">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search creators by name, handle, specialty, or bio..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-white text-slate-900 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md placeholder-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => onSelectSpecialty?.(spec)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              creatorSpecialtyFilter === spec
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Creators Grid */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => {
            const isFollowed = followedCreators.includes(creator.id);
            return (
              <div 
                key={creator.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-purple-400 p-5 space-y-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => onOpenCreatorProfile?.(creator)}
                    className="flex items-center space-x-3 cursor-pointer group/author"
                    title="View Full Creator Profile & All Templates"
                  >
                    <img 
                      src={creator.avatar} 
                      alt={creator.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; 
                      }}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-xs group-hover/author:scale-105 transition-transform shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center space-x-1">
                        <h4 className="font-bold text-xs text-slate-900 group-hover/author:text-purple-600 transition-colors truncate">
                          {creator.name}
                        </h4>
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] shrink-0" title="Verified Creator">
                          ✓
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{creator.handle} • {creator.followers}</p>
                      <span className="text-[9px] font-bold text-purple-600 group-hover/author:underline flex items-center pt-0.5">
                        {creator.specialty || 'Verified Designer'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFollow?.(creator.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1 shrink-0 ${
                      isFollowed 
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <UserCheck size={12} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                  "{creator.bio}"
                </p>

                {/* Portfolio Preview Thumbnails */}
                {creator.designs && creator.designs.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {creator.designs.slice(0, 2).map((design) => (
                      <div
                        key={design.id}
                        onClick={() => onLoadTemplate(design)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-slate-200 hover:border-purple-500 bg-white shadow-xs transition-all flex flex-col justify-between"
                      >
                        {design.previewUrl ? (
                          <div className="h-20 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                            <img 
                              src={design.previewUrl} 
                              alt={design.title} 
                              referrerPolicy="no-referrer"
                              onError={(e) => { 
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; 
                              }}
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
                )}

                {/* View Full Profile Button */}
                <button
                  onClick={() => onOpenCreatorProfile?.(creator)}
                  className="w-full py-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-100"
                >
                  <span>View Full Profile & All {creator.designs?.length || 0} Templates</span>
                  <ArrowRight size={12} />
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Users size={40} className="mx-auto text-slate-300" />
          <h3 className="font-extrabold text-slate-800 text-sm">No creators found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any verified creators matching your search. Try adjusting the search query or specialty filter.
          </p>
          <button
            onClick={() => {
              onSearchChange?.('');
              onSelectSpecialty?.('All');
            }}
            className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
