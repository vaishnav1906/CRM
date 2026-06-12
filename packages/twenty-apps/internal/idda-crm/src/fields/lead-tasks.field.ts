import {
  defineField,
  FieldType,
  RelationType,
} from 'twenty-sdk/define';

import {
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_TASKS_REVERSE_FIELD_UUID,
  TASK_LEAD_RELATION_FIELD_UUID,
  TASK_OBJECT_UUID,
} from 'src/constants/universal-identifiers';

// Back-ref: Lead.crmTasks → [Task]
export default defineField({
  universalIdentifier: LEAD_TASKS_REVERSE_FIELD_UUID,
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: FieldType.RELATION,
  name: 'crmTasks',
  label: 'Tasks',
  icon: 'IconCheckbox',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: TASK_OBJECT_UUID,
  relationTargetFieldMetadataUniversalIdentifier: TASK_LEAD_RELATION_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
