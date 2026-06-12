import { DatabaseEventPayload, defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { LEAD_SCORE_CALCULATOR_UUID } from 'src/constants/universal-identifiers';

// Fields that trigger re-scoring — must NOT include leadScore/scoreBand/scoreExplanation
const SCORE_TRIGGER_FIELDS = [
  'stage',
  'callOutcome',
  'interestLevel',
  'conversionProbability',
  'meetingDate',
  'assignedToId',
  'enrichmentStatus',
  'priority',
  'lastContactedAt',
];

type LeadScoreData = {
  id: string;
  stage?: string | null;
  phones?: { primaryPhoneNumber?: string | null } | null;
  emails?: { primaryEmail?: string | null } | null;
  website?: { primaryLinkUrl?: string | null } | null;
  instagram?: { primaryLinkUrl?: string | null } | null;
  meetingDate?: string | null;
  callOutcome?: string | null;
  interestLevel?: string | null;
  conversionProbability?: number | null;
  lastContactedAt?: string | null;
  assignedToId?: string | null;
  enrichmentStatus?: string | null;
  priority?: string | null;
};

type ScoreResult = {
  score: number;
  band: 'HOT' | 'WARM' | 'COLD';
  explanation: string;
};

function computeScore(lead: LeadScoreData): ScoreResult {
  let score = 0;
  const factors: string[] = [];

  // Contact info completeness
  if (lead.phones?.primaryPhoneNumber) { score += 10; factors.push('+10 phone'); }
  if (lead.emails?.primaryEmail) { score += 8; factors.push('+8 email'); }
  if (lead.website?.primaryLinkUrl) { score += 5; factors.push('+5 website'); }
  if (lead.instagram?.primaryLinkUrl) { score += 4; factors.push('+4 instagram'); }

  // Engagement signals
  if (lead.meetingDate) { score += 20; factors.push('+20 meeting scheduled'); }

  if (lead.callOutcome === 'POSITIVE') { score += 15; factors.push('+15 positive call'); }
  else if (lead.callOutcome === 'FOLLOW_UP') { score += 8; factors.push('+8 follow-up call'); }
  else if (lead.callOutcome === 'NEUTRAL') { score += 4; factors.push('+4 neutral call'); }
  else if (lead.callOutcome === 'NOT_INTERESTED') { score -= 10; factors.push('-10 not interested call'); }

  if (lead.interestLevel === 'HOT') { score += 15; factors.push('+15 hot interest'); }
  else if (lead.interestLevel === 'WARM') { score += 8; factors.push('+8 warm interest'); }
  else if (lead.interestLevel === 'COLD') { score -= 5; factors.push('-5 cold interest'); }
  else if (lead.interestLevel === 'NOT_INTERESTED') { score -= 15; factors.push('-15 not interested'); }

  // Conversion probability
  if (lead.conversionProbability != null) {
    const bonus = Math.floor(lead.conversionProbability / 10);
    score += bonus;
    factors.push(`+${bonus} conversion%`);
  }

  // Assignment & enrichment
  if (lead.assignedToId) { score += 5; factors.push('+5 assigned'); }

  if (lead.enrichmentStatus === 'ENRICHED') { score += 6; factors.push('+6 enriched'); }
  else if (lead.enrichmentStatus === 'MANUALLY_VERIFIED') { score += 8; factors.push('+8 verified'); }
  else if (lead.enrichmentStatus === 'FAILED') { score -= 5; factors.push('-5 failed enrichment'); }

  // Priority
  if (lead.priority === 'URGENT') { score += 8; factors.push('+8 urgent priority'); }
  else if (lead.priority === 'HIGH') { score += 5; factors.push('+5 high priority'); }
  else if (lead.priority === 'LOW') { score -= 3; factors.push('-3 low priority'); }

  // Recency penalty — stale if not contacted in >14 days
  if (lead.lastContactedAt) {
    const daysSinceContact = (Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceContact > 14) { score -= 20; factors.push('-20 inactive >14d'); }
    else if (daysSinceContact > 7) { score -= 8; factors.push('-8 inactive >7d'); }
  }

  // Stage signals
  if (lead.stage === 'REJECTED') { score -= 30; factors.push('-30 rejected'); }
  else if (lead.stage === 'ONBOARDED') { score += 10; factors.push('+10 onboarded'); }
  else if (lead.stage === 'NEGOTIATION') { score += 12; factors.push('+12 in negotiation'); }
  else if (lead.stage === 'MEETING_SCHEDULED') { score += 10; factors.push('+10 meeting stage'); }
  else if (lead.stage === 'INTERESTED') { score += 8; factors.push('+8 interested stage'); }

  // Clamp 0–100
  const finalScore = Math.max(0, Math.min(100, score));
  const band: 'HOT' | 'WARM' | 'COLD' = finalScore >= 80 ? 'HOT' : finalScore >= 50 ? 'WARM' : 'COLD';

  return {
    score: finalScore,
    band,
    explanation: factors.join(' | ') || 'No factors',
  };
}

const handler = async (payload: DatabaseEventPayload) => {
  const leadId = payload.recordId;
  const client = new CoreApiClient();

  // Fetch current lead state for scoring
  let lead: LeadScoreData;
  try {
    const result = await (client as any).query({
      crmTask: undefined, // dummy — real query below
      lead: {
        __args: { id: leadId },
        id: true,
        stage: true,
        phones: { primaryPhoneNumber: true },
        emails: { primaryEmail: true },
        website: { primaryLinkUrl: true },
        instagram: { primaryLinkUrl: true },
        meetingDate: true,
        callOutcome: true,
        interestLevel: true,
        conversionProbability: true,
        lastContactedAt: true,
        assignedTo: { id: true },
        enrichmentStatus: true,
        priority: true,
      },
    });
    const raw = (result as any)?.lead;
    if (!raw) return { skipped: true, reason: 'lead not found' };
    lead = {
      id: raw.id,
      stage: raw.stage,
      phones: raw.phones,
      emails: raw.emails,
      website: raw.website,
      instagram: raw.instagram,
      meetingDate: raw.meetingDate,
      callOutcome: raw.callOutcome,
      interestLevel: raw.interestLevel,
      conversionProbability: raw.conversionProbability,
      lastContactedAt: raw.lastContactedAt,
      assignedToId: raw.assignedTo?.id ?? null,
      enrichmentStatus: raw.enrichmentStatus,
      priority: raw.priority,
    };
  } catch (err) {
    console.error('[lead-score-calculator] query failed:', err);
    return { error: 'query failed' };
  }

  const { score, band, explanation } = computeScore(lead);

  // Update score fields — these are NOT in SCORE_TRIGGER_FIELDS, so no loop
  try {
    await (client as any).mutation({
      updateLead: {
        __args: {
          id: leadId,
          data: {
            leadScore: score,
            scoreBand: band,
            scoreExplanation: explanation,
          },
        },
        id: true,
      },
    });
  } catch (err) {
    console.error('[lead-score-calculator] update failed:', err);
    return { error: 'update failed' };
  }

  return { leadId, score, band };
};

export default defineLogicFunction({
  universalIdentifier: LEAD_SCORE_CALCULATOR_UUID,
  name: 'lead-score-calculator',
  description:
    'Recalculates leadScore (0-100), scoreBand (HOT/WARM/COLD), and scoreExplanation when key lead fields change. Does NOT watch score fields themselves — no infinite loop possible.',
  timeoutSeconds: 15,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: SCORE_TRIGGER_FIELDS,
  },
});
