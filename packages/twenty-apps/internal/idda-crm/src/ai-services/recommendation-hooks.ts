// Phase 12 — AI Recommendation Hooks
// Rule-based next-best-action engine (no LLM cost). Plug in LLM via lead-summarizer when ready.

export type LeadState = {
  stage: string;
  interestLevel: string | null;
  callOutcome: string | null;
  lastContactedAt: string | null;
  meetingDate: string | null;
  nextFollowUpAt: string | null;
  leadScore: number | null;
  enrichmentStatus: string | null;
  assignedToId: string | null;
};

export type Recommendation = {
  action: string;
  urgency: 'high' | 'medium' | 'low';
  rationale: string;
  taskType: 'FOLLOW_UP_CALL' | 'SEND_WHATSAPP' | 'EMAIL' | 'MEETING' | 'RESEARCH' | 'MANUAL';
};

const daysSince = (iso: string | null): number => {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
};

export function getRecommendation(lead: LeadState): Recommendation {
  const staleDays = daysSince(lead.lastContactedAt);

  // Critical: missed follow-up
  if (lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date()) {
    return { action: 'Call now — follow-up is overdue', urgency: 'high', rationale: 'Scheduled follow-up has passed', taskType: 'FOLLOW_UP_CALL' };
  }

  // Highly interested — close immediately
  if (lead.interestLevel === 'HOT' && lead.stage !== 'ONBOARDED') {
    return { action: 'Schedule demo or send proposal', urgency: 'high', rationale: 'Hot lead needs immediate closing attention', taskType: 'MEETING' };
  }

  // Post-meeting — send proposal
  if (lead.stage === 'MEETING_COMPLETED' && lead.callOutcome !== 'NOT_INTERESTED') {
    return { action: 'Send proposal/contract today', urgency: 'high', rationale: 'Meeting done — strike while interest is high', taskType: 'EMAIL' };
  }

  // Positive call — schedule meeting
  if (lead.callOutcome === 'POSITIVE' && !lead.meetingDate) {
    return { action: 'Schedule a product demo', urgency: 'high', rationale: 'Positive call — convert to meeting before interest cools', taskType: 'MEETING' };
  }

  // Not enriched — research first
  if (lead.enrichmentStatus === 'PENDING' || lead.enrichmentStatus === 'FAILED') {
    return { action: 'Research and verify contact details', urgency: 'medium', rationale: 'Lead data incomplete — enrich before calling', taskType: 'RESEARCH' };
  }

  // Stale — re-engage
  if (staleDays > 14) {
    return { action: 'Re-engage with a WhatsApp message', urgency: 'medium', rationale: `No contact in ${Math.floor(staleDays)} days`, taskType: 'SEND_WHATSAPP' };
  }

  // Unassigned — needs owner
  if (!lead.assignedToId) {
    return { action: 'Assign this lead to a team member', urgency: 'medium', rationale: 'Unassigned leads lose momentum', taskType: 'MANUAL' };
  }

  // Default: call
  return { action: 'Make an introductory call', urgency: 'low', rationale: 'Standard outreach for new lead', taskType: 'FOLLOW_UP_CALL' };
}

export function getBatchRecommendations(leads: LeadState[]): Recommendation[] {
  return leads.map(getRecommendation);
}
