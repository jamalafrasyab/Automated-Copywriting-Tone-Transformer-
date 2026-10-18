import React from 'react';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  Workflow, 
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { PresetBrief } from '../types';
import { PRESET_BRIEFS } from '../data/presets';

interface HeaderProps {
  activeTab: 'studio' | 'sweep' | 'batch' | 'blueprint' | 'code';
  setActiveTab: (tab: 'studio' | 'sweep' | 'batch' | 'blueprint' | 'code') => void;
  statusOnline: boolean;
  onSelectPreset?: (preset: PresetBrief) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  statusOnline,
  onSelectPreset 
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = React.useState(false);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/30">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  DecodeLabs <span className="text-cyan-400 font-semibold">CopyTransformer</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Batch: 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Project 2 • Dynamic String Orchestration & Tone Engine
              </p>
            </div>
          </div>

          {/* Nav Controls Segmented Bar */}
          <nav className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'studio'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Orchestrator</span>
            </button>

            <button
              onClick={() => setActiveTab('sweep')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'sweep'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Async Sweep</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'batch'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Resilience Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'blueprint'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Python & CLI</span>
            </button>
          </nav>

          {/* Quick Presets Dropdown & Engine Status */}
          <div className="flex items-center space-x-2 shrink-0">
            {onSelectPreset && (
              <div className="relative">
                <button
                  onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                  className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Brief Presets</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {showPresetsMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800 mb-1">
                      Industrial Benchmark Briefs
                    </div>
                    {PRESET_BRIEFS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onSelectPreset(preset);
                          setShowPresetsMenu(false);
                          setActiveTab('studio');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex flex-col"
                      >
                        <span className="font-semibold truncate">{preset.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {preset.platform} • {preset.tone}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className={`w-2 h-2 rounded-full ${statusOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-[11px] font-medium hidden sm:inline">gemini-3.8-flash</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
