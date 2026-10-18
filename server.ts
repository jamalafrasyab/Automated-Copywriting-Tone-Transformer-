import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialise GoogleGenAI with mandatory User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface TransformRequest {
  productName: string;
  description: string;
  targetAudience?: string;
  platform: 'linkedin' | 'twitter' | 'instagram' | 'email' | 'facebook_ad' | 'technical_spec';
  tone: 'witty' | 'professional' | 'thought_leader' | 'urgency' | 'empathetic' | 'bold_disruptive' | 'technical';
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  customConstraints?: string;
}

export interface PydanticCopyResponse {
  headline: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  estimatedWordCount: number;
  characterCount: number;
  toneAudit: {
    dominantTone: string;
    wittinessScore: number; // 0-100
    professionalismScore: number; // 0-100
    persuasionScore: number; // 0-100
    platformComplianceScore: number; // 0-100
    characterLimitPassed: boolean;
    complianceNotes: string;
  };
  compiledPromptUsed: string;
  latencyMs: number;
  timestamp: string;
}

// Master Instruction Template Gatekeeper (f-string style compiler based on Slide 6 & 15)
function compileMasterInstructionTemplate(params: TransformRequest): { systemInstruction: string; userPrompt: string } {
  const { productName, description, targetAudience, platform, tone, customConstraints } = params;

  // Platform specific gatekeeper rules
  const platformRules: Record<string, string> = {
    twitter: 'CRITICAL CONSTRAINT: Output MUST be under 280 characters total for the main tweet text. Punchy single-idea hook, 1-2 tight hashtags, ultra-crisp call to action.',
    linkedin: 'CRITICAL CONSTRAINT: Thought-leadership executive tone. Line 1 must be a thumb-stopping provocative hook. Use generous whitespace between thoughts (1-2 sentences per paragraph). Include 2-3 value bullet points and 3-4 professional hashtags.',
    instagram: 'CRITICAL CONSTRAINT: Highly visual, lifestyle-oriented narrative. Hook immediately in first 40 characters before user clicks "...more". Natural emoji placement for rhythm. Include a cluster of 5-8 relevant niche & broad hashtags at the bottom.',
    email: 'CRITICAL CONSTRAINT: Cold pitch / Newsletter format. Provide a high-CTR Subject Line, a compelling preview snippet hook, problem-agitate-solve body paragraphs, and a crystal-clear single Call-To-Action link text.',
    facebook_ad: 'CRITICAL CONSTRAINT: Direct response conversion copywriting. Scroll-stopping pattern interrupt hook, emotional benefit-driven body, social proof cue, and high-urgency call to action with secondary headline.',
    technical_spec: 'CRITICAL CONSTRAINT: DecodeLabs Blueprint Format A4. Precise engineering specification, architectural value proposition, compliance and SLA metrics, zero marketing fluff, technical rigor.',
  };

  const toneGuidelines: Record<string, string> = {
    witty: 'Tone: Witty, clever, playful with sharp analogies, tongue-in-cheek punchlines, and memorable phrasing without losing core product credibility.',
    professional: 'Tone: Highly polished, authoritative, corporate-safe, structured, factual, and commercially compelling.',
    thought_leader: 'Tone: Visionary, strategic, counter-intuitive insight, positioning the product at the forefront of industry transformation.',
    urgency: 'Tone: Direct response, FOMO, time-sensitive catalyst, active verbs, high friction elimination.',
    empathetic: 'Tone: Deeply understanding user pain points, consultative, trustworthy, warm, solution-oriented guidance.',
    bold_disruptive: 'Tone: Challenger brand voice, provocative questioning of status-quo conventions, punchy, uninhibited.',
    technical: 'Tone: Engineering-grade precision, deterministic claims, feature-to-outcome mapping, architectural clarity.',
  };

  const selectedPlatformRule = platformRules[platform] || platformRules.linkedin;
  const selectedToneGuideline = toneGuidelines[tone] || toneGuidelines.professional;

  const systemInstruction = `You are DecodeLabs Enterprise Master Copywriting & Tone Transformer Engine (Industrial Training Kit Project 2).
Your responsibility is strict dynamic prompt gatekeeping: sanitize incoming raw variables, apply platform-specific constraints, calibrate the target tone, and output strict schema-validated structured copy.

Brand Safety & Compliance Gate:
1. Never hallucinate fake technical credentials or false regulatory claims.
2. Adhere strictly to platform character and format constraints.
3. Every generated package must contain a headline, opening hook, body text, call-to-action, hashtags array, and a programmatic tone audit evaluation.`;

  const userPrompt = `### COMPILED GATEKEEPER INGESTION PAYLOAD ###
[RAW_INPUT_METADATA]
- Product Name: ${productName}
- Core Raw Description: ${description}
- Target Audience: ${targetAudience || 'General Target Market'}
- Target Platform: ${platform.toUpperCase()}
- Target Tone Profile: ${tone.toUpperCase()}

[INJECTED_MASTER_GATE_RULES]
${selectedPlatformRule}
${selectedToneGuideline}
${customConstraints ? `[USER_CUSTOM_OVERRIDE_CONSTRAINTS]: ${customConstraints}` : ''}

[EXECUTION DIRECTIVE]
Generate the optimized platform copy and perform the Tone Audit calculation. Calculate true word count and character count.
For Twitter/X, ensure characterLimitPassed is true only if total characters <= 280.`;

  return { systemInstruction, userPrompt };
}

