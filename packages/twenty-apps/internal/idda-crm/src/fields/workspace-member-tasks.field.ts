import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  TASK_ASSIGNED_TO_FIELD_UUID,
  TASK_OBJECT_UUID,
  WORKSPACE_MEMBER_TASKS_REVERSE_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Back-ref: WorkspaceMember.assignedCrmTasks → [Task]
export default defineField({
  universalIdentifier: WORKSPACE_MEMBER_TASKS_REVERSE_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  type: FieldType.RELATION,
  name: 'assignedCrmTasks',
  label: 'Assigned Tasks',
  icon: 'IconCheckbox',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier: TASK_OBJECT_UUID,
  relationTargetFieldMetadataUniversalIdentifier: TASK_ASSIGNED_TO_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
