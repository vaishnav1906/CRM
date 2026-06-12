import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_ASSIGNED_TEAM_FIELD_UUID,
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CALL_OUTCOME_FIELD_UUID,
  LEAD_CALL_STATUS_FIELD_UUID,
  LEAD_CONVERSION_PROBABILITY_FIELD_UUID,
  LEAD_MEETING_DATE_FIELD_UUID,
  LEAD_MEETING_MODE_FIELD_UUID,
  LEAD_MEETING_OUTCOME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  RESEARCH_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Research team: can create & enrich leads, cannot manage calls or meetings
export default defineRole({
  universalIdentifier: RESEARCH_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Research Agent',
  description:
    'Research team member — creates leads, fills in clinic/doctor data, updates research metadata. Cannot manage calls, meetings, or conversions.',
  icon: 'IconSearch',
  canBeAssignedToUsers: true,
  canUpdateAllSettings: false,
  canReadAllObjectRecords: false,
  canUpdateAllObjectRecords: false,
  canSoftDeleteAllObjectRecords: false,
  canDestroyAllObjectRecords: false,
  objectPermissions: [
    {
      objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.note.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.attachment.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  // Research agents cannot update call/meeting/sales fields
  fieldPermissions: [
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_CALL_STATUS_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_CALL_OUTCOME_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_MEETING_MODE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_MEETING_OUTCOME_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_CONVERSION_PROBABILITY_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_ASSIGNED_TEAM_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
  ],
});
