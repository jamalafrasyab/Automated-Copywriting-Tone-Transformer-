import React, { useState } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3, 
  RefreshCw, 
  Download,
  Share2,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Heart,
  Mail,
  Zap,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { PlatformId, ToneId, PydanticCopyResponse, PresetBrief } from '../types';
import { PLATFORMS, TONES, PRESET_BRIEFS } from '../data/presets';
import { PromptGatekeeperModal } from './PromptGatekeeperModal';

interface StudioViewProps {
  onSendToSweep?: (brief: { productName: string; description: string; tone: ToneId }) => void;
  presetBrief?: PresetBrief | null;
}

export const StudioView: React.FC<StudioViewProps> = ({ onSendToSweep, presetBrief }) => {
  // Form state
  const [productName, setProductName] = useState(
    presetBrief?.productName || 'StrataMesh CarbonZero Running Shoe'
  );
  const [description, setDescription] = useState(
    presetBrief?.description ||
      'An ultra-lightweight running shoe crafted from 100% recycled oceanic plastics, featuring supercritical nitrogen-infused foam midsole for 82% energy return. Weighs only 185 grams, carbon-neutral certified.'
  );
  const [targetAudience, setTargetAudience] = useState(
    presetBrief?.targetAudience || 'Marathon runners, urban joggers, eco-conscious athletic buyers'
  );
  const [platform, setPlatform] = useState<PlatformId>(presetBrief?.platform || 'twitter');
  const [tone, setTone] = useState<ToneId>(presetBrief?.tone || 'witty');
  const [temperature, setTemperature] = useState<number>(presetBrief?.temperature || 0.85);
  const [topP, setTopP] = useState<number>(presetBrief?.topP || 0.95);
  const [maxOutputTokens, setMaxOutputTokens] = useState<number>(800);
  const [customConstraints, setCustomConstraints] = useState('');

  // Generation & Results state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<PydanticCopyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [previewTab, setPreviewTab] = useState<'copy' | 'social_mock' | 'schema'>('copy');

  // Handle Preset selection
  const handleSelectPreset = (preset: PresetBrief) => {
    setProductName(preset.productName);
    setDescription(preset.description);
    setTargetAudience(preset.targetAudience);
    setPlatform(preset.platform);
    setTone(preset.tone);
    setTemperature(preset.temperature);
    setTopP(preset.topP);
    setResult(null);
  };

  // React to presetBrief prop change if passed from parent
  React.useEffect(() => {
    if (presetBrief) {
      handleSelectPreset(presetBrief);
    }
  }, [presetBrief]);

  // Tone quick change auto-calibrates recommended temperature
  const handleToneChange = (newTone: ToneId) => {
    setTone(newTone);
    const toneConfig = TONES.find(t => t.id === newTone);
    if (toneConfig) {
      setTemperature(toneConfig.recommendedTemp);
    }
  };

  // Run Transformation
  const handleTransform = async () => {
    if (!productName.trim() || !description.trim()) {
      setError('Please provide a product name and description.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          description,
          targetAudience,
          platform,
          tone,
          temperature,
          topP,
          maxOutputTokens,
          customConstraints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transform copy');
      }

      const data: PydanticCopyResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during inference.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyFullCopy = () => {
    if (!result) return;
    const fullText = `${result.headline}\n\n${result.hook}\n\n${result.body}\n\n${result.callToAction}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!result) return;
    const mdContent = `# ${result.headline}
*Target Platform: ${platform.toUpperCase()}* | *Tone: ${tone.toUpperCase()}* | *Character Count: ${result.characterCount}*

> **Opening Hook:**
> ${result.hook}

## Copy Body
${result.body}

**Call to Action:** ${result.callToAction}

**Hashtags:** ${result.hashtags.join(' ')}

---
### Programmatic Tone Audit
- Dominant Tone: ${result.toneAudit.dominantTone}
- Wittiness Score: ${result.toneAudit.wittinessScore}/100
- Professionalism Score: ${result.toneAudit.professionalismScore}/100
- Persuasion Score: ${result.toneAudit.persuasionScore}/100
- Platform Compliance Score: ${result.toneAudit.platformComplianceScore}/100
- Compliance Notes: ${result.toneAudit.complianceNotes}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/\s+/g, '_')}_${platform}_copy.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const selectedPlatformConfig = PLATFORMS.find(p => p.id === platform);
  const selectedToneConfig = TONES.find(t => t.id === tone);

  // Character limit calculations for Twitter
  const isTwitter = platform === 'twitter';
  const charLimit = 280;
  const currentChars = result?.characterCount || 0;
  const charRatio = isTwitter ? Math.min(100, (currentChars / charLimit) * 100) : 100;
  const isOverTwitterLimit = isTwitter && currentChars > charLimit;

  return (
    <div className="space-y-6">
      {/* Quick Start Presets Hero Strip */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORCHESTRATION WORKBENCH</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
              Automated Copywriting & Tone Transformer Studio
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowInspector(true)}
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect Hidden Gatekeeper Prompt</span>
          </button>
        </div>

        {/* 1-Click Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            Quick Test Briefs:
          </span>
          {PRESET_BRIEFS.map(preset => {
            const isActive = productName === preset.productName;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{preset.title.split(':')[1]?.trim() || preset.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">({preset.platform})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid: Left Ingestion & Parameters (7 Cols), Right Output (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Ingestion & Inference Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Ingestion Layer Variables */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  1. Input Ingestion Layer
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">
                User facts isolated from model prompt
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. StrataMesh CarbonZero Running Shoe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Raw Description & Features <span className="text-slate-400 font-normal">(Facts, specs, metrics)</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Raw feature specs, technical numbers, materials, outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  placeholder="e.g. Marathon runners, urban joggers, eco-conscious athletic buyers"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Platform Target Selection */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  2. Platform Gatekeeper Target
                </h2>
              </div>
              <span className="text-[11px] text-cyan-400 font-medium">
                Active: {selectedPlatformConfig?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => {
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/80 ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300 font-semibold mb-1">
                      {p.badge}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: Tone & The Parameter Tuning Spectrum (Slide 7) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  3. Tone & Inference Parameter Spectrum
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Slide 7 Blueprint
              </span>
            </div>

            {/* Tone Selector Pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Brand Tone Profile <span className="text-slate-400 font-normal">(Auto-calibrates creative temperature)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TONES.map(t => {
                  const isSelected = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToneChange(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500/60 text-amber-200 ring-1 ring-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{t.name}</div>
                      <div className="text-[10px] font-mono mt-0.5 text-slate-400">
                        Temp: ~{t.recommendedTemp}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Hyper-Parameters (Slide 7) */}
            <div className="pt-2 border-t border-slate-800/80 space-y-4">
              {/* Temperature Slider with visual color zones */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Inference Temperature: <span className="font-mono text-cyan-400 font-bold">{temperature.toFixed(2)}</span>
                  </span>
                  <span className="text-[11px] font-medium text-amber-300">
                    {temperature <= 0.35
                      ? 'Consistent & Factual (Slide 7: Emails/Specs)'
                      : temperature >= 0.8
                      ? 'High Variance & Witty (Slide 7: Social hooks)'
                      : 'Balanced Commercial Persuasion'}
                  </span>
                </div>

                <div className="relative pt-1">
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.05"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>0.0 (Factual)</span>
                    <span className="text-cyan-400">0.2 (Email/Spec)</span>
                    <span className="text-slate-300">0.7 (Standard)</span>
                    <span className="text-amber-400 font-bold">0.8+ (Witty Social)</span>
                    <span>1.5 (Max)</span>
                  </div>
                </div>
              </div>

              {/* Top_P & Max Tokens row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">
                      Top_P Nucleus: <span className="font-mono text-cyan-400">{topP.toFixed(2)}</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={topP}
                    onChange={e => setTopP(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">
                      Token Budget: <span className="font-mono text-cyan-400">{maxOutputTokens}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Buffer Safe</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="2048"
                    step="50"
                    value={maxOutputTokens}
                    onChange={e => setMaxOutputTokens(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleTransform}
                disabled={isGenerating}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing Inference & Pydantic Validation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Transform Copy ({platform.toUpperCase()} • {tone.toUpperCase()})</span>
                  </>
                )}
              </button>

              {onSendToSweep && (
                <button
                  type="button"
                  onClick={() => onSendToSweep({ productName, description, tone })}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
                >
                  <Repeat2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sweep 4 Platforms</span>
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output Layer & Pydantic Validation Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full min-h-[620px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  4. Output & Validation QA
                </h2>
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setPreviewTab('copy')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    previewTab === 'copy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Structured
                </button>
                <button
                  onClick={() => setPreviewTab('social_mock')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    previewTab === 'social_mock' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Feed Mock
                </button>
                <button
                  onClick={() => setPreviewTab('schema')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    previewTab === 'schema' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Schema
                </button>
              </div>
            </div>

            {/* Result Content */}
            {result ? (
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Character Limit Gauge for Twitter or Platform bounds */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Length Compliance Gate:
                    </span>
                    <span className="font-mono text-xs font-bold">
                      {isTwitter ? (
                        <span className={isOverTwitterLimit ? 'text-rose-400' : 'text-emerald-400'}>
                          {currentChars} / {charLimit} chars
                        </span>
                      ) : (
                        <span className="text-cyan-400">
                          {currentChars} chars • {result.estimatedWordCount} words
                        </span>
                      )}
                    </span>
                  </div>

                  {isTwitter && (
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOverTwitterLimit ? 'bg-rose-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${charRatio}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {result.toneAudit.characterLimitPassed ? 'Passed Platform Bounds' : 'Length Warning'}
                    </span>
                    <span className="font-mono">{result.latencyMs}ms latency</span>
                  </div>
                </div>

                {/* Tab 1: Structured Copy */}
                {previewTab === 'copy' && (
                  <div className="space-y-3 flex-1 flex flex-col">
                    {/* Headline */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-0.5">
                        Headline / Subject Line
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                        {result.headline}
                      </h3>
                    </div>

                    {/* Hook */}
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block mb-0.5">
                        Opening Hook (Thumb-Stopper)
                      </span>
                      <p className="text-xs font-medium text-cyan-100 italic leading-relaxed">
                        "{result.hook}"
                      </p>
                    </div>

                    {/* Body */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex-1 overflow-y-auto max-h-52">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                        Persuasive Body Content
                      </span>
                      <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {result.body}
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                          Call To Action (CTA)
                        </span>
                        <span className="text-xs font-bold text-white">
                          {result.callToAction}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={copyFullCopy}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={downloadMarkdown}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                          <span>MD</span>
                        </button>
                      </div>
                    </div>

                    {/* Hashtags */}
                    {result.hashtags && result.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {result.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Realistic Feed Mockup */}
                {previewTab === 'social_mock' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex-1 flex flex-col justify-center">
                    {platform === 'twitter' && (
                      <div className="p-4 rounded-xl bg-black border border-slate-800 text-white space-y-3 font-sans">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-xs text-black">
                            DL
                          </div>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1">
                              DecodeLabs AI <span className="text-cyan-400">✓</span> <span className="text-slate-500 font-normal">@decodelabs_ai</span>
                            </div>
                            <div className="text-[10px] text-slate-500">Official Brand Channel</div>
                          </div>
                        </div>
                        <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap">
                          <p className="font-semibold text-slate-100">{result.hook}</p>
                          <p className="text-slate-300">{result.body}</p>
                          <p className="text-cyan-400 font-bold">{result.callToAction}</p>
                          <p className="text-cyan-400 text-[11px]">{result.hashtags.join(' ')}</p>
                        </div>
                        <div className="flex justify-between text-slate-500 text-xs pt-2 border-t border-slate-900">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 24</span>
                          <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" /> 68</span>
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 312</span>
                          <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /></span>
                        </div>
                      </div>
                    )}

                    {platform === 'linkedin' && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-white space-y-3 font-sans">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                            DL
                          </div>
                          <div>
                            <div className="text-xs font-bold">DecodeLabs Engineering Group</div>
                            <div className="text-[10px] text-slate-400">142,000 followers • 2h</div>
                          </div>
                        </div>
                        <div className="text-xs leading-relaxed space-y-2 whitespace-pre-wrap text-slate-200">
                          <p className="font-bold text-white text-sm">{result.headline}</p>
                          <p className="font-medium text-cyan-200">{result.hook}</p>
                          <div className="text-slate-300">{result.body}</div>
                          <p className="font-bold text-cyan-400">{result.callToAction}</p>
                          <p className="text-blue-400 text-[11px]">{result.hashtags.join(' ')}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-slate-400 text-xs pt-2 border-t border-slate-800">
                          <span className="flex items-center gap-1 hover:text-white cursor-pointer"><ThumbsUp className="w-3.5 h-3.5" /> Like</span>
                          <span className="flex items-center gap-1 hover:text-white cursor-pointer"><MessageSquare className="w-3.5 h-3.5" /> Comment</span>
                          <span className="flex items-center gap-1 hover:text-white cursor-pointer"><Repeat2 className="w-3.5 h-3.5" /> Repost</span>
                        </div>
                      </div>
                    )}

                    {platform === 'email' && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-white space-y-3 font-sans">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-[11px] text-slate-400"><strong className="text-slate-300">Subject:</strong> {result.headline}</div>
                          <div className="text-[10px] text-slate-500"><strong className="text-slate-400">Preview:</strong> {result.hook}</div>
                        </div>
                        <div className="text-xs text-slate-200 space-y-3 whitespace-pre-wrap leading-relaxed">
                          <p className="font-medium text-cyan-200">{result.hook}</p>
                          <div>{result.body}</div>
                          <div className="pt-2">
                            <span className="inline-block px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs">
                              {result.callToAction}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {platform !== 'twitter' && platform !== 'linkedin' && platform !== 'email' && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="font-bold text-white text-sm">{result.headline}</div>
                        <div className="text-xs text-slate-300 whitespace-pre-wrap">{result.body}</div>
                        <div className="text-xs font-bold text-cyan-400">{result.callToAction}</div>
                        <div className="text-[11px] text-slate-400">{result.hashtags.join(' ')}</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Schema JSON */}
                {previewTab === 'schema' && (
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto flex-1 max-h-96 leading-relaxed">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}

                {/* Programmatic Tone Audit Radar */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-mono">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                      Tone Audit Evaluation
                    </span>
                    <span className="text-[11px] text-cyan-400">Dominant: {result.toneAudit.dominantTone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                        <span>Wittiness</span>
                        <span className="font-mono text-white font-bold">{result.toneAudit.wittinessScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all"
                          style={{ width: `${result.toneAudit.wittinessScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                        <span>Professionalism</span>
                        <span className="font-mono text-white font-bold">{result.toneAudit.professionalismScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-400 h-full rounded-full transition-all"
                          style={{ width: `${result.toneAudit.professionalismScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                        <span>Persuasion</span>
                        <span className="font-mono text-white font-bold">{result.toneAudit.persuasionScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all"
                          style={{ width: `${result.toneAudit.persuasionScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                        <span>Platform Rule</span>
                        <span className="font-mono text-white font-bold">{result.toneAudit.platformComplianceScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all"
                          style={{ width: `${result.toneAudit.platformComplianceScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                <Sparkles className="w-10 h-10 text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-slate-300">Ready to Transform</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Select your platform target and tone profile, then click Transform Copy to run dynamic f-string compilation and inference.
                </p>
                <div className="mt-4 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono text-left">
                  $ python run.py --product "{productName.slice(0, 20)}..." --platform {platform} --tone {tone}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inspector Modal */}
      <PromptGatekeeperModal
        isOpen={showInspector}
        onClose={() => setShowInspector(false)}
        productName={productName}
        description={description}
        targetAudience={targetAudience}
        platform={platform}
        tone={tone}
        customConstraints={customConstraints}
      />
    </div>
  );
};
