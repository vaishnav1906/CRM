// Phase 12 — AI Service Prompt Templates
// Plug these into OpenAI/Mistral/Claude API when integrating.

export type LeadContext = {
  doctorName: string;
  clinicName: string;
  specialization: string;
  city: string;
  stage: string;
  interestLevel: string | null;
  callOutcome: string | null;
  followUpNotes: string | null;
  objections: string | null;
  leadScore: number | null;
  lastContactedAt: string | null;
};

export const PROMPT_TEMPLATES = {
  leadSummary: (lead: LeadContext): string => `
You are a CRM assistant for IDDA Assurance, a healthcare insurance SaaS company.
Summarize this lead in 2-3 sentences for a sales agent. Be concise and actionable.

Lead:
- Doctor: ${lead.doctorName} (${lead.specialization})
- Clinic: ${lead.clinicName}, ${lead.city}
- Pipeline stage: ${lead.stage}
- Interest level: ${lead.interestLevel ?? 'unknown'}
- Last call outcome: ${lead.callOutcome ?? 'not called'}
- Follow-up notes: ${lead.followUpNotes ?? 'none'}
- Objections: ${lead.objections ?? 'none'}
- Lead score: ${lead.leadScore ?? 'unscored'}
- Last contacted: ${lead.lastContactedAt ?? 'never'}

Provide a 2-3 sentence summary. Focus on current status and next step.
`.trim(),

  objectionSummary: (objections: string): string => `
You are a sales coach for a healthcare SaaS company.
A lead has raised the following objections. Classify each objection and suggest a brief counter-argument.

Objections text:
"${objections}"

Respond in JSON: {"objections": [{"text": "...", "type": "price|trust|timing|relevance|other", "counter": "..."}]}
`.trim(),

  nextBestAction: (lead: LeadContext): string => `
You are a CRM AI assistant for IDDA Assurance.
Given this lead's current state, recommend the single best next action for the sales agent.

Lead state:
- Stage: ${lead.stage}
- Interest: ${lead.interestLevel ?? 'unknown'}
- Call outcome: ${lead.callOutcome ?? 'not called'}
- Score: ${lead.leadScore ?? 'unscored'}
- Days since last contact: ${lead.lastContactedAt ? Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / 86400000) : 'never contacted'}
- Objections: ${lead.objections ?? 'none'}

Respond in JSON: {"action": "...", "rationale": "...", "urgency": "high|medium|low"}
`.trim(),

  callSummary: (transcriptOrNotes: string, leadName: string): string => `
Summarize this sales call with ${leadName} for IDDA Assurance.
Extract: decision outcome, key objections, agreed next steps, sentiment.

Call notes/transcript:
"${transcriptOrNotes}"

Respond in JSON: {
  "outcome": "positive|neutral|negative|no_answer",
  "keyPoints": ["..."],
  "objections": ["..."],
  "nextSteps": ["..."],
  "sentiment": "positive|neutral|negative",
  "summary": "2-sentence summary"
}
`.trim(),

  leadQualification: (lead: LeadContext): string => `
Assess whether this healthcare lead is qualified for IDDA Assurance's subscription product.
Qualification criteria: doctor in private practice, >5 years experience (inferred from specialization), city with IDDA coverage.

Lead:
- ${lead.doctorName}, ${lead.specialization}, ${lead.clinicName}, ${lead.city}

Respond in JSON: {"qualified": true|false, "confidence": 0-100, "reasons": ["..."], "disqualifiers": ["..."]}
`.trim(),
};
