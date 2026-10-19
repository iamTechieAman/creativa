import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Canvas, Rect, Circle, Triangle, Line, Textbox, 
  FabricImage, PencilBrush, Shadow, Group, ActiveSelection, FabricObject 
} from 'fabric';

// Canva signature selection controls & bounding box tokens
if (FabricObject?.ownDefaults) {
  FabricObject.ownDefaults.borderColor = '#8B3DFF';
  FabricObject.ownDefaults.borderScaleFactor = 1.8;
  FabricObject.ownDefaults.cornerColor = '#ffffff';
  FabricObject.ownDefaults.cornerStrokeColor = '#8B3DFF';
  FabricObject.ownDefaults.cornerStyle = 'circle';
  FabricObject.ownDefaults.cornerSize = 9;
  FabricObject.ownDefaults.transparentCorners = false;
}

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Drawer from './components/Drawer';
import ContextToolbar from './components/ContextToolbar';
import CanvasStage from './components/CanvasStage';
import PagesBar from './components/PagesBar';
import ExportModal from './components/ExportModal';
import ResizeModal from './components/ResizeModal';
import SaveModal from './components/SaveModal';
import EditImageModal from './components/EditImageModal';
import PresentationModal from './components/PresentationModal';
import GridViewModal from './components/GridViewModal';
import NotesDrawer from './components/NotesDrawer';
import MagicWriteModal from './components/MagicWriteModal';
import MagicDesignModal from './components/MagicDesignModal';
import VersionHistoryModal from './components/VersionHistoryModal';
import CreativaHomeModal from './components/CreativaHomeModal';
import CreatorProfileModal from './components/CreatorProfileModal';
import { getAllCreators } from './data/creators';
import { synthesizeCanvaTemplate } from './utils/canvaTemplateEngine';

import { 
  getSavedProjects, saveProjectToStorage, deleteProjectFromStorage, 
  exportProjectFile, parseImportedFile 
} from './utils/storage';
import { 
  createStar, createHexagon, createHeart, createStickerBadge,
  createPhoneMockup, createLaptopMockup, createPolaroidFrame, createCircleFrame, createSocialIcon,
  createRetroCassette, create3DStar, createRetroChair, createDoodlePencil, createPeaceBadge
} from './utils/shapeHelper';
import { startContinuousAutoScraping } from './utils/autoScraper';
import { loadGoogleFont } from './utils/fontLoader';

