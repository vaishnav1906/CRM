import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID,
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_LEAD_ACTIVITIES_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Back-ref: Lead.leadActivities → [LeadActivity]
export default defineField({
  universalIdentifier: LEAD_LEAD_ACTIVITIES_FIELD_UUID,
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'leadActivities',
  label: 'Activity Log',
  icon: 'IconActivity',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
