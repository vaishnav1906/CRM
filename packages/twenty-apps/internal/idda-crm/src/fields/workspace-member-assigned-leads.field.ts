import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_ASSIGNED_LEADS_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Back-reference: WorkspaceMember.assignedLeads → [Lead]
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_ASSIGNED_LEADS_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedLeads',
  label: 'Assigned Leads',
  icon: 'IconUsers',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
