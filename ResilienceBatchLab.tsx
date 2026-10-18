import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Clock, 
  DollarSign, 
  Activity, 
  Sparkles,
  FileSpreadsheet,
  ArrowDownCircle,
  HelpCircle
} from 'lucide-react';
import { BatchItem, PlatformId, ToneId } from '../types';

export const ResilienceBatchLab: React.FC = () => {
  // Semaphore state
  const [semaphoreLimit, setSemaphoreLimit] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [testAttempt, setTestAttempt] = useState<number>(3);

  // Batch queue items
  const initialBatch: BatchItem[] = [
    {
      id: 'task-1',
      productName: 'StrataMesh CarbonZero Shoe',
      description: 'Supercritical nitrogen-infused running shoe from recycled plastic.',
      platform: 'twitter',
      tone: 'witty',
      status: 'pending',
    },
    {
      id: 'task-2',
      productName: 'InflowCore 64-Bit Orchestrator',
      description: 'Distributed async gateway ingesting 450 GB/s with sub-5ms p99 latency.',
      platform: 'linkedin',
      tone: 'thought_leader',
      status: 'pending',
    },
    {
      id: 'task-3',
      productName: 'ApexMotion Neural Desk',
      description: 'Motorized standing desk with posture radar adjusting every 45 mins.',
      platform: 'instagram',
      tone: 'witty',
      status: 'pending',
    },
    {
      id: 'task-4',
      productName: 'OmniCredit Pulse SDK',
      description: 'Embeddable instant lending widget handling KYC & risk underwriting.',
      platform: 'email',
      tone: 'professional',
      status: 'pending',
    },
    {
      id: 'task-5',
      productName: 'AetherCode Live Copilot',
      description: 'IDE copilot detecting async race conditions across whole repo graphs.',
      platform: 'facebook_ad',
      tone: 'urgency',
      status: 'pending',
    },
  ];

  const [batchItems, setBatchItems] = useState<BatchItem[]>(initialBatch);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeConnections, setActiveConnections] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Calculate Tenacity Backoff Curve: Delay = multiplier * 2^attempt +/- random_jitter
  const calculateDelay = (attempt: number, mult: number) => {
    const base = mult * Math.pow(2, attempt);
    const jitter = (Math.random() * 0.4 - 0.2) * base; // +/- 20% jitter
    return Math.max(0.5, parseFloat((base + jitter).toFixed(2)));
  };

  const computedDelay = calculateDelay(testAttempt, multiplier);

  // Execute Batch with Real Semaphore Gate Control
  const executeBatch = async () => {
    setIsProcessing(true);
    setCompletedCount(0);

    // Reset status to queued
    setBatchItems(prev => prev.map(item => ({ ...item, status: 'queued', result: undefined })));

    // Semaphore implementation in JavaScript
    let active = 0;
    const queue = [...batchItems];
    let nextIndex = 0;

    const processNext = async (index: number): Promise<void> => {
      if (index >= queue.length) return;

      const currentItem = queue[index];

      // Mark processing
      active++;
      setActiveConnections(active);
      setBatchItems(prev =>
        prev.map((it, i) => (i === index ? { ...it, status: 'processing' } : it))
      );

      const taskStart = Date.now();
      try {
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: currentItem.productName,
            description: currentItem.description,
            platform: currentItem.platform,
            tone: currentItem.tone,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        const latency = Date.now() - taskStart;

        setBatchItems(prev =>
          prev.map((it, i) =>
            i === index ? { ...it, status: 'completed', result: data, latencyMs: latency } : it
          )
        );
      } catch (err) {
        setBatchItems(prev =>
          prev.map((it, i) => (i === index ? { ...it, status: 'failed' } : it))
        );
      } finally {
        active--;
        setActiveConnections(active);
        setCompletedCount(c => c + 1);

        // Pick next item if queue remains
        if (nextIndex < queue.length) {
          const itemToRun = nextIndex++;
          await processNext(itemToRun);
        }
      }
    };

    // Launch initial workers up to semaphoreLimit
    const initialWorkers = [];
    const limit = Math.min(semaphoreLimit, queue.length);
    for (let i = 0; i < limit; i++) {
      nextIndex++;
      initialWorkers.push(processNext(i));
    }

    await Promise.all(initialWorkers);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                SLIDE 11, 12 & 13 RESILIENCE ARCHITECTURE
              </span>
              <span className="text-xs text-slate-400">Semaphore Gate & Tenacity Retries</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Rate Limit Shield & Bulk Processing Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Prevents HTTP 429 Too Many Requests via asyncio.Semaphore connection funneling, neutralizes transient drops with Tenacity randomized exponential backoff, and unlocks OpenBatch scale.
            </p>
          </div>

          <button
            onClick={executeBatch}
            disabled={isProcessing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Batch ({completedCount}/{batchItems.length})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Dispatch Batch with Semaphore ({semaphoreLimit} Concurrency)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slide 11: Interactive Semaphore Gate & Tenacity Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The Semaphore Gate Funnel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Slide 11: The Semaphore Gate
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
              asyncio.Semaphore({semaphoreLimit})
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Programmatic limit enforcing maximum concurrent network connections. Prevents burst traffic from triggering instantaneous HTTP 429 Rate Limits from API gateways.
          </p>

          {/* Visual Funnel Representation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Gate Concurrency Cap (Slots):</span>
              <span className="font-mono text-cyan-400 font-bold">{semaphoreLimit} Max Active</span>
            </div>

            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={semaphoreLimit}
              onChange={e => setSemaphoreLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            {/* Visual slots */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold block mb-2">
                Active In-Flight Slot Monitor:
              </span>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const isAllocated = idx < semaphoreLimit;
                  const isBusy = idx < activeConnections;

                  return (
                    <div
                      key={idx}
                      className={`flex-1 p-2 rounded-lg border text-center text-[10px] font-mono transition-all ${
                        !isAllocated
                          ? 'border-slate-800/40 bg-slate-950/20 text-slate-600'
                          : isBusy
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 animate-pulse font-bold'
                          : 'border-slate-700 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      Slot {idx + 1}
                      <div className="text-[9px] mt-0.5">
                        {!isAllocated ? 'Locked' : isBusy ? 'Active' : 'Free'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Tenacity Activation Curve */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Slide 11: The Activation Curve
              </h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
              Tenacity Retry Formula
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
            <code>Delay = multiplier * 2^attempt +/- random_jitter</code>
          </div>

          {/* Interactive Calculator */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Attempt Number: <span className="text-white font-mono font-bold">{testAttempt}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={testAttempt}
                onChange={e => setTestAttempt(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Multiplier: <span className="text-white font-mono font-bold">{multiplier.toFixed(1)}s</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={multiplier}
                onChange={e => setMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
            </div>
          </div>

          {/* Curve Step Preview */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/50">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                Backoff Sleep for Attempt #{testAttempt}
              </span>
              <span className="text-base font-bold font-mono text-white">
                ~{computedDelay} seconds
              </span>
            </div>
            <div className="text-right text-[11px] text-indigo-300">
              Jitter keeps clients from synchronizing spikes
            </div>
          </div>
        </div>
      </div>

      {/* Slide 12 & 13: Batch Processor Queue & openbatch Concept */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Bulk Processing Ingestion Queue (Slide 5 CSV & Slide 13 BatchCollector)
            </h3>
          </div>

          {/* Slide 12 comparison badge */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              Slide 12: 50% Token Cost Reduction via Batch API
            </span>
          </div>
        </div>

        {/* Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 font-mono text-slate-400">
                <th className="p-3">Task ID</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Tone</th>
                <th className="p-3">Queue Status</th>
                <th className="p-3">Generated Headline & Audit</th>
                <th className="p-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {batchItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono text-slate-400">{item.id}</td>
                  <td className="p-3 font-semibold text-white">{item.productName}</td>
                  <td className="p-3 font-mono uppercase text-cyan-400">{item.platform}</td>
                  <td className="p-3 font-mono text-amber-300">{item.tone}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'processing'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                          : item.status === 'queued'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 max-w-xs">
                    {item.result ? (
                      <div>
                        <div className="font-bold text-white text-xs truncate">
                          {item.result.headline}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {item.result.toneAudit.dominantTone} • {item.result.characterCount} chars
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Awaiting inference...</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {item.latencyMs ? `${item.latencyMs}ms` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
