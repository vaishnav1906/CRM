import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
} from 'twenty-sdk/define';

import {
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_TASKS_REVERSE_FIELD_UUID,
  TASK_LEAD_RELATION_FIELD_UUID,
  TASK_OBJECT_UUID,
} from 'src/constants/universal-identifiers';

// Forward: Task.lead → Lead (many tasks per lead)
export default defineField({
  universalIdentifier: TASK_LEAD_RELATION_FIELD_UUID,
  objectUniversalIdentifier: TASK_OBJECT_UUID,
  type: FieldType.RELATION,
  name: 'lead',
  label: 'Lead',
  icon: 'IconStethoscope',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier: LEAD_TASKS_REVERSE_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'leadId',
  },
});
