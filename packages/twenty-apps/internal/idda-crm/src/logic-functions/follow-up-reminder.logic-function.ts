// Phase 16 — Follow-Up Reminder Cron
// Runs every day at 08:00 IST (02:30 UTC).
// Finds leads with overdue nextFollowUpAt, creates a FOLLOW_UP_CALL task per lead,
// and logs a FOLLOW_UP_DUE LeadActivity entry.

import { CronPayload, defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { FOLLOW_UP_REMINDER_CRON_UUID } from 'src/constants/universal-identifiers';

const EXCLUDED_STAGES = ['ONBOARDED', 'REJECTED'];

type OverdueLead = {
  id: string;
  clinicName: string;
  doctorName: { firstName: string | null; lastName: string | null } | null;
  stage: string;
  assignedToId: string | null;
  nextFollowUpAt: string;
};

type LeadsQueryResult = {
  leads: {
    edges: { node: OverdueLead }[];
  };
};

const handler = async (_payload: CronPayload) => {
  const now = new Date().toISOString();

  const client = new CoreApiClient();

  // Fetch overdue leads — nextFollowUpAt is in the past and lead is still active
  let overdueLeads: OverdueLead[] = [];
  try {
    const result = (await (client as any).query({
      leads: {
        __args: {
          first: 500,
          filter: {
            and: [
              { nextFollowUpAt: { lte: now } },
              { stage: { notIn: EXCLUDED_STAGES } },
            ],
          },
        },
        edges: {
          node: {
            id: true,
            clinicName: true,
            doctorName: { firstName: true, lastName: true },
            stage: true,
            assignedToId: true,
            nextFollowUpAt: true,
          },
        },
      },
    })) as LeadsQueryResult;

    overdueLeads = (result?.leads?.edges ?? []).map((e) => e.node);
  } catch (err) {
    console.error('[follow-up-reminder] failed to fetch overdue leads:', err);
    return { processed: 0, errors: 1 };
  }

  if (overdueLeads.length === 0) {
    return { processed: 0, errors: 0 };
  }

  let processed = 0;
  let errors = 0;

  for (const lead of overdueLeads) {
    const doctorFirst = lead.doctorName?.firstName ?? '';
    const doctorLast = lead.doctorName?.lastName ?? '';
    const label = [doctorFirst, doctorLast].filter(Boolean).join(' ') || lead.clinicName || 'Lead';

    // Create follow-up call task
    try {
      await (client as any).mutation({
        createCrmTask: {
          __args: {
            data: {
              title: `Follow-up due: ${label}`,
              description: `Scheduled follow-up for ${label} (${lead.stage}) is overdue. Original due: ${new Date(lead.nextFollowUpAt).toLocaleDateString('en-IN')}.`,
              taskType: 'FOLLOW_UP_CALL',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: now,
              reminderAt: now,
              leadId: lead.id,
              assignedToId: lead.assignedToId ?? null,
            },
          },
          id: true,
        },
      });
    } catch (err) {
      console.error(`[follow-up-reminder] failed creating task for lead ${lead.id}:`, err);
      errors++;
      continue;
    }

    // Log a FOLLOW_UP_DUE activity
    try {
      await (client as any).mutation({
        createLeadActivity: {
          __args: {
            data: {
              eventType: 'FOLLOW_UP_DUE',
              fromValue: '',
              toValue: lead.nextFollowUpAt,
              description: `Automated reminder: follow-up overdue for ${label}`,
              occurredAt: now,
              leadId: lead.id,
              performedById: null,
            },
          },
          id: true,
        },
      });
    } catch (err) {
      // Non-critical — task was created, just activity logging failed
      console.warn(`[follow-up-reminder] failed logging activity for lead ${lead.id}:`, err);
    }

    processed++;
  }

  return { processed, errors };
};

export default defineLogicFunction({
  universalIdentifier: FOLLOW_UP_REMINDER_CRON_UUID,
  name: 'follow-up-reminder',
  description:
    'Daily cron (08:00 IST) that finds leads with overdue nextFollowUpAt, creates a FOLLOW_UP_CALL task, and logs a FOLLOW_UP_DUE activity for each.',
  timeoutSeconds: 120,
  handler,
  cronTriggerSettings: {
    pattern: '30 2 * * *',
  },
});
