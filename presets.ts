import { PlatformConfig, ToneConfig, PresetBrief } from '../types';

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    badge: 'Thought Leadership',
    description: 'Executive hook in line 1, clean line breaks, high-signal bullet points, corporate credibility.',
    recommendedTone: 'thought_leader',
    icon: 'Linkedin',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    badge: '≤ 280 Characters',
    charLimit: 280,
    description: 'Strict character gatekeeper limit. High-impact punchy hook, concise value, 1-2 hashtags.',
    recommendedTone: 'witty',
    icon: 'Twitter',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    badge: 'Visual & Lifestyle',
    description: 'Evocative lifestyle narrative, strong first 40-char hook, natural emojis, relevant hashtag clusters.',
    recommendedTone: 'witty',
    icon: 'Instagram',
    color: 'from-pink-500 to-amber-500',
  },
  {
    id: 'email',
    name: 'Email Newsletter',
    badge: 'High-CTR Conversion',
    description: 'High-converting Subject Line, preview snippet, problem-agitate-solve body, distinct button CTA.',
    recommendedTone: 'professional',
    icon: 'Mail',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'facebook_ad',
    name: 'Facebook / Meta Ad',
    badge: 'Direct Response',
    description: 'Scroll-stopping pattern interrupt hook, emotional benefit-driven copy, social proof cues, urgent CTA.',
    recommendedTone: 'urgency',
    icon: 'Zap',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'technical_spec',
    name: 'Technical Spec / Brief',
    badge: 'Format A4 Engineering',
    description: 'DecodeLabs Blueprint Format A4. Rigorous architectural breakdown, compliance check, deterministic facts.',
    recommendedTone: 'technical',
    icon: 'FileCode2',
    color: 'from-slate-600 to-slate-800',
  },
];

