import React, { useEffect, useRef, useState } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize, RotateCcw, Plus, Copy, 
  Trash2, Lock, Unlock, FileText, Clock, LayoutGrid, 
  ChevronLeft, ChevronRight, Expand 
} from 'lucide-react';

export default function CanvasStage({
  canvasRef,
  containerRef,
  dimensions,
  zoom,
  setZoom,
  backgroundColor,
  pages = [],
  activePageIndex = 0,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onLockPage,
  isPageLocked = false,
  showRulers = true,
  showMargins = false,
  showBleed = false,
  onOpenNotes,
  onOpenGridView,
  onOpenPresent,
  pageDuration = '5.0',
  onUpdatePageTitle
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isEditingPageTitle, setIsEditingPageTitle] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const touchStartDistRef = useRef(null);
  const initialZoomRef = useRef(zoom);

  const activePage = pages[activePageIndex] || { title: `Page ${activePageIndex + 1}` };

  const handleZoomIn = () => setZoom(prev => Math.min(Number((prev + 0.1).toFixed(2)), 3.0));
  const handleZoomOut = () => setZoom(prev => Math.max(Number((prev - 0.1).toFixed(2)), 0.2));
  const handleZoomReset = () => setZoom(1);

  // Wheel Zoom & Trackpad Pinch Zoom (Ctrl/Cmd + Wheel)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        setZoom(prev => Math.min(3.0, Math.max(0.15, Number((prev + delta).toFixed(2)))));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [containerRef, setZoom]);

  // Spacebar Hand Tool (Pan Mode)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleContainerMouseDown = (e) => {
    if ((isSpacePressed && e.button === 0) || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      if (containerRef.current) {
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          scrollLeft: containerRef.current.scrollLeft,
          scrollTop: containerRef.current.scrollTop
        };
      }
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      containerRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      containerRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, containerRef]);

  // Mobile multi-touch pinch zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistRef.current = Math.hypot(dx, dy);
        initialZoomRef.current = zoom;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchStartDistRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scaleFactor = dist / touchStartDistRef.current;
        const nextZoom = Number(Math.min(3.0, Math.max(0.15, initialZoomRef.current * scaleFactor)).toFixed(2));
        setZoom(nextZoom);
      }
    };

    const handleTouchEnd = () => {
      touchStartDistRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerRef, zoom, setZoom]);

  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const paddingX = clientWidth < 640 ? 16 : clientWidth < 1024 ? 40 : 80;
    const paddingY = clientWidth < 640 ? 20 : clientWidth < 1024 ? 40 : 80;
    const availableW = Math.max(60, clientWidth - paddingX);
    const availableH = Math.max(60, clientHeight - paddingY);
    const scaleW = availableW / (dimensions.width || 800);
    const scaleH = availableH / (dimensions.height || 800);
    const fitScale = Math.min(scaleW, scaleH, 1.2);
    setZoom(Number(Math.max(0.12, fitScale).toFixed(2)));
  };

  useEffect(() => {
    handleFitToScreen();
    const handleResize = () => {
      handleFitToScreen();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions.width, dimensions.height]);

  const handleMouseMove = (e) => {
    if (!showRulers) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left) / zoom);
    const y = Math.round((e.clientY - rect.top) / zoom);
    setMousePos({ x, y });
  };

  // Generate ruler tick markings (Light Theme)
  const renderHorizontalRuler = () => {
    const ticks = [];
    const step = 100;
    for (let x = 0; x <= dimensions.width; x += step) {
      ticks.push(
        <div 
          key={x} 
          className="absolute top-0 bottom-0 border-l border-slate-300 flex flex-col justify-between pl-1"
          style={{ left: `${x * zoom}px` }}
        >
          <span className="text-[9px] text-slate-500 font-mono select-none pointer-events-none">
            {x}
          </span>
          <div className="h-1.5 w-px bg-slate-400"></div>
        </div>
      );
    }
    return ticks;
  };

  const renderVerticalRuler = () => {
    const ticks = [];
    const step = 100;
    for (let y = 0; y <= dimensions.height; y += step) {
      ticks.push(
        <div 
          key={y} 
          className="absolute left-0 right-0 border-t border-slate-300 flex items-center justify-between pt-0.5"
          style={{ top: `${y * zoom}px` }}
        >
          <span className="text-[9px] text-slate-500 font-mono select-none pointer-events-none pl-0.5">
            {y}
          </span>
          <div className="w-1.5 h-px bg-slate-400"></div>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none">
      {/* Canvas Viewport Scroll Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-[#eaedf2] overflow-auto relative canvas-viewport"
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          cursor: isPanning ? 'grabbing' : isSpacePressed ? 'grab' : 'default'
        }}
        onMouseDown={handleContainerMouseDown}
      >
        {/* Inner centering wrapper: uses width: max-content; min-width: 100%; margin: 0 auto to center without flex auto-margin click jitter */}
        <div 
          className="flex flex-col items-center justify-start p-3 sm:p-6 md:p-12 shrink-0"
          style={{ width: 'max-content', minWidth: '100%', margin: '0 auto' }}
        >
        {/* Page Top Action Bar */}
        <div 
          className="flex items-center justify-between mb-3 text-xs text-slate-700 font-medium transition-all max-w-full"
          style={{ width: `${Math.max(dimensions.width * zoom, 280)}px`, maxWidth: '100%' }}
        >
          {/* Page Title & Number */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 text-xs tracking-wide">
              Page {activePageIndex + 1}
            </span>
            <span className="text-slate-400">-</span>
            <input
              type="text"
              value={activePage.title || ''}
              onChange={(e) => onUpdatePageTitle?.(e.target.value)}
              placeholder="Add page title"
              className="bg-transparent hover:bg-white/80 focus:bg-white border border-transparent hover:border-slate-300 focus:border-purple-500 rounded px-2 py-0.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all w-20 sm:w-32 md:w-44 truncate"
            />
          </div>

          {/* Page Actions */}
          <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border border-slate-300/80 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={onLockPage}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
              title={isPageLocked ? "Unlock page" : "Lock page"}
            >
              {isPageLocked ? <Lock size={13} className="text-amber-500" /> : <Unlock size={13} />}
            </button>
            <button
              onClick={() => onDuplicatePage?.(activePageIndex)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
              title="Duplicate page"
            >
              <Copy size={13} />
            </button>
            {pages.length > 1 && (
              <button
                onClick={() => onDeletePage?.(activePageIndex)}
                className="p-1.5 rounded-md hover:bg-red-50 text-slate-600 hover:text-red-500 transition-colors"
                title="Delete page"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button
              onClick={onAddPage}
              className="p-1.5 rounded-md hover:bg-purple-50 text-purple-600 transition-colors"
              title="Add empty page"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Artboard Wrapper with Optional Rulers */}
        <div className="relative flex">
          {/* Vertical Ruler on Left */}
          {showRulers && (
            <div 
              className="w-5 bg-white border-r border-slate-300 relative shrink-0 shadow-xs mr-1 rounded-l-md overflow-hidden"
              style={{ height: `${dimensions.height * zoom}px` }}
            >
              {renderVerticalRuler()}
              {/* Vertical hair-line cursor indicator */}
              <div 
                className="absolute left-0 right-0 h-px bg-purple-600 z-20 pointer-events-none"
                style={{ top: `${mousePos.y * zoom}px` }}
              />
            </div>
          )}

          <div className="flex flex-col">
            {/* Horizontal Ruler on Top */}
            {showRulers && (
              <div 
                className="h-5 bg-white border-b border-slate-300 relative shadow-xs mb-1 rounded-t-md overflow-hidden"
                style={{ width: `${dimensions.width * zoom}px` }}
              >
                {renderHorizontalRuler()}
                {/* Horizontal hair-line cursor indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-px bg-purple-600 z-20 pointer-events-none"
                  style={{ left: `${mousePos.x * zoom}px` }}
                />
              </div>
            )}

            {/* Artboard Stage with Drop Shadow */}
            <div 
              className="origin-top-left relative"
              onMouseMove={handleMouseMove}
              style={{
                width: `${dimensions.width * zoom}px`,
                height: `${dimensions.height * zoom}px`
              }}
            >
              <div 
                className="artboard-shadow relative overflow-hidden bg-white origin-top-left"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: '0 0',
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  backgroundColor: backgroundColor?.includes('gradient') ? 'transparent' : (backgroundColor || '#ffffff'),
                  background: backgroundColor || '#ffffff'
                }}
              >
                {/* Print Bleed Guide Overlay (20px red dashed) */}
                {showBleed && (
                  <div className="absolute inset-[20px] border border-dashed border-red-500/60 pointer-events-none z-30 flex items-start justify-start p-1">
                    <span className="text-[9px] font-mono text-red-500 bg-red-50/80 px-1 rounded">
                      Print Bleed (20px)
                    </span>
                  </div>
                )}

                {/* Safe Margins Guide Overlay (40px purple dashed) */}
                {showMargins && (
                  <div className="absolute inset-[40px] border border-dashed border-purple-500/60 pointer-events-none z-30 flex items-start justify-start p-1">
                    <span className="text-[9px] font-mono text-purple-600 bg-purple-50/80 px-1 rounded">
                      Safe Margins (40px)
                    </span>
                  </div>
                )}

                {/* The Fabric.js Canvas element */}
                <canvas ref={canvasRef} />
              </div>
            </div>
          </div>
        </div>

        {/* Centered Add Page Button below artboard */}
        <div className="mt-8 flex justify-center pb-8">
          <button
            onClick={onAddPage}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-purple-600 shadow-sm text-xs font-bold transition-all hover:shadow-md group"
          >
            <div className="w-5 h-5 rounded-full bg-purple-100 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
              <Plus size={13} className="text-purple-600 group-hover:text-white" />
            </div>
            <span>Add page</span>
          </button>
        </div>
      </div>
    </div>

      {/* ================= CANVA BOTTOM STATUS BAR ================= */}
      <footer className="h-10 bg-white border-t border-slate-200 px-2 sm:px-4 flex items-center justify-between text-xs text-slate-600 select-none shrink-0 shadow-xs z-30 mb-14 md:mb-0">
        {/* Left: Notes & Duration */}
        <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
          <button
            onClick={onOpenNotes}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
            title="Add speaker notes for this page"
          >
            <FileText size={14} className="text-purple-600" />
            <span>Notes</span>
          </button>

          <div 
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-[11px]"
            title="Page presentation timing"
          >
            <Clock size={12} className="text-slate-500" />
            <span>{pageDuration}s</span>
          </div>
        </div>

        {/* Center: Zoom Slider & Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={handleZoomOut} 
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          
          <input
            type="range"
            min="20"
            max="250"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            className="hidden sm:block w-20 md:w-28 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title="Zoom Slider"
          />

          <button 
            onClick={handleZoomIn} 
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>

          <span
            onClick={handleZoomReset}
            className="font-bold text-slate-800 text-[11px] cursor-pointer hover:text-purple-600 min-w-[34px] sm:min-w-[38px] text-center"
            title="Reset to 100%"
          >
            {Math.round(zoom * 100)}%
          </span>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={handleFitToScreen}
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
            title="Fit to Screen"
          >
            <Maximize size={13} />
          </button>
        </div>

        {/* Right: Grid View, Page Pager, Fullscreen Present */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={onOpenGridView}
            className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
            title="Grid view (manage all pages)"
          >
            <LayoutGrid size={14} className="text-slate-600" />
            <span className="hidden md:inline text-[11px]">Grid view</span>
          </button>

          {/* Pager Navigation */}
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-700 px-1 border-l border-slate-200 pl-1.5 sm:pl-2">
            <button
              onClick={() => onSelectPage?.(Math.max(0, activePageIndex - 1))}
              disabled={activePageIndex === 0}
              className="p-1 disabled:opacity-30 hover:bg-slate-100 rounded text-slate-600"
              title="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[10px] sm:text-[11px] whitespace-nowrap">{activePageIndex + 1} / {pages.length}</span>
            <button
              onClick={() => onSelectPage?.(Math.min(pages.length - 1, activePageIndex + 1))}
              disabled={activePageIndex === pages.length - 1}
              className="p-1 disabled:opacity-30 hover:bg-slate-100 rounded text-slate-600"
              title="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={onOpenPresent}
            className="hidden sm:block p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-purple-600 transition-colors ml-1"
            title="Full screen present"
          >
            <Expand size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
