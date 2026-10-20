import React, { useState, useRef, useEffect } from 'react';
import { 
  Undo2, Redo2, Cloud, CloudCheck, Download, 
  ChevronDown, Save, FilePlus, Maximize2, 
  FolderOpen, Upload, Trash2, Edit3, Sparkles, Play,
  Share2, Copy, Check, Users, Eye, Ruler,
  FileCheck, Shield, ExternalLink, History, Compass, User
} from 'lucide-react';
import CreativaLogo from './CreativaLogo';

export default function Header({
  projectTitle,
  setProjectTitle,
  saveStatus, // 'saved', 'saving', 'unsaved'
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onNew,
  onMakeCopy,
  onOpenResize,
  onOpenExport,
  onExportJSON,
  onImportJSON,
  onClearCanvas,
  canvasDimensions,
  onOpenPresent,
  showRulers,
  setShowRulers,
  showMargins,
  setShowMargins,
  showBleed,
  setShowBleed,
  onOpenVersionHistory,
  onOpenHome
}) {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fileMenuRef = useRef(null);
  const shareMenuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) {
        setIsFileMenuOpen(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setIsShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
      setIsFileMenuOpen(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="h-14 w-full max-w-full overflow-hidden bg-white border-b border-slate-200 text-slate-800 flex items-center justify-between px-2 sm:px-3 md:px-4 z-40 select-none shadow-xs">
      {/* ================= LEFT SECTION: CANVA LOGO & FILE MENU ================= */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 shrink-0">
        {/* Official Creativa Brand Logo */}
        <div 
          onClick={onOpenHome || onNew} 
          className="flex items-center cursor-pointer group pr-1 sm:pr-2"
          title="Creativa Home & Discover Templates"
        >
          <CreativaLogo className="h-8 sm:h-9 w-auto" showTagline={false} />
        </div>

        {/* Home / Templates Hub Button (Desktop/Tablet) */}
        <button
          onClick={onOpenHome}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shrink-0"
          title="Explore Creativa Templates Hub"
        >
          <Compass size={14} className="text-purple-600 shrink-0" />
          <span>Templates</span>
        </button>

        {/* File Menu Dropdown */}
        <div className="relative" ref={fileMenuRef}>
          <button 
            onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
            className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            <span>File</span>
            <ChevronDown size={13} className={`transition-transform duration-150 ${isFileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFileMenuOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 z-50 text-slate-700 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <p className="font-bold text-slate-900 truncate">{projectTitle || 'Untitled design'}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{canvasDimensions.width} × {canvasDimensions.height} px</p>
              </div>

              <div className="py-1">
                <button 
                  onClick={() => { onOpenHome ? onOpenHome() : onNew(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-purple-50 hover:text-purple-700 text-left transition-colors"
                >
                  <Compass size={15} className="text-purple-600" />
                  <span>Explore templates</span>
                </button>

                <button 
                  onClick={() => { onOpenResize?.(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <Sparkles size={15} className="text-purple-600" />
                  <span>Magic Switch & Resize</span>
                </button>

                <button 
                  onClick={() => { onNew(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <FilePlus size={15} className="text-cyan-600" />
                  <span>Create new design</span>
                </button>

                <button 
                  onClick={() => { onMakeCopy?.(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <Copy size={15} className="text-purple-600" />
                  <span>Make a copy</span>
                </button>
                
                <button 
                  onClick={() => { onSave(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Save size={15} className="text-emerald-600" />
                    <span>Save</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+S</span>
                </button>

                <button 
                  onClick={() => { onOpenVersionHistory?.(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <History size={15} className="text-amber-600" />
                    <span>Version history</span>
                  </div>
                </button>
              </div>

              {/* View Settings Submenu */}
              <div className="border-t border-slate-100 py-1">
                <p className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  View Settings
                </p>
                
                <label className="flex items-center justify-between px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center space-x-2">
                    <Ruler size={14} className="text-slate-500" />
                    <span>Show rulers & guides</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showRulers}
                    onChange={(e) => setShowRulers(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center space-x-2">
                    <Eye size={14} className="text-slate-500" />
                    <span>Show margins</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showMargins}
                    onChange={(e) => setShowMargins(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <span className="flex items-center space-x-2">
                    <FileCheck size={14} className="text-slate-500" />
                    <span>Show print bleed</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showBleed}
                    onChange={(e) => setShowBleed(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                </label>
              </div>

              {/* Project Import/Export */}
              <div className="border-t border-slate-100 py-1">
                <button 
                  onClick={() => { onExportJSON(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <Download size={15} className="text-slate-500" />
                  <span>Download .creativa file</span>
                </button>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors"
                >
                  <Upload size={15} className="text-slate-500" />
                  <span>Import .creativa file</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileImport} 
                  accept=".json,.creativa.json,.canva.json" 
                  className="hidden" 
                />
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button 
                  onClick={() => { onClearCanvas(); setIsFileMenuOpen(false); }}
                  className="w-full flex items-center space-x-2.5 px-3.5 py-2 hover:bg-red-50 text-red-600 text-left transition-colors"
                >
                  <Trash2 size={15} />
                  <span>Clear artboard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Creativa Magic Switch & Resize Button (Tablet/Desktop, mobile in File menu) */}
        <button
          onClick={onOpenResize}
          className="hidden sm:flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-300 transition-all shadow-xs group shrink-0"
          title="Magic Switch & Resize"
        >
          <Maximize2 size={13} className="text-purple-600 group-hover:scale-110 transition-transform shrink-0" />
          <span className="hidden xl:inline">Magic Switch</span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono ml-0.5">
            {canvasDimensions.width}×{canvasDimensions.height}
          </span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-l border-slate-200 pl-1 sm:pl-1.5">
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${canUndo ? 'text-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${canRedo ? 'text-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Autosave Status */}
        <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-500 pl-1">
          {saveStatus === 'saving' ? (
            <>
              <Cloud size={14} className="text-amber-500 animate-pulse" />
              <span className="text-[11px]">Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CloudCheck size={14} className="text-emerald-600" />
              <span className="text-[11px] text-slate-600 font-medium">All changes saved</span>
            </>
          ) : (
            <>
              <Cloud size={14} className="text-slate-400" />
              <span className="text-[11px] text-slate-400">Unsaved changes</span>
            </>
          )}
        </div>
      </div>

      {/* ================= CENTER SECTION: PROJECT TITLE ================= */}
      <div className="hidden sm:flex flex-1 min-w-0 max-w-xs md:max-w-md mx-2 justify-center">
        {isEditingTitle ? (
          <input 
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            autoFocus
            className="bg-white border border-purple-500 rounded-lg px-3 py-1 text-xs text-center font-semibold text-slate-800 focus:outline-none w-full shadow-inner"
          />
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg hover:bg-slate-100 cursor-pointer text-xs font-semibold text-slate-800 transition-colors truncate max-w-full group"
            title="Click to rename design"
          >
            <span className="truncate">{projectTitle || 'Untitled design'}</span>
            <Edit3 size={12} className="text-slate-400 group-hover:text-purple-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* ================= RIGHT SECTION: PRESENT, SHARE, DOWNLOAD ================= */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 shrink-0">
        {/* Present Button */}
        <button
          onClick={onOpenPresent}
          className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-300 shadow-xs"
          title="Presenter view (fullscreen slideshow)"
        >
          <Play size={13} className="text-emerald-600 fill-emerald-600" />
          <span>Present</span>
        </button>

        {/* Quick 1-Tap Download Button */}
        <button
          onClick={onOpenExport}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors border border-slate-200 shadow-xs flex items-center space-x-1"
          title="Download / Export Design (PNG, JPG, PDF, SVG)"
        >
          <Download size={14} className="text-purple-600 shrink-0" />
          <span className="hidden md:inline text-xs font-semibold">Download</span>
        </button>

        {/* Authentic Creativa Share Dropdown */}
        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
            className="canva-btn-primary flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-purple-500/25 transition-all text-white shrink-0"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {isShareMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-50 text-slate-700 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Collaboration Link Box */}
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs">Collaboration link</span>
                  <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                    Creativa
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-slate-50 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 truncate border border-slate-200 font-mono">
                    {window.location.origin}
                  </div>
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shrink-0 shadow-xs"
                  >
                    {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="py-3 space-y-1">
                {/* Download / Export Button */}
                <button
                  onClick={() => {
                    setIsShareMenuOpen(false);
                    onOpenExport();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-purple-50 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Download size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-purple-700">Download</p>
                      <p className="text-[10px] text-slate-400">PNG, JPG, PDF, SVG</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 text-slate-400" />
                </button>

                {/* Present Button */}
                <button
                  onClick={() => {
                    setIsShareMenuOpen(false);
                    onOpenPresent();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-emerald-50 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Play size={16} className="fill-emerald-700" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-700">Present</p>
                      <p className="text-[10px] text-slate-400">Fullscreen presentation view</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 text-slate-400" />
                </button>

                {/* Save to Browser */}
                <button
                  onClick={() => {
                    setIsShareMenuOpen(false);
                    onSave();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-cyan-50 text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Save size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-cyan-700">Save project</p>
                      <p className="text-[10px] text-slate-400">Save to browser memory</p>
                    </div>
                  </div>
                  <ChevronDown size={14} className="-rotate-90 text-slate-400" />
                </button>
              </div>

              {/* Bottom footer */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Creativa Web Engine</span>
                <span className="text-purple-600 font-semibold">100% Client-Side</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
