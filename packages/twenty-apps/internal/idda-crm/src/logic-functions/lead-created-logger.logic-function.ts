import { DatabaseEventPayload, defineLogicFunction } from 'twenty-sdk/define';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { LEAD_CREATED_LOGGER_UUID } from 'src/constants/universal-identifiers';

type LeadAfter = {
  id?: string;
  stage?: string;
  assignedToId?: string | null;
  clinicName?: string;
  doctorName?: { firstName?: string; lastName?: string } | null;
};

type LeadCreatedProperties = {
  after?: LeadAfter;
};

const handler = async (payload: DatabaseEventPayload) => {
  const props = payload.properties as LeadCreatedProperties;
  const leadId = payload.recordId;
  const performedById = payload.workspaceMemberId ?? null;

  const after: LeadAfter = props.after ?? {};
  const doctorFirst = after.doctorName?.firstName ?? '';
  const doctorLast = after.doctorName?.lastName ?? '';
  const doctorLabel = [doctorFirst, doctorLast].filter(Boolean).join(' ') || 'Unknown';
  const clinicLabel = after.clinicName ?? 'Unknown Clinic';
  const description = `Lead created: ${doctorLabel} — ${clinicLabel}`;

  try {
    const client = new CoreApiClient();
    await (client as any).mutation({
      createLeadActivity: {
        __args: {
          data: {
            eventType: 'LEAD_CREATED',
            fromValue: '',
            toValue: after.stage ?? 'NEW_LEAD',
            description,
            occurredAt: new Date().toISOString(),
            leadId,
            performedById,
          },
        },
        id: true,
      },
    });
  } catch (err) {
    console.error('[lead-created-logger] failed:', err);
  }

  return { logged: true, leadId };
};

export default defineLogicFunction({
  universalIdentifier: LEAD_CREATED_LOGGER_UUID,
  name: 'lead-created-logger',
  description:
    'Fires on lead.created events and writes the initial LEAD_CREATED LeadActivity record.',
  timeoutSeconds: 10,
  handler,
  databaseEventTriggerSettings: {
    eventName: 'lead.created',
  },
});
