import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudioView } from './components/StudioView';
import { ConcurrencySweepView } from './components/ConcurrencySweepView';
import { ResilienceBatchLab } from './components/ResilienceBatchLab';
import { BlueprintManualView } from './components/BlueprintManualView';
import { PythonSuiteView } from './components/PythonSuiteView';
import { ToneId, PresetBrief } from './types';
import { Phone, Mail, Globe, MapPin, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'sweep' | 'batch' | 'blueprint' | 'code'>('studio');
  const [statusOnline, setStatusOnline] = useState(true);
  const [activePreset, setActivePreset] = useState<PresetBrief | null>(null);
  const [sweepBrief, setSweepBrief] = useState<{ productName: string; description: string; tone: ToneId } | undefined>();

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setStatusOnline(true))
      .catch(() => setStatusOnline(false));
  }, []);

  const handleSendToSweep = (brief: { productName: string; description: string; tone: ToneId }) => {
    setSweepBrief(brief);
    setActiveTab('sweep');
  };

  const handleSelectPresetFromHeader = (preset: PresetBrief) => {
    setActivePreset(preset);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-blueprint-grid selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        statusOnline={statusOnline}
        onSelectPreset={handleSelectPresetFromHeader}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
          <StudioView
            onSendToSweep={handleSendToSweep}
            presetBrief={activePreset}
          />
        )}
        {activeTab === 'sweep' && <ConcurrencySweepView initialBrief={sweepBrief} />}
        {activeTab === 'batch' && <ResilienceBatchLab />}
        {activeTab === 'blueprint' && <BlueprintManualView />}
        {activeTab === 'code' && <PythonSuiteView />}
      </main>

      {/* Footer referencing DecodeLabs Slide 18 */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-400">
              DecodeLabs Industrial Training Kit • Batch: 2026 • Generative AI Project 2
            </span>
          </div>

          {/* Slide 18 contact details */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              www.decodelabs.tech
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              decodelabs.tech@gmail.com
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              +91 9236011887
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              Greater Lucknow, India
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
