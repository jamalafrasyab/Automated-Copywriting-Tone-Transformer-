import React, { useState } from 'react';
import { 
  Layers, 
  CheckSquare, 
  Square, 
  Cpu, 
  ShieldAlert, 
  Sliders, 
  Network, 
  Workflow, 
  FileCode, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Terminal,
  Zap,
  Info
} from 'lucide-react';

export const BlueprintManualView: React.FC = () => {
  // Slide 16 Checklist state
  const [checklist, setChecklist] = useState({
    pydantic: true,
    cli: true,
    masterTemplate: true,
    dualPipeline: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="space-y-6">
      {/* Title & Onboarding Manual Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SLIDE 4 & 15 SCHEMATIC VERSION 1.4.2
              </span>
              <span className="text-xs text-slate-400">DecodeLabs Intern Onboarding Manual</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              The Automated Copywriting & Tone Transformer Blueprint
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Engineering schematic and complete architectural reference for Batch 2026 Generative AI Engineers at DecodeLabs. Master dynamic string compilation, inference parameter tuning, and dual-pipeline routing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/60 px-3 py-2 rounded-xl border border-cyan-800/60">
            <span>DRAWING SCALE: 1:100</span>
            <span>•</span>
            <span>PROJECT: TONE_TRANSFORM_ENG</span>
          </div>
        </div>
      </div>

      {/* Slide 15: Synthesis Architectural Flow Pipeline Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Slide 15 Synthesis: The Complete Architecture Flow
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Pure Inference Logic • Structural Prompt Isolation
          </span>
        </div>

        {/* Blueprint Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1: Ingestion */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStep === 1
                ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
              <span>01. START</span>
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">CLI / CSV Input</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Argparse captures <code className="text-cyan-300 font-mono">product</code>, <code className="text-cyan-300 font-mono">tone</code>, <code className="text-cyan-300 font-mono">platform</code> metadata.
            </p>
          </div>

          {/* Step 2: Gatekeeper */}
          <div
            onClick={() => setActiveStep(2)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStep === 2
                ? 'bg-blue-950/50 border-blue-400 ring-1 ring-blue-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-2">
              <span>02. GATEKEEPER</span>
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">Prompt Compiler</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              f-strings systematically isolate user variables and append hidden platform constraints.
            </p>
          </div>

          {/* Step 3: Router */}
          <div
            onClick={() => setActiveStep(3)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStep === 3
                ? 'bg-indigo-950/50 border-indigo-400 ring-1 ring-indigo-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-indigo-400 mb-2">
              <span>03. ROUTER</span>
              <Network className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">Dual-Pipeline</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Routes to real-time async (<code className="text-cyan-300 font-mono">asyncio</code>) or bulk (<code className="text-cyan-300 font-mono">openbatch</code>).
            </p>
          </div>

          {/* Step 4: Shield */}
          <div
            onClick={() => setActiveStep(4)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStep === 4
                ? 'bg-amber-950/50 border-amber-400 ring-1 ring-amber-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
              <span>04. SHIELD</span>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">Tenacity & Semaphore</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Gated concurrency (10 max) + randomized exponential backoff retry curve.
            </p>
          </div>

          {/* Step 5: End Validation */}
          <div
            onClick={() => setActiveStep(5)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStep === 5
                ? 'bg-emerald-950/50 border-emerald-400 ring-1 ring-emerald-400'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
              <span>05. END QA</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1">Pydantic Validation</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Guarantees strict schema output, character bounds, and tone audit calculation.
            </p>
          </div>
        </div>

        {/* Detailed Explanation Panel for Active Step */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          {activeStep === 1 && (
            <div>
              <span className="font-bold text-cyan-400 font-mono block mb-1">
                Slide 5 & 14: Ingestion Layer Architecture
              </span>
              <p className="text-slate-300 leading-relaxed">
                Captures metadata (Product, Target Tone, Platform Variables) from CLI flags (<code className="text-cyan-300">argparse</code>) or CSV files. Uses custom type converters and prefix handling (<code className="text-cyan-300">prefix_chars="-+"</code>) so users can pass standard flags like <code className="text-cyan-300">--tone witty</code> alongside custom actions like <code className="text-cyan-300">+a platform</code>.
              </p>
            </div>
          )}
          {activeStep === 2 && (
            <div>
              <span className="font-bold text-blue-400 font-mono block mb-1">
                Slide 6: Protecting Brand Voice with the Master Instruction Template
              </span>
              <p className="text-slate-300 leading-relaxed">
                The framework's primary goal is <strong>isolation</strong>. Raw user inputs are systematically sanitized and formatted before ever touching the language model. The application layer acts as a strict gatekeeper: the end-user provides raw facts, while the code enforces the structural prompt and platform-specific filtering (e.g. Twitter/X maximum 280 characters).
              </p>
            </div>
          )}
          {activeStep === 3 && (
            <div>
              <span className="font-bold text-indigo-400 font-mono block mb-1">
                Slide 8 & 12: Dual-Pipeline Router (Real-Time vs. Bulk Scale)
              </span>
              <p className="text-slate-300 leading-relaxed">
                When real-time UI streaming is not required, bulk processing routes to the Batch API, slashing token costs by exactly 50% and isolating bulk jobs onto a dedicated, high-rate-limit pool. For real-time applications, the router dispatches concurrent async coroutines via <code className="text-cyan-300">asyncio.gather</code>.
              </p>
            </div>
          )}
          {activeStep === 4 && (
            <div>
              <span className="font-bold text-amber-400 font-mono block mb-1">
                Slide 11: Building Resilience Against Rate Limits
              </span>
              <p className="text-slate-300 leading-relaxed">
                The Semaphore Gate strictly caps active network connections (e.g., limit: 10) to prevent instantaneous HTTP 429 errors. For transient network hiccups, Tenacity retry logic activates a randomized exponential backoff curve (<code className="text-cyan-300">Delay = multiplier * 2^attempt +/- random_jitter</code>) so requests never self-synchronize in thundering herds.
              </p>
            </div>
          )}
          {activeStep === 5 && (
            <div>
              <span className="font-bold text-emerald-400 font-mono block mb-1">
                Slide 13 & 15: Pydantic Validation & Guardrail Verification
              </span>
              <p className="text-slate-300 leading-relaxed">
                Prior to delivery to the client or database, generated JSON is validated against strict Pydantic schemas. This verifies that Twitter copy never exceeds 280 characters, all required CTA elements exist, and a programmatic ToneAudit score is computed.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide 16: Your Mission Deployment Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Slide 16: Your Mission — Deployment Checklist
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {Object.values(checklist).filter(Boolean).length} / 4 Complete
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 1 */}
          <div
            onClick={() => toggleCheck('pydantic')}
            className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              checklist.pydantic
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="mt-0.5">
              {checklist.pydantic ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs text-white">
                1. Define the Pydantic Models (<code className="font-mono text-cyan-300">models.py</code>)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Establish the strict output schemas required for final copy generation (<code className="font-mono text-slate-300">MarketingCopyOutput</code>, <code className="font-mono text-slate-300">ToneAudit</code>).
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => toggleCheck('cli')}
            className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              checklist.cli
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="mt-0.5">
              {checklist.cli ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs text-white">
                2. Configure the CLI (<code className="font-mono text-cyan-300">run.py</code>)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set up argparse to capture product variables, tone modifiers, target platforms, and custom prefix flags.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => toggleCheck('masterTemplate')}
            className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              checklist.masterTemplate
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="mt-0.5">
              {checklist.masterTemplate ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs text-white">
                3. Build the Master Template (<code className="font-mono text-cyan-300">compiler.py</code>)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Use f-strings to lock in brand safety guidelines and platform constraints (e.g., Twitter &lt;= 280 characters).
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => toggleCheck('dualPipeline')}
            className={`p-4 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
              checklist.dualPipeline
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="mt-0.5">
              {checklist.dualPipeline ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs text-white">
                4. Implement the Dual-Pipeline (<code className="font-mono text-cyan-300">pipeline.py</code>)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Route real-time requests through <code className="font-mono text-slate-300">asyncio.gather</code> with Semaphores, and bulk requests through batch collectors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 17: Conclusion from DecodeLabs */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-900/40 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold font-mono">
          <BookOpen className="w-4 h-4" />
          <span>DECODELABS LEADERSHIP CONCLUSION (SLIDE 17)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "The absolute best way to master Generative AI Engineering is through hands-on inference tuning, not just theory. Experiment with unique solutions—like testing how high Temperature values affect brand consistency on LinkedIn versus Instagram, or implementing strict length validation constraints for character-limited platforms—and treat every erratic, repetitive, or overly verbose AI response as a valuable learning opportunity."
        </p>
        <div className="text-[11px] text-slate-500 pt-1 font-mono">
          Powered by DecodeLabs • Batch: 2026 • Greater Lucknow, India • www.decodelabs.tech
        </div>
      </div>
    </div>
  );
};
