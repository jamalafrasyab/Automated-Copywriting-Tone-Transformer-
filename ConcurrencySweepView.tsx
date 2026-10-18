import React, { useState } from 'react';
import { 
  Workflow, 
  Clock, 
  Zap, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PydanticCopyResponse, ToneId, PlatformId } from '../types';
import { PRESET_BRIEFS, TONES } from '../data/presets';

interface SweepResultItem extends Omit<PydanticCopyResponse, 'platform'> {
  platform: PlatformId;
  latencyMs: number;
}

interface SweepResponse {
  results: SweepResultItem[];
  totalWallClockMs: number;
  sequentialSumMs: number;
  timeSavedMs: number;
  speedupFactor: string;
}

interface ConcurrencySweepViewProps {
  initialBrief?: { productName: string; description: string; tone: ToneId };
}

export const ConcurrencySweepView: React.FC<ConcurrencySweepViewProps> = ({ initialBrief }) => {
  const [productName, setProductName] = useState(
    initialBrief?.productName || 'StrataMesh CarbonZero Running Shoe'
  );
  const [description, setDescription] = useState(
    initialBrief?.description ||
      'An ultra-lightweight running shoe crafted from 100% recycled oceanic plastics, featuring supercritical nitrogen-infused foam midsole for 82% energy return. Weighs only 185 grams, carbon-neutral certified.'
  );
  const [tone, setTone] = useState<ToneId>(initialBrief?.tone || 'witty');
  const [temperature, setTemperature] = useState<number>(0.8);
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepData, setSweepData] = useState<SweepResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const runSweep = async () => {
    setIsSweeping(true);
    setError(null);

    try {
      const response = await fetch('/api/concurrent-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          description,
          platforms: ['linkedin', 'twitter', 'instagram', 'email'],
          tone,
          temperature,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Concurrent sweep failed');
      }

      const data: SweepResponse = await response.json();
      setSweepData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Execution error during concurrent sweep');
    } finally {
      setIsSweeping(false);
    }
  };

  const copyPlatformCopy = (item: SweepResultItem, idx: number) => {
    const text = `${item.headline}\n\n${item.hook}\n\n${item.body}\n\n${item.callToAction}\n\n${item.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Slide 8 & 10 Concept Banner */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 font-mono mb-0.5">
              <Workflow className="w-3.5 h-3.5" />
              <span>CONCURRENCY ENGINE • ASYNCIO.GATHER</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Multi-Platform Concurrent Transformation Sweep
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Dispatches parallel network requests to simultaneously transform your copy for LinkedIn, Twitter, Instagram, and Email. Drastically reduces wall-clock time by overlapping network waiting.
            </p>
          </div>

          <button
            onClick={runSweep}
            disabled={isSweeping}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isSweeping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Dispatching 4 Parallel Coroutines...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Run 4-Platform Sweep</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sweep Configuration Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Target Product</label>
          <input
            type="text"
            value={productName}
            onChange={e => setProductName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Tone Modifier</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value as ToneId)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
          >
            {TONES.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">
            Temperature: <span className="text-cyan-400 font-mono font-bold">{temperature.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1.2"
            step="0.05"
            value={temperature}
            onChange={e => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div className="flex items-end justify-end">
          <button
            onClick={() => {
              const rand = PRESET_BRIEFS[Math.floor(Math.random() * PRESET_BRIEFS.length)];
              setProductName(rand.productName);
              setDescription(rand.description);
              setTone(rand.tone);
            }}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-center cursor-pointer"
          >
            Load Random Brief
          </button>
        </div>
      </div>

      {/* Latency Comparison Card (Slide 8 Scaling Dilemma) */}
      {sweepData && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Slide 8 Scaling Dilemma Benchmark: Overlapping I/O Telemetry
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {sweepData.speedupFactor} Parallel Speedup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Total Wall-Clock Time</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {(sweepData.totalWallClockMs / 1000).toFixed(2)}s
              </div>
              <span className="text-[10px] text-slate-500">True elapsed parallel duration</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Sequential Sum (If Sync)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                {(sweepData.sequentialSumMs / 1000).toFixed(2)}s
              </div>
              <span className="text-[10px] text-slate-500">Total single-threaded latency</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Wall-Clock Saved</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {(sweepData.timeSavedMs / 1000).toFixed(2)}s
              </div>
              <span className="text-[10px] text-slate-500">Network wait time eliminated</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Concurrency Multiplier</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {sweepData.speedupFactor}
              </div>
              <span className="text-[10px] text-slate-500">Effective concurrency boost</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200 flex items-start space-x-2.5">
            <TrendingDown className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Slide 8 Core Insight:</strong> "Async code does not make a single model call faster; it drastically reduces total wall-clock time by overlapping network waiting periods." Notice each task took ~1.5s–2.5s individually, but all 4 completed in only {(sweepData.totalWallClockMs / 1000).toFixed(2)}s total.
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Side-by-Side Sweep Output Grid */}
      {sweepData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sweepData.results.map((res, idx) => {
            const isTwitter = res.platform === 'twitter';
            const charLimitCheck = isTwitter ? res.characterCount <= 280 : true;

            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-cyan-400 font-mono">
                      {res.platform}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {res.latencyMs}ms
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mb-2 line-clamp-2">
                    {res.headline}
                  </h3>

                  <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-cyan-100 italic mb-2 line-clamp-3">
                    "{res.hook}"
                  </div>

                  <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto mb-2 pr-1">
                    {res.body}
                  </div>

                  <div className="text-[11px] font-bold text-emerald-400 mb-2">
                    CTA: {res.callToAction}
                  </div>

                  {res.hashtags && (
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
                      {res.hashtags.map((h, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Chars: {res.characterCount}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        charLimitCheck ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isTwitter ? (charLimitCheck ? '≤ 280 Passed' : '> 280 Exceeded') : 'Compliant'}
                    </span>
                  </div>

                  <button
                    onClick={() => copyPlatformCopy(res, idx)}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIndex === idx ? 'Copied' : `Copy ${res.platform}`}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide 10: Concurrency Patterns Comparison Matrix */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Slide 10 Technical Matrix: asyncio.gather vs. asyncio.as_completed
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 font-mono text-slate-300">
                <th className="p-3 font-semibold">Evaluation Metric</th>
                <th className="p-3 font-semibold text-cyan-400">asyncio.gather (Current Mode)</th>
                <th className="p-3 font-semibold text-slate-400">asyncio.as_completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="p-3 font-medium text-slate-400">Result Order</td>
                <td className="p-3 text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Guaranteed; strictly matches input index
                </td>
                <td className="p-3 text-slate-400">Non-deterministic; resolved by network latency</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Memory Footprint</td>
                <td className="p-3 text-slate-300">Higher; buffers entire batch in memory</td>
                <td className="p-3 text-emerald-400">Lower; processes and releases incrementally</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Error Isolation</td>
                <td className="p-3 text-slate-300">Requires <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">return_exceptions=True</code> to prevent batch crash</td>
                <td className="p-3 text-slate-300">Natural isolation; exceptions handled per task</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Ideal Industrial Use Case</td>
                <td className="p-3 font-semibold text-cyan-300">Database synchronization, side-by-side platform verification</td>
                <td className="p-3 text-slate-300">Interactive UI streaming and fast-as-possible delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
