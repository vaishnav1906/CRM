import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CALLING_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID,
  LEAD_ENRICHMENT_SOURCE_FIELD_UUID,
  LEAD_IMPORT_BATCH_ID_FIELD_UUID,
  LEAD_MEETING_OUTCOME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_SCRAPED_AT_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Calling team: manages call flow, can update call fields and push to INTERESTED
export default defineRole({
  universalIdentifier: CALLING_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Calling Agent',
  description:
    'Calling team member — makes outbound calls, updates call status/outcome, schedules meetings. Cannot modify research data or finalize deals.',
  icon: 'IconPhone',
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
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  // Calling agents cannot touch research ingestion metadata or deal closure
  fieldPermissions: [
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_IMPORT_BATCH_ID_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_ENRICHMENT_SOURCE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_SCRAPED_AT_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_MEETING_OUTCOME_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
  ],
});