// Schema definition for Structured Output (Pydantic equivalent)
const copyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: 'The primary bold headline or subject line',
    },
    hook: {
      type: Type.STRING,
      description: 'The first 1-2 opening sentences designed to grab immediate attention',
    },
    body: {
      type: Type.STRING,
      description: 'The full core copy formatted with platform-appropriate spacing and line breaks',
    },
    callToAction: {
      type: Type.STRING,
      description: 'Direct call to action statement or button label',
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Relevant platform hashtags including the # symbol',
    },
    estimatedWordCount: {
      type: Type.INTEGER,
      description: 'Estimated word count of the body plus hook',
    },
    characterCount: {
      type: Type.INTEGER,
      description: 'Total character count of hook + body + callToAction + hashtags',
    },
    toneAudit: {
      type: Type.OBJECT,
      properties: {
        dominantTone: {
          type: Type.STRING,
          description: 'The primary perceived tone of the generated text',
        },
        wittinessScore: {
          type: Type.INTEGER,
          description: 'Score from 0 to 100 on humor, wit, and linguistic playfulness',
        },
        professionalismScore: {
          type: Type.INTEGER,
          description: 'Score from 0 to 100 on professional authority and business rigor',
        },
        persuasionScore: {
          type: Type.INTEGER,
          description: 'Score from 0 to 100 on conversion and persuasive drive',
        },
        platformComplianceScore: {
          type: Type.INTEGER,
          description: 'Score from 0 to 100 on adhering to platform conventions and formatting',
        },
        characterLimitPassed: {
          type: Type.BOOLEAN,
          description: 'True if it adheres strictly to platform bounds (e.g. <= 280 chars for Twitter)',
        },
        complianceNotes: {
          type: Type.STRING,
          description: 'Brief QA assessment of whether the copy meets the gatekeeper prompt rules',
        },
      },
      required: [
        'dominantTone',
        'wittinessScore',
        'professionalismScore',
        'persuasionScore',
        'platformComplianceScore',
        'characterLimitPassed',
        'complianceNotes',
      ],
    },
  },
  required: [
    'headline',
    'hook',
    'body',
    'callToAction',
    'hashtags',
    'estimatedWordCount',
    'characterCount',
    'toneAudit',
  ],
};

