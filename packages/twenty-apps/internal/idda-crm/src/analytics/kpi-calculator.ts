// Phase 15 — KPI Calculator
// Query-based KPI aggregation. Call from scripts or a scheduled job.

const API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:3000';
const API_KEY = process.env.TWENTY_API_KEY ?? '';

async function gql(query: string): Promise<unknown> {
  const res = await fetch(`${API_URL}/api`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ query }),
  });
  const json = (await res.json()) as { data?: unknown };
  return json.data;
}

export type KPIReport = {
  generatedAt: string;
  leads: {
    total: number;
    byStage: Record<string, number>;
    newThisWeek: number;
    rejected: number;
    onboarded: number;
  };
  activities: {
    total: number;
    callsThisWeek: number;
    meetingsThisWeek: number;
  };
  pipeline: {
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
    avgLeadScore: number;
  };
  tasks: {
    total: number;
    overdue: number;
    completedThisWeek: number;
  };
};

export async function computeKPIs(): Promise<KPIReport> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [leadsData, activitiesData] = await Promise.all([
    gql(`query { leads(first: 10000) { edges { node { stage scoreBand leadScore createdAt } } } }`) as Promise<any>,
    gql(`query { leadActivities(first: 10000) { edges { node { eventType occurredAt } } } }`) as Promise<any>,
  ]);

  const leads = (leadsData?.leads?.edges ?? []).map((e: any) => e.node);
  const activities = (activitiesData?.leadActivities?.edges ?? []).map((e: any) => e.node);

  const byStage: Record<string, number> = {};
  let hotLeads = 0, warmLeads = 0, coldLeads = 0, scoreSum = 0, scoredCount = 0;

  for (const lead of leads) {
    byStage[lead.stage] = (byStage[lead.stage] ?? 0) + 1;
    if (lead.scoreBand === 'HOT') hotLeads++;
    else if (lead.scoreBand === 'WARM') warmLeads++;
    else if (lead.scoreBand === 'COLD') coldLeads++;
    if (lead.leadScore != null) { scoreSum += lead.leadScore; scoredCount++; }
  }

  const newThisWeek = leads.filter((l: any) => l.createdAt >= weekAgo).length;
  const callsThisWeek = activities.filter((a: any) => a.occurredAt >= weekAgo && ['CALL_ATTEMPTED', 'CALL_OUTCOME_UPDATED'].includes(a.eventType)).length;
  const meetingsThisWeek = activities.filter((a: any) => a.occurredAt >= weekAgo && a.eventType === 'MEETING_SCHEDULED').length;

  return {
    generatedAt: new Date().toISOString(),
    leads: {
      total: leads.length,
      byStage,
      newThisWeek,
      rejected: byStage['REJECTED'] ?? 0,
      onboarded: byStage['ONBOARDED'] ?? 0,
    },
    activities: {
      total: activities.length,
      callsThisWeek,
      meetingsThisWeek,
    },
    pipeline: {
      hotLeads,
      warmLeads,
      coldLeads,
      avgLeadScore: scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0,
    },
    tasks: {
      total: 0,
      overdue: 0,
      completedThisWeek: 0,
    },
  };
}
