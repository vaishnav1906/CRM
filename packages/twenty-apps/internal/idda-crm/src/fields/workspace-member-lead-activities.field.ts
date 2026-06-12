import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID,
  WORKSPACE_MEMBER_LEAD_ACTIVITIES_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Back-ref: WorkspaceMember.leadActivities → [LeadActivity]
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_LEAD_ACTIVITIES_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'leadActivities',
  label: 'Lead Activities',
  icon: 'IconActivity',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
  relationTargetFieldMetadataUniversalIdentifier:
    LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
