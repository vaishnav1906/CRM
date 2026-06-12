// Phase 12 — AI Lead Summarizer Interface
// Implement with OpenAI/Mistral/Claude when ready. Currently returns placeholders.

import { LeadContext, PROMPT_TEMPLATES } from './prompt-templates';

export type AISummaryResult = {
  summary: string;
  nextAction: string;
  confidence: number;
  tags: string[];
};

// Placeholder: replace aiCall() with real API call to LLM provider
async function aiCall(prompt: string): Promise<string> {
  // Example integration point:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 300 }),
  // });
  // const json = await response.json();
  // return json.choices[0].message.content;
  void prompt;
  return JSON.stringify({ placeholder: true });
}

export async function summarizeLead(lead: LeadContext): Promise<AISummaryResult> {
  try {
    const summaryPrompt = PROMPT_TEMPLATES.leadSummary(lead);
    const actionPrompt = PROMPT_TEMPLATES.nextBestAction(lead);

    const [summaryRaw, actionRaw] = await Promise.all([
      aiCall(summaryPrompt),
      aiCall(actionPrompt),
    ]);

    const actionData = JSON.parse(actionRaw) as { action?: string; urgency?: string };

    return {
      summary: summaryRaw.replace(/[{}"]/g, '').slice(0, 500) || `Lead at ${lead.stage} stage`,
      nextAction: actionData.action ?? 'Follow up with a call',
      confidence: 70,
      tags: [lead.stage, lead.interestLevel ?? 'unscored'].filter(Boolean),
    };
  } catch {
    return {
      summary: `${lead.doctorName} — ${lead.stage}`,
      nextAction: 'Review and follow up',
      confidence: 0,
      tags: [],
    };
  }
}

export async function summarizeObjections(objections: string): Promise<{ type: string; counter: string }[]> {
  if (!objections.trim()) return [];
  try {
    const raw = await aiCall(PROMPT_TEMPLATES.objectionSummary(objections));
    const data = JSON.parse(raw) as { objections?: { type: string; counter: string }[] };
    return data.objections ?? [];
  } catch {
    return [];
  }
}

export async function generateCallSummary(notes: string, leadName: string): Promise<string> {
  try {
    const raw = await aiCall(PROMPT_TEMPLATES.callSummary(notes, leadName));
    const data = JSON.parse(raw) as { summary?: string };
    return data.summary ?? notes.slice(0, 200);
  } catch {
    return notes.slice(0, 200);
  }
}
