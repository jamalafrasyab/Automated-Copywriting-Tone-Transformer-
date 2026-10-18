export type PlatformId = 'linkedin' | 'twitter' | 'instagram' | 'email' | 'facebook_ad' | 'technical_spec';

export type ToneId = 'witty' | 'professional' | 'thought_leader' | 'urgency' | 'empathetic' | 'bold_disruptive' | 'technical';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  badge: string;
  charLimit?: number;
  description: string;
  recommendedTone: ToneId;
  icon: string;
  color: string;
}

export interface ToneConfig {
  id: ToneId;
  name: string;
  description: string;
  recommendedTemp: number;
  tag: string;
  badgeColor: string;
}

export interface ToneAudit {
  dominantTone: string;
  wittinessScore: number;
  professionalismScore: number;
  persuasionScore: number;
  platformComplianceScore: number;
  characterLimitPassed: boolean;
  complianceNotes: string;
}

export interface PydanticCopyResponse {
  headline: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  estimatedWordCount: number;
  characterCount: number;
  toneAudit: ToneAudit;
  compiledPromptUsed?: string;
  latencyMs?: number;
  platform?: PlatformId;
  timestamp?: string;
}

export interface PresetBrief {
  id: string;
  title: string;
  productName: string;
  description: string;
  targetAudience: string;
  platform: PlatformId;
  tone: ToneId;
  temperature: number;
  topP: number;
  category: string;
}

export interface BatchItem {
  id: string;
  productName: string;
  description: string;
  platform: PlatformId;
  tone: ToneId;
  status: 'pending' | 'queued' | 'processing' | 'completed' | 'failed';
  result?: PydanticCopyResponse;
  latencyMs?: number;
  retryCount?: number;
}
