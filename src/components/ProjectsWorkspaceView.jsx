import React from 'react';
import { FolderOpen, Search, Plus, Trash2, ArrowRight, X, Clock, Layers } from 'lucide-react';

export default function ProjectsWorkspaceView({
  savedProjects = [],
  projectSearchQuery = '',
  onSearchChange,
  onLoadProject,
  onDeleteProject,
  onNewCustomDesign
}) {
  const filtered = savedProjects.filter(p => {
    if (!projectSearchQuery) return true;
    return p.title?.toLowerCase().includes(projectSearchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
          <FolderOpen size={16} />
          <span>Creativa Local Workspace</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Your Saved Projects ({savedProjects.length})
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed mt-1">
              Your designs are saved in your local browser sandbox. They are never transmitted or exposed to any other user or machine. 100% private.
            </p>
          </div>
          <button
            onClick={() => onNewCustomDesign?.()}
            className="canva-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center space-x-2 shrink-0 self-start md:self-auto hover:scale-105 transition-transform"
          >
            <Plus size={16} />
            <span>New Custom Design</span>
          </button>
        </div>

        {/* Search Bar */}
        {savedProjects.length > 0 && (
          <div className="pt-2 relative max-w-md">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search saved designs by name..."
              value={projectSearchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
            {projectSearchQuery && (
              <button 
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Create Blank Card */}
        <div
          onClick={() => onNewCustomDesign?.()}
          className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50/50 p-4 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[160px] sm:min-h-[220px]"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform mb-2 sm:mb-3 shadow-xs">
            <Plus size={22} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-800">Create blank</span>
          <span className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Custom size</span>
        </div>

        {/* Saved Projects */}
        {filtered.map(proj => (
          <div
            key={proj.id}
            className="group bg-white rounded-2xl border border-slate-200 hover:border-purple-500 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between min-h-[160px] sm:min-h-[220px]"
          >
            <div 
              onClick={() => onLoadProject?.(proj)}
              className="h-24 sm:h-36 bg-slate-100 relative cursor-pointer overflow-hidden flex items-center justify-center p-2 sm:p-3 text-center group-hover:bg-purple-50/60 transition-colors"
            >
              <span className="font-bold text-xs text-slate-600 line-clamp-2 px-2">
                {proj.title}
              </span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md flex items-center space-x-1.5">
                  <span>Open in Canvas</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="truncate flex-1 pr-2">
                <p 
                  onClick={() => onLoadProject?.(proj)}
                  className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-purple-600 transition-colors"
                >
                  {proj.title}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {proj.width} × {proj.height} px
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete design "${proj.title}"?`)) {
                    onDeleteProject?.(proj.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                title="Delete project"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Empty State when zero saved projects */}
      {savedProjects.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen size={40} className="mx-auto text-slate-300" />
          <h3 className="font-extrabold text-slate-800 text-sm">No saved projects yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you create or customize designs in the editor, hit File ➔ Save to store your designs here for one-click access.
          </p>
          <button
            onClick={() => onNewCustomDesign?.()}
            className="px-5 py-2.5 rounded-xl canva-btn-primary text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            Create Your First Design
          </button>
        </div>
      )}

    </div>
  );
}
