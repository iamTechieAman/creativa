import React from 'react';
import { 
  AlignLeft, AlignCenter, AlignRight, AlignStartVertical, 
  AlignVerticalSpaceAround, AlignEndVertical, ArrowUp, ArrowDown, 
  ChevronsUp, ChevronsDown, X
} from 'lucide-react';

export default function PositionPanel({
  isOpen,
  onClose,
  activeObject,
  onUpdateProp,
  onMoveLayer,
  onAlign
}) {
  if (!isOpen || !activeObject) return null;

  return (
    <div className="absolute top-12 right-6 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-40 select-none text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h4 className="font-bold text-slate-900 text-xs">Position & Alignment</h4>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={15} />
        </button>
      </div>

      <div className="py-3 space-y-4">
        {/* Layer Arrange */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Arrange Order
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onMoveLayer('front')}
              className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
            >
              <ChevronsUp size={14} className="text-purple-600" />
              <span>To Front</span>
            </button>
            <button
              onClick={() => onMoveLayer('back')}
              className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
            >
              <ChevronsDown size={14} className="text-purple-600" />
              <span>To Back</span>
            </button>
            <button
              onClick={() => onMoveLayer('forward')}
              className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
            >
              <ArrowUp size={14} className="text-purple-600" />
              <span>Forward</span>
            </button>
            <button
              onClick={() => onMoveLayer('backward')}
              className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium"
            >
              <ArrowDown size={14} className="text-purple-600" />
              <span>Backward</span>
            </button>
          </div>
        </div>

        {/* Align to Page */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Align to Artboard
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onAlign('left')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignLeft size={15} className="mb-1 text-slate-600" />
              <span>Left</span>
            </button>
            <button
              onClick={() => onAlign('center')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignCenter size={15} className="mb-1 text-slate-600" />
              <span>Center</span>
            </button>
            <button
              onClick={() => onAlign('right')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignRight size={15} className="mb-1 text-slate-600" />
              <span>Right</span>
            </button>
            <button
              onClick={() => onAlign('top')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignStartVertical size={15} className="mb-1 text-slate-600" />
              <span>Top</span>
            </button>
            <button
              onClick={() => onAlign('middle')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignVerticalSpaceAround size={15} className="mb-1 text-slate-600" />
              <span>Middle</span>
            </button>
            <button
              onClick={() => onAlign('bottom')}
              className="flex flex-col items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium text-center"
            >
              <AlignEndVertical size={15} className="mb-1 text-slate-600" />
              <span>Bottom</span>
            </button>
          </div>
        </div>

        {/* Coordinates & Dimensions */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Exact Dimensions
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Width</span>
              <input
                type="number"
                value={Math.round((activeObject.width || 100) * (activeObject.scaleX || 1))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const scale = val / (activeObject.width || 100);
                  onUpdateProp('scaleX', scale);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Height</span>
              <input
                type="number"
                value={Math.round((activeObject.height || 100) * (activeObject.scaleY || 1))}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const scale = val / (activeObject.height || 100);
                  onUpdateProp('scaleY', scale);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">X Position</span>
              <input
                type="number"
                value={Math.round(activeObject.left || 0)}
                onChange={(e) => onUpdateProp('left', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-0.5">Y Position</span>
              <input
                type="number"
                value={Math.round(activeObject.top || 0)}
                onChange={(e) => onUpdateProp('top', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 block mb-0.5">Rotation (Degrees)</span>
              <input
                type="number"
                min="0"
                max="360"
                value={Math.round(activeObject.angle || 0)}
                onChange={(e) => onUpdateProp('angle', Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
