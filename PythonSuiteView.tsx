import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Play, 
  RefreshCw, 
  FileCode2, 
  FolderTree, 
  Sparkles,
  Layers,
  ChevronRight,
  Code
} from 'lucide-react';
import { PYTHON_FILES } from '../data/presets';

type FileKey = 'models_py' | 'compiler_py' | 'pipeline_py' | 'run_py' | 'requirements';

export const PythonSuiteView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileKey>('run_py');
  const [copied, setCopied] = useState(false);

  // CLI simulator state
  const [cliCommand, setCliCommand] = useState(
    'python run.py --product "Eco Running Shoe" --platform twitter --tone witty --temp 0.85'
  );
  const [cliOutput, setCliOutput] = useState<string | null>(null);
  const [isExecutingCli, setIsExecutingCli] = useState(false);

  const fileMap: Record<FileKey, { name: string; content: string; desc: string }> = {
    run_py: {
      name: 'run.py',
      content: PYTHON_FILES.run_py,
      desc: 'Slide 14 CLI Configuration with Argparse and prefix_chars',
    },
    models_py: {
      name: 'models.py',
      content: PYTHON_FILES.models_py,
      desc: 'Slide 16 Mission 1: Pydantic Data Models & ToneAudit Schema',
    },
    compiler_py: {
      name: 'compiler.py',
      content: PYTHON_FILES.compiler_py,
      desc: 'Slide 6 Mission 3: Master Instruction Template f-string Compiler',
    },
    pipeline_py: {
      name: 'pipeline.py',
      content: PYTHON_FILES.pipeline_py,
      desc: 'Slide 8 & 11 Mission 4: Dual-Pipeline with Semaphore & Tenacity Shield',
    },
    requirements: {
      name: 'requirements.txt',
      content: PYTHON_FILES.requirements,
      desc: 'Project Python Dependencies',
    },
  };

  const copyFile = () => {
    navigator.clipboard.writeText(fileMap[selectedFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([fileMap[selectedFile].content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileMap[selectedFile].name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Run the CLI simulator by calling backend transform API
  const handleRunCli = async () => {
    setIsExecutingCli(true);
    setCliOutput(null);

    // Simple parser for standard CLI args
    const cmd = cliCommand;
    let product = 'StrataMesh Shoe';
    let platform = 'twitter';
    let tone = 'witty';
    let temp = 0.8;
    const hasAll = cmd.includes('+a') || cmd.includes('--platform all');

    const prodMatch = cmd.match(/--product\s+"([^"]+)"/) || cmd.match(/-p\s+"([^"]+)"/);
    if (prodMatch) product = prodMatch[1];

    const platMatch = cmd.match(/--platform\s+([a-zA-Z_]+)/);
    if (platMatch) platform = platMatch[1];

    const toneMatch = cmd.match(/--tone\s+([a-zA-Z_]+)/) || cmd.match(/-t\s+([a-zA-Z_]+)/);
    if (toneMatch) tone = toneMatch[1];

    const tempMatch = cmd.match(/--temp\s+([0-9.]+)/);
    if (tempMatch) temp = parseFloat(tempMatch[1]);

    try {
      if (hasAll) {
        const response = await fetch('/api/concurrent-sweep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: product,
            description: `Official enterprise brief for ${product}`,
            platforms: ['linkedin', 'twitter', 'instagram', 'email'],
            tone,
            temperature: temp,
          }),
        });
        const data = await response.json();

        let terminalOutput = `⚡ DecodeLabs CopyTransformer Engine Initialized\n`;
        terminalOutput += `Product: ${product} | Tone: ${tone} | Temp: ${temp}\n`;
        terminalOutput += `[asyncio.gather] Dispatched concurrent sweep across 4 platforms in ${data.totalWallClockMs}ms\n`;
        terminalOutput += `Sequential duration saved: ${data.timeSavedMs}ms (${data.speedupFactor} concurrency speedup)\n\n`;

        data.results.forEach((r: any) => {
          terminalOutput += `------------------------------------------------------------\n`;
          terminalOutput += `[PLATFORM: ${r.platform.toUpperCase()}] (${r.characterCount} chars | Latency: ${r.latencyMs}ms)\n`;
          terminalOutput += `HEADLINE: ${r.headline}\n`;
          terminalOutput += `HOOK:     ${r.hook}\n`;
          terminalOutput += `BODY:     ${r.body.replace(/\n+/g, ' ')}\n`;
          terminalOutput += `CTA:      ${r.callToAction}\n`;
          terminalOutput += `TAGS:     ${(r.hashtags || []).join(' ')}\n`;
          terminalOutput += `AUDIT:    ${r.toneAudit?.dominantTone} | Compliance: ${r.toneAudit?.platformComplianceScore}/100\n`;
        });
        setCliOutput(terminalOutput);
      } else {
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: product,
            description: `Official enterprise specification for ${product}`,
            platform,
            tone,
            temperature: temp,
          }),
        });
        const data = await response.json();

        let terminalOutput = `⚡ DecodeLabs CopyTransformer Engine Initialized\n`;
        terminalOutput += `Product: ${product} | Platform: ${platform} | Tone: ${tone} | Temp: ${temp}\n\n`;
        terminalOutput += `[OUTPUT GENERATED VIA GEMINI-3.8-FLASH]\n`;
        terminalOutput += `HEADLINE:    ${data.headline}\n`;
        terminalOutput += `HOOK:        ${data.hook}\n`;
        terminalOutput += `BODY:\n${data.body}\n\n`;
        terminalOutput += `CTA:         ${data.callToAction}\n`;
        terminalOutput += `HASHTAGS:    ${(data.hashtags || []).join(' ')}\n\n`;
        terminalOutput += `[PYDANTIC VALIDATION QA]\n`;
        terminalOutput += `Character Count: ${data.characterCount} (Limit Passed: ${data.toneAudit?.characterLimitPassed})\n`;
        terminalOutput += `Dominant Tone:   ${data.toneAudit?.dominantTone}\n`;
        terminalOutput += `Wittiness:       ${data.toneAudit?.wittinessScore}/100\n`;
        terminalOutput += `Professionalism: ${data.toneAudit?.professionalismScore}/100\n`;
        terminalOutput += `Compliance Notes:${data.toneAudit?.complianceNotes}\n`;
        terminalOutput += `Inference Time:  ${data.latencyMs}ms\n`;
        setCliOutput(terminalOutput);
      }
    } catch (err: any) {
      setCliOutput(`[ERROR]: Failed to execute CLI command: ${err.message}`);
    } finally {
      setIsExecutingCli(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SLIDE 14 & 16 PYTHON CODEBASE
              </span>
              <span className="text-xs text-slate-400">Complete Production Package</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Python Implementation & CLI Engine Suite
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect, copy, or download the exact Python code mandated by DecodeLabs Industrial Training Kit Project 2: Pydantic schemas, f-string gatekeeper compiler, and asyncio + Tenacity pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadFile}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download {fileMap[selectedFile].name}</span>
            </button>
            <button
              onClick={copyFile}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 font-mono mb-3">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              <span>project_2_engine/</span>
            </div>

            {(Object.keys(fileMap) as FileKey[]).map(key => {
              const file = fileMap[key];
              const isSelected = selectedFile === key;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedFile(key)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode2 className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
              File Mission:
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {fileMap[selectedFile].desc}
            </p>
          </div>
        </div>

        {/* Right: Code Viewer (9 cols) */}
        <div className="lg:col-span-9 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">{fileMap[selectedFile].name}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {fileMap[selectedFile].content.split('\n').length} lines
            </span>
          </div>

          <pre className="p-5 font-mono text-xs text-slate-300 overflow-auto flex-1 leading-relaxed selection:bg-cyan-500/30 whitespace-pre">
            {fileMap[selectedFile].content}
          </pre>
        </div>
      </div>

      {/* Slide 14: Interactive CLI Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Slide 14: Interactive CLI Terminal Simulator (python run.py)
            </h2>
          </div>

          {/* Quick preset commands */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Sample CLI Runs:</span>
            <button
              onClick={() =>
                setCliCommand('python run.py --product "Eco Shoe" --platform twitter --tone witty --temp 0.85')
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
            >
              Single Twitter
            </button>
            <button
              onClick={() =>
                setCliCommand('python run.py --product "InflowCore" --platform linkedin --tone thought_leader --temp 0.6')
              }
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
            >
              LinkedIn Spec
            </button>
            <button
              onClick={() =>
                setCliCommand('python run.py --product "Neural Desk" +a --tone witty --temp 0.8')
              }
              className="px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 font-mono text-[10px]"
            >
              +a All Platforms Sweep
            </button>
          </div>
        </div>

        {/* Terminal Input Bar */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono text-xs">
          <span className="text-emerald-400 font-bold px-2">$</span>
          <input
            type="text"
            value={cliCommand}
            onChange={e => setCliCommand(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono"
            placeholder="python run.py --product ... --platform ... --tone ..."
          />
          <button
            onClick={handleRunCli}
            disabled={isExecutingCli}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isExecutingCli ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Output Window */}
        <div className="bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 min-h-[180px] max-h-[300px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
          {cliOutput ? (
            cliOutput
          ) : (
            <div className="text-slate-600 italic">
              Type or select a command above and hit 'Run' to execute model inference and view CLI output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