// API Route: Single Transform
app.post('/api/transform', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      productName,
      description,
      targetAudience,
      platform,
      tone,
      temperature = 0.7,
      topP = 0.95,
      maxOutputTokens,
      customConstraints,
    } = req.body as TransformRequest;

    if (!productName || !description) {
      return res.status(400).json({ error: 'productName and description are required' });
    }

    const { systemInstruction, userPrompt } = compileMasterInstructionTemplate({
      productName,
      description,
      targetAudience,
      platform: platform || 'linkedin',
      tone: tone || 'professional',
      customConstraints,
    });

    const config: any = {
      systemInstruction,
      temperature: Number(temperature) || 0.7,
      topP: Number(topP) || 0.95,
      responseMimeType: 'application/json',
      responseSchema: copyResponseSchema,
    };

    if (maxOutputTokens && Number(maxOutputTokens) > 0) {
      config.maxOutputTokens = Number(maxOutputTokens);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config,
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);
    const latencyMs = Date.now() - startTime;

    // Recalculate true character count on server for absolute QA compliance check
    const fullTextLength = (
      (parsedData.hook || '') + ' ' +
      (parsedData.body || '') + ' ' +
      (parsedData.callToAction || '') + ' ' +
      (parsedData.hashtags || []).join(' ')
    ).trim().length;

    if (platform === 'twitter') {
      parsedData.toneAudit.characterLimitPassed = fullTextLength <= 280;
    }
    parsedData.characterCount = fullTextLength;
    parsedData.estimatedWordCount = (parsedData.body || '').split(/\s+/).filter(Boolean).length;
    parsedData.compiledPromptUsed = userPrompt;
    parsedData.latencyMs = latencyMs;
    parsedData.timestamp = new Date().toISOString();

    res.json(parsedData);
  } catch (err: any) {
    console.error('Transform error:', err);
    res.status(500).json({
      error: err.message || 'Failed to transform copy',
      details: String(err),
    });
  }
});

// API Route: Concurrent Sweep across multiple platforms (asyncio.gather simulation)
app.post('/api/concurrent-sweep', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      productName,
      description,
      targetAudience,
      platforms = ['linkedin', 'twitter', 'instagram', 'email'],
      tone = 'witty',
      temperature = 0.8,
      topP = 0.95,
    } = req.body;

    if (!productName || !description) {
      return res.status(400).json({ error: 'productName and description are required' });
    }

    // Execute concurrently using Promise.all (matching asyncio.gather)
    const promises = platforms.map(async (platformKey: any) => {
      const taskStart = Date.now();
      const { systemInstruction, userPrompt } = compileMasterInstructionTemplate({
        productName,
        description,
        targetAudience,
        platform: platformKey,
        tone,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: Number(temperature) || 0.8,
          topP: Number(topP) || 0.95,
          responseMimeType: 'application/json',
          responseSchema: copyResponseSchema,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const taskLatency = Date.now() - taskStart;
      parsed.platform = platformKey;
      parsed.latencyMs = taskLatency;
      parsed.compiledPromptUsed = userPrompt;
      return parsed;
    });

    const results = await Promise.all(promises);
    const totalWallClockMs = Date.now() - startTime;
    const sequentialSumMs = results.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0);
    const timeSavedMs = Math.max(0, sequentialSumMs - totalWallClockMs);

    res.json({
      results,
      totalWallClockMs,
      sequentialSumMs,
      timeSavedMs,
      speedupFactor: (sequentialSumMs / (totalWallClockMs || 1)).toFixed(2) + 'x',
    });
  } catch (err: any) {
    console.error('Sweep error:', err);
    res.status(500).json({ error: err.message || 'Concurrent sweep failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    engine: 'DecodeLabs CopyTransformer v2.6',
    model: 'gemini-3.8-flash',
    uptime: process.uptime(),
  });
});

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DecodeLabs CopyTransformer Engine listening on port ${PORT}`);
  });
}

startServer();
