import React from 'react';
import { X, Lock, CheckCircle2, Shield, Copy, Check } from 'lucide-react';
import { PlatformId, ToneId } from '../types';

interface PromptGatekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  description: string;
  targetAudience: string;
  platform: PlatformId;
  tone: ToneId;
  customConstraints: string;
}

export const PromptGatekeeperModal: React.FC<PromptGatekeeperModalProps> = ({
  isOpen,
  onClose,
  productName,
  description,
  targetAudience,
  platform,
  tone,
  customConstraints,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const platformRules: Record<string, string> = {
    twitter: 'CRITICAL CONSTRAINT: Output MUST be under 280 characters total. Punchy single-idea hook, 1-2 hashtags, tight CTA.',
    linkedin: 'CRITICAL CONSTRAINT: Thought-leadership executive tone. Line 1 thumb-stopping hook. Generous line breaks. 2-3 value bullet points.',
    instagram: 'CRITICAL CONSTRAINT: Lifestyle narrative. High visual impact in first 40 chars. Emoji rhythm. 5-8 hashtag cluster.',
    email: 'CRITICAL CONSTRAINT: Cold pitch / Newsletter format. High-CTR Subject Line, preview snippet, Problem-Agitate-Solve body, distinct CTA.',
    facebook_ad: 'CRITICAL CONSTRAINT: Direct response conversion copywriting. Scroll-stopping pattern interrupt hook, emotional benefit-driven body, social proof cue.',
    technical_spec: 'CRITICAL CONSTRAINT: DecodeLabs Blueprint Format A4. Rigorous architectural breakdown, compliance check, zero marketing fluff.',
  };

  const compiledText = `### COMPILED GATEKEEPER INGESTION PAYLOAD ###
[RAW_INPUT_METADATA]
- Product Name: ${productName || '<UNSPECIFIED>'}
- Target Audience: ${targetAudience || 'General Audience'}
- Target Platform: ${platform.toUpperCase()}
- Target Tone Profile: ${tone.toUpperCase()}

[INJECTED_MASTER_GATE_RULES]
${platformRules[platform] || ''}
Tone directive: Calibrate linguistic cadence, humor/formality indexes strictly for ${tone}.
${customConstraints ? `[USER_CUSTOM_OVERRIDE_CONSTRAINTS]: ${customConstraints}\n` : ''}
[SANITIZED_PRODUCT_FACTS]
${description || '<No description entered>'}

[EXECUTION DIRECTIVE]
Generate platform copy strictly matching MarketingCopyOutput Pydantic schema with ToneAudit calculations.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(compiledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Slide 6 Blueprint: Master Instruction Gatekeeper Inspector
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  Isolation Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                End-user provides raw facts; the application layer compiles and protects brand voice.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
              <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                Ingested Variables (f-string)
              </span>
              <p className="text-[11px] leading-relaxed">
                {productName || 'None'} • {platform} • {tone}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200">
              <span className="block text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1">
                Platform Constraint
              </span>
              <p className="text-[11px] leading-relaxed line-clamp-2">
                {platformRules[platform]}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-200">
              <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                Downstream Schema
              </span>
              <p className="text-[11px] leading-relaxed">
                MarketingCopyOutput (Pydantic validated)
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Compiled Gatekeeper Payload (Passed to Gemini API)
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-cyan-500/30">
              {compiledText}
            </pre>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-slate-400 text-[11px] leading-relaxed">
              <strong className="text-slate-200">DecodeLabs Training Note:</strong> Slide 5 mandates isolation: raw user inputs never touch the language model directly. They are wrapped inside the master gatekeeper f-string with hardcoded constraints to prevent prompt injection and guarantee length compliance.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
