import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  WORKSPACE_MEMBER_ASSIGNED_LEADS_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Forward: Lead.assignedTo → WorkspaceMember (many leads per member)
export default defineField({
  universalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID,
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'assignedTo',
  label: 'Assigned To',
  icon: 'IconUserCircle',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_ASSIGNED_LEADS_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'assignedToId',
  },
});
