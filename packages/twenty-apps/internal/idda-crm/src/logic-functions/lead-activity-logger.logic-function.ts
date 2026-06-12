import { DatabaseEventPayload, defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { LEAD_ACTIVITY_LOGGER_UUID } from 'src/constants/universal-identifiers';

// Stage label map for human-readable descriptions
const STAGE_LABELS: Record<string, string> = {
  NEW_LEAD: 'New Lead',
  RESEARCH_COMPLETED: 'Research Completed',
  READY_FOR_CALLING: 'Ready for Calling',
  CONTACT_ATTEMPTED: 'Contact Attempted',
  FOLLOW_UP_PENDING: 'Follow-Up Pending',
  INTERESTED: 'Interested',
  MEETING_SCHEDULED: 'Meeting Scheduled',
  MEETING_COMPLETED: 'Meeting Completed',
  NEGOTIATION: 'Negotiation',
  ONBOARDED: 'Onboarded',
  REJECTED: 'Rejected',
};

type LeadDiff = {
  stage?: { before: string; after: string };
  assignedToId?: { before: string | null; after: string | null };
  assignedTeam?: { before: string | null; after: string | null };
  priority?: { before: string; after: string };
  callStatus?: { before: string | null; after: string | null };
  callOutcome?: { before: string | null; after: string | null };
  meetingDate?: { before: string | null; after: string | null };
  interestLevel?: { before: string | null; after: string | null };
  nextFollowUpAt?: { before: string | null; after: string | null };
  followUpNotes?: { before: string | null; after: string | null };
  objections?: { before: string | null; after: string | null };
  conversionProbability?: { before: number | null; after: number | null };
};

type LeadEventProperties = {
  updatedFields?: string[];
  diff?: LeadDiff;
  after?: { id: string };
};

const WATCHED_FIELDS = [
  'stage',
  'assignedToId',
  'assignedTeam',
  'priority',
  'callStatus',
  'callOutcome',
  'meetingDate',
  'interestLevel',
  'nextFollowUpAt',
  'followUpNotes',
  'objections',
  'conversionProbability',
];

const handler = async (payload: DatabaseEventPayload) => {
  const props = payload.properties as LeadEventProperties;
  const updatedFields = props.updatedFields ?? [];
  const diff = props.diff ?? {};
  const leadId = payload.recordId;
  const performedById = payload.workspaceMemberId ?? null;

  const relevantFields = updatedFields.filter((f) =>
    WATCHED_FIELDS.includes(f),
  );
  if (relevantFields.length === 0) return { skipped: true };

  const client = new CoreApiClient();
  const results: string[] = [];

  for (const field of relevantFields) {
    const change = (diff as Record<string, { before: unknown; after: unknown }>)[field];
    if (!change) continue;

    let eventType = 'STAGE_CHANGED';
    let fromValue = String(change.before ?? '');
    let toValue = String(change.after ?? '');
    let description = '';

    if (field === 'stage') {
      eventType = 'STAGE_CHANGED';
      fromValue = STAGE_LABELS[fromValue] ?? fromValue;
      toValue = STAGE_LABELS[toValue] ?? toValue;
      description = `Stage changed: ${fromValue} → ${toValue}`;
    } else if (field === 'assignedToId') {
      eventType = 'ASSIGNED_TO_CHANGED';
      description = 'Lead reassigned to a different team member';
    } else if (field === 'assignedTeam') {
      eventType = 'TEAM_CHANGED';
      description = `Team changed: ${fromValue || 'none'} → ${toValue || 'none'}`;
    } else if (field === 'priority') {
      eventType = 'PRIORITY_CHANGED';
      description = `Priority changed: ${fromValue} → ${toValue}`;
    } else if (field === 'callStatus') {
      eventType = 'CALL_ATTEMPTED';
      description = `Call status updated: ${fromValue || 'none'} → ${toValue || 'none'}`;
    } else if (field === 'callOutcome') {
      eventType = 'CALL_OUTCOME_UPDATED';
      description = `Call outcome: ${toValue}`;
    } else if (field === 'meetingDate') {
      eventType = 'MEETING_SCHEDULED';
      description = `Meeting scheduled for ${toValue || 'TBD'}`;
    } else if (field === 'interestLevel') {
      eventType = 'INTEREST_LEVEL_UPDATED';
      description = `Interest level: ${fromValue || 'none'} → ${toValue || 'none'}`;
    } else if (field === 'nextFollowUpAt') {
      eventType = 'FOLLOW_UP_SCHEDULED';
      description = `Follow-up scheduled: ${toValue || 'cleared'}`;
    } else if (field === 'followUpNotes') {
      eventType = 'NOTE_ADDED';
      const preview = toValue.length > 80 ? toValue.slice(0, 80) + '…' : toValue;
      description = `Follow-up note updated: ${preview || '(cleared)'}`;
    } else if (field === 'objections') {
      eventType = 'NOTE_ADDED';
      const preview = toValue.length > 80 ? toValue.slice(0, 80) + '…' : toValue;
      description = `Objections noted: ${preview || '(cleared)'}`;
    } else if (field === 'conversionProbability') {
      eventType = 'INTEREST_LEVEL_UPDATED';
      description = `Conversion probability: ${fromValue || '0'}% → ${toValue || '0'}%`;
    }

    try {
      const result = await (client as any).mutation({
        createLeadActivity: {
          __args: {
            data: {
              eventType,
              fromValue,
              toValue,
              description,
              occurredAt: new Date().toISOString(),
              leadId,
              performedById,
            },
          },
          id: true,
        },
      });

      const activityId = (result as any)?.createLeadActivity?.id;
      if (activityId) results.push(activityId);
    } catch (err) {
      // Best-effort logging — don't fail the workflow
      console.error(`[lead-activity-logger] failed to log ${field}:`, err);
    }
  }

  return { logged: results.length, activityIds: results };
};

export default defineLogicFunction({
  universalIdentifier: LEAD_ACTIVITY_LOGGER_UUID,
  name: 'lead-activity-logger',
  description:
    'Fires on lead.updated events and writes a LeadActivity record for each tracked field change (stage, assignee, team, priority, call status, meeting date, interest level).',
  timeoutSeconds: 15,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: [
      'stage', 'assignedToId', 'assignedTeam', 'priority',
      'callStatus', 'callOutcome', 'meetingDate', 'interestLevel',
      'nextFollowUpAt', 'followUpNotes', 'objections', 'conversionProbability',
    ],
  },
});
