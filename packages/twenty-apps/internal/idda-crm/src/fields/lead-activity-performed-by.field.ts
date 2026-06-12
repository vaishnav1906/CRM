import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID,
  WORKSPACE_MEMBER_LEAD_ACTIVITIES_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Forward: LeadActivity.performedBy → WorkspaceMember
export default defineField({
  universalIdentifier: LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID,
  objectUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
  type: FieldType.RELATION,
  name: 'performedBy',
  label: 'Performed By',
  icon: 'IconUserCircle',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_LEAD_ACTIVITIES_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'performedById',
  },
});
