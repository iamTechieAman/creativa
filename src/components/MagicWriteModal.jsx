import React, { useState } from 'react';
import { 
  X, Sparkles, Wand2, RefreshCw, Check, Copy, ArrowDownRight, 
  ChevronRight, AlignLeft, Send 
} from 'lucide-react';
import { 
  MAGIC_WRITE_ACTIONS, TONE_PRESETS, executeMagicWrite 
} from '../utils/aiEngines';

export default function MagicWriteModal({
  isOpen,
  onClose,
  activeObject,
  onReplaceText,
  onInsertNewText
}) {
  const [selectedAction, setSelectedAction] = useState('rewrite');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const originalText = activeObject?.text || '';

  const handleGenerate = async (actionToRun = selectedAction, toneToRun = selectedTone) => {
    setIsGenerating(true);
    setCopied(false);
    try {
      const result = await executeMagicWrite(actionToRun, originalText, {
        tone: toneToRun,
        customPrompt
      });
      setGeneratedText(result);
    } catch (e) {
      console.error(e);
      setGeneratedText('Could not generate text. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReplace = () => {
    if (!generatedText) return;
    onReplaceText(generatedText);
    onClose();
  };

  const handleApplyInsertBelow = () => {
    if (!generatedText) return;
    onInsertNewText(generatedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl canva-gradient flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">Creativa Magic Write™</h3>
              </div>
              <p className="text-[11px] text-slate-500">AI-powered copywriting, brainstorming & content refinement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Current Text Pill */}
          {originalText && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Selected Canvas Text
              </span>
              <p className="text-slate-800 italic line-clamp-2 text-xs">
                "{originalText}"
              </p>
            </div>
          )}

          {/* Quick AI Transformation Actions */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Transform With 1-Click
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MAGIC_WRITE_ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => {
                    setSelectedAction(action.id);
                    setCustomPrompt('');
                    handleGenerate(action.id, selectedTone);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedAction === action.id && !customPrompt
                      ? 'border-purple-600 bg-purple-50/70 shadow-xs ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-purple-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-slate-900 text-xs flex items-center space-x-1">
                    <Wand2 size={12} className="text-purple-600 shrink-0" />
                    <span>{action.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">{action.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Change Tone */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Change Tone
            </span>
            <div className="flex flex-wrap gap-1.5">
              {TONE_PRESETS.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => {
                    setSelectedTone(tone.id);
                    handleGenerate(selectedAction, tone.id);
                  }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    selectedTone === tone.id
                      ? 'border-purple-600 bg-purple-600 text-white shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span>{tone.icon}</span>
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt Input */}
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Or Ask Magic Write Anything
            </span>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Write 5 catchy bullet points for a coffee shop discount..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
                className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || (!customPrompt && !originalText)}
                className="canva-btn-primary px-4 py-2 rounded-xl font-bold flex items-center space-x-1 shadow-md text-xs"
              >
                {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                <span>Generate</span>
              </button>
            </div>
          </div>

          {/* Generated Result Output */}
          {generatedText && (
            <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                <span className="font-bold text-purple-900 flex items-center space-x-1">
                  <Sparkles size={13} className="text-purple-600" />
                  <span>Magic Write Result</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="text-purple-700 hover:text-purple-900 font-semibold text-[11px] flex items-center space-x-1 bg-white px-2 py-0.5 rounded-md border border-purple-200 shadow-xs"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {generatedText}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-purple-100">
                {activeObject && (
                  <button
                    onClick={handleApplyReplace}
                    className="canva-btn-primary flex-1 py-2 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Check size={13} />
                    <span>Replace Canvas Text</span>
                  </button>
                )}
                <button
                  onClick={handleApplyInsertBelow}
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-50 text-purple-700 border border-purple-300 font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                >
                  <ArrowDownRight size={13} />
                  <span>Insert As New Text</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Powered by Creativa Magic Studio AI</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