export const TONES: ToneConfig[] = [
  {
    id: 'witty',
    name: 'Witty & Clever',
    description: 'Unexpected linguistic hooks, witty analogies, and playful phrasing (Slide 6 & 7: Temp ~0.8)',
    recommendedTemp: 0.85,
    tag: 'Slide 6 & 7 High Variance',
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'professional',
    name: 'Professional Factual',
    description: 'Structured, highly consistent, corporate-safe and grounded (Slide 7: Temp ~0.2)',
    recommendedTemp: 0.25,
    tag: 'Slide 7 Low Variance',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  },
  {
    id: 'thought_leader',
    name: 'Thought Leader & Visionary',
    description: 'Strategic industry foresight, counter-intuitive angles, executive gravitas.',
    recommendedTemp: 0.65,
    tag: 'Industry Benchmark',
    badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  },
  {
    id: 'urgency',
    name: 'High Urgency / Conversion',
    description: 'Direct response copywriting, catalyst language, active verbs, high friction elimination.',
    recommendedTemp: 0.55,
    tag: 'Direct Response',
    badgeColor: 'bg-red-500/10 text-red-300 border-red-500/30',
  },
  {
    id: 'empathetic',
    name: 'Empathetic & Advisory',
    description: 'Relatable user pain points, consultative warmth, trust-building guidance.',
    recommendedTemp: 0.45,
    tag: 'Customer-Centric',
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'bold_disruptive',
    name: 'Bold & Disruptive',
    description: 'Challenger brand tone, challenging legacy incumbents with uncompromising energy.',
    recommendedTemp: 0.9,
    tag: 'High Energy',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30',
  },
  {
    id: 'technical',
    name: 'Technical & Deterministic',
    description: 'Architectural clarity, quantitative accuracy, zero marketing fluff.',
    recommendedTemp: 0.15,
    tag: 'Engineering Format',
    badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
];

export const PRESET_BRIEFS: PresetBrief[] = [
  {
    id: 'eco-shoe',
    title: 'DecodeLabs Slide 6 Reference: Eco Running Shoe',
    productName: 'StrataMesh CarbonZero Running Shoe',
    description: 'An ultra-lightweight running shoe crafted from 100% recycled oceanic plastics, featuring supercritical nitrogen-infused foam midsole for 82% energy return. Weighs only 185 grams, carbon-neutral certified.',
    targetAudience: 'Marathon runners, urban joggers, eco-conscious athletic buyers',
    platform: 'twitter',
    tone: 'witty',
    temperature: 0.85,
    topP: 0.95,
    category: 'Slide 6 Benchmark',
  },
  {
    id: 'saas-analytics',
    title: 'Enterprise AI Micro-Service Inflow Engine',
    productName: 'InflowCore 64-Bit Orchestrator',
    description: 'Real-time asynchronous data pipeline gateway that ingests 450 GB/s with sub-5ms p99 latency. Implements dynamic backpressure, semaphore token bucket gating, and zero-downtime schema evolution.',
    targetAudience: 'CTOs, Principal Distributed Systems Engineers, Cloud Architects',
    platform: 'linkedin',
    tone: 'thought_leader',
    temperature: 0.6,
    topP: 0.9,
    category: 'Slide 4 Blueprint',
  },
  {
    id: 'fintech-api',
    title: 'Instant Micro-Lending Developer SDK',
    productName: 'OmniCredit Pulse SDK',
    description: 'Developer-first embeddable lending widget allowing neo-banks and merchants to offer instant low-risk credit in 3 lines of code. Handles KYC, real-time risk scoring, and multi-currency ledger reconciliation.',
    targetAudience: 'Fintech product managers, senior developers, e-commerce founders',
    platform: 'email',
    tone: 'professional',
    temperature: 0.3,
    topP: 0.85,
    category: 'Enterprise B2B',
  },
  {
    id: 'ergonomic-desk',
    title: 'Smart Kinetic Ergonomic Workstation',
    productName: 'ApexMotion Neural Standing Desk',
    description: 'Motorized dual-motor desk with integrated posture radar sensor that subtly adjusts height every 45 minutes to prevent spinal fatigue. Built from solid walnut with integrated wireless charging and cable conduit.',
    targetAudience: 'Remote software engineers, design leads, wellness enthusiasts',
    platform: 'instagram',
    tone: 'witty',
    temperature: 0.8,
    topP: 0.95,
    category: 'Lifestyle Hardware',
  },
  {
    id: 'ai-code-editor',
    title: 'Autonomous Code Intelligence Suite',
    productName: 'AetherCode Live Reasoning Copilot',
    description: 'IDE extension that analyzes whole-repo dependency graphs, proactively detects subtle race conditions in async pipelines, and writes multi-threaded integration test suites with zero configuration.',
    targetAudience: 'Senior Python & TypeScript developers, Engineering Leads',
    platform: 'facebook_ad',
    tone: 'urgency',
    temperature: 0.7,
    topP: 0.9,
    category: 'DevTools',
  },
];

export const PYTHON_FILES = {
  requirements: `# DecodeLabs Industrial Training Kit - Project 2 Dependencies
google-genai>=2.4.0
pydantic>=2.7.0
tenacity>=8.3.0
httpx>=0.27.0
rich>=13.7.0
python-dotenv>=1.0.1
`,

  models_py: `"""
DecodeLabs Industrial Training Kit - Project 2
File: models.py
Mission 1: Define strict Pydantic schemas for copy generation & tone auditing.
"""
from typing import List, Optional
from pydantic import BaseModel, Field

class ToneAudit(BaseModel):
    dominant_tone: str = Field(description="Primary detected voice")
    wittiness_score: int = Field(ge=0, le=100, description="Humor and wit index")
    professionalism_score: int = Field(ge=0, le=100, description="Corporate authority index")
    persuasion_score: int = Field(ge=0, le=100, description="Conversion drive index")
    platform_compliance_score: int = Field(ge=0, le=100, description="Platform formatting compliance")
    character_limit_passed: bool = Field(description="Strict enforcement of platform length limits")
    compliance_notes: str = Field(description="Quality assessment from prompt gatekeeper")

class MarketingCopyOutput(BaseModel):
    """
    Pydantic Schema enforced by the Master Prompt Gatekeeper.
    Guarantees structural fidelity before touching downstream consumers.
    """
    headline: str = Field(description="Primary headline or subject line")
    hook: str = Field(description="Attention-capturing opening line (1-2 sentences)")
    body: str = Field(description="Core persuasive body copy with platform line breaks")
    call_to_action: str = Field(description="Clear call to action command or button text")
    hashtags: List[str] = Field(default_factory=list, description="Targeted platform hashtags")
    estimated_word_count: int = Field(description="Calculated word count")
    character_count: int = Field(description="Total character count")
    tone_audit: ToneAudit = Field(description="Automated compliance & tone score")

class PipelineConfig(BaseModel):
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.95, ge=0.0, le=1.0)
    max_tokens: int = Field(default=800)
    semaphore_limit: int = Field(default=10, description="Max concurrent connections")
`,

  compiler_py: `"""
DecodeLabs Industrial Training Kit - Project 2
File: compiler.py
Mission 3: Dynamic Master Instruction Template f-string Compiler & Gatekeeper.
Isolates raw user variables and systematically enforces brand safety & platform rules.
"""

def compile_master_template(
    product_name: str,
    raw_description: str,
    platform: str,
    tone: str,
    target_audience: str = "General",
    custom_constraints: str = ""
) -> str:
    """
    Gatekeeper Prompt Compiler.
    Enforces structural prompt isolation before sending payload to the LLM.
    """
    platform_rules = {
        "twitter": "CRITICAL: Output MUST be under 280 characters total. Punchy hook, 1-2 hashtags, tight CTA.",
        "linkedin": "CRITICAL: Executive thought leadership. Line 1 thumb-stopping hook. Generous line breaks. 2-3 value bullets.",
        "instagram": "CRITICAL: Lifestyle narrative. High visual impact in first 40 chars. Emoji rhythm. 5-8 hashtag cluster.",
        "email": "CRITICAL: High-CTR Subject line, preview snippet, Problem-Agitate-Solve body, single clickable CTA.",
        "facebook_ad": "CRITICAL: Direct-response scroll stopper, emotional hook, social proof cue, urgency CTA.",
        "technical_spec": "CRITICAL: DecodeLabs Blueprint Format A4. Rigorous architectural breakdown, zero marketing fluff.",
    }

    rule = platform_rules.get(platform.lower(), "Ensure standard high-converting platform copy.")

    # Master Hidden Template (Slide 6 Blueprint)
    compiled_payload = f"""
You are DecodeLabs Enterprise Master Copywriting & Tone Transformer Engine.
Enforce structural prompt isolation: sanitize user variables and guarantee platform bounds.

=== INGESTED METADATA ===
Product: {product_name}
Target Audience: {target_audience}
Target Platform: {platform.upper()}
Specified Tone: {tone.upper()}

=== PLATFORM GATEKEEPER CONSTRAINT ===
{rule}

=== RAW PRODUCT FACTS ===
{raw_description}

{f"=== CUSTOM USER OVERRIDE ===\\n{custom_constraints}" if custom_constraints else ""}

=== TASK ===
Transform the raw facts into platform copy that adheres strictly to the tone and constraints.
Perform the ToneAudit QA check. Return strictly compliant JSON matching MarketingCopyOutput schema.
""".strip()

    return compiled_payload
`,

  pipeline_py: `"""
DecodeLabs Industrial Training Kit - Project 2
File: pipeline.py
Mission 4: Dual-Pipeline Real-Time Async Orchestrator with Semaphore Concurrency & Tenacity Retries.
"""
import os
import asyncio
import random
from typing import List, Dict, Any
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from models import MarketingCopyOutput, PipelineConfig
from compiler import compile_master_template

# Initialize Gemini Client (Uses User-Agent for tracking telemetry)
client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY"),
    http_options={"headers": {"User-Agent": "aistudio-build"}}
)

# Concurrency Semaphore Gate (Slide 11 Blueprint)
SEMAPHORE_LIMIT = 10
semaphore = asyncio.Semaphore(SEMAPHORE_LIMIT)

# Slide 11: Tenacity Exponential Backoff Retry Shield
# Delay = multiplier * 2^attempt +/- random_jitter
@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1.0, min=1.0, max=16.0),
    reraise=True
)
async def generate_single_copy(
    product_name: str,
    description: str,
    platform: str,
    tone: str,
    config: PipelineConfig
) -> MarketingCopyOutput:
    """
    Executes model inference protected by Semaphore Gate and Tenacity Shield.
    """
    prompt = compile_master_template(
        product_name=product_name,
        raw_description=description,
        platform=platform,
        tone=tone
    )

    async with semaphore:
        # Asynchronous call yielding control to the event loop
        response = await client.aio.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=config.temperature,
                top_p=config.top_p,
                response_mime_type="application/json",
                response_schema=MarketingCopyOutput,
            )
        )
        
        # Pydantic validation (Slide 15 & 16)
        output = MarketingCopyOutput.model_validate_json(response.text)
        return output

async def run_concurrent_platform_sweep(
    product_name: str,
    description: str,
    platforms: List[str],
    tone: str,
    config: PipelineConfig
) -> List[MarketingCopyOutput]:
    """
    Slide 8 & 10: asyncio.gather Pattern
    Guaranteed result order matching input indices with concurrent overlapping network waiting.
    """
    tasks = [
        generate_single_copy(product_name, description, plat, tone, config)
        for plat in platforms
    ]
    # asyncio.gather with return_exceptions=True for batch error isolation
    results = await asyncio.gather(*tasks, return_exceptions=False)
    return results
`,

  run_py: `"""
DecodeLabs Industrial Training Kit - Project 2
File: run.py
Mission 2: CLI Configuration with Argparse (Slide 14 Blueprint)
Usage:
    python run.py --product "Eco Shoe" --platform twitter --tone witty --temp 0.8
"""
import asyncio
import argparse
import sys
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from models import PipelineConfig
from pipeline import generate_single_copy, run_concurrent_platform_sweep

console = Console()

def parse_args():
    # Slide 14: prefix_chars support for standard (-) and custom (+) flags
    parser = argparse.ArgumentParser(
        description="DecodeLabs Automated Copywriting & Tone Transformer Engine",
        prefix_chars="-+"
    )
    parser.add_argument("--product", "-p", required=True, help="Product Name")
    parser.add_argument("--desc", "-d", required=True, help="Raw Product Description")
    parser.add_argument("--platform", default="linkedin", choices=["linkedin", "twitter", "instagram", "email", "all"])
    parser.add_argument("--tone", "-t", default="witty", help="Target tone (witty, professional, etc.)")
    parser.add_argument("--temp", type=float, default=0.7, help="Inference Temperature (0.0 to 1.5)")
    parser.add_argument("--top_p", type=float, default=0.95, help="Top-P nucleus sampling")
    parser.add_argument("+a", "+all_platforms", action="store_true", help="Concurrent sweep across all platforms")
    
    return parser.parse_args()

async def main():
    args = parse_args()
    config = PipelineConfig(temperature=args.temp, top_p=args.top_p)

    console.print(f"[bold cyan]⚡ DecodeLabs CopyTransformer Engine Initialized[/bold cyan]")
    console.print(f"Product: [green]{args.product}[/green] | Tone: [yellow]{args.tone}[/yellow] | Temp: [magenta]{args.temp}[/magenta]")

    if args.a or args.platform == "all":
        platforms = ["linkedin", "twitter", "instagram", "email"]
        console.print(f"Running concurrent sweep across {len(platforms)} platforms via [bold]asyncio.gather[/bold]...")
        results = await run_concurrent_platform_sweep(args.product, args.desc, platforms, args.tone, config)
        
        for plat, res in zip(platforms, results):
            console.print(Panel(
                f"[bold cyan]{res.headline}[/bold cyan]\\n\\n[italic]{res.hook}[/italic]\\n\\n{res.body}\\n\\n[bold green]CTA:[/bold green] {res.call_to_action}\\n\\n{' '.join(res.hashtags)}",
                title=f"Platform: {plat.upper()} ({res.character_count} chars)",
                subtitle=f"Audit: {res.tone_audit.dominant_tone} | Compliance: {res.tone_audit.platform_compliance_score}/100"
            ))
    else:
        res = await generate_single_copy(args.product, args.desc, args.platform, args.tone, config)
        console.print(Panel(
            f"[bold cyan]{res.headline}[/bold cyan]\\n\\n[italic]{res.hook}[/italic]\\n\\n{res.body}\\n\\n[bold green]CTA:[/bold green] {res.call_to_action}\\n\\n{' '.join(res.hashtags)}",
            title=f"Platform: {args.platform.upper()} (Chars: {res.character_count})",
            subtitle=f"Tone Score: {res.tone_audit.wittiness_score}/100 | Limit Passed: {res.tone_audit.character_limit_passed}"
        ))

if __name__ == "__main__":
    asyncio.run(main())
`,
};
