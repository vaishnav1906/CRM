import { DatabaseEventPayload, defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { TASK_AUTOMATION_UUID } from 'src/constants/universal-identifiers';

type LeadDiff = {
  callStatus?: { before: string | null; after: string | null };
  callOutcome?: { before: string | null; after: string | null };
  meetingDate?: { before: string | null; after: string | null };
  stage?: { before: string | null; after: string | null };
};

type LeadEventProperties = {
  updatedFields?: string[];
  diff?: LeadDiff;
  after?: { assignedToId?: string | null };
};

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const handler = async (payload: DatabaseEventPayload) => {
  const props = payload.properties as LeadEventProperties;
  const updatedFields = props.updatedFields ?? [];
  const diff = props.diff ?? {};
  const leadId = payload.recordId;
  const performedById = payload.workspaceMemberId ?? null;

  const client = new CoreApiClient();
  const tasksCreated: string[] = [];

  // Auto-create follow-up call task when no-answer or busy
  if (
    updatedFields.includes('callStatus') &&
    (diff.callStatus?.after === 'NO_ANSWER' || diff.callStatus?.after === 'BUSY')
  ) {
    try {
      const result = await (client as any).mutation({
        createCrmTask: {
          __args: {
            data: {
              title: 'Retry call — no answer',
              taskType: 'FOLLOW_UP_CALL',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: daysFromNow(1),
              reminderAt: daysFromNow(1),
              leadId,
              assignedToId: performedById,
            },
          },
          id: true,
        },
      });
      const id = (result as any)?.createCrmTask?.id;
      if (id) tasksCreated.push(id);
    } catch (err) {
      console.error('[task-automation] failed creating retry-call task:', err);
    }
  }

  // Auto-create meeting prep task when meeting is scheduled
  if (
    updatedFields.includes('meetingDate') &&
    diff.meetingDate?.after &&
    !diff.meetingDate?.before
  ) {
    const meetingAt = new Date(diff.meetingDate.after);
    const reminderAt = new Date(meetingAt.getTime() - 60 * 60 * 1000); // 1h before

    try {
      const result = await (client as any).mutation({
        createCrmTask: {
          __args: {
            data: {
              title: 'Prepare for meeting',
              description: `Meeting scheduled for ${meetingAt.toLocaleDateString('en-IN')}. Prepare demo/proposal.`,
              taskType: 'MEETING',
              status: 'TODO',
              priority: 'HIGH',
              dueDate: meetingAt.toISOString(),
              reminderAt: reminderAt.toISOString(),
              leadId,
              assignedToId: performedById,
            },
          },
          id: true,
        },
      });
      const id = (result as any)?.createCrmTask?.id;
      if (id) tasksCreated.push(id);
    } catch (err) {
      console.error('[task-automation] failed creating meeting-prep task:', err);
    }
  }

  // Auto-create follow-up WhatsApp task after positive call outcome
  if (
    updatedFields.includes('callOutcome') &&
    diff.callOutcome?.after === 'FOLLOW_UP'
  ) {
    try {
      const result = await (client as any).mutation({
        createCrmTask: {
          __args: {
            data: {
              title: 'Send follow-up WhatsApp message',
              taskType: 'SEND_WHATSAPP',
              status: 'TODO',
              priority: 'MEDIUM',
              dueDate: daysFromNow(1),
              leadId,
              assignedToId: performedById,
            },
          },
          id: true,
        },
      });
      const id = (result as any)?.createCrmTask?.id;
      if (id) tasksCreated.push(id);
    } catch (err) {
      console.error('[task-automation] failed creating whatsapp task:', err);
    }
  }

  // Auto-create proposal task after meeting completed
  if (
    updatedFields.includes('stage') &&
    diff.stage?.after === 'MEETING_COMPLETED'
  ) {
    try {
      const result = await (client as any).mutation({
        createCrmTask: {
          __args: {
            data: {
              title: 'Send proposal / contract',
              taskType: 'EMAIL',
              status: 'TODO',
              priority: 'URGENT',
              dueDate: daysFromNow(2),
              reminderAt: daysFromNow(1),
              leadId,
              assignedToId: performedById,
            },
          },
          id: true,
        },
      });
      const id = (result as any)?.createCrmTask?.id;
      if (id) tasksCreated.push(id);
    } catch (err) {
      console.error('[task-automation] failed creating proposal task:', err);
    }
  }

  return { tasksCreated: tasksCreated.length, taskIds: tasksCreated };
};

export default defineLogicFunction({
  universalIdentifier: TASK_AUTOMATION_UUID,
  name: 'task-automation',
  description:
    'Auto-creates CRM tasks from lead events: retry call on no-answer, meeting prep on scheduling, WhatsApp follow-up on FOLLOW_UP outcome, proposal task on meeting completion.',
  timeoutSeconds: 20,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.updated',
    updatedFields: ['callStatus', 'callOutcome', 'meetingDate', 'stage'],
  },
});
