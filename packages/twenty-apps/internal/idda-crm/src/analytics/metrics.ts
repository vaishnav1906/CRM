// Phase 15 — Sales Metrics
// Utility functions for computing per-agent and pipeline-level metrics.

export type LeadRecord = {
  id: string;
  stage: string;
  assignedToId: string | null;
  leadScore: number | null;
  scoreBand: string | null;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
};

export type ActivityRecord = {
  id: string;
  eventType: string;
  occurredAt: string;
  performedById: string | null;
};

export type AgentMetrics = {
  agentId: string;
  leadsAssigned: number;
  callsMade: number;
  meetingsScheduled: number;
  stageConversions: number;
  avgResponseDays: number;
};

const daysBetween = (a: string, b: string): number =>
  Math.abs(new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24);

export function computeConversionRate(leads: LeadRecord[], fromStage: string, toStage: string): number {
  const from = leads.filter((l) => l.stage === fromStage || l.stage === toStage).length;
  const to = leads.filter((l) => l.stage === toStage).length;
  return from > 0 ? Math.round((to / from) * 100) : 0;
}

export function computeStaleLeadPercent(leads: LeadRecord[], thresholdDays = 14): number {
  const now = new Date().toISOString();
  const stale = leads.filter((l) => {
    if (!l.lastContactedAt) return true;
    return daysBetween(l.lastContactedAt, now) > thresholdDays;
  });
  return leads.length > 0 ? Math.round((stale.length / leads.length) * 100) : 0;
}

export function computeAvgFollowUpDelay(leads: LeadRecord[]): number {
  const delays: number[] = [];
  for (const lead of leads) {
    if (lead.createdAt && lead.lastContactedAt) {
      delays.push(daysBetween(lead.createdAt, lead.lastContactedAt));
    }
  }
  return delays.length > 0 ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length) : 0;
}

export function computeAgentMetrics(
  leads: LeadRecord[],
  activities: ActivityRecord[],
  agentId: string,
): AgentMetrics {
  const agentLeads = leads.filter((l) => l.assignedToId === agentId);
  const agentActivities = activities.filter((a) => a.performedById === agentId);

  const callsMade = agentActivities.filter((a) =>
    ['CALL_ATTEMPTED', 'CALL_OUTCOME_UPDATED', 'CALL_MISSED'].includes(a.eventType),
  ).length;

  const meetingsScheduled = agentActivities.filter((a) => a.eventType === 'MEETING_SCHEDULED').length;
  const stageConversions = agentActivities.filter((a) => a.eventType === 'STAGE_CHANGED').length;

  const responseTimes: number[] = agentLeads
    .filter((l) => l.lastContactedAt)
    .map((l) => daysBetween(l.createdAt, l.lastContactedAt!));

  return {
    agentId,
    leadsAssigned: agentLeads.length,
    callsMade,
    meetingsScheduled,
    stageConversions,
    avgResponseDays: responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0,
  };
}

export function computePipelineSummary(leads: LeadRecord[]): Record<string, unknown> {
  const total = leads.length;
  const byBand = { HOT: 0, WARM: 0, COLD: 0, unscored: 0 };
  for (const l of leads) {
    if (l.scoreBand === 'HOT') byBand.HOT++;
    else if (l.scoreBand === 'WARM') byBand.WARM++;
    else if (l.scoreBand === 'COLD') byBand.COLD++;
    else byBand.unscored++;
  }
  const scores = leads.filter((l) => l.leadScore != null).map((l) => l.leadScore!);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return { total, byBand, avgScore, conversionRate: computeConversionRate(leads, 'INTERESTED', 'ONBOARDED') };
}