export default function App() {
  // Document metadata & State
  const [projectId, setProjectId] = useState(() => `proj-${Date.now()}`);
  const [projectTitle, setProjectTitle] = useState('My Brand Design');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 800 });
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const [savedProjects, setSavedProjects] = useState([]);

  // Multi-page state
  const [pages, setPages] = useState([
    { id: 'page-1', title: 'Page 1', canvasData: null, backgroundColor: '#ffffff', previewUrl: '', notes: '' }
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  // View Settings & Canva Pro State (Rulers OFF by default as requested)
  const [showRulers, setShowRulers] = useState(false);
  const [showMargins, setShowMargins] = useState(false);
  const [showBleed, setShowBleed] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const [pageDuration, setPageDuration] = useState('5.0');
  const [isPageLocked, setIsPageLocked] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('templates');
  const [zoom, setZoom] = useState(0.85);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isMagicWriteOpen, setIsMagicWriteOpen] = useState(false);
  const [isMagicDesignOpen, setIsMagicDesignOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState(null);
  const [isCanvaHomeOpen, setIsCanvaHomeOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('editor') === 'true' || window.location.hash === '#editor') {
        return false;
      }
    }
    return true;
  });
  const [historySnapshots, setHistorySnapshots] = useState([]);

  // Drawing mode state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#7D2AE8');

  // Active object & Layers
  const [activeObject, setActiveObject] = useState(null);
  const [canvasObjects, setCanvasObjects] = useState([]);

  // Clipboard ref for Ctrl+C / Ctrl+V
  const clipboardRef = useRef(null);

  // History Stack (Undo / Redo / Version History)
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isHistoryLockedRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Canvas and DOM refs
  const canvasElRef = useRef(null);
  const fabricRef = useRef(null);
  const containerRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // Load saved projects on initial render
  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, []);

  // Update undo/redo availability
  const updateHistoryState = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  // Push snapshot to history
  const pushHistoryState = useCallback(() => {
    if (isHistoryLockedRef.current || !fabricRef.current) return;
    const json = fabricRef.current.toDatalessJSON([
      'id', 'name', 'locked', 'lockMovementX', 'lockMovementY', 
      'lockRotation', 'lockScalingX', 'lockScalingY', 'selectable', 'visible'
    ]);
    
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    const entry = { data: JSON.stringify(json), timestamp: Date.now() };
    newHistory.push(entry);
    if (newHistory.length > 50) newHistory.shift();
    
    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setHistorySnapshots([...newHistory]);
    updateHistoryState();
    setSaveStatus('unsaved');
  }, []);

  // Sync canvas objects list for layers panel
  const syncObjectsList = useCallback(() => {
    if (!fabricRef.current) return;
    setCanvasObjects([...fabricRef.current.getObjects()]);
  }, []);

  // Auto-fit artboard stage within container viewport so zero text or graphics are clipped
  const autoFitCanvas = useCallback((w, h) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (!clientWidth || !clientHeight) return;
    const paddingX = clientWidth < 640 ? 16 : clientWidth < 1024 ? 40 : 80;
    const paddingY = clientWidth < 640 ? 20 : clientWidth < 1024 ? 40 : 80;
    const availableW = Math.max(clientWidth - paddingX, 100);
    const availableH = Math.max(clientHeight - paddingY, 100);
    const scale = Math.min(availableW / w, availableH / h, 1.0);
    setZoom(Math.max(0.12, Number(scale.toFixed(2))));
  }, []);

  // Continuous Always-On Canva Background Auto-Scraping
  useEffect(() => {
    startContinuousAutoScraping(45);
    const handleSync = (e) => {
      console.info('[Canva Auto-Scraper] Realtime sync update received:', e.detail);
    };
    window.addEventListener('canva_autoscrape_sync', handleSync);
    return () => window.removeEventListener('canva_autoscrape_sync', handleSync);
  }, []);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return;

    const canvas = new Canvas(canvasElRef.current, {
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selectionColor: 'rgba(125, 42, 232, 0.1)',
      selectionBorderColor: '#7D2AE8',
      selectionLineWidth: 1.5
    });

    fabricRef.current = canvas;

    const brush = new PencilBrush(canvas);
    brush.width = brushSize;
    brush.color = brushColor;
    canvas.freeDrawingBrush = brush;

    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setActiveObject(active || null);
    };

    const handleObjectModified = () => {
      pushHistoryState();
      syncObjectsList();
    };

    const handleObjectAdded = () => {
      if (!isHistoryLockedRef.current) {
        pushHistoryState();
        syncObjectsList();
      }
    };

    const handleObjectRemoved = () => {
      if (!isHistoryLockedRef.current) {
        pushHistoryState();
        syncObjectsList();
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setActiveObject(null));
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('path:created', handleObjectModified);

    // Double-click to instantly edit any text or group text
    canvas.on('mouse:dblclick', (opt) => {
      const target = opt.target;
      if (!target) return;
      if (target.type === 'textbox' || target.type === 'i-text') {
        target.enterEditing();
        target.selectAll();
        canvas.requestRenderAll();
      } else if (target.type === 'group') {
        const subTarget = opt.subTargets && opt.subTargets[0];
        const textObj = (subTarget && (subTarget.type === 'textbox' || subTarget.type === 'i-text'))
          ? subTarget
          : target.getObjects().find(o => o.type === 'textbox' || o.type === 'i-text');
        if (textObj) {
          textObj.enterEditing?.();
          textObj.selectAll?.();
          canvas.requestRenderAll();
        }
      }
    });

    pushHistoryState();
    syncObjectsList();

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Canvas resizing with proportional scaling
  const handleApplyResize = (w, h, scaleContent = true) => {
    if (!fabricRef.current) return;
    const oldW = canvasDimensions.width;
    const oldH = canvasDimensions.height;
    const scaleX = w / oldW;
    const scaleY = h / oldH;

    setCanvasDimensions({ width: w, height: h });
    fabricRef.current.setDimensions({ width: w, height: h });

    if (scaleContent) {
      fabricRef.current.getObjects().forEach(obj => {
        obj.set({
          left: obj.left * scaleX,
          top: obj.top * scaleY,
          scaleX: (obj.scaleX || 1) * scaleX,
          scaleY: (obj.scaleY || 1) * scaleY
        });
        obj.setCoords();
      });
    }

    fabricRef.current.requestRenderAll();
    pushHistoryState();
  };

  // Copy & Resize to new design (Magic Switch Pro)
  const handleCopyAndResize = (newW, newH, scaleContent = true) => {
    if (!fabricRef.current) return;
    const oldW = canvasDimensions.width;
    const oldH = canvasDimensions.height;
    const scaleX = newW / oldW;
    const scaleY = newH / oldH;

    const newTitle = `${projectTitle} (${newW}×${newH})`;
    const newId = `proj-${Date.now()}`;

    setProjectId(newId);
    setProjectTitle(newTitle);
    setCanvasDimensions({ width: newW, height: newH });
    fabricRef.current.setDimensions({ width: newW, height: newH });

    if (scaleContent) {
      fabricRef.current.getObjects().forEach(obj => {
        obj.set({
          left: obj.left * scaleX,
          top: obj.top * scaleY,
          scaleX: (obj.scaleX || 1) * scaleX,
          scaleY: (obj.scaleY || 1) * scaleY
        });
        obj.setCoords();
      });
    }

    fabricRef.current.requestRenderAll();
    pushHistoryState();
    handleSaveProject(newTitle);
  };

  // Sync brush state
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.isDrawingMode = isDrawingMode;
    if (fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
      fabricRef.current.freeDrawingBrush.color = brushColor;
    }
  }, [isDrawingMode, brushSize, brushColor]);

  // Restore specific historical snapshot (Canva Pro Version History)
  const handleRestoreSnapshot = useCallback(async (targetIndex) => {
    if (targetIndex < 0 || targetIndex >= historyRef.current.length || !fabricRef.current) return;
    isHistoryLockedRef.current = true;
    historyIndexRef.current = targetIndex;
    const entry = historyRef.current[targetIndex];
    const dataStr = typeof entry === 'string' ? entry : entry.data;
    const targetState = JSON.parse(dataStr);
    await fabricRef.current.loadFromJSON(targetState);
    fabricRef.current.requestRenderAll();
    setActiveObject(null);
    syncObjectsList();
    isHistoryLockedRef.current = false;
    updateHistoryState();
  }, [syncObjectsList]);

  // Undo
  const handleUndo = useCallback(async () => {
    if (historyIndexRef.current <= 0 || !fabricRef.current) return;
    isHistoryLockedRef.current = true;
    historyIndexRef.current -= 1;
    const entry = historyRef.current[historyIndexRef.current];
    const dataStr = typeof entry === 'string' ? entry : entry.data;
    const targetState = JSON.parse(dataStr);
    await fabricRef.current.loadFromJSON(targetState);
    fabricRef.current.requestRenderAll();
    setActiveObject(null);
    syncObjectsList();
    isHistoryLockedRef.current = false;
    updateHistoryState();
  }, [syncObjectsList]);

  // Redo
  const handleRedo = useCallback(async () => {
    if (historyIndexRef.current >= historyRef.current.length - 1 || !fabricRef.current) return;
    isHistoryLockedRef.current = true;
    historyIndexRef.current += 1;
    const entry = historyRef.current[historyIndexRef.current];
    const dataStr = typeof entry === 'string' ? entry : entry.data;
    const targetState = JSON.parse(dataStr);
    await fabricRef.current.loadFromJSON(targetState);
    fabricRef.current.requestRenderAll();
    setActiveObject(null);
    syncObjectsList();
    isHistoryLockedRef.current = false;
    updateHistoryState();
  }, [syncObjectsList]);

  // Save Project
  const handleSaveProject = useCallback((customTitle) => {
    if (!fabricRef.current) return;
    setSaveStatus('saving');
    const titleToSave = customTitle || projectTitle || 'Untitled design';

    // Update active page
    const currentData = fabricRef.current.toDatalessJSON([
      'id', 'name', 'locked', 'lockMovementX', 'lockMovementY', 
      'lockRotation', 'lockScalingX', 'lockScalingY', 'selectable', 'visible'
    ]);
    const preview = fabricRef.current.toDataURL({ format: 'jpeg', quality: 0.7, multiplier: 0.4 });

    const updatedPages = [...pages];
    updatedPages[activePageIndex] = {
      ...updatedPages[activePageIndex],
      canvasData: currentData,
      backgroundColor,
      previewUrl: preview
    };
    setPages(updatedPages);

    const project = {
      id: projectId,
      title: titleToSave,
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      pages: updatedPages,
      canvasData: currentData
    };

    saveProjectToStorage(project);
    setSavedProjects(getSavedProjects());
    setProjectTitle(titleToSave);
    setSaveStatus('saved');
  }, [projectId, projectTitle, canvasDimensions, backgroundColor, pages, activePageIndex]);

  // Debounced auto-save
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (fabricRef.current && saveStatus === 'unsaved') {
        handleSaveProject(projectTitle);
      }
    }, 2500);

    return () => clearTimeout(autoSaveTimerRef.current);
  }, [saveStatus, handleSaveProject, projectTitle]);

  // Multi-Page Switcher
  const handleSelectPage = async (newIndex) => {
    if (newIndex === activePageIndex || !fabricRef.current) return;

    // Snapshot current active page
    const currentData = fabricRef.current.toDatalessJSON([
      'id', 'name', 'locked', 'lockMovementX', 'lockMovementY', 
      'lockRotation', 'lockScalingX', 'lockScalingY', 'selectable', 'visible'
    ]);
    const preview = fabricRef.current.toDataURL({ format: 'jpeg', quality: 0.7, multiplier: 0.4 });
    const updatedPages = [...pages];
    updatedPages[activePageIndex] = {
      ...updatedPages[activePageIndex],
      canvasData: currentData,
      backgroundColor,
      previewUrl: preview
    };

    // Load new page
    isHistoryLockedRef.current = true;
    fabricRef.current.clear();
    const targetPage = updatedPages[newIndex];
    setBackgroundColor(targetPage.backgroundColor || '#ffffff');
    if (targetPage.canvasData) {
      await fabricRef.current.loadFromJSON(targetPage.canvasData);
    } else {
      fabricRef.current.backgroundColor = targetPage.backgroundColor || '#ffffff';
    }
    fabricRef.current.requestRenderAll();
    setActiveObject(null);
    syncObjectsList();
    isHistoryLockedRef.current = false;

    setPages(updatedPages);
    setActivePageIndex(newIndex);
  };

  const handleAddPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      canvasData: null,
      backgroundColor: '#ffffff',
      previewUrl: ''
    };
    setPages(prev => [...prev, newPage]);
    handleSelectPage(pages.length);
  };

  const handleDuplicatePage = () => {
    if (!fabricRef.current) return;
    const currentData = fabricRef.current.toDatalessJSON();
    const preview = fabricRef.current.toDataURL({ format: 'jpeg', quality: 0.7, multiplier: 0.4 });
    const newPage = {
      id: `page-${Date.now()}`,
      title: `${pages[activePageIndex].title} (Copy)`,
      canvasData: currentData,
      backgroundColor,
      previewUrl: preview
    };
    const updated = [...pages];
    updated.splice(activePageIndex + 1, 0, newPage);
    setPages(updated);
    setActivePageIndex(activePageIndex + 1);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const updated = pages.filter((_, idx) => idx !== activePageIndex);
    const newActiveIndex = Math.max(0, activePageIndex - 1);
    setPages(updated);
    handleSelectPage(newActiveIndex);
  };

  const handleMovePage = (index, direction) => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pages.length) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPages(updated);
    setActivePageIndex(target);
  };

  // Make a Copy of current design (File -> Make a copy)
  const handleMakeCopy = () => {
    const newId = `proj-${Date.now()}`;
    const newTitle = `${projectTitle} (Copy)`;
    setProjectId(newId);
    setProjectTitle(newTitle);
    handleSaveProject(newTitle);
    alert(`Created copy: "${newTitle}"`);
  };

  // Update Page Title
  const handleUpdatePageTitle = (newTitle) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      title: newTitle
    };
    setPages(updated);
  };

  // Update Page Notes
  const handleUpdatePageNotes = (newNotes) => {
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      notes: newNotes
    };
    setPages(updated);
  };

  // Lock entire active page
  const handleLockPage = () => {
    if (!fabricRef.current) return;
    const newLockState = !isPageLocked;
    setIsPageLocked(newLockState);
    fabricRef.current.getObjects().forEach(obj => {
      obj.set({
        lockMovementX: newLockState,
        lockMovementY: newLockState,
        lockRotation: newLockState,
        lockScalingX: newLockState,
        lockScalingY: newLockState,
        hasControls: !newLockState
      });
    });
    fabricRef.current.requestRenderAll();
    syncObjectsList();
  };

  // Clipboard: Copy
  const handleCopy = useCallback(async () => {
    if (!activeObject) return;
    const cloned = await activeObject.clone();
    clipboardRef.current = cloned;
  }, [activeObject]);

  // Clipboard: Paste
  const handlePaste = useCallback(async () => {
    if (!clipboardRef.current || !fabricRef.current) return;
    const canvas = fabricRef.current;
    const cloned = await clipboardRef.current.clone();

    cloned.set({
      left: cloned.left + 24,
      top: cloned.top + 24,
      evented: true
    });

    if (cloned.type === 'activeSelection') {
      cloned.canvas = canvas;
      cloned.forEachObject((obj) => {
        canvas.add(obj);
      });
      cloned.setCoords();
    } else {
      canvas.add(cloned);
    }

    clipboardRef.current.top += 24;
    clipboardRef.current.left += 24;
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
    pushHistoryState();
  }, [pushHistoryState]);

  // Keyboard Shortcuts (Undo, Redo, Copy, Paste, Nudge, Delete, Select All)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      const isEditingFabricText = activeObject?.isEditing;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput && !isEditingFabricText) {
          e.preventDefault();
          handleUndo();
        }
      } else if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') || 
                 ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        if (!isInput && !isEditingFabricText) {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        if (!isInput && !isEditingFabricText && activeObject) {
          handleCopy();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        if (!isInput && !isEditingFabricText) {
          handlePaste();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        if (!isInput && !isEditingFabricText && fabricRef.current) {
          e.preventDefault();
          const allObjects = fabricRef.current.getObjects().filter(o => o.selectable !== false);
          if (allObjects.length > 0) {
            const selection = new ActiveSelection(allObjects, { canvas: fabricRef.current });
            fabricRef.current.setActiveObject(selection);
            fabricRef.current.requestRenderAll();
            setActiveObject(selection);
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveProject(projectTitle);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (!isInput && !isEditingFabricText && activeObject) {
          e.preventDefault();
          handleDuplicate();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isInput && !isEditingFabricText && activeObject) {
          e.preventDefault();
          handleDeleteObject(activeObject);
        }
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (!isInput && !isEditingFabricText && activeObject) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          if (e.key === 'ArrowLeft') activeObject.left -= step;
          if (e.key === 'ArrowRight') activeObject.left += step;
          if (e.key === 'ArrowUp') activeObject.top -= step;
          if (e.key === 'ArrowDown') activeObject.top += step;
          activeObject.setCoords();
          fabricRef.current.requestRenderAll();
          pushHistoryState();
        }
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && !isInput && !isEditingFabricText) {
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          handleAddText('Heading');
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleAddShape({ type: 'rect', name: 'Rectangle', fill: '#7D2AE8', rx: 0, ry: 0 });
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleAddShape({ type: 'circle', name: 'Circle', fill: '#00C4CC' });
        } else if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          handleAddLine({ id: 'line-solid', name: 'Solid Line', stroke: '#1e293b', strokeWidth: 3, strokeDashArray: null });
        } else if (e.key === 'Escape') {
          if (fabricRef.current) {
            fabricRef.current.discardActiveObject();
            fabricRef.current.requestRenderAll();
            setActiveObject(null);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeObject, handleUndo, handleRedo, handleCopy, handlePaste, handleSaveProject, projectTitle, pushHistoryState]);

  // Center Object
  const centerObject = (obj) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    obj.set({
      left: canvasDimensions.width / 2,
      top: canvasDimensions.height / 2,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  // Add Shape
  const handleAddShape = (shapeDef) => {
    if (!fabricRef.current) return;
    let obj;
    const center = { left: canvasDimensions.width / 2, top: canvasDimensions.height / 2 };

    if (shapeDef.type === 'rect') {
      obj = new Rect({
        ...center,
        width: shapeDef.width,
        height: shapeDef.height,
        fill: shapeDef.fill,
        rx: shapeDef.rx || 0,
        ry: shapeDef.ry || 0,
        originX: 'center',
        originY: 'center'
      });
    } else if (shapeDef.type === 'circle') {
      obj = new Circle({
        ...center,
        radius: shapeDef.radius,
        fill: shapeDef.fill,
        originX: 'center',
        originY: 'center'
      });
    } else if (shapeDef.type === 'triangle') {
      obj = new Triangle({
        ...center,
        width: shapeDef.width,
        height: shapeDef.height,
        fill: shapeDef.fill,
        originX: 'center',
        originY: 'center'
      });
    } else if (shapeDef.type === 'star') {
      obj = createStar({ fill: shapeDef.fill, ...center });
    } else if (shapeDef.type === 'hexagon') {
      obj = createHexagon({ fill: shapeDef.fill, ...center });
    } else if (shapeDef.type === 'heart') {
      obj = createHeart({ fill: shapeDef.fill, ...center });
    }

    if (obj) centerObject(obj);
  };

  // Add Vector Mockups (Pro)
  const handleAddMockup = (type) => {
    const center = { left: canvasDimensions.width / 2, top: canvasDimensions.height / 2 };
    let obj;
    if (type === 'phone') obj = createPhoneMockup(center);
    else if (type === 'laptop') obj = createLaptopMockup(center);
    else if (type === 'polaroid') obj = createPolaroidFrame(center);
    else if (type === 'circle') obj = createCircleFrame(center);
    if (obj) centerObject(obj);
  };

  // Add Social Media Icon
  const handleAddSocialIcon = (platform, fill) => {
    const icon = createSocialIcon({ 
      platform, 
      fill, 
      left: canvasDimensions.width / 2, 
      top: canvasDimensions.height / 2 
    });
    centerObject(icon);
  };

  // Add Retro Graphics (Screenshot 3)
  const handleAddRetroGraphic = (type) => {
    const center = { left: canvasDimensions.width / 2, top: canvasDimensions.height / 2 };
    let obj;
    if (type === 'cassette') obj = createRetroCassette(center);
    else if (type === '3dstar') obj = create3DStar(center);
    else if (type === 'chair') obj = createRetroChair(center);
    else if (type === 'pencil') obj = createDoodlePencil(center);
    else if (type === 'peace') obj = createPeaceBadge(center);
    if (obj) centerObject(obj);
  };

  // Add Line
  const handleAddLine = (lineDef) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const startX = canvasDimensions.width / 2 - 120;
    const endX = canvasDimensions.width / 2 + 120;
    const y = canvasDimensions.height / 2;

    const line = new Line([startX, y, endX, y], {
      stroke: lineDef.stroke,
      strokeWidth: lineDef.strokeWidth,
      strokeDashArray: lineDef.strokeDashArray
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.requestRenderAll();
  };

  // Add Sticker Badge
  const handleAddSticker = (stickerDef) => {
    const group = createStickerBadge({
      ...stickerDef,
      left: canvasDimensions.width / 2,
      top: canvasDimensions.height / 2
    });
    centerObject(group);
  };

  // Add Text with dynamic font loading
  const handleAddText = async (styleDef) => {
    if (styleDef.fontFamily) {
      await loadGoogleFont(styleDef.fontFamily);
    }
    const textbox = new Textbox(styleDef.text || 'Add your text', {
      left: canvasDimensions.width / 2,
      top: canvasDimensions.height / 2,
      originX: 'center',
      originY: 'center',
      fontSize: styleDef.fontSize || 32,
      fontWeight: styleDef.fontWeight || 'normal',
      fontStyle: styleDef.fontStyle || 'normal',
      fontFamily: styleDef.fontFamily || 'Inter',
      fill: styleDef.fill || '#1e293b',
      textAlign: styleDef.textAlign || 'center',
      stroke: styleDef.stroke || null,
      strokeWidth: styleDef.strokeWidth || 0,
      shadow: styleDef.shadow ? new Shadow(styleDef.shadow) : null,
      width: Math.min(canvasDimensions.width * 0.75, 450)
    });
    centerObject(textbox);
  };

  // Add Font Pairing
  const handleAddFontPairing = async (pairing) => {
    if (!pairing) return;
    await Promise.all([
      loadGoogleFont(pairing.headingFont),
      loadGoogleFont(pairing.bodyFont)
    ]);
    const canvas = fabricRef.current;
    if (!canvas) return;

    const centerY = canvasDimensions.height / 2;
    const centerX = canvasDimensions.width / 2;

    const headingBox = new Textbox(pairing.sampleHeading || 'Innovate Tomorrow', {
      left: centerX,
      top: centerY - 45,
      originX: 'center',
      originY: 'center',
      fontSize: 44,
      fontWeight: 'bold',
      fontFamily: pairing.headingFont,
      fill: '#1e293b',
      textAlign: 'center',
      width: Math.min(canvasDimensions.width * 0.85, 600)
    });

    const subBox = new Textbox(pairing.sampleSub || 'Scalable AI architectures built for growth', {
      left: centerX,
      top: centerY + 35,
      originX: 'center',
      originY: 'center',
      fontSize: 20,
      fontWeight: 'normal',
      fontFamily: pairing.bodyFont,
      fill: '#64748b',
      textAlign: 'center',
      width: Math.min(canvasDimensions.width * 0.8, 550)
    });

    canvas.add(headingBox);
    canvas.add(subBox);
    canvas.setActiveObject(headingBox);
    canvas.requestRenderAll();
  };

  // Add Image
  const handleAddImage = async (url) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
      const maxDim = Math.min(canvasDimensions.width, canvasDimensions.height) * 0.65;
      if (img.width > maxDim || img.height > maxDim) {
        const scale = maxDim / Math.max(img.width, img.height);
        img.scale(scale);
      }
      centerObject(img);
    } catch (err) {
      console.error('Failed to load image:', err);
    }
  };

  // Set Background
  const handleSetBackground = (bg) => {
    setBackgroundColor(bg);
    if (!fabricRef.current) return;
    if (bg.includes('gradient')) {
      fabricRef.current.backgroundColor = 'transparent';
    } else {
      fabricRef.current.backgroundColor = bg;
    }
    fabricRef.current.requestRenderAll();
    pushHistoryState();
  };

  // Load Premade or Scraped Template (with auto-fit, zero text-clipping, and instant editability)
  const handleLoadTemplate = async (template) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    isHistoryLockedRef.current = true;
    canvas.clear();

    const canvasW = template.width || 1080;
    const canvasH = template.height || 1080;
    setCanvasDimensions({ width: canvasW, height: canvasH });
    canvas.setDimensions({ width: canvasW, height: canvasH });
    setBackgroundColor(template.backgroundColor || '#ffffff');
    setProjectTitle(template.title || 'Untitled design');

    // Auto-fit artboard to viewport so no text or graphics are pushed offscreen
    autoFitCanvas(canvasW, canvasH);

    // 1. Ensure template has rich objects
    let rawObjects = template.objects;
    if (!Array.isArray(rawObjects) || rawObjects.length === 0) {
      const syn = synthesizeCanvaTemplate(template.title || 'Creative Design', {
        width: canvasW,
        height: canvasH,
        category: template.category || 'Presentation'
      });
      rawObjects = syn.objects || [];
    }

    // 2. Safe image loader with timeout & resilient CDN fallback
    const loadFabricImageSafe = async (src, options = {}) => {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2800));
      try {
        return await Promise.race([
          FabricImage.fromURL(src, { crossOrigin: 'anonymous', ...options }),
          timeoutPromise
        ]);
      } catch (err) {
        console.warn('Image timed out or failed, using CDN fallback:', src);
        try {
          const fallbackUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
          return await FabricImage.fromURL(fallbackUrl, { crossOrigin: 'anonymous', ...options });
        } catch (e2) {
          return null;
        }
      }
    };

    // 3. Process and add each object
    for (const objDef of rawObjects) {
      const { type, text, ...cleanProps } = objDef;
      let fObj;

      if (type === 'rect') {
        fObj = new Rect({
          ...cleanProps,
          selectable: cleanProps.selectable ?? true
        });
      } else if (type === 'circle') {
        fObj = new Circle({
          ...cleanProps,
          selectable: cleanProps.selectable ?? true
        });
      } else if (type === 'triangle') {
        fObj = new Triangle({
          ...cleanProps,
          selectable: cleanProps.selectable ?? true
        });
      } else if (type === 'line') {
        fObj = new Line(cleanProps.points || [0, 0, 100, 0], {
          ...cleanProps,
          selectable: cleanProps.selectable ?? true
        });
      } else if (type === 'textbox' || type === 'i-text' || type === 'text') {
        const fullText = text || '';
        const { height: _h, width: specifiedW, ...textProps } = cleanProps;
        const originX = textProps.originX || 'left';
        const left = textProps.left ?? 0;

        let maxAllowedWidth;
        if (originX === 'center') {
          const edgeDist = Math.min(left, canvasW - left);
          maxAllowedWidth = Math.max(200, Math.floor(edgeDist * 2 * 0.95));
        } else if (originX === 'right') {
          maxAllowedWidth = Math.max(200, Math.floor(left * 0.95));
        } else {
          maxAllowedWidth = Math.max(200, Math.floor((canvasW - left) * 0.95));
        }

        let finalWidth = specifiedW ? Math.min(specifiedW, maxAllowedWidth) : maxAllowedWidth;
        let fontSize = textProps.fontSize || 32;
        const estCharPerLine = Math.floor(finalWidth / (fontSize * 0.58));
        const estimatedLines = Math.ceil(fullText.length / Math.max(estCharPerLine, 1));
        if (estimatedLines > 3 && fontSize > 26) {
          fontSize = Math.max(18, Math.round(fontSize * 0.8));
        }
        if (estimatedLines > 5 && fontSize > 18) {
          fontSize = Math.max(14, Math.round(fontSize * 0.75));
        }

        fObj = new Textbox(fullText, {
          ...textProps,
          fontSize,
          width: finalWidth,
          originX,
          splitByGrapheme: false,
          selectable: true,
          editable: true,
          cursorColor: '#7D2AE8',
          selectionColor: 'rgba(125, 42, 232, 0.3)',
          padding: 6,
          shadow: textProps.shadow || {
            color: 'rgba(0, 0, 0, 0.5)',
            blur: 6,
            offsetX: 0,
            offsetY: 2
          }
        });
      } else if (type === 'image' && cleanProps.src) {
        try {
          fObj = await loadFabricImageSafe(cleanProps.src);
          if (fObj) {
            const isBgImage = rawObjects.indexOf(objDef) === 0 || 
                              (cleanProps.left === 0 && cleanProps.top === 0) || 
                              (!cleanProps.width || cleanProps.width >= canvasW * 0.6);

            if (isBgImage) {
              // Scale to cover 100% of canvas artboard without awkward cutoffs
              const scale = Math.max(canvasW / (fObj.width || 1), canvasH / (fObj.height || 1));
              fObj.set({
                scaleX: scale,
                scaleY: scale,
                left: canvasW / 2,
                top: canvasH / 2,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true
              });
            } else {
              const targetW = cleanProps.width || canvasW * 0.5;
              const { scaleX: _sx, scaleY: _sy, width: _w, height: _h, ...imgProps } = cleanProps;
              fObj.set(imgProps);
              if (targetW && fObj.width) {
                fObj.scaleToWidth(targetW);
              }
              fObj.set({
                selectable: true,
                hasControls: true,
                lockMovementX: false,
                lockMovementY: false
              });
            }
          }
        } catch (e) {
          console.warn('Failed to load image in template:', e);
        }
      }

      if (fObj) {
        canvas.add(fObj);
        // If image is background, keep at back so text is immediately selectable
        if (type === 'image') {
          canvas.sendObjectToBack(fObj);
        }
      }
    }

    // 4. If template has fewer than 3 objects, enrich it into a complete Canva design!
    const currentObjs = canvas.getObjects();
    const existingTextboxes = currentObjs.filter(o => o.type === 'textbox');
    
    if (currentObjs.length < 3) {
      // Add subtle dark readability backdrop (non-interactive so clicks pass through to text)
      const readabilityCard = new Rect({
        left: Math.round(canvasW / 2),
        top: Math.round(canvasH * 0.50),
        width: Math.round(canvasW * 0.84),
        height: Math.round(canvasH * 0.58),
        fill: 'rgba(15, 23, 42, 0.55)',
        rx: 24,
        ry: 24,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false
      });
      canvas.add(readabilityCard);

      // Re-position and format existing headline text for razor-sharp readability
      if (existingTextboxes.length > 0) {
        const headline = existingTextboxes[0];
        headline.set({
          left: Math.round(canvasW / 2),
          top: Math.round(canvasH * 0.42),
          originX: 'center',
          originY: 'center',
          textAlign: 'center',
          fill: '#ffffff',
          width: Math.round(canvasW * 0.78),
          fontSize: Math.min(headline.fontSize || 36, Math.round(canvasW * 0.045)),
          shadow: { color: 'rgba(0,0,0,0.7)', blur: 8, offsetX: 0, offsetY: 2 },
          selectable: true,
          editable: true,
          cursorColor: '#7D2AE8'
        });
        canvas.bringObjectToFront(headline);
      }

      // Add Category Pill Badge (Grouped so rectangle and text move together seamlessly)
      const badgeW = Math.min(240, Math.round(canvasW * 0.30));
      const catBadge = new Rect({
        left: 0,
        top: 0,
        width: badgeW,
        height: 38,
        fill: '#7D2AE8',
        rx: 19,
        ry: 19,
        originX: 'center',
        originY: 'center',
      });
      const catText = new Textbox((template.category || 'OFFICIAL TEMPLATE').toUpperCase(), {
        left: 0,
        top: 0,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        fill: '#ffffff',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        width: badgeW - 20,
        editable: true,
        cursorColor: '#ffffff'
      });
      const badgeGroup = new Group([catBadge, catText], {
        left: Math.round(canvasW / 2),
        top: Math.round(canvasH * 0.28),
        originX: 'center',
        originY: 'center',
        subTargetCheck: true,
        interactive: true
      });
      canvas.add(badgeGroup);

      // Add Subtitle Textbox
      const subText = new Textbox(`Professional editable layout for ${template.title || 'your brand'}. Customize typography, colors & vectors.`, {
        left: Math.round(canvasW / 2),
        top: Math.round(canvasH * 0.56),
        fontSize: Math.max(15, Math.round(canvasW * 0.020)),
        fontFamily: 'Inter',
        fill: '#e2e8f0',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        width: Math.round(canvasW * 0.74),
        shadow: { color: 'rgba(0,0,0,0.6)', blur: 6, offsetX: 0, offsetY: 2 },
        selectable: true,
        editable: true,
        cursorColor: '#7D2AE8'
      });
      canvas.add(subText);

      // Add Call To Action Button (Grouped so button and text move together)
      const ctaW = Math.min(240, Math.round(canvasW * 0.30));
      const ctaBtn = new Rect({
        left: 0,
        top: 0,
        width: ctaW,
        height: 48,
        fill: '#f59e0b',
        rx: 24,
        ry: 24,
        originX: 'center',
        originY: 'center',
      });
      const ctaLabel = new Textbox('CUSTOMIZE NOW', {
        left: 0,
        top: 0,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
        fill: '#0f172a',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        width: ctaW - 20,
        editable: true,
        cursorColor: '#7D2AE8'
      });
      const ctaGroup = new Group([ctaBtn, ctaLabel], {
        left: Math.round(canvasW / 2),
        top: Math.round(canvasH * 0.68),
        originX: 'center',
        originY: 'center',
        subTargetCheck: true,
        interactive: true
      });
      canvas.add(ctaGroup);

      // Ensure card is behind text and buttons, but in front of background image
      const bgImg = canvas.getObjects().find(o => o.type === 'image');
      if (bgImg) {
        canvas.sendObjectToBack(readabilityCard);
        canvas.sendObjectToBack(bgImg);
      }
    }

    // 5. Automatically bring main headline textbox to front and select it
    const allFinalObjs = canvas.getObjects();
    const primaryTextbox = allFinalObjs.find(o => o.type === 'textbox');
    if (primaryTextbox) {
      canvas.bringObjectToFront(primaryTextbox);
      canvas.setActiveObject(primaryTextbox);
    }

    // 6. Refresh font rendering once web fonts are fully loaded
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        canvas.getObjects().forEach(obj => {
          if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') {
            obj.initDimensions?.();
          }
        });
        canvas.requestRenderAll();
      });
    }

    canvas.requestRenderAll();
    syncObjectsList();
    isHistoryLockedRef.current = false;
    pushHistoryState();
  };

  // Load Saved Project
  const handleLoadProject = async (project) => {
    const canvas = fabricRef.current;
    if (!canvas || !project.canvasData) return;

    isHistoryLockedRef.current = true;
    setProjectId(project.id);
    setProjectTitle(project.title);
    setCanvasDimensions({ width: project.width, height: project.height });
    canvas.setDimensions({ width: project.width, height: project.height });
    setBackgroundColor(project.backgroundColor || '#ffffff');

    autoFitCanvas(project.width, project.height);

    if (project.pages && project.pages.length > 0) {
      setPages(project.pages);
      setActivePageIndex(0);
    }

    await canvas.loadFromJSON(project.canvasData);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        canvas.getObjects().forEach(obj => {
          if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') {
            obj.initDimensions?.();
          }
        });
        canvas.requestRenderAll();
      });
    }

    canvas.requestRenderAll();
    syncObjectsList();
    isHistoryLockedRef.current = false;
    pushHistoryState();
  };

  // Delete Saved Project
  const handleDeleteSavedProject = (id) => {
    const updated = deleteProjectFromStorage(id);
    setSavedProjects(updated);
  };

  // Create New Empty Design
  const handleNewDesign = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = '#ffffff';
      fabricRef.current.requestRenderAll();
    }
    setProjectId(`proj-${Date.now()}`);
    setProjectTitle('Untitled design');
    setBackgroundColor('#ffffff');
    setActiveObject(null);
    setPages([{ id: 'page-1', title: 'Page 1', canvasData: null, backgroundColor: '#ffffff', previewUrl: '' }]);
    setActivePageIndex(0);
    syncObjectsList();
    pushHistoryState();
  };

  // Duplicate
  const handleDuplicate = async () => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject) return;
    const cloned = await activeObject.clone();
    cloned.set({
      left: activeObject.left + 24,
      top: activeObject.top + 24,
      evented: true
    });
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
  };

  // Delete Object
  const handleDeleteObject = (obj) => {
    const canvas = fabricRef.current;
    if (!canvas || !obj) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    setActiveObject(null);
  };

  // Layer Reordering
  const handleMoveLayer = (directionOrObj, dir) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const target = typeof directionOrObj === 'string' ? activeObject : directionOrObj;
    const action = typeof directionOrObj === 'string' ? directionOrObj : dir;
    if (!target) return;

    if (action === 'front' || action === 'up') {
      canvas.bringObjectForward(target);
    } else if (action === 'back' || action === 'down') {
      canvas.sendObjectBackwards(target);
    } else if (action === 'top') {
      canvas.bringObjectToFront(target);
    } else if (action === 'bottom') {
      canvas.sendObjectToBack(target);
    }
    canvas.requestRenderAll();
    syncObjectsList();
    pushHistoryState();
  };

  // Lock / Unlock
  const handleToggleLock = (targetObj) => {
    const target = targetObj || activeObject;
    if (!target || !fabricRef.current) return;
    const isLocked = !target.lockMovementX;
    target.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockRotation: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
      hasControls: !isLocked
    });
    fabricRef.current.requestRenderAll();
    setActiveObject({ ...target });
    syncObjectsList();
  };

  // Toggle Visibility
  const handleToggleVisibility = (targetObj) => {
    const target = targetObj || activeObject;
    if (!target || !fabricRef.current) return;
    target.set('visible', target.visible === false ? true : false);
    fabricRef.current.requestRenderAll();
    syncObjectsList();
  };

  // Apply Font Pair (Pro)
  const handleApplyFontPair = (headingFont, bodyFont) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach(obj => {
      if (obj.type === 'textbox') {
        if ((obj.fontSize || 20) >= 30) {
          obj.set('fontFamily', headingFont);
        } else {
          obj.set('fontFamily', bodyFont);
        }
      }
    });
    canvas.requestRenderAll();
    pushHistoryState();
  };

  // Align Object
  const handleAlign = (type) => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject) return;
    if (type === 'center') {
      canvas.centerObject(activeObject);
    } else if (type === 'left') {
      activeObject.set({ left: activeObject.getScaledWidth() / 2 });
    } else if (type === 'right') {
      activeObject.set({ left: canvasDimensions.width - activeObject.getScaledWidth() / 2 });
    } else if (type === 'top') {
      activeObject.set({ top: activeObject.getScaledHeight() / 2 });
    } else if (type === 'bottom') {
      activeObject.set({ top: canvasDimensions.height - activeObject.getScaledHeight() / 2 });
    } else if (type === 'middle') {
      activeObject.set({ top: canvasDimensions.height / 2 });
    }
    activeObject.setCoords();
    canvas.requestRenderAll();
    pushHistoryState();
  };

  // Group multiple selected objects
  const handleGroup = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'activeSelection') return;

    const group = active.toGroup();
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    setActiveObject(group);
    pushHistoryState();
  };

  // Ungroup selected group
  const handleUngroup = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'group') return;

    active.toActiveSelection();
    canvas.requestRenderAll();
    setActiveObject(canvas.getActiveObject());
    pushHistoryState();
  };

  // Shuffle Canvas Colors with Brand Palette
  const handleShuffleColors = (palette) => {
    const canvas = fabricRef.current;
    if (!canvas || !palette || palette.length === 0) return;

    const objects = canvas.getObjects();
    objects.forEach((obj, idx) => {
      if (obj.type === 'textbox' || obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle' || obj.type === 'polygon' || obj.type === 'path') {
        const color = palette[(idx + Math.floor(Math.random() * palette.length)) % palette.length];
        if (obj.fill && obj.fill !== 'transparent') {
          obj.set('fill', color);
        }
      }
    });

    canvas.requestRenderAll();
    pushHistoryState();
  };

  // Update Object Property
  const handleUpdateProp = (prop, value) => {
    if (!activeObject || !fabricRef.current) return;
    activeObject.set(prop, value);
    fabricRef.current.requestRenderAll();
    setActiveObject({ ...activeObject });
    pushHistoryState();
  };

  // Apply Photo Changes from EditImageModal
  const handleApplyImageChanges = async (newUrl) => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject || activeObject.type !== 'image') return;

    const oldLeft = activeObject.left;
    const oldTop = activeObject.top;
    const oldScaleX = activeObject.scaleX;
    const oldScaleY = activeObject.scaleY;
    const oldAngle = activeObject.angle;

    const newImg = await FabricImage.fromURL(newUrl, { crossOrigin: 'anonymous' });
    newImg.set({
      left: oldLeft,
      top: oldTop,
      scaleX: oldScaleX,
      scaleY: oldScaleY,
      angle: oldAngle,
      originX: 'center',
      originY: 'center'
    });

    canvas.remove(activeObject);
    canvas.add(newImg);
    canvas.setActiveObject(newImg);
    canvas.requestRenderAll();
    setActiveObject(newImg);
    pushHistoryState();
  };

  // Magic Write: Replace Active Text
  const handleMagicWriteReplace = (newText) => {
    if (!activeObject || !fabricRef.current) return;
    activeObject.set('text', newText);
    if (activeObject.initDimensions) activeObject.initDimensions();
    activeObject.setCoords();
    fabricRef.current.requestRenderAll();
    setActiveObject({ ...activeObject });
    pushHistoryState();
  };

  // Magic Write: Insert New Text Below
  const handleMagicWriteInsertBelow = (newText) => {
    if (!fabricRef.current) return;
    const left = activeObject ? activeObject.left : canvasDimensions.width / 2;
    const top = activeObject ? activeObject.top + 60 : canvasDimensions.height / 2;
    const tb = new Textbox(newText, {
      left,
      top,
      fontSize: 22,
      fontFamily: 'Inter',
      fill: '#1e293b',
      originX: 'center',
      originY: 'center',
      width: Math.min(canvasDimensions.width * 0.75, 450)
    });
    fabricRef.current.add(tb);
    fabricRef.current.setActiveObject(tb);
    fabricRef.current.requestRenderAll();
    setActiveObject(tb);
    syncObjectsList();
    pushHistoryState();
  };

  // Magic Grab: Subject Separation
  const handleMagicGrab = async ({ subjectDataUrl, backgroundDataUrl }) => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject) return;
    const oldLeft = activeObject.left;
    const oldTop = activeObject.top;
    const oldScaleX = activeObject.scaleX;
    const oldScaleY = activeObject.scaleY;

    // 1. Add background
    const bgImg = await FabricImage.fromURL(backgroundDataUrl, { crossOrigin: 'anonymous' });
    bgImg.set({
      left: oldLeft,
      top: oldTop,
      scaleX: oldScaleX,
      scaleY: oldScaleY,
      originX: 'center',
      originY: 'center'
    });
    canvas.remove(activeObject);
    canvas.add(bgImg);

    // 2. Add isolated subject in front
    const subImg = await FabricImage.fromURL(subjectDataUrl, { crossOrigin: 'anonymous' });
    subImg.set({
      left: oldLeft + 25,
      top: oldTop - 25,
      scaleX: oldScaleX,
      scaleY: oldScaleY,
      originX: 'center',
      originY: 'center'
    });
    canvas.add(subImg);
    canvas.setActiveObject(subImg);
    canvas.requestRenderAll();
    setActiveObject(subImg);
    syncObjectsList();
    pushHistoryState();
  };

  // Grab Text: OCR to Canvas Elements
  const handleGrabText = async ({ cleanedImage, textElements }) => {
    const canvas = fabricRef.current;
    if (!canvas || !activeObject) return;
    const oldLeft = activeObject.left;
    const oldTop = activeObject.top;
    const oldScaleX = activeObject.scaleX;
    const oldScaleY = activeObject.scaleY;

    const cleanImg = await FabricImage.fromURL(cleanedImage, { crossOrigin: 'anonymous' });
    cleanImg.set({
      left: oldLeft,
      top: oldTop,
      scaleX: oldScaleX,
      scaleY: oldScaleY,
      originX: 'center',
      originY: 'center'
    });
    canvas.remove(activeObject);
    canvas.add(cleanImg);

    textElements.forEach(item => {
      const tb = new Textbox(item.text, {
        left: item.left || oldLeft,
        top: item.top || oldTop,
        fontSize: item.fontSize || 24,
        fontWeight: item.fontWeight || 'normal',
        fontFamily: 'Inter',
        fill: item.fill || '#1e293b',
        originX: 'center',
        originY: 'center'
      });
      canvas.add(tb);
    });

    canvas.requestRenderAll();
    syncObjectsList();
    pushHistoryState();
  };

  // Magic Design: Apply Generated Artboard Layout
  const handleApplyMagicDesign = async (layout) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    isHistoryLockedRef.current = true;
    canvas.clear();
    setBackgroundColor(layout.backgroundColor || '#ffffff');
    canvas.backgroundColor = layout.backgroundColor || '#ffffff';

    autoFitCanvas(canvasDimensions.width, canvasDimensions.height);

    for (const objDef of (layout.objects || [])) {
      const { type, text, ...cleanProps } = objDef;
      let fObj;
      if (type === 'rect') {
        fObj = new Rect(cleanProps);
      } else if (type === 'circle') {
        fObj = new Circle(cleanProps);
      } else if (type === 'image' && cleanProps.src) {
        try {
          fObj = await FabricImage.fromURL(cleanProps.src, { crossOrigin: 'anonymous' });
          if (fObj) {
            fObj.set(cleanProps);
            canvas.add(fObj);
            canvas.sendObjectToBack(fObj);
            continue;
          }
        } catch (e) {
          console.warn('Magic design image load error:', e);
        }
      } else if (type === 'textbox' || type === 'i-text' || type === 'text') {
        const { height: _h, ...tProps } = cleanProps;
        fObj = new Textbox(text || '', {
          ...tProps,
          selectable: true,
          editable: true,
          cursorColor: '#7D2AE8',
          splitByGrapheme: false
        });
      }
      if (fObj) canvas.add(fObj);
    }

    const primaryTextbox = canvas.getObjects().find(o => o.type === 'textbox');
    if (primaryTextbox) {
      canvas.setActiveObject(primaryTextbox);
    }

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        canvas.getObjects().forEach(obj => {
          if (obj.type === 'textbox') obj.initDimensions?.();
        });
        canvas.requestRenderAll();
      });
    }

    canvas.requestRenderAll();
    syncObjectsList();
    isHistoryLockedRef.current = false;
    pushHistoryState();
  };

  // Presentation Mode Pre-Flight
  const handleOpenPresentation = () => {
    if (!fabricRef.current) return;
    // Capture current page preview
    const preview = fabricRef.current.toDataURL({ format: 'jpeg', quality: 0.85, multiplier: 1 });
    const updated = [...pages];
    updated[activePageIndex] = {
      ...updated[activePageIndex],
      previewUrl: preview,
      backgroundColor
    };
    setPages(updated);
    setIsPresentationOpen(true);
  };

  // Export JSON file
  const handleExportJSON = () => {
    if (!fabricRef.current) return;
    const project = {
      title: projectTitle,
      width: canvasDimensions.width,
      height: canvasDimensions.height,
      backgroundColor,
      pages,
      canvasData: fabricRef.current.toDatalessJSON()
    };
    exportProjectFile(project);
  };

  // Import JSON file
  const handleImportJSON = async (file) => {
    try {
      const data = await parseImportedFile(file);
      if (data && data.canvasData) {
        handleLoadProject(data);
      }
    } catch (err) {
      alert('Error parsing project file: ' + err.message);
    }
  };

  const isMultiple = activeObject?.type === 'activeSelection';
  const isGroup = activeObject?.type === 'group';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f0f2f5] select-none text-slate-800">
      {/* 1. Header Bar */}
      <Header
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => setIsSaveModalOpen(true)}
        onNew={handleNewDesign}
        onMakeCopy={handleMakeCopy}
        onOpenResize={() => setIsResizeModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenPresent={handleOpenPresentation}
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onOpenHome={() => setIsCanvaHomeOpen(true)}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onClearCanvas={handleNewDesign}
        canvasDimensions={canvasDimensions}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        showMargins={showMargins}
        setShowMargins={setShowMargins}
        showBleed={showBleed}
        setShowBleed={setShowBleed}
      />

      {/* 2. Main Work Area (Sidebar + Drawer + Canvas Area) */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={(tab) => setActiveTab(tab)} 
        />

        <Drawer
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
          onLoadTemplate={handleLoadTemplate}
          onAddShape={handleAddShape}
          onAddLine={handleAddLine}
          onAddSticker={handleAddSticker}
          onAddText={handleAddText}
          onAddFontPairing={handleAddFontPairing}
          onAddImage={handleAddImage}
          isDrawingMode={isDrawingMode}
          setIsDrawingMode={setIsDrawingMode}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          onSetBackground={handleSetBackground}
          savedProjects={savedProjects}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteSavedProject}
          canvasObjects={canvasObjects}
          onSelectObject={(obj) => {
            if (fabricRef.current) {
              fabricRef.current.setActiveObject(obj);
              fabricRef.current.requestRenderAll();
            }
          }}
          onMoveLayer={handleMoveLayer}
          onToggleLock={handleToggleLock}
          onDeleteObject={handleDeleteObject}
          onAddCustomObject={centerObject}
          onShuffleCanvasColors={handleShuffleColors}
          onAddMockup={handleAddMockup}
          onAddSocialIcon={handleAddSocialIcon}
          onAddRetroGraphic={handleAddRetroGraphic}
          onToggleVisibility={handleToggleVisibility}
          onApplyFontPair={handleApplyFontPair}
          canvasDimensions={canvasDimensions}
          onOpenMagicDesign={() => setIsMagicDesignOpen(true)}
          onOpenMagicWrite={() => setIsMagicWriteOpen(true)}
          onOpenCreatorProfile={(creator) => setSelectedCreatorForProfile(creator)}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ContextToolbar
            canvas={fabricRef.current}
            activeObject={activeObject}
            onUpdateProp={handleUpdateProp}
            onDuplicate={handleDuplicate}
            onDelete={() => handleDeleteObject(activeObject)}
            onMoveLayer={handleMoveLayer}
            onToggleLock={() => handleToggleLock(activeObject)}
            onAlign={handleAlign}
            onOpenEditImage={() => setIsEditImageModalOpen(true)}
            onOpenMagicWrite={() => setIsMagicWriteOpen(true)}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            isMultipleSelected={isMultiple}
            isGroupSelected={isGroup}
            backgroundColor={backgroundColor}
            onSetBackground={handleSetBackground}
            onOpenNotes={() => setIsNotesOpen(prev => !prev)}
            pageDuration={pageDuration}
            setPageDuration={setPageDuration}
          />

          <CanvasStage
            canvasRef={canvasElRef}
            containerRef={containerRef}
            dimensions={canvasDimensions}
            zoom={zoom}
            setZoom={setZoom}
            backgroundColor={backgroundColor}
            pages={pages}
            activePageIndex={activePageIndex}
            onSelectPage={handleSelectPage}
            onAddPage={handleAddPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
            onLockPage={handleLockPage}
            isPageLocked={isPageLocked}
            showRulers={showRulers}
            showMargins={showMargins}
            showBleed={showBleed}
            onOpenNotes={() => setIsNotesOpen(prev => !prev)}
            onOpenGridView={() => setIsGridViewOpen(true)}
            onOpenPresent={handleOpenPresentation}
            pageDuration={pageDuration}
            onUpdatePageTitle={handleUpdatePageTitle}
          />

          <NotesDrawer
            isOpen={isNotesOpen}
            onClose={() => setIsNotesOpen(false)}
            pageIndex={activePageIndex}
            pageNotes={pages[activePageIndex]?.notes || ''}
            onUpdateNotes={handleUpdatePageNotes}
          />
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        canvas={fabricRef.current}
        canvasWidth={canvasDimensions.width}
        canvasHeight={canvasDimensions.height}
        projectTitle={projectTitle}
        pages={pages}
        activePageIndex={activePageIndex}
      />

      <ResizeModal
        isOpen={isResizeModalOpen}
        onClose={() => setIsResizeModalOpen(false)}
        currentWidth={canvasDimensions.width}
        currentHeight={canvasDimensions.height}
        onApplyResize={handleApplyResize}
        onCopyAndResize={handleCopyAndResize}
        canvas={fabricRef.current}
      />

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentTitle={projectTitle}
        onSaveConfirm={(title) => handleSaveProject(title)}
      />

      <EditImageModal
        isOpen={isEditImageModalOpen}
        onClose={() => setIsEditImageModalOpen(false)}
        activeImageObj={activeObject}
        onApplyImageChanges={handleApplyImageChanges}
        onMagicGrab={handleMagicGrab}
        onGrabText={handleGrabText}
      />

      <MagicWriteModal
        isOpen={isMagicWriteOpen}
        onClose={() => setIsMagicWriteOpen(false)}
        activeObject={activeObject}
        onReplaceText={handleMagicWriteReplace}
        onInsertNewText={handleMagicWriteInsertBelow}
      />

      <MagicDesignModal
        isOpen={isMagicDesignOpen}
        onClose={() => setIsMagicDesignOpen(false)}
        canvasDimensions={canvasDimensions}
        onApplyLayout={handleApplyMagicDesign}
      />

      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        pages={pages}
      />

      <GridViewModal
        isOpen={isGridViewOpen}
        onClose={() => setIsGridViewOpen(false)}
        pages={pages}
        activePageIndex={activePageIndex}
        onSelectPage={handleSelectPage}
        onAddPage={handleAddPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={handleDeletePage}
        onMovePage={handleMovePage}
      />

      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        historySnapshots={historySnapshots}
        currentIndex={historyIndexRef.current}
        onRestoreSnapshot={handleRestoreSnapshot}
      />

      {/* Creativa Main Home Screen & Dashboard */}
      <CreativaHomeModal
        isOpen={isCanvaHomeOpen}
        onClose={() => setIsCanvaHomeOpen(false)}
        onLoadTemplate={(template) => {
          handleLoadTemplate(template);
          setIsCanvaHomeOpen(false);
        }}
        onNewCustomDesign={() => {
          setIsCanvaHomeOpen(false);
          setIsResizeModalOpen(true);
        }}
        savedProjects={savedProjects}
        onLoadProject={(proj) => {
          handleLoadProject(proj);
          setIsCanvaHomeOpen(false);
        }}
        onDeleteProject={handleDeleteSavedProject}
        onOpenMagicDesign={() => {
          setIsCanvaHomeOpen(false);
          setIsMagicDesignOpen(true);
        }}
        onOpenMagicWrite={() => {
          setIsCanvaHomeOpen(false);
          setIsMagicWriteOpen(true);
        }}
        onApplyMagicDesign={(layout) => {
          handleApplyMagicDesign(layout);
          setIsCanvaHomeOpen(false);
        }}
        onApplyAiImage={(imgUrl) => {
          handleAddImage(imgUrl);
          setIsCanvaHomeOpen(false);
        }}
        canvasDimensions={canvasDimensions}
        onOpenCreatorProfile={(creator) => {
          setSelectedCreatorForProfile(creator);
        }}
      />

      {/* Official Creator Full Profile View */}
      <CreatorProfileModal
        isOpen={!!selectedCreatorForProfile}
        onClose={() => setSelectedCreatorForProfile(null)}
        creator={selectedCreatorForProfile}
        onLoadTemplate={(template) => {
          handleLoadTemplate(template);
          setSelectedCreatorForProfile(null);
          setIsCanvaHomeOpen(false);
        }}
        allCreators={getAllCreators()}
        onSelectCreator={(c) => setSelectedCreatorForProfile(c)}
      />
    </div>
  );
}
