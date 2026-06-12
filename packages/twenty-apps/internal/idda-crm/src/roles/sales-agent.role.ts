import {
  defineRole,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_IMPORT_BATCH_ID_FIELD_UUID,
  LEAD_ENRICHMENT_SOURCE_FIELD_UUID,
  LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID,
  LEAD_SCRAPED_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  SALES_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Sales team: manages meetings, negotiation, and closure
export default defineRole({
  universalIdentifier: SALES_AGENT_ROLE_UNIVERSAL_IDENTIFIER,
  label: 'Sales Agent',
  description:
    'Sales team member — runs meetings, negotiates, closes deals, manages conversion probability and expected closure dates. Full access to lead data except research ingestion metadata.',
  icon: 'IconTrophy',
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
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.task.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
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
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    {
      objectUniversalIdentifier:
        STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  ],
  // Sales agents cannot touch raw research ingestion metadata
  fieldPermissions: [
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_IMPORT_BATCH_ID_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_ENRICHMENT_SOURCE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
    { objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER, fieldUniversalIdentifier: LEAD_SCRAPED_AT_FIELD_UUID, canReadFieldValue: true, canUpdateFieldValue: false },
  ],
});
