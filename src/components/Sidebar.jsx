import React from 'react';
import { 
  LayoutTemplate, Shapes, Type, UploadCloud, 
  Paintbrush, Palette, Layers, FolderHeart, 
  BarChart3, QrCode, Sparkles, Wand2, LayoutGrid, Image as ImageIcon, Users 
} from 'lucide-react';

export const SIDEBAR_TABS = [
  { id: 'templates', label: 'Design', icon: LayoutTemplate },
  { id: 'magic', label: 'Magic Studio', icon: Wand2, isAi: true },
  { id: 'elements', label: 'Elements', icon: Shapes },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'brand', label: 'Brand Kit', icon: Sparkles },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'creators', label: 'Creators', icon: Users },
  { id: 'apps', label: 'Apps', icon: LayoutGrid },
  { id: 'uploads', label: 'Uploads', icon: UploadCloud },
  { id: 'draw', label: 'Draw', icon: Paintbrush },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'qrcode', label: 'QR Code', icon: QrCode },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'projects', label: 'Projects', icon: FolderHeart }
];

export default function Sidebar({ activeTab, onSelectTab }) {
  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex w-[72px] bg-white border-r border-slate-200 flex-col items-center py-2 z-30 select-none shrink-0 h-full overflow-y-auto shadow-xs">
        <div className="flex flex-col space-y-1 w-full px-1.5">
          {SIDEBAR_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isAi = tab.isAi;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(isActive ? null : tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl w-full text-[10px] font-medium transition-all group relative ${
                  isActive 
                    ? isAi ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-bold shadow-xs border border-purple-300' : 'bg-purple-50 text-purple-700 font-bold shadow-xs' 
                    : isAi ? 'text-purple-700 hover:bg-purple-50 hover:text-purple-900' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'
                }`}
                title={tab.label}
              >
                <div className={`p-1 rounded-lg transition-transform group-hover:scale-110 ${
                  isActive 
                    ? isAi ? 'text-purple-700' : 'text-purple-700' 
                    : isAi ? 'text-purple-600' : 'text-slate-500 group-hover:text-purple-600'
                }`}>
                  <Icon size={19} className={isAi ? 'stroke-[2.2]' : ''} />
                </div>
                <span className="mt-0.5 leading-tight tracking-tight text-center truncate max-w-full">
                  {tab.label}
                </span>
                {isAi && (
                  <span className="text-[7.5px] px-1 py-0.2 rounded-full font-black bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white mt-0.5 shadow-2xs uppercase">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile & Tablet Bottom Toolbar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 items-center px-2 space-x-1 overflow-x-auto scrollbar-none shadow-lg touch-pan-x">
        {SIDEBAR_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isAi = tab.isAi;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(isActive ? null : tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[9px] font-medium shrink-0 transition-all ${
                isActive 
                  ? isAi ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-bold shadow-xs border border-purple-300' : 'bg-purple-100 text-purple-700 font-bold shadow-xs' 
                  : isAi ? 'text-purple-700 hover:text-purple-900' : 'text-slate-600 hover:text-purple-700 active:bg-slate-100'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-purple-700' : isAi ? 'text-purple-600' : 'text-slate-500'} />
              <span className="mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
