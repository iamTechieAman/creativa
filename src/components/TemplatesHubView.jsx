import React from 'react';
import { LayoutTemplate, Search, X, Check, Eye } from 'lucide-react';

export default function TemplatesHubView({
  filteredTemplates = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onLoadTemplate,
  onOpenCreatorProfile
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-200">
          <LayoutTemplate size={16} />
          <span>Creativa Templates Library</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              All Official & Creator Templates ({filteredTemplates.length})
            </h2>
            <p className="text-xs text-purple-200 max-w-2xl leading-relaxed mt-1">
              Explore hundreds of professionally aggregated, fully editable design layouts across presentation, social media, marketing, and business. 100% unlocked and free.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pt-2 relative max-w-xl">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates by keyword, theme, or topic..."
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

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory?.(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-xs scale-102'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onLoadTemplate(template)}
              className="bg-white rounded-2xl border border-slate-200 hover:border-purple-500 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Thumbnail */}
              {template.previewUrl ? (
                <div className="h-36 sm:h-48 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img 
                    src={template.previewUrl} 
                    alt={template.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'; 
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex items-center px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold">
                    {template.category}
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white font-bold text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md">
                    Edit ➔
                  </div>
                </div>
              ) : (
                <div 
                  className="h-36 sm:h-48 w-full relative p-3 sm:p-4 flex flex-col justify-between overflow-hidden"
                  style={{ background: template.previewGradient || template.backgroundColor || '#7D2AE8' }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-white">
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

              {/* Card Bottom Meta */}
              <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                <div className="flex-1 pr-2 truncate">
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
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'; 
                        }}
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
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <LayoutTemplate size={40} className="mx-auto text-slate-300" />
          <h3 className="font-extrabold text-slate-800 text-sm">No templates found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any templates matching "{searchQuery}". Try a different keyword or browse all categories.
          </p>
          <button
            onClick={() => {
              onSearchChange?.('');
              onSelectCategory?.('All');
            }}
            className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
