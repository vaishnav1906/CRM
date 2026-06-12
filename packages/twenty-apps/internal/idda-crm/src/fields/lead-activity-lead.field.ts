import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID,
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_LEAD_ACTIVITIES_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

// Forward: LeadActivity.lead → Lead (MANY_TO_ONE — many activities per lead)
export default defineField({
  universalIdentifier: LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID,
  objectUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  icon: 'IconStethoscope',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_LEAD_ACTIVITIES_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.CASCADE,
    joinColumnName: 'leadId',
  },
});
